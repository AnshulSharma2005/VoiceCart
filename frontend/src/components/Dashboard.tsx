import { useState, useEffect, useCallback } from "react";
import { ShoppingBag, LogOut, User } from "lucide-react";
import { VoiceRecorder } from "./VoiceRecorder";
import { ShoppingList } from "./ShoppingList";
import { SmartSuggestions } from "./SmartSuggestions";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";
import { useShoppingList } from "../hooks/useShoppingList";
import { VoiceCommand, UserType, ShoppingItem, Suggestion } from "@shared/types";
import { useNavigate } from "react-router-dom";

interface DashboardProps {
  user: UserType | null;
  onLogout: () => void;
}

interface BackendSuggestion {
  id?: string;
  name: string;
  category?: string;
  reason?: string;
  confidence?: number;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [feedback, setFeedback] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  const navigate = useNavigate();

  const {
    items,
    history,
    addItem,
    removeItem,
    toggleComplete,
    updateQuantity,
    clearCompleted,
  } = useShoppingList();

  // ✅ Voice command handler (original version)
  const handleVoiceCommand = useCallback(
    (command: VoiceCommand | null) => {
      if (!command) {
        setFeedback("Sorry, I didn’t understand that command.");
        setTimeout(() => setFeedback(""), 3000);
        return;
      }

      switch (command.action) {
        case "add":
  if (command.item) {
    addItem(command.item, command.quantity || 1, command.category);
    setFeedback(
      `Added ${command.quantity || 1} ${command.item}(s)${
        command.category ? ` to ${command.category}` : ""
      }`
    );
  }
  break;

        case "remove":
          if (command.item) {
            const found = items.find(
              (i) => i.name.toLowerCase() === command.item!.toLowerCase()
            );
            if (found) {
              removeItem(found.id);
              setFeedback(`Removed ${command.item}`);
            }
          }
          break;

        case "complete":
          if (command.item) {
            const found = items.find(
              (i) => i.name.toLowerCase() === command.item!.toLowerCase()
            );
            if (found) {
              toggleComplete(found.id);
              setFeedback(`Completed ${command.item}`);
            }
          }
          break;

        case "clear":
          clearCompleted();
          setFeedback("Cleared completed items");
          break;

        default:
          setFeedback("Command not recognized");
      }

      setTimeout(() => setFeedback(""), 3000);
    },
    [items, addItem, removeItem, toggleComplete, clearCompleted]
  );

  // ✅ Keep your old voice recognition flow
  const { voiceState, startListening, stopListening, setVoiceState } =
    useVoiceRecognition(handleVoiceCommand);

  // ✅ Fetch AI suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsLoadingSuggestions(true);
        const response = await fetch("http://localhost:5000/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.id || "default",
            currentItems: items.map((i: ShoppingItem) => i.name),
            history: history.map((i: ShoppingItem) => i.name),
          }),
        });
        const data = (await response.json()) as { suggestions: BackendSuggestion[] };
        const mappedSuggestions: Suggestion[] = (data.suggestions || []).map((s) => ({
          id: s.id || crypto.randomUUID(),
          name: s.name,
          category: s.category || "General",
          reason: s.reason || "AI suggestion",
          confidence: s.confidence ?? 0.9,
        }));
        setSuggestions(mappedSuggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [items, history, user]);

  const handleAddSuggestion = (name: string, category?: string) => {
    addItem(name, 1, category || "General");
    setFeedback(`Added ${name} to your list`);
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    onLogout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="relative z-50 bg-white bg-opacity-80 backdrop-blur-lg border-b border-white border-opacity-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Voice Shopping Assistant
              </h1>
              <p className="text-gray-600 text-sm">Welcome back, {user?.name || "User"}!</p>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex items-center space-x-2 p-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700 font-medium">{user?.name || "Guest"}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name || "Guest"}</p>
                  <p className="text-xs text-gray-500">{user?.email || ""}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="text-center">
            <VoiceRecorder
              voiceState={voiceState}
              setVoiceState={setVoiceState}
              feedback={feedback}
              startListening={startListening}
              stopListening={stopListening}
              onCommand={(action, item) => {
                const validActions: VoiceCommand["action"][] = [
                  "search",
                  "add",
                  "remove",
                  "clear",
                  "complete",
                ];

                if (validActions.includes(action as VoiceCommand["action"])) {
                  handleVoiceCommand({
                    action: action as VoiceCommand["action"],
                    item,
                    intent: "add_item",
                    raw: item || "",
                  });
                } else {
                  handleVoiceCommand(null);
                }
              }}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ShoppingList
                items={items}
                onToggleComplete={toggleComplete}
                onRemove={removeItem}
                onUpdateQuantity={updateQuantity}
                onClearCompleted={clearCompleted}
              />
            </div>

            <div className="space-y-6">
              <SmartSuggestions
                suggestions={suggestions}
                onAddSuggestion={handleAddSuggestion}
                isLoading={isLoadingSuggestions}
              />
            </div>
          </div>
        </div>
      </main>

      {showUserMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
      )}
    </div>
  );
}
