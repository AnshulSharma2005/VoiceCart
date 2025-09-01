import { useState } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { VoiceState } from "../../../shared";

interface VoiceRecorderProps {
  voiceState: VoiceState;
  setVoiceState: React.Dispatch<React.SetStateAction<VoiceState>>;
  feedback: string;
  startListening: () => void;
  stopListening: () => void;
  onCommand?: (action: string, item?: string) => void; // Added callback
}

export function VoiceRecorder({
  voiceState,
  setVoiceState,
  feedback,
  onCommand, // Destructure here
}: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const startListening = () => {
    const win = window as {
      SpeechRecognition?: typeof SpeechRecognition;
      webkitSpeechRecognition?: typeof SpeechRecognition;
    };

    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setVoiceState((prev) => ({ ...prev, isSupported: false }));
      return;
    }

    const recog = new SpeechRecognitionClass();
    recog.lang = navigator.language || "en-US";
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    recog.onstart = () => {
      setIsListening(true);
      setVoiceState((prev) => ({ ...prev, isListening: true, error: null }));
    };

    recog.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setIsProcessing(true);

      try {
        const res = await fetch("http://localhost:5000/api/voice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript }),
        });

        const data: {
          transcript?: string;
          translated?: string;
          error?: string;
          shoppingList?: string[];
          action?: string;
          item?: string;
        } = await res.json();

        if (data.error) {
          setVoiceState((prev) => ({ ...prev, error: data.error ?? null }));
        } else {
          setVoiceState((prev) => ({
            ...prev,
            transcript: data.translated || data.transcript || transcript,
            shoppingList: data.shoppingList || prev.shoppingList || [],
            error: null,
          }));

          // Trigger Dashboard's shopping list update
          if (data.action) {
            onCommand?.(data.action, data.item);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setVoiceState((prev) => ({ ...prev, error: err.message }));
        } else {
          setVoiceState((prev) => ({ ...prev, error: "Failed to process audio" }));
        }
      } finally {
        setIsProcessing(false);
      }
    };

    recog.onerror = (event: SpeechRecognitionErrorEvent) => {
      setVoiceState((prev) => ({ ...prev, error: event.error }));
      setIsListening(false);
    };

    recog.onend = () => {
      setIsListening(false);
    };

    recog.start();
    setRecognition(recog);
  };

  const stopListening = () => {
    recognition?.stop();
    setIsListening(false);
  };

  if (!voiceState.isSupported) {
    return (
      <div className="text-center p-8 bg-red-100 rounded-xl">
        <MicOff className="w-12 h-12 mx-auto mb-4 text-red-500" />
        <p className="text-red-700">Voice recognition is not supported in your browser.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={!voiceState.isSupported || isProcessing}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
          isListening
            ? "bg-gradient-to-r from-red-500 to-pink-500 animate-pulse"
            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        }`}
      >
        {isListening ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
      </button>

      <div className="mt-4 text-center">
        {isListening ? (
          <p className="text-purple-600 font-medium">Listening...</p>
        ) : isProcessing ? (
          <p className="text-blue-600 font-medium">Processing...</p>
        ) : (
          <p className="text-gray-600">Tap to speak</p>
        )}

        {voiceState.transcript && !isProcessing && (
          <p className="text-gray-600 text-sm mt-1 italic">"{voiceState.transcript}"</p>
        )}

        {/* {voiceState.shoppingList && voiceState.shoppingList.length > 0 && (
          <ul className="mt-2 text-left text-gray-700">
            {voiceState.shoppingList.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        )} */}

        {voiceState.error && <p className="text-red-500 text-sm mt-2">{voiceState.error}</p>}

        {feedback && (
          <div className="mt-3 p-3 bg-green-100 rounded-lg flex items-center justify-center">
            <Volume2 className="w-4 h-4 text-green-600 mr-2" />
            <p className="text-green-700 text-sm">{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
}
