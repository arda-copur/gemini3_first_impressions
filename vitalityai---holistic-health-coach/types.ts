export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export enum Goal {
  LoseWeight = 'Lose Weight',
  BuildMuscle = 'Build Muscle',
  Maintain = 'Maintain Health',
  Endurance = 'Improve Endurance',
  StressRelief = 'Stress Relief & Yoga'
}

export enum ActivityLevel {
  Sedentary = 'Sedentary (Office job)',
  LightlyActive = 'Lightly Active (1-2 days/week)',
  ModeratelyActive = 'Moderately Active (3-5 days/week)',
  VeryActive = 'Very Active (6-7 days/week)'
}

export type Language = 'en' | 'de' | 'tr' | 'fr' | 'it';

export interface UserProfile {
  age: number;
  gender: Gender;
  height: number; // cm
  weight: number; // kg
  goal: Goal;
  activityLevel: ActivityLevel;
  dietaryPreferences: string; 
  equipment: string; 
}

export interface MacroNutrients {
  protein: number;
  carbs: number;
  fats: number;
}

export interface MealItem {
  name: string;
  portion: string;
  calories: number;
}

export interface Meal {
  name: string; 
  items: MealItem[];
  totalCalories: number;
}

export interface DietPlan {
  dailyCalories: number;
  macros: MacroNutrients;
  hydrationGoal: string;
  meals: Meal[];
  tips: string[];
  shoppingList: string[]; // New feature
}

export interface Exercise {
  name: string;
  type: 'strength' | 'cardio' | 'flexibility'; // Helps UI rendering
  sets?: string; // Optional now
  reps?: string; // Optional now
  duration?: string; // For cardio/yoga
  notes?: string;
}

export interface WorkoutDay {
  dayName: string; 
  focusArea: string; 
  exercises: Exercise[];
  durationMinutes: number;
}

export interface WorkoutPlan {
  weeklySchedule: WorkoutDay[];
  recommendedWarmup: string;
  recoveryAdvice: string;
}

export interface WellnessPlan {
  dailyMantra: string;
  mindfulnessActivity: string; // e.g., "5 min box breathing"
  sleepAdvice: string;
}

export interface HealthPlanResponse {
  dietPlan: DietPlan;
  workoutPlan: WorkoutPlan;
  wellnessPlan: WellnessPlan; // New feature
  summary: string;
}