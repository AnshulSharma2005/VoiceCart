import express from "express";
import cors from "cors";
import { parseCommand } from "../../shared/parseCommand";
import { getAISuggestions } from "./utils/smartSuggestionsAI";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data
interface UserData {
  shoppingList: string[];
  purchaseHistory: string[];
}
const users: Record<string, UserData> = {};

export interface SuggestionType {
  id: string;
  name: string;
  category: string;
  reason: string;
  confidence: number;
}

// Translate using LibreTranslate (free)
async function translateToEnglish(text: string): Promise<string> {
  try {
    const res = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source: "auto", target: "en", format: "text" }),
    });
    const data = (await res.json()) as { translatedText: string };
    return data.translatedText;
  } catch (err) {
    console.error(err);
    return text;
  }
}

app.post("/api/voice", async (req, res) => {
  try {
    const userId = req.body.userId || "default";
    if (!users[userId]) users[userId] = { shoppingList: [], purchaseHistory: [] };

    const transcript: string = req.body.transcript;
    if (!transcript) return res.status(400).json({ error: "No transcript provided" });

    const translated = await translateToEnglish(transcript);
    const { action, item } = parseCommand(translated);

    if (action === "add" && item) {
      users[userId].shoppingList.push(item);
      users[userId].purchaseHistory.push(item);
    } else if (action === "remove" && item) {
      users[userId].shoppingList = users[userId].shoppingList.filter(i => i !== item);
    }

    const suggestions: SuggestionType[] = await getAISuggestions({
      history: users[userId].purchaseHistory,
      currentList: users[userId].shoppingList,
      season: "summer",
    });

    res.json({ transcript, translated, action, item, shoppingList: users[userId].shoppingList, suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process voice command" });
  }
});
app.post("/api/recommendations", async (req, res) => {
  try {
    const userId = req.body.userId || "default";
    if (!users[userId]) users[userId] = { shoppingList: [], purchaseHistory: [] };

    const suggestions = await getAISuggestions({
      history: users[userId].purchaseHistory,
      currentList: users[userId].shoppingList,
      season: "summer",
    });

    res.json({ suggestions });
  } catch (err) {
    console.error("AI suggestions error:", err);
    res.status(500).json({ error: "Failed to fetch AI suggestions" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
