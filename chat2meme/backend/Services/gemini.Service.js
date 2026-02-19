const { GoogleGenAI } = require("@google/genai");

// Fixed emotion set — must match the emotion labels stored in MongoDB avatar documents
const AVATAR_EMOTIONS = ["funny", "confusing", "sad", "angry", "happy"];

// Map any AI-returned emotion to the closest valid DB emotion
const EMOTION_MAP = {
    // Direct matches
    funny: "funny",
    confusing: "confusing",
    confused: "confusing",
    sad: "sad",
    angry: "angry",
    happy: "happy",
    // Common AI alternatives → mapped to closest
    neutral: "funny",       // neutral chat → funny (default fallback)
    surprised: "funny",     // surprised → funny
    disgusted: "angry",     // disgusted → angry
    fearful: "sad",         // fearful → sad
    excited: "happy",       // excited → happy
    joy: "happy",
    fear: "sad",
    disgust: "angry",
    surprise: "funny",
    anticipation: "happy",
    trust: "happy",
};

function sanitizeEmotion(emotion) {
    if (!emotion) return "funny"; // default
    const lower = emotion.toLowerCase().trim();
    return EMOTION_MAP[lower] || "funny"; // fallback to funny if unknown
}

class GeminiService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.isMock = !this.apiKey || this.apiKey === "your_gemini_api_key_here";
        if (this.isMock) {
            console.warn("⚠️ GEMINI_API_KEY is not set correctly. Using MOCK mode for demonstration.");
        } else {
            this.client = new GoogleGenAI({
                apiKey: this.apiKey
            });
        }
    }

    async analyzeChatContent({ text, imageBase64, imageMimeType }) {
        if (this.isMock) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return {
                speakers: [
                    { id: "1", name: "User A", color: "#10b981" },
                    { id: "2", name: "User B", color: "#3b82f6" }
                ],
                messages: [
                    { speakerId: "1", text: "Hey, did you see the new update?", emotion: "happy" },
                    { speakerId: "2", text: "Yeah! The chat analysis is sick.", emotion: "funny" },
                    { speakerId: "1", text: "Gemini is pretty powerful for this.", emotion: "confusing" }
                ]
            };
        }

        try {
            const promptContent = `
                Analyze the following chat content and provide a structured JSON response.
                Detect all speakers, assign them a unique ID, and provide their messages in chronological order.
                
                For each message, also pick the single best matching emotion from this fixed list:
                ${JSON.stringify(AVATAR_EMOTIONS)}
                
                Requirements:
                1. Detect speakers and their names.
                2. Extract every message with the correct speaker identification.
                3. For each message, choose the most fitting emotion from the list above based on the message content and tone.
                4. Return the data in the following JSON format ONLY:
                {
                    "speakers": [
                        { "id": "uuid/string", "name": "Speaker Name", "color": "suggested_hex_color" }
                    ],
                    "messages": [
                        { "speakerId": "id_from_above", "text": "The message text", "emotion": "one_of_the_emotions_above" }
                    ]
                }
                
                Respond ONLY with the JSON block. No explanation.
            `;

            let parts = [{ text: promptContent }];
            if (imageBase64) {
                parts.push({
                    inlineData: {
                        data: imageBase64,
                        mimeType: imageMimeType || "image/jpeg"
                    }
                });
            }
            if (text) {
                parts.push({ text });
            }

            const response = await this.client.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: [
                    { role: "user", parts }
                ]
            });

            let responseText = "";
            if (response.text) {
                responseText = response.text;
            } else if (response.candidates && response.candidates[0].content.parts[0].text) {
                responseText = response.candidates[0].content.parts[0].text;
            }

            // Extract JSON if wrapped in code blocks
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            throw new Error("Failed to parse JSON from Gemini response: " + responseText);
        } catch (error) {
            console.error("Gemini Service Error:", error);
            throw error;
        }
    }
}

module.exports = new GeminiService();
module.exports.AVATAR_EMOTIONS = AVATAR_EMOTIONS;
module.exports.sanitizeEmotion = sanitizeEmotion;
