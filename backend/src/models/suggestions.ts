export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  completed: boolean;
}

export interface Suggestion {
  id: string;
  name: string;
  category: string;
  reason: string;
  confidence: number;
  seasonal?: boolean;
  substitute?: boolean;
}
