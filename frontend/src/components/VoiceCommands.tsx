// components/VoiceCommands.tsx
import { Mic } from "lucide-react";

interface VoiceCommandsProps {
  listening: boolean;
  startListening: () => void;
  stopListening: () => void;
}

export function VoiceCommands({
  listening,
  startListening,
  stopListening,
}: VoiceCommandsProps) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <Mic className="w-5 h-5 mr-2 text-purple-600" />
        Voice Commands
      </h3>

      <button
        onClick={listening ? stopListening : startListening}
        className={`px-4 py-2 rounded-lg text-white font-medium ${
          listening ? "bg-red-500" : "bg-purple-600"
        }`}
      >
        {listening ? "Stop Listening" : "Start Listening"}
      </button>
    </div>
  );
}
