const { processConversationAudio } = require("./audio.Controller");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatFlow = require("../Model/Chat.Model");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const generateChatFlow = async (req, res) => {
    try {
        const { text, image, generateAudio } = req.body; // Add flag to opt-in for audio

        if (!text && !image) {
            return res.status(400).json({ success: false, message: "Provide text or image input" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        // ... (Gemini prompt construction remains the same, assuming it works) ...

        // RE-IMPLEMENTING PROMPT LOGIC HERE TO BE SAFE (Diff chunk replacement)
        let promptParts = [];
        const systemPrompt = `
        You are an AI that converts inputs into a structured chat JSON for a video generator.
        
        1. If input is an image, extract the visible chat text verbatim.
        2. If input is text, normalize it.
        3. Output STRICT JSON with two speakers "A" and "B".
        
        Output Format:
        [
          { "speaker": "A", "text": "...", "emotion": "normal",},
          { "speaker": "B", "text": "...", "emotion": "happy",}
        ]
        
        Emotions: ["normal", "angry", "sad", "happy", "cute", "sarcastic"].
        RETURN ONLY JSON. NO MARKDOWN.
        `;

        promptParts.push(systemPrompt);

        if (text) {
            promptParts.push(`Input Text:\n${text}`);
        }

        if (image) {
            promptParts.push({
                inlineData: {
                    data: image,
                    mimeType: "image/jpeg",
                },
            });
            promptParts.push("Extract chat from this image and structure it.");
        }

        const result = await model.generateContent(promptParts);
        const response = await result.response;
        let textOutput = response.text();

        textOutput = textOutput.replace(/```json/g, "").replace(/```/g, "").trim();

        let conversation;
        try {
            conversation = JSON.parse(textOutput);
        } catch (e) {
            const firstBracket = textOutput.indexOf("[");
            const lastBracket = textOutput.lastIndexOf("]");
            if (firstBracket !== -1 && lastBracket !== -1) {
                const jsonSub = textOutput.substring(firstBracket, lastBracket + 1);
                conversation = JSON.parse(jsonSub);
            } else {
                throw new Error("Failed to parse JSON from AI response");
            }
        }

        // --- NEW AUDIO INTEGRATION ---
        // Automatically generate audio if requested (or default to true if you prefer)
        // User asked: "user send img ... convert to text ... convert to voice ... data look like speaker text audio emotion"
        // So we do it by default.

        console.log("Generating Audio for conversation...");
        const enrichedConversation = await processConversationAudio(conversation);

        // Save to DB with audioUrl (file path instead of Base64)
        const conversationForDb = enrichedConversation.map(c => ({
            speaker: c.speaker,
            text: c.text,
            emotion: c.emotion,
            audioUrl: c.audioUrl // Save the file URL instead of Base64
        }));

        const newChat = new ChatFlow({
            originalInput: {
                text: text || null,
                hasImage: !!image
            },
            conversation: conversationForDb
        });

        await newChat.save();

        // Return the enriched conversation (with Audio URLs) to the user
        res.status(200).json({ success: true, conversation: enrichedConversation, id: newChat._id });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { generateChatFlow };
