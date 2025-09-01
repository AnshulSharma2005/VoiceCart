// hooks/useShoppingList.ts
import { useState } from "react";
import { ShoppingItem } from "@shared/types";

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [history, setHistory] = useState<ShoppingItem[]>([]);

  // Add a new item (or increase quantity if already exists by name)
  function addItem(name: string, quantity = 1, category = "General") {
    setItems((prev) => {
      const existing = prev.find((i) => i.name.toLowerCase() === name.toLowerCase());
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      const newItem: ShoppingItem = {
        id: crypto.randomUUID(),
        name,
        quantity,
        category,
        completed: false,
        addedAt: new Date(),
        priority: "medium",
      };
      setHistory((h) => [...h, newItem]);
      return [...prev, newItem];
    });
  }

  // Remove item by id
  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  // Toggle complete by id
  function toggleComplete(id: string) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, completed: !i.completed } : i
      )
    );
  }

  // Update item quantity by id
  function updateQuantity(id: string, quantity: number) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }

  // Clear all completed items
  function clearCompleted() {
    setItems((prev) => prev.filter((i) => !i.completed));
  }

  return {
    items,
    history,
    addItem,
    removeItem,
    toggleComplete,
    updateQuantity,
    clearCompleted,
  };
}
