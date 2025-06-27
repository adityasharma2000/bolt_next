import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 0.2,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8190,
  responseMimeType: "text/plain",
};
const codeGenerationConfig = {
  temperature: 0.2,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8190,
  responseMimeType: "application/json",
};

export const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig,
});

export const codeModel = genAI.getGenerativeModel({
  model: "gemini-2.5-pro",
  generationConfig: codeGenerationConfig,
  history: [],
});
