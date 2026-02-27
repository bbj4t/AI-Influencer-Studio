import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateInfluencerBio(name: string, niche: string, tone: string): Promise<string> {
  const prompt = `Create a short, engaging bio (max 3 sentences) for an AI influencer named "${name}". 
Their niche is "${niche}" and their tone of voice is "${tone}".`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  
  return response.text || "A mysterious AI influencer.";
}

export async function generateContentText(influencer: any, topic: string, type: 'blog' | 'social'): Promise<string> {
  const prompt = `You are an AI influencer named "${influencer.name}".
Your niche is "${influencer.niche}".
Your tone of voice is "${influencer.toneOfVoice}".
Your bio: "${influencer.bio}".

Write a ${type === 'blog' ? 'short blog post (300 words)' : 'social media caption with hashtags'} about: "${topic}".
Write it exactly in your persona's tone of voice.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  
  return response.text || "";
}

export async function generateInfluencerImage(influencer: any, prompt: string): Promise<string> {
  const fullPrompt = `A high quality, photorealistic image of an influencer. 
Visual style: ${influencer.visualStyle}. 
Scenario: ${prompt}. 
Make it look like a professional social media photo.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: {
      parts: [
        {
          text: fullPrompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K"
      }
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Failed to generate image");
}
