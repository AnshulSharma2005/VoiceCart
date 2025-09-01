// utils/nlp.ts
import type { VoiceCommand } from "../../../shared";

export interface ParsedCommand {
  intent: VoiceCommand["intent"];
  item?: string;
}

export async function nlpParse(text: string): Promise<ParsedCommand> {
  const normalized = text.trim().toLowerCase();

  // --- Hindi REMOVE ---
// --- Hindi REMOVE ---
if (
  /(hata|hatao|hata do|nikal|nikalo|nikal do|hatado|हटा दो|निकाल दो|निकालो|हटाओ)/i.test(normalized)
) {
  const item = normalized.replace(
    /(hata|hatao|hata do|nikal|nikalo|nikal do|hatado|हटा दो|निकाल दो|निकालो|हटाओ)/gi,
    ""
  ).trim();
  return { intent: "remove_item", item };
}

// --- Hindi ADD ---
if (
  /(jodo|dalo|dal do|add karo|le aao|lao|khareedo|chahiye|जोड़ो|डालो|लाओ|खरीदो|चाहिए)/i.test(normalized)
) {
  const item = normalized.replace(
    /(jodo|dalo|dal do|add karo|le aao|lao|khareedo|chahiye|जोड़ो|डालो|लाओ|खरीदो|चाहिए)/gi,
    ""
  ).trim();
  return { intent: "add_item", item };
}

  // --- English ADD ---
  if (/add|buy|get|need|want/i.test(normalized)) {
    const item = normalized.replace(/add|buy|get|need|want/gi, "").trim();
    return { intent: "add_item", item };
  }

  // --- English REMOVE ---
  if (/remove|delete|drop/i.test(normalized)) {
    const item = normalized.replace(/remove|delete|drop/gi, "").trim();
    return { intent: "remove_item", item };
  }

  return { intent: "unknown" };
}
