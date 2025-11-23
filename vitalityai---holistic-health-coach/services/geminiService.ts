import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, HealthPlanResponse, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateHealthPlan = async (profile: UserProfile, language: Language): Promise<HealthPlanResponse> => {
  const languageNames = {
    en: "English",
    de: "German",
    tr: "Turkish",
    fr: "French",
    it: "Italian"
  };
  
  const targetLang = languageNames[language];

  const prompt = `
    Act as a world-class holistic health coach. Generate a vibrant, positive, and scientifically accurate health plan for this user.
    
    **IMPORTANT: Output the content values in ${targetLang} language, but keep the JSON property keys (like 'dailyCalories', 'meals', 'name', 'focusArea') exactly as defined in the schema.**

    Profile:
    - Age: ${profile.age}, Gender: ${profile.gender}
    - Height: ${profile.height}cm, Weight: ${profile.weight}kg
    - Goal: ${profile.goal}
    - Activity: ${profile.activityLevel}
    - Preferences: ${profile.dietaryPreferences || "Standard balanced"}
    - Equipment: ${profile.equipment || "Bodyweight"}

    Requirements:
    1. **Diet:** Delicious, healthy meals. Include a shopping list of main ingredients.
    2. **Workout:** If it's cardio or yoga, use 'duration' instead of sets/reps. If strength, use sets/reps. Avoid "N/A".
    3. **Wellness:** Include a daily mantra and a mindfulness activity.
    
    Tone: Encouraging, professional, cheerful. Language: ${targetLang}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["dietPlan", "workoutPlan", "wellnessPlan", "summary"],
          properties: {
            summary: { type: Type.STRING, description: `A cheerful, empowering summary of the plan in ${targetLang}.` },
            wellnessPlan: {
              type: Type.OBJECT,
              required: ["dailyMantra", "mindfulnessActivity", "sleepAdvice"],
              properties: {
                dailyMantra: { type: Type.STRING, description: `A positive affirmation in ${targetLang}` },
                mindfulnessActivity: { type: Type.STRING, description: `A specific mental health exercise in ${targetLang}` },
                sleepAdvice: { type: Type.STRING, description: `Sleep advice in ${targetLang}` }
              }
            },
            dietPlan: {
              type: Type.OBJECT,
              required: ["dailyCalories", "hydrationGoal", "shoppingList", "macros", "meals", "tips"],
              properties: {
                dailyCalories: { type: Type.NUMBER },
                hydrationGoal: { type: Type.STRING, description: `e.g. '2.5 Liters' in ${targetLang}` },
                shoppingList: { type: Type.ARRAY, items: { type: Type.STRING } },
                macros: {
                  type: Type.OBJECT,
                  required: ["protein", "carbs", "fats"],
                  properties: {
                    protein: { type: Type.NUMBER },
                    carbs: { type: Type.NUMBER },
                    fats: { type: Type.NUMBER },
                  }
                },
                meals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["name", "totalCalories", "items"],
                    properties: {
                      name: { type: Type.STRING, description: `Meal name (e.g. Breakfast) in ${targetLang}` },
                      totalCalories: { type: Type.NUMBER },
                      items: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          required: ["name", "portion", "calories"],
                          properties: {
                            name: { type: Type.STRING, description: `Food item name in ${targetLang}` },
                            portion: { type: Type.STRING, description: `Portion size in ${targetLang}` },
                            calories: { type: Type.NUMBER },
                          }
                        }
                      }
                    }
                  }
                },
                tips: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            workoutPlan: {
              type: Type.OBJECT,
              required: ["recommendedWarmup", "recoveryAdvice", "weeklySchedule"],
              properties: {
                recommendedWarmup: { type: Type.STRING, description: `Warmup routine in ${targetLang}` },
                recoveryAdvice: { type: Type.STRING, description: `Recovery advice in ${targetLang}` },
                weeklySchedule: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["dayName", "focusArea", "durationMinutes", "exercises"],
                    properties: {
                      dayName: { type: Type.STRING, description: `Day name (e.g. Monday) in ${targetLang}` },
                      focusArea: { type: Type.STRING, description: `Focus area (e.g. Legs) in ${targetLang}` },
                      durationMinutes: { type: Type.NUMBER },
                      exercises: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          required: ["name", "type"],
                          properties: {
                            name: { type: Type.STRING, description: `Exercise name in ${targetLang}` },
                            type: { type: Type.STRING, enum: ["strength", "cardio", "flexibility"] },
                            sets: { type: Type.STRING, description: "Only for strength. e.g. '3'" },
                            reps: { type: Type.STRING, description: "Only for strength. e.g. '12'" },
                            duration: { type: Type.STRING, description: `For cardio/yoga. e.g. '30 min' in ${targetLang}` },
                            notes: { type: Type.STRING, description: `Form notes in ${targetLang}` },
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No content generated");
    }

    // Strip markdown if present (e.g. ```json ... ```) to ensure parsing works
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanJson) as HealthPlanResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const chatWithCoach = async (history: { role: string; parts: { text: string }[] }[], newMessage: string, language: Language): Promise<string> => {
  const languageNames = {
    en: "English",
    de: "German",
    tr: "Turkish",
    fr: "French",
    it: "Italian"
  };
  
  const targetLang = languageNames[language];

  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `You are 'Vitality Coach', a warm, cheerful, and holistic health expert. You care about mental and physical health equally. Keep answers encouraging. Always reply in ${targetLang}.`
    },
    history: history,
  });

  const result = await chat.sendMessage({ message: newMessage });
  return result.text || "I'm simpler sorry, I couldn't process that right now.";
};