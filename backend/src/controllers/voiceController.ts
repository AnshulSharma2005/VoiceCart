import { getAISuggestions } from "../utils/smartSuggestionsAI";
import { SuggestionType } from "../utils/types";

// Define a type for the user state
interface UserState {
  shoppingList: string[];
  purchasedItems: string[];
}

export async function handleVoiceCommand(
  transcript: string,
  userState: UserState
): Promise<{ addedItem?: string; suggestions: SuggestionType[] }> {
  let addedItem: string | undefined = undefined;

  // Handle "add" command
  if (transcript.toLowerCase().includes("add")) {
    const item = transcript.replace(/add\s+/i, "").trim();
    userState.shoppingList.push(item);
    userState.purchasedItems.push(item); // optional, if you track history
    addedItem = item;
    console.log(`${item} added to your list`);
  }

  // Fetch dynamic AI suggestions
  const suggestions = await getAISuggestions({
    history: userState.purchasedItems,
    currentList: userState.shoppingList,
    season: "summer" // optionally compute dynamically
  });

  console.log("You might also need:", suggestions.map(s => s.name).join(", "));

  return { addedItem, suggestions };
}
