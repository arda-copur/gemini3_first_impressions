export enum DetailLevel {
  Brief = 'Brief',
  Standard = 'Standard',
  Detailed = 'Detailed'
}

export enum Tone {
  Professional = 'Professional',
  Academic = 'Academic',
  Creative = 'Creative',
  Casual = 'Casual'
}

export enum Theme {
  Modern = 'Modern',
  Minimal = 'Minimal',
  Corporate = 'Corporate',
  Creative = 'Creative'
}

export interface PresentationConfig {
  topic: string;
  detailLevel: DetailLevel;
  pageCount: number;
  tone: Tone;
  theme: Theme;
  includeImages: boolean;
}

export interface SlideContent {
  title: string;
  content: string[];
  footerNote?: string;
  visualDescription?: string; // Prompt for the image generator
  imageBase64?: string; // The generated image
}

export interface GeneratedPresentation {
  topic: string;
  theme: Theme;
  slides: SlideContent[];
  coverImageBase64?: string;
}

export type AppState = 'idle' | 'generating_structure' | 'generating_images' | 'ready' | 'error';