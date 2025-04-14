
export interface ImageOptions {
  purpose: 'product' | 'slider' | 'banner' | 'collection' | 'announcement' | 'footer' | 'header' | 'image-with-text' | 'multicolumn' | 'custom';
  customType?: string;
}

export interface UserCredits {
  current: number;
  max: number;
}

export interface GeneratedCode {
  code: string;
  shopifyLiquid: string;
}

export interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
  imageUrl?: string;
  sectionType?: string;
  requirements?: string;
}

// API request/response interfaces
export interface GenerateCodeRequest {
  sectionType: string;
  requirements: string;
  imageDescription: string;
}

export interface GenerateCodeResponse {
  code: string;
  shopifyLiquid: string;
}
