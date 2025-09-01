import { VoiceCommand } from "@shared/types";
import { extractQuantity } from "./numberParser";

const categoryKeywords: Record<string, string[]> = {
  dairy: ["milk", "cheese", "butter", "yogurt"],
  produce: ["apple", "banana", "bananas", "orange", "tomato", "onion", "muskmelon"],
  beverages: ["water", "juice", "soda", "cola"],
  snacks: ["chips", "cookies", "popcorn"],
  meat: ["chicken", "beef", "pork", "fish"],
  household: ["soap", "shampoo", "detergent", "umbrella", "umbrellas"],
  other: [],
};

export function parseVoiceCommand(raw: string): VoiceCommand {
  const lower = raw.toLowerCase();
  const words = lower.split(" ");

  // ✅ detect action
  let action: VoiceCommand["action"] = "add";
  if (lower.includes("remove")) action = "remove";
  if (lower.includes("clear")) action = "clear";
  if (lower.includes("complete") || lower.includes("done")) action = "complete";

  // ✅ detect quantity (digits, words, dozen logic, etc.)
  let quantity = extractQuantity(lower);

  // ✅ clean stop words
    // ✅ clean stop words
  const stopWords = ["add", "remove", "buy", "complete", "from", "my", "list"];
  const filtered = words.filter((w) => !stopWords.includes(w) && w !== "a" && w !== "one");

  // ✅ remove "dozen" from item name but multiply quantity
  let itemWords = [...filtered];
  if (itemWords.includes("dozen")) {
    quantity = quantity * 12; // one dozen = 12, two dozen = 24, etc.
    itemWords = itemWords.filter((w) => w !== "dozen");
  }

  const item = itemWords[itemWords.length - 1] || "";

  // ✅ auto-category
  let category = "other";
  for (const [cat, keywords] of Object.entries(categoryKeywords) as [string, string[]][]) {
    if (keywords.some((k) => lower.includes(k))) {
      category = cat;
      break;
    }
  }

  return {
    action,
    intent: `shopping.${action}`,
    item,
    quantity,
    category,
    raw,
  };
}
