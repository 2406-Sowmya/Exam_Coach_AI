
import { GoogleGenAI, Type } from "@google/genai";
import { Topic, Attempt } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getExplanation = async (topicName: string, subjectName: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are an expert exam tutor for ${subjectName}. Explain the topic "${topicName}" in a simple, beginner-friendly way that is optimized for exam success. Use bullet points for key concepts. Keep it concise but thorough.`,
    config: {
      temperature: 0.7,
      systemInstruction: "You are a helpful academic tutor who simplifies complex concepts for students."
    }
  });
  return response.text;
};

export const generateQuiz = async (topicName: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 multiple-choice questions for the topic: ${topicName}. Each question should have 4 options and 1 correct answer.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER }
          },
          required: ["question", "options", "correctIndex"]
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const getCoachResponse = async (query: string, studentContext: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Student Question: ${query}\n\nStudent Progress Context: ${studentContext}`,
    config: {
      systemInstruction: "You are a motivating, exam-focused AI coach. Provide concise advice and encourage the student based on their progress."
    }
  });
  return response.text;
};
export const generateRevisionPlan = async (
  topics: Topic[],
  attempts: Attempt[]
) => {
  // Build progress summary (data only, no planning)
  const progress = topics.map(t => {
    const related = attempts.filter(a => a.topicId === t.id);
    const avg =
      related.length > 0
        ? (
            related.reduce((s, a) => s + a.score / a.total, 0) /
            related.length
          ) * 100
        : null;

    return {
      topic: t.name,
      attempts: related.length,
      averageScore: avg === null ? "Not Attempted" : `${avg.toFixed(1)}%`
    };
  });

  const prompt = `
You are an expert exam planner.

Using ONLY the student progress data below, generate a STRICT 7-day revision plan.

Rules:
- You must output Day 1 to Day 7 (exactly 7 days)
- Decide tasks dynamically based on progress
- Topics not attempted should be prioritized
- Weak topics should appear more often
- Do NOT mention percentages in the final plan
- Do NOT explain the logic
- Keep it exam-oriented and realistic

Student Progress:
${JSON.stringify(progress, null, 2)}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.6
    }
  });

  return response.text;
};


