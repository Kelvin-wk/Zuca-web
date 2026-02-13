
import { GoogleGenAI, Type } from "@google/genai";
import { TriviaQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FALLBACK_QUESTIONS: TriviaQuestion[] = [
  { question: "How many books are in the New Testament?", options: ["24", "27", "39", "66"], correctAnswer: 1, explanation: "The New Testament consists of 27 books.", points: 5 },
  { question: "Who was the first martyr of the Church?", options: ["Peter", "Paul", "Stephen", "James"], correctAnswer: 2, explanation: "St. Stephen was the first martyr.", points: 5 },
  { question: "Which Gospel was written first?", options: ["Matthew", "Mark", "Luke", "John"], correctAnswer: 1, explanation: "Most scholars agree Mark was the first Gospel.", points: 5 },
  { question: "How many days was Lazarus in the tomb?", options: ["1", "2", "3", "4"], correctAnswer: 3, explanation: "Jesus raised Lazarus after 4 days.", points: 5 },
  { question: "Who wrote the Book of Revelation?", options: ["Peter", "Paul", "John", "Luke"], correctAnswer: 2, explanation: "John the Apostle wrote Revelation.", points: 10 },
  { question: "What is the shortest verse in the Bible?", options: ["Jesus wept.", "God is love.", "Pray without ceasing.", "Rejoice always."], correctAnswer: 0, explanation: "John 11:35: 'Jesus wept.'", points: 10 },
  { question: "Who was the oldest man mentioned in the Bible?", options: ["Adam", "Noah", "Methuselah", "Abraham"], correctAnswer: 2, explanation: "Methuselah lived to be 969 years old.", points: 10 }
];

export const generateBibleTrivia = async (): Promise<TriviaQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate exactly 7 unique multiple-choice Bible trivia questions. Assign a 'points' value to each question (integers) such that the total sum of points for all 7 questions is exactly 50. Include difficult ones.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                minItems: 4,
                maxItems: 4
              },
              correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
              explanation: { type: Type.STRING },
              points: { type: Type.INTEGER, description: "Points for this question" }
            },
            required: ["question", "options", "correctAnswer", "explanation", "points"]
          }
        }
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error: any) {
    console.warn("Gemini API Quota or Error, using fallback trivia:", error?.message);
    // If we hit 429 or any error, we return the fallback immediately to keep the app functional
    return FALLBACK_QUESTIONS;
  }
};

export const getSpiritualInsight = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful and wise spiritual companion for the Zetech University Catholic Action community. Provide encouraging, biblically grounded, and respectful responses."
      }
    });
    return response.text || "May God bless you today.";
  } catch (error) {
    return "The Lord is my shepherd, I shall not want. (API Quota reached, showing fallback)";
  }
};
