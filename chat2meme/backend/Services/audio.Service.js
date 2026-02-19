const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const client = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY // Ensure this is set in .env
});

/**
 * Upload a buffer to Cloudinary and return the secure URL
 * @param {Buffer} buffer - The audio buffer
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<string>} - The secure URL of the uploaded file
 */
const uploadToCloudinary = async (buffer, folder = 'chat2meme_audio') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'video', // Cloudinary treats audio as 'video' resource type usually, or 'auto'
                folder: folder,
                format: 'mp3'
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );

        const stream = Readable.from(buffer);
        stream.pipe(uploadStream);
    });
};

/**
 * Generate audio for a single text using ElevenLabs
 * @param {string} text - The text to convert to speech
 * @param {string} voiceId - The voice ID to use
 * @returns {Promise<Buffer>} - The audio buffer
 */
const generateAudioBuffer = async (text, voiceId) => {
    try {
        const audioStream = await client.textToSpeech.convert(voiceId, {
            text: text,
            model_id: "eleven_multilingual_v2",
            output_format: "mp3_44100_128",
        });

        // Convert stream to Buffer
        const chunks = [];
        for await (const chunk of audioStream) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    } catch (error) {
        console.error('ElevenLabs Generation Error:', error);
        throw error;
    }
};

/**
 * Process a full conversation: Generate audio and upload to Cloudinary for each line
 * @param {Array} chatData - Array of { speaker, text, emotion }
 * @returns {Promise<Array>} - Enriched chatData with audioUrl
 */
const processConversationAudio = async (chatData) => {
    // Default Voices (Rachel for A, Domi for B - matching videoModel)
    const VOICE_A = "21m00Tcm4TlvDq8ikWAM";
    const VOICE_B = "AZnzlk1XvdvUeBnXmlld";

    const enrichedConversation = [];

    // Process sequentially to preserve order and avoid rate limits
    for (const line of chatData) {
        try {
            const voiceId = line.speaker === 'A' ? VOICE_A : VOICE_B;

            console.log(`Generating audio for Speaker ${line.speaker}: "${line.text.substring(0, 20)}..."`);

            // 1. Generate Audio Buffer
            const audioBuffer = await generateAudioBuffer(line.text, voiceId);

            // 2. Upload to Cloudinary
            const audioUrl = await uploadToCloudinary(audioBuffer);

            enrichedConversation.push({
                ...line,
                audioUrl: audioUrl
            });

        } catch (error) {
            console.error(`Failed to process audio for line: "${line.text}"`, error.message);
            // Fallback: return line without audioUrl, or with an error field
            enrichedConversation.push({
                ...line,
                audioError: "Failed to generate audio"
            });
        }
    }

    return enrichedConversation;
};

/**
 * Fetch all available voices from ElevenLabs
 * @returns {Promise<Array>} - Array of voice objects
 */
const getVoices = async () => {
    try {
        const response = await client.voices.getAll();
        return response.voices;
    } catch (error) {
        console.error('ElevenLabs Get Voices Error:', error);
        throw error;
    }
};

module.exports = {
    processConversationAudio,
    getVoices
};
