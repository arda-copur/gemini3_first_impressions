import { GoogleGenAI } from "@google/genai";
import { CuratorParams, CuratorResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME_IMAGE = 'gemini-2.5-flash-image';
const MODEL_NAME_TEXT = 'gemini-2.5-flash';

// Helper to clean base64 string
const cleanBase64 = (data: string) => {
  return data.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

export const generateVirtualTryOn = async (userImage: string, garmentImage: string) => {
  try {
    const userBase64 = cleanBase64(userImage);
    const garmentBase64 = cleanBase64(garmentImage);

    const prompt = `
      TASK: Virtual Try-On / Clothing Replacement
      
      INPUTS:
      - Image 1: The User (Target Model).
      - Image 2: The Garment (Clothing Item).

      INSTRUCTIONS:
      1. CRITICAL: You MUST completely remove the User's current top/outfit and replace it with the Garment from Image 2.
      2. FIT & CROP: If Image 1 is an upper-body shot (portrait) or close-up, you must intelligently crop and fit the Garment to the visible torso. Do not require a full-body view.
      3. REALISM: Warp the fabric to match the User's body shape and pose. Respect folds, tension, and gravity.
      4. IDENTITY PRESERVATION: Keep the User's face, hair, skin tone, and background EXACTLY as they are. Only change the pixels where the clothing sits.
      5. LIGHTING: Blend the new Garment into the scene using the lighting from Image 1.

      OUTPUT:
      A single high-quality photorealistic image of the User wearing the new Garment.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME_IMAGE,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: userBase64 } },
          { inlineData: { mimeType: 'image/png', data: garmentBase64 } },
          { text: prompt }
        ]
      },
      config: {
        // We rely on the model to output an image part
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return {
          imageUrl: `data:image/png;base64,${part.inlineData.data}`
        };
      }
    }
    
    // Fallback if no image found
    return { text: "The atelier could not process this angle. Please try a clearer photo." };

  } catch (error) {
    console.error("Try-on error:", error);
    throw error;
  }
};

export const generateStyleAdvice = async (userImage: string) => {
  try {
    const userBase64 = cleanBase64(userImage);

    const response = await ai.models.generateContent({
      model: MODEL_NAME_TEXT,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: userBase64 } },
          { text: "Analyze this person's look and current outfit style. Suggest 3 distinct fashion styles that would suit them (e.g., 'Avant-Garde Minimalist', 'Vintage 90s', 'Corporate Chic'). For each style, describe a specific outfit combination. Format the output as a clean Markdown list." }
        ]
      }
    });

    return {
      text: response.text
    };
  } catch (error) {
    console.error("Advice error:", error);
    throw error;
  }
};

export const generateContextualAdvice = async (userImage: string, params: CuratorParams): Promise<CuratorResult> => {
  try {
    const userBase64 = cleanBase64(userImage);

    // STEP 1: Get Context & Weather via Search Grounding
    const searchPrompt = `
      You are a High-End Fashion Stylist.
      
      CONTEXT:
      - Location: ${params.location}
      - Date: ${params.date}
      - Time of Day: ${params.time}
      - Occasion: ${params.occasion}
      - Relationship Status/Company: ${params.relationshipStatus}

      TASK 1: Use Google Search to find the weather forecast (or historical weather) for ${params.location} on ${params.date}.
      
      TASK 2: Analyze the User's photo (attached) to understand their physique, skin tone, and vibe.
      
      TASK 3: Create a PERFECT outfit recommendation that:
      - Is practical for the specific weather found.
      - Is appropriate for the occasion and relationship context.
      - Flatters the user.
      
      OUTPUT FORMAT (JSON):
      {
        "weatherSummary": "e.g., Rainy, 12°C, windy in the evening",
        "outfitPlan": "Detailed description of the outfit (Top, Bottom, Shoes, Accessories) and why it works for this specific date/venue.",
        "visualPrompt": "A highly detailed prompt to generate a photorealistic fashion photography flat-lay of this exact outfit on a neutral background."
      }
    `;

    const planResponse = await ai.models.generateContent({
      model: MODEL_NAME_TEXT,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: userBase64 } },
          { text: searchPrompt }
        ]
      },
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType is not allowed when using googleSearch
      }
    });

    const planText = planResponse.text || "{}";
    const jsonMatch = planText.match(/```json\s*([\s\S]*?)\s*```/) || planText.match(/{[\s\S]*}/);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : "{}";
    const planData = JSON.parse(jsonStr);
    
    // STEP 2: Generate the Visual of the Suggested Outfit
    // We use the description generated in Step 1 to create a visual
    let visualUrl = undefined;
    
    if (planData.visualPrompt) {
      const imageResponse = await ai.models.generateContent({
        model: MODEL_NAME_IMAGE,
        contents: {
          parts: [
             { text: `Create a high-fashion product shot: ${planData.visualPrompt}. Studio lighting, 4k, cinematic.` }
          ]
        }
      });
      
      for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          visualUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    return {
      weather: planData.weatherSummary || "Weather data unavailable",
      outfitDescription: planData.outfitPlan || "Could not generate plan.",
      visualUrl: visualUrl
    };

  } catch (error) {
    console.error("Curator error:", error);
    throw error;
  }
};