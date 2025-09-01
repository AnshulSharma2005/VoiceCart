import React from 'react';
import { Plus, Sparkles, Leaf, RefreshCw, History } from 'lucide-react';
import { Suggestion } from '../../../shared';

interface SmartSuggestionsProps {
  suggestions: Suggestion[];
  onAddSuggestion: (name: string, category: string) => void;
  isLoading: boolean;
}

export function SmartSuggestions({ 
  suggestions, 
  onAddSuggestion, 
  isLoading 
}: SmartSuggestionsProps) {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-800">Smart Suggestions</h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-white bg-opacity-60 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-800">Smart Suggestions</h3>
        </div>
        <p className="text-gray-600 text-center">
          Add some items to get personalized suggestions!
        </p>
      </div>
    );
  }

  // ✅ Map AI "reason" field to icons
  const getSuggestionIcon = (reason: string) => {
    if (reason.toLowerCase().includes("seasonal")) return <Leaf className="w-4 h-4 text-green-500" />;
    if (reason.toLowerCase().includes("substitute")) return <RefreshCw className="w-4 h-4 text-blue-500" />;
    if (reason.toLowerCase().includes("history")) return <History className="w-4 h-4 text-gray-500" />;
    return <Sparkles className="w-4 h-4 text-purple-500" />;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-6 h-6 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-800">Smart Suggestions</h3>
      </div>
      
      <div className="space-y-3">
        {suggestions.slice(0, 6).map((suggestion) => (
          <div
            key={suggestion.id}
            className="bg-white bg-opacity-80 backdrop-blur-sm rounded-xl p-4 hover:bg-opacity-100 transition-all duration-200 border border-white border-opacity-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  {getSuggestionIcon(suggestion.reason)}
                  <h4 className="font-medium text-gray-800 capitalize">
                    {suggestion.name}
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  {suggestion.reason}
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="px-2 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-xs font-medium">
                    {suggestion.category}
                  </span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-500 h-1.5 rounded-full"
                        style={{ width : `${suggestion.confidence * 100}%` }}
                      />
                    </div>
                    <span className="ml-2 text-xs text-gray-500">
                      {Math.round(suggestion.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onAddSuggestion(suggestion.name, suggestion.category)}
                className="ml-4 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
