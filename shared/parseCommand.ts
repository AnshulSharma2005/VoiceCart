import { VoiceCommand } from "./types";

export function parseCommand(transcript: string): VoiceCommand {
  const text = transcript.toLowerCase().trim();

  // Default "unknown" command
  let command: VoiceCommand = {
    action: "search", // default action if not matched
    intent: "unknown",
    raw: transcript,
  };

  // ADD command
  if (text.includes("add") || text.includes("need") || text.includes("buy")) {
    const words = text.split(" ");
    const item = words[words.length - 1]; // simple extraction (last word)
    command = {
      action: "add",
      intent: "add_item",
      item,
      raw: transcript,
    };
    return command;
  }

  // REMOVE command
  if (text.includes("remove") || text.includes("delete")) {
    const words = text.split(" ");
    const item = words[words.length - 1];
    command = {
      action: "remove",
      intent: "remove_item",
      item,
      raw: transcript,
    };
    return command;
  }

  // CLEAR list
  if (text.includes("clear all") || text.includes("empty list")) {
    command = {
      action: "clear",
      intent: "unknown",
      raw: transcript,
    };
    return command;
  }

  // COMPLETE item
  if (text.includes("complete") || text.includes("done")) {
    const words = text.split(" ");
    const item = words[words.length - 1];
    command = {
      action: "complete",
      intent: "unknown",
      item,
      raw: transcript,
    };
    return command;
  }

  return command;
}
