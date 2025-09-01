// src/utils/suggestions.ts
import { ShoppingItem, Suggestion } from "../../../shared";

const SEASONAL_ITEMS = {
  spring: ["asparagus", "strawberries", "peas", "lettuce", "radishes"],
  summer: ["tomatoes", "corn", "watermelon", "berries", "zucchini"],
  fall: ["apples", "pumpkin", "sweet potatoes", "squash", "cranberries"],
  winter: ["oranges", "potatoes", "onions", "cabbage", "root vegetables"],
};

const SUBSTITUTES = {
  milk: ["almond milk", "oat milk", "soy milk", "coconut milk"],
  butter: ["margarine", "coconut oil", "olive oil"],
  sugar: ["honey", "maple syrup", "stevia", "brown sugar"],
  bread: ["wraps", "pita bread", "bagels", "crackers"],
  pasta: ["rice", "quinoa", "zucchini noodles", "lentils"],
  chicken: ["turkey", "tofu", "fish", "beans"],
  cheese: ["nutritional yeast", "vegan cheese", "cashew cream"],
};

const FREQUENT_PAIRS = {
  milk: ["cereal", "cookies", "coffee"],
  tomatoes: ["onions", "garlic", "basil"],
  chicken: ["rice", "vegetables", "seasoning"],
  pasta: ["sauce", "cheese", "garlic"],
  bread: ["butter", "jam", "peanut butter"],
};

export function generateSuggestions(
  currentItems: ShoppingItem[],
  history: ShoppingItem[]
): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const currentItemNames = currentItems.map((item) => item.name.toLowerCase());

  // 🔹 1. Frequent Pairs
  currentItems.forEach((item) => {
    const pairs = FREQUENT_PAIRS[item.name.toLowerCase() as keyof typeof FREQUENT_PAIRS];
    if (pairs) {
      pairs.forEach((pair) => {
        if (!currentItemNames.includes(pair.toLowerCase())) {
          suggestions.push({
            id: `pair-${pair}`,
            name: pair,
            category: getCategoryForItem(pair),
            reason: `Often bought with ${item.name}`,
            confidence: 0.8,
          });
        }
      });
    }
  });

  // 🔹 2. History-based
  const historicalItems = getFrequentHistoricalItems(history, currentItemNames);
  historicalItems.forEach((item, index) => {
    suggestions.push({
      id: `history-${item.name}`,
      name: item.name,
      category: item.category,
      reason: `You buy this regularly`,
      confidence: 0.7 - index * 0.1,
    });
  });

  // 🔹 3. Seasonal
  const seasonalItems = getSeasonalItems();
  seasonalItems.forEach((item) => {
    if (!currentItemNames.includes(item.toLowerCase())) {
      suggestions.push({
        id: `seasonal-${item}`,
        name: item,
        category: getCategoryForItem(item),
        reason: `In season now`,
        confidence: 0.6,
        seasonal: true,
      });
    }
  });

  // 🔹 4. Substitutes (NEW: included automatically)
  currentItems.forEach((item) => {
    const substitutes = SUBSTITUTES[item.name.toLowerCase() as keyof typeof SUBSTITUTES] || [];
    substitutes.forEach((sub, idx) => {
      if (!currentItemNames.includes(sub.toLowerCase())) {
        suggestions.push({
          id: `substitute-${item.name}-${sub}`,
          name: sub,
          category: getCategoryForItem(sub),
          reason: `Alternative to ${item.name}`,
          confidence: 0.9 - idx * 0.1,
          substitute: true,
        });
      }
    });
  });

  // Return top 10
  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
}

// 🛠️ Helpers
function getFrequentHistoricalItems(history: ShoppingItem[], exclude: string[]): ShoppingItem[] {
  const itemCounts = new Map<string, { item: ShoppingItem; count: number }>();

  history.forEach((item) => {
    const name = item.name.toLowerCase();
    if (!exclude.includes(name)) {
      const existing = itemCounts.get(name);
      if (existing) {
        existing.count++;
      } else {
        itemCounts.set(name, { item, count: 1 });
      }
    }
  });

  return Array.from(itemCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((entry) => entry.item);
}

function getSeasonalItems(): string[] {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return SEASONAL_ITEMS.spring;
  if (month >= 5 && month <= 7) return SEASONAL_ITEMS.summer;
  if (month >= 8 && month <= 10) return SEASONAL_ITEMS.fall;
  return SEASONAL_ITEMS.winter;
}

function getCategoryForItem(itemName: string): string {
  const categories = {
    dairy: ["milk", "cheese", "yogurt", "butter", "cream", "eggs"],
    produce: ["apple", "banana", "orange", "tomato", "lettuce", "carrot", "potato", "onion"],
    meat: ["chicken", "beef", "pork", "fish", "turkey"],
    pantry: ["rice", "pasta", "bread", "flour", "sugar", "salt"],
    beverages: ["water", "juice", "soda", "coffee", "tea"],
    snacks: ["chips", "cookies", "crackers", "nuts"],
  };

  const lower = itemName.toLowerCase();
  for (const [category, items] of Object.entries(categories)) {
    if (items.some((item) => lower.includes(item) || item.includes(lower))) {
      return category;
    }
  }

  return "other";
}
