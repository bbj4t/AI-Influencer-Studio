export interface Influencer {
  id: string;
  name: string;
  niche: string;
  toneOfVoice: string;
  visualStyle: string;
  bio: string;
  avatarUrl?: string;
  createdAt: number;
}

export interface ContentItem {
  id: string;
  influencerId: string;
  type: 'text' | 'image' | 'social';
  prompt: string;
  result: string; // Text or Image URL
  createdAt: number;
}
