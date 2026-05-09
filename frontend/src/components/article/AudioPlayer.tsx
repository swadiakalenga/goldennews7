"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface AudioPlayerProps {
  title: string;
  content: string;
}

type PlayState = "idle" | "playing" | "paused";

// Singleton: cancel any active utterance when a new player starts
let activeStop: (() => void) | null = null;

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export default function AudioPlayer({ title, content }: AudioPlayerProps) {
  const [state, setState] = useState<PlayState>("idle");
  const [supported, setSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    utteranceRef.current = null;
    setState("idle");
    if (activeStop === stop) activeStop = null;
  }, []);

  const play = useCallback(() => {
    if (!supported) return;

    // Stop any other player
    if (activeStop && activeStop !== stop) activeStop();
    activeStop = stop;

    const text = `${title}. ${stripHtml(content)}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.88;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Prefer a French voice
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(
      (v) => v.lang.startsWith("fr") && !v.name.includes("Google")
    ) ?? voices.find((v) => v.lang.startsWith("fr"));
    if (frVoice) utterance.voice = frVoice;

    utterance.onend = () => setState("idle");
    utterance.onerror = () => setState("idle");

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setState("playing");
  }, [supported, title, content, stop]);

  const pause = useCallback(() => {
    window.speechSynthesis?.pause();
    setState("paused");
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis?.resume();
    setState("playing");
  }, []);

  if (!supported) return null;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
        state === "playing"
          ? "bg-amber-50 border-amber-300"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      {/* Animated wave when playing */}
      {state === "playing" && (
        <div className="flex items-end gap-0.5 h-4 shrink-0">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-0.5 bg-amber-500 rounded-full animate-pulse"
              style={{ height: `${[60, 100, 75, 90][i - 1]}%`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}

      <span className={`text-sm font-semibold shrink-0 ${state === "playing" ? "text-amber-700" : "text-gray-700"}`}>
        {state === "playing" ? "Lecture en cours…" : "Écouter l'article"}
      </span>

      <div className="flex items-center gap-1.5 ml-auto">
        {state === "idle" && (
          <button
            onClick={play}
            aria-label="Lire"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Écouter
          </button>
        )}

        {state === "playing" && (
          <button
            onClick={pause}
            aria-label="Pause"
            className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </button>
        )}

        {state === "paused" && (
          <button
            onClick={resume}
            aria-label="Reprendre"
            className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}

        {state !== "idle" && (
          <button
            onClick={stop}
            aria-label="Arrêter"
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
