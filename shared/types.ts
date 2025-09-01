export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  price?: number;
  brand?: string;
  completed: boolean;
  addedAt: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface VoiceCommand {
  action: 'add' | 'remove' | 'search' | 'clear' | 'complete';
  intent: string;
  item?: string;
  quantity?: number;
  category?: string;
  brand?: string;
  priceRange?: { min: number; max: number };
  raw: string;
}


// src/types.ts
export interface Suggestion {
  id: string;
  name: string;
  category: string;
  reason: string;
  confidence: number; // 0–1
  seasonal?: boolean;
  substitute?: boolean;
}


export interface VoiceState {
  isListening: boolean;
  isSupported: boolean;
  confidence: number;
  transcript: string;
  error: string | null;
  shoppingList?: string[];
}

export interface UserType {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  preferences?: {
    language: string;
    voiceEnabled: boolean;
    categories: string[];
  };
}

export interface AuthState {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
}