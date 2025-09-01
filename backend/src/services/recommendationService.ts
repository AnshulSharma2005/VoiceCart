import { ShoppingItem, Suggestion } from "../models/suggestions";

// Temporary rule-based logic
export async function generateRecommendations(
  currentItems: ShoppingItem[],
  history: ShoppingItem[],
  userId: string
): Promise<Suggestion[]> {
  const currentItemNames = currentItems.map(i => i.name.toLowerCase());

  const suggestions: Suggestion[] = [];

  // Example: simple recommendation rule
  if (!currentItemNames.includes("milk")) {
    suggestions.push({
      id: "rec-1",
      name: "Milk",
      category: "dairy",
      reason: "You often buy this with cereal",
      confidence: 0.85,
    });
  }

  if (!currentItemNames.includes("bread")) {
    suggestions.push({
      id: "rec-2",
      name: "Bread",
      category: "pantry",
      reason: "A common staple you might need",
      confidence: 0.75,
    });
  }

  return suggestions;
}
