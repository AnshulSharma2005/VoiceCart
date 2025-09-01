import React from 'react';
import { Check, X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { ShoppingItem } from '../../../shared';

interface ShoppingListProps {
  items: ShoppingItem[];
  onToggleComplete: (id: string) => void;   // expects id
  onRemove: (id: string) => void;           // expects id
  onUpdateQuantity: (id: string, quantity: number) => void;
  onClearCompleted: () => void;
}

const categoryColors = {
  dairy: 'from-blue-400 to-cyan-400',
  produce: 'from-green-400 to-emerald-400',
  meat: 'from-red-400 to-pink-400',
  pantry: 'from-yellow-400 to-orange-400',
  beverages: 'from-purple-400 to-indigo-400',
  snacks: 'from-pink-400 to-rose-400',
  household: 'from-gray-400 to-slate-400',
  frozen: 'from-cyan-400 to-blue-400',
  other: 'from-gray-400 to-gray-500'
};

const categoryIcons = {
  dairy: '🥛',
  produce: '🥬',
  meat: '🥩',
  pantry: '🍞',
  beverages: '🥤',
  snacks: '🍿',
  household: '🧽',
  frozen: '🧊',
  other: '📦'
};

export function ShoppingList({ 
  items, 
  onToggleComplete, 
  onRemove, 
  onUpdateQuantity, 
  onClearCompleted 
}: ShoppingListProps) {
  const groupedItems = items.reduce((groups, item) => {
    const category = item.category?.toLowerCase() || 'other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {} as Record<string, ShoppingItem[]>);

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  if (totalCount === 0) {
    return (
      <div className="text-center p-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl">
        <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500 text-lg">Your shopping list is empty</p>
        <p className="text-gray-400 text-sm mt-2">Use voice commands to add items!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Shopping List</h2>
            <p className="text-gray-600">
              {completedCount} of {totalCount} items completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </div>
            <p className="text-sm text-gray-500">Complete</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{ width : `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>

        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-sm font-medium"
          >
            Clear Completed ({completedCount})
          </button>
        )}
      </div>

      {/* Grouped Items */}
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category} className="space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{categoryIcons[category as keyof typeof categoryIcons]}</span>
            <h3 className="text-lg font-semibold text-gray-800 capitalize">
              {category} ({categoryItems.length})
            </h3>
          </div>

          <div className="grid gap-3">
            {categoryItems.map((item) => (
              <div
                key={item.id}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-200
                  ${item.completed
                    ? 'bg-gray-50 border-gray-200 opacity-75'
                    : `bg-gradient-to-r ${categoryColors[item.category as keyof typeof categoryColors] || categoryColors.other} bg-opacity-10 border-transparent hover:shadow-md`
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <button
                      onClick={() => onToggleComplete(item.id)}
                      className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center
                        transition-all duration-200
                        ${item.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 hover:border-green-400'
                        }
                      `}
                    >
                      {item.completed && <Check className="w-4 h-4 text-white" />}
                    </button>

                    <div className="flex-1">
                      <h4 className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {item.name}
                      </h4>
                      {item.brand && (
                        <p className="text-sm text-gray-500">{item.brand}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>

                      <span className="text-lg font-semibold text-gray-800 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemove(item.id)}
                      className="w-8 h-8 rounded-full bg-red-100 border border-red-200 flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
