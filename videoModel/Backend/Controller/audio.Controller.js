const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
const { Readable } = require('stream');
const fs = require('fs');
const path = require('path');

const generateAudio = async (req, res) => {
    try {
        const { text, voiceId } = req.body;

        if (!text) {
            return res.status(400).json({ success: false, message: "Text is required" });
        }

        const client = new ElevenLabsClient({
            apiKey: process.env.ELEVENLABS_API_KEY,
        });

        const voice = voiceId || "21m00Tcm4TlvDq8ikWAM"; // Rachel

        const audioResponse = await client.textToSpeech.convert(voice, {
            text: text,
            model_id: "eleven_multilingual_v2",
            output_format: "mp3_44100_128",
        });

        // Validating if it's a Node stream or Web stream.
        // The previous error "audioStream.pipe is not a function" and user docs suggest it's a Web Stream.
        // However, sometimes in Node environments SDKs return Node streams. 
        // If it has .pipe, use it. If not, check for getReader.

        // Based on user docs provided:
        // const reader = audio.getReader();
        // const stream = new Readable(...)

        // We assume audioResponse is the stream object that has getReader() 
        // (though in some versions convert returns the stream functionality directly or a Buffer if not streamed)

        // If wrapping in Readable.from didn't work previously, we do the manual read.

        res.set({
            "Content-Type": "audio/mpeg",
            "Content-Disposition": 'attachment; filename="audio.mp3"',
        });

        // Implementation from docs adapted for Express response
        if (typeof audioResponse.getReader === 'function') {
            const reader = audioResponse.getReader();
            const readable = new Readable({
                async read() {
                    try {
                        const { done, value } = await reader.read();
                        if (done) {
                            this.push(null);
                        } else {
                            this.push(value);
                        }
                    } catch (e) {
                        this.destroy(e);
                    }
                },
            });
            readable.pipe(res);
        } else if (typeof audioResponse.pipe === 'function') {
            // It is already a node stream
            audioResponse.pipe(res);
        } else {
            // Fallback: it might be a Buffer or generic iterable
            const readable = Readable.from(audioResponse);
            readable.pipe(res);
        }

    } catch (error) {
        console.error("ElevenLabs SDK Error:", error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: "TTS Generation Failed",
                details: error.message
            });
        }
    }
};

const streamToBuffer = async (readable) => {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
};

// Helper to process conversion without Request/Response objects
const processConversationAudio = async (conversation, voiceIdA, voiceIdB) => {
    if (!conversation || !Array.isArray(conversation)) {
        throw new Error("Conversation array is required");
    }

    const client = new ElevenLabsClient({
        apiKey: process.env.ELEVENLABS_API_KEY,
    });

    // Default Voices
    const VOICE_A = voiceIdA || "21m00Tcm4TlvDq8ikWAM"; // Rachel 
    const VOICE_B = voiceIdB || "AZnzlk1XvdvUeBnXmlld"; // Domi

    // Ensure public/audio directory exists
    const audioDir = path.join(__dirname, '..', 'public', 'audio');
    if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
    }

    // Process sequentially to avoid rate limits and keep order simple
    const enrichedConversation = [];
    const timestamp = Date.now();

    for (let i = 0; i < conversation.length; i++) {
        const line = conversation[i];
        const voiceId = line.speaker === "A" ? VOICE_A : VOICE_B;

        try {
            // Generate audio
            const audioStream = await client.textToSpeech.convert(voiceId, {
                text: line.text,
                model_id: "eleven_multilingual_v2",
                output_format: "mp3_44100_128",
            });

            // Convert stream to Buffer
            let buffer;
            // SDK Stream handling check
            if (typeof audioStream.getReader === 'function') {
                const reader = audioStream.getReader();
                const chunks = [];
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    chunks.push(value);
                }
                buffer = Buffer.concat(chunks);
            } else if (typeof audioStream.pipe === 'function') {
                buffer = await streamToBuffer(audioStream);
            } else {
                buffer = Buffer.from(audioStream);
            }

            // Generate unique filename
            const filename = `${timestamp}_${line.speaker}_${i}.mp3`;
            const filepath = path.join(audioDir, filename);

            // Save to file
            fs.writeFileSync(filepath, buffer);

            // Return URL instead of Base64
            const audioUrl = `/public/audio/${filename}`;

            enrichedConversation.push({
                ...line,
                audioUrl: audioUrl,
                voiceId: voiceId
            });

        } catch (err) {
            console.error(`Failed audio for ${line.speaker}:`, err.message);
            enrichedConversation.push({
                ...line,
                audioError: err.message
            });
        }
    }
    return enrichedConversation;
};

const generateConversationAudio = async (req, res) => {
    try {
        const { conversation, voiceIdA, voiceIdB } = req.body;
        const enriched = await processConversationAudio(conversation, voiceIdA, voiceIdB);
        res.status(200).json({ success: true, conversation: enriched });

    } catch (error) {
        console.error("Batch Audio Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { generateAudio, generateConversationAudio, processConversationAudio };
