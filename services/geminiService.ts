import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FLASH = 'gemini-2.5-flash';

export const GeminiService = {
  /**
   * Generates a synopsis for a novel based on title and genre.
   */
  generateSynopsis: async (title: string, genre: string): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_FLASH,
        contents: `Write a compelling and concise synopsis (max 100 words) for a novel titled "${title}" in the "${genre}" genre. The tone should be engaging.`,
      });
      return response.text ?? '';
    } catch (error) {
      console.error("Gemini Synopsis Error:", error);
      throw error;
    }
  },

  /**
   * Continues the story based on the preceding text.
   */
  continueStory: async (currentContent: string, title: string): Promise<string> => {
    try {
      // Using a reasonable context window from the end of the content
      const context = currentContent.slice(-4000); 
      
      const response = await ai.models.generateContent({
        model: MODEL_FLASH,
        contents: `You are a co-author for the novel "${title}". Continue the story from the following text naturally. Maintain the tone and style. Write about 200-300 words.\n\nText:\n${context}`,
      });
      return response.text ?? '';
    } catch (error) {
      console.error("Gemini Continuation Error:", error);
      throw error;
    }
  },

  /**
   * Summarizes a chapter for a reader.
   */
  summarizeChapter: async (content: string): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_FLASH,
        contents: `Summarize the following novel chapter in 3 bullet points, avoiding major spoilers if possible but capturing the essence.\n\nChapter Content:\n${content.slice(0, 8000)}`,
      });
      return response.text ?? '';
    } catch (error) {
      console.error("Gemini Summary Error:", error);
      throw error;
    }
  }
};