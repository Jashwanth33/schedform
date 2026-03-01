import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const gemini = ai;

export async function generateFormFields(description: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a list of form fields for a booking platform based on this description: "${description}". 
    Return a JSON array of objects with: label, name, type (text, textarea, email, tel, select, radio, checkbox), options (array of strings, only for select/radio/checkbox), required (boolean).`,
    config: {
      responseMimeType: "application/json"
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [];
  }
}
