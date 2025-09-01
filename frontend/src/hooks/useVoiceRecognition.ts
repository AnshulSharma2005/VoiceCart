// hooks/useVoiceRecognition.ts
import { useState, useRef } from "react";
import type { VoiceCommand, VoiceState } from "../../../shared";
import { parseCommand } from "../../../shared/parseCommand";

export function useVoiceRecognition(
  onCommand: (command: VoiceCommand | null) => void
) {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isSupported: true,
    isListening: false,
    transcript: "",
    confidence: 0,
    error: null,
    shoppingList: [],
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const lastTranscriptRef = useRef<string>("");

  const startListening = () => {
    const win = window as typeof window & {
      SpeechRecognition?: new () => SpeechRecognition;
      webkitSpeechRecognition?: new () => SpeechRecognition;
    };

    const SpeechRecognitionClass =
      win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setVoiceState((prev) => ({ ...prev, isSupported: false }));
      return;
    }

    const recog = new SpeechRecognitionClass();
    recog.lang = navigator.language || "en-US";
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    recog.onstart = () => {
      setVoiceState((prev) => ({ ...prev, isListening: true, error: null }));
    };

    recog.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.trim();

      if (transcript === lastTranscriptRef.current) return;
      lastTranscriptRef.current = transcript;

      setVoiceState((prev) => ({
        ...prev,
        transcript,
        confidence: event.results[0][0].confidence ?? 0,
      }));

      // ✅ parse transcript into VoiceCommand
      const parsed = parseCommand(transcript);
      onCommand(parsed);
    };

    recog.onerror = (event: SpeechRecognitionErrorEvent) => {
      setVoiceState((prev) => ({ ...prev, error: event.error }));
    };

    recog.onend = () => {
      setVoiceState((prev) => ({ ...prev, isListening: false }));
    };

    recog.start();
    recognitionRef.current = recog;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setVoiceState((prev) => ({ ...prev, isListening: false }));
  };

  return { voiceState, setVoiceState, startListening, stopListening };
}
