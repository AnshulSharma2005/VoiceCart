import fetch from "node-fetch";
import { SuggestionType } from "./types";

interface UserContext {
  history: string[];
  currentList: string[];
  season?: string;
}

interface OpenAIResponse {
  choices?: { message: { content: string } }[];
}

export async function getAISuggestions(user: UserContext): Promise<SuggestionType[]> {
  const prompt = `
You are a shopping assistant.
Generate exactly 5 product suggestions in STRICT JSON format.
Do not include explanations or extra text. Only output a JSON array.

Each suggestion object must have:
- name (string)
- reason (string)  // must specify if it's "History", "Seasonal", or "Substitute"
- category (string)
- confidence (number between 0 and 1)

Context:
- Purchase history: ${user.history.length ? user.history.join(", ") : "none"}
- Current shopping list: ${user.currentList.length ? user.currentList.join(", ") : "none"}
- Season: ${user.season || "unknown"}

Rules:
1. Recommend items from purchase history that are NOT in the current shopping list.
2. Recommend at least one seasonal item appropriate for the given season.
3. If an item in history might need a healthier/alternative option, suggest a substitute.
4. Keep all output in a single JSON array of 5 objects.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = (await response.json()) as OpenAIResponse;
    const rawText = data.choices?.[0]?.message?.content || "";

    // Extract JSON array from the response
    const match = rawText.match(/\[[\s\S]*\]/);
    if (!match) {
      console.warn("No JSON detected from AI response:", rawText);
      return [];
    }

    const parsed = JSON.parse(match[0]) as {
      name: string;
      reason: string;
      category: string;
      confidence: number;
    }[];

    return parsed.map((item, idx) => ({
      id: `ai-${idx}`,
      name: item.name,
      category: item.category || "General",
      reason: item.reason || "AI suggestion",
      confidence: typeof item.confidence === "number" ? item.confidence : 0.8,
    }));
  } catch (err) {
    console.error("Error fetching AI suggestions:", err);
    return [];
  }
}
