"use client";

import { useState, useEffect } from "react";

/**
 * Hook to persist input values in localStorage based on category.
 * Used for "Smart Memory" fields like Venues, Speakers, etc.
 */
export function useSmartMemory(category: string) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`su_memory_${category}`);
    if (saved) {
      try {
        setSuggestions(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing memory:", e);
      }
    }
  }, [category]);

  const saveMemory = (value: string) => {
    if (!value || value.trim() === "") return;
    const trimmed = value.trim();
    setSuggestions(prev => {
      if (prev.includes(trimmed)) return prev;
      const updated = [trimmed, ...prev].slice(0, 10); // Keep last 10
      localStorage.setItem(`su_memory_${category}`, JSON.stringify(updated));
      return updated;
    });
  };

  return { suggestions, saveMemory };
}
