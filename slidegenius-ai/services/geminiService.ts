import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PresentationConfig, SlideContent } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const slideSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Slide title" },
    content: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "3-5 concise bullet points for the slide content." 
    },
    footerNote: { type: Type.STRING, description: "A short footnote, citation, or key takeaway." },
    visualDescription: { 
      type: Type.STRING, 
      description: "A concise, descriptive prompt for an AI image generator to create an illustration for this slide. Leave empty if no image is needed. Limit to approx 50% of slides." 
    }
  },
  required: ["title", "content"]
};

const presentationSchema: Schema = {
  type: Type.ARRAY,
  items: slideSchema
};

export const generatePresentationContent = async (config: PresentationConfig): Promise<SlideContent[]> => {
  try {
    // Use Pro model for better reasoning on structure and visual prompts
    const modelId = 'gemini-3-pro-preview';
    
    const prompt = `
      Create a professional presentation about: "${config.topic}".
      
      Configuration:
      - Total Content Slides: ${config.pageCount} (excluding cover).
      - Tone: ${config.tone}.
      - Detail Level: ${config.detailLevel}.
      - Language: English.
      
      Instructions:
      1. Structure the content logically.
      2. If "visualDescription" is generated, describe a clean, professional, 4k style image (e.g., "A modern isometric illustration of data analysis"). 
      3. Only suggest images (visualDescription) for key slides where a visual aid adds significant value (about 40-60% of slides).
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: presentationSchema,
        systemInstruction: "You are a world-class presentation strategist. Generate structured JSON for presentation slides.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    return JSON.parse(text) as SlideContent[];
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string, aspectRatio: "4:3" | "16:9" | "1:1" = "4:3"): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `${prompt} High quality, professional style, minimalist, 4k resolution, no text labels.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return undefined;
  } catch (error) {
    console.error("Error generating image:", error);
    return undefined;
  }
};

export const generateSlidesWithImages = async (slides: SlideContent[], topic: string): Promise<SlideContent[]> => {
  // We limit concurrent requests to avoid hitting rate limits aggressively, 
  // though 2.5 Flash is fast. We'll map all promises.
  
  const updatedSlides = await Promise.all(slides.map(async (slide) => {
    if (slide.visualDescription) {
      const fullPrompt = `Context: Presentation about ${topic}. Image Request: ${slide.visualDescription}`;
      const imageBase64 = await generateImage(fullPrompt, "4:3"); // Using 4:3 for slide insertions
      return { ...slide, imageBase64 };
    }
    return slide;
  }));

  return updatedSlides;
};