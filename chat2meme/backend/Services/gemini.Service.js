const { GoogleGenAI } = require("@google/genai");

class GeminiService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.isMock = !this.apiKey || this.apiKey === "your_gemini_api_key_here";
        if (this.isMock) {
            console.warn("⚠️ GEMINI_API_KEY is not set correctly. Using MOCK mode for demonstration.");
        } else {
            // Updated SDK initialization
            this.client = new GoogleGenAI({
                apiKey: this.apiKey
            });
        }
    }

    async analyzeChatContent({ text, imageBase64, imageMimeType }) {
        if (this.isMock) {
            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            return {
                speakers: [
                    { id: "1", name: "User A", color: "#10b981" },
                    { id: "2", name: "User B", color: "#3b82f6" }
                ],
                messages: [
                    { speakerId: "1", text: "Hey, did you see the new update?" },
                    { speakerId: "2", text: "Yeah! The chat analysis is sick." },
                    { speakerId: "1", text: "Gemini is pretty powerful for this." }
                ]
            };
        }

        try {
            const promptContent = `
                Analyze the following chat content and provide a structured JSON response.
                Detect all speakers, assign them a unique ID, and provide their messages in chronological order.
                
                Requirements:
                1. Detect speakers and their names.
                2. Extract every message with the correct speaker identification.
                3. Return the data in the following JSON format:
                {
                    "speakers": [
                        { "id": "uuid/string", "name": "Speaker Name", "color": "suggested_hex_color" }
                    ],
                    "messages": [
                        { "speakerId": "id_from_above", "text": "The message text" }
                    ]
                }
                
                Respond ONLY with the JSON block.
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

            // Using the requested model and SDK structure
            const response = await this.client.models.generateContent({
                model: "gemini-3-flash-preview", // Successful in test!
                contents: [
                    { role: "user", parts }
                ]
            });

            // The new SDK returns response.text directly or via parts
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
