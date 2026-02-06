import { GoogleGenAI } from "@google/genai"; // The new library

// Initialize with the new Client structure
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateInterviewQuestion = async (
  role: string,
  difficulty: string,
) => {
  try {
    // In the new SDK, models are accessed via ai.models
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a senior technical interviewer. Ask ONE ${difficulty} interview question for a ${role} developer. Keep it short and practical.`,
            },
          ],
        },
      ],
    });

    // FIX: The new SDK puts the text directly on the response object
    // No more .text() function or deep .candidates nesting!
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate a question. Please try again.";
  }
};
