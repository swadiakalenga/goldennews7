"use client";

import { useEffect, useRef, useState } from "react";
import { breakingNewsItems } from "@/data/mock-news";

export default function BreakingNews() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % breakingNewsItems.length);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4 flex items-center gap-4">
        <span className="shrink-0 text-xs font-black uppercase tracking-widest bg-white text-red-600 px-2.5 py-0.5 rounded animate-pulse">
          Urgent
        </span>
        <div className="overflow-hidden flex-1">
          <p
            key={index}
            className="text-sm font-medium whitespace-nowrap truncate animate-fade-in"
          >
            {breakingNewsItems[index]}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          {breakingNewsItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === index ? "bg-white" : "bg-red-400"
              }`}
              aria-label={`Alerte ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
