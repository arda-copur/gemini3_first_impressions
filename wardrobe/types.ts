export interface UploadedImage {
  id: string;
  data: string; // Base64
  type: 'user' | 'garment';
  previewUrl: string;
}

export interface GenerationResult {
  imageUrl?: string;
  text?: string;
}

export type AppView = 'try-on' | 'advice' | 'curator';

export interface CuratorParams {
  location: string;
  date: string;
  time: string;
  occasion: string;
  relationshipStatus: string;
}

export interface CuratorResult {
  weather: string;
  outfitDescription: string;
  visualUrl?: string; // Generated image of the suggestion
}

export interface IGProfile {
  username: string;
  fullName: string;
  category: string;
  avatarUrl: string;
  isVerified: boolean;
}

export interface GrowthDataPoint {
  day: string;
  followers: number;
}

export interface AnalysisResult {
  targetUser: string;
  timestamp: string;
  followersCount: number;
  followingCount: number;
  newlyFollowed: IGProfile[];
  unfollowed: IGProfile[];
  growthData: GrowthDataPoint[];
}