"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface AudioPlayerProps {
  title: string;
  content: string;
}

type Speed = "slow" | "normal" | "fast";
type PlayState = "idle" | "playing" | "paused";

const RATES: Record<Speed, number> = { slow: 0.75, normal: 0.88, fast: 1.1 };
const SPEED_LABELS: Record<Speed, string> = { slow: "Lent", normal: "Normal", fast: "Rapide" };

// Singleton: cancel any active utterance when a new player starts
let activeStop: (() => void) | null = null;

function stripHtml(html: string): string {
  return html
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, ".\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim();
}

function buildChunks(html: string, title: string): string[] {
  const plain = stripHtml(html);
  const fullText = `${title}. ${plain}`;
  const paragraphs = fullText.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  const result: string[] = [];
  for (const para of paragraphs) {
    if (para.length <= 350) {
      result.push(para);
      continue;
    }
    const sentences = para.match(/[^.!?]+[.!?]+["']?\s*/g) ?? [para];
    let buf = "";
    for (const sent of sentences) {
      if (buf.length + sent.length > 350 && buf) {
        result.push(buf.trim());
        buf = sent;
      } else {
        buf += sent;
      }
    }
    if (buf.trim()) result.push(buf.trim());
  }
  return result.filter((c) => c.length > 0);
}

function getBestFrenchVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const preferred = ["fr-FR", "fr-CA", "fr-BE", "fr-CH", "fr"];
  for (const lang of preferred) {
    const match = voices.find((v) => v.lang === lang || v.lang.startsWith(lang));
    if (match) return match;
  }
  return voices[0] ?? null;
}

function getFrenchVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  return voices.filter((v) => v.lang.toLowerCase().startsWith("fr"));
}

export default function AudioPlayer({ title, content }: AudioPlayerProps) {
  const [playState, setPlayState] = useState<PlayState>("idle");
  const [speed, setSpeed] = useState<Speed>("normal");
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string>("");
  const [chunkIndex, setChunkIndex] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);

  const chunksRef = useRef<string[]>([]);
  const chunkIndexRef = useRef(0);
  const playStateRef = useRef<PlayState>("idle");
  const speedRef = useRef<Speed>("normal");
  const selectedVoiceRef = useRef<string>("");
  const stopRef = useRef<(() => void) | null>(null);
  // Ref for recursive speakChunk calls (avoids variable-before-declaration)
  const speakChunkRef = useRef<(index: number) => void>(() => {});

  // Sync refs in effects (never during render)
  useEffect(() => { playStateRef.current = playState; }, [playState]);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { selectedVoiceRef.current = selectedVoiceUri; }, [selectedVoiceUri]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    function loadVoices() {
      setSupported(true);
      const all = window.speechSynthesis.getVoices();
      const fr = getFrenchVoices(all);
      setVoices(fr);
      if (!selectedVoiceRef.current && fr.length > 0) {
        const best = getBestFrenchVoice(fr);
        if (best) setSelectedVoiceUri(best.voiceURI);
      }
    }

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  // Build chunks and update totalChunks state (inside async fn to avoid sync setState-in-effect)
  useEffect(() => {
    async function build() {
      const chunks = buildChunks(content, title);
      chunksRef.current = chunks;
      setTotalChunks(chunks.length);
    }
    build();
  }, [content, title]);

  const speakChunk = useCallback((index: number) => {
    const chunks = chunksRef.current;
    if (index >= chunks.length) {
      setPlayState("idle");
      setChunkIndex(0);
      chunkIndexRef.current = 0;
      if (activeStop === stopRef.current) activeStop = null;
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = "fr-FR";
    utterance.rate = RATES[speedRef.current];
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const allVoices = window.speechSynthesis.getVoices();
    const voice = allVoices.find((v) => v.voiceURI === selectedVoiceRef.current);
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      if (playStateRef.current !== "playing") return;
      const next = chunkIndexRef.current + 1;
      chunkIndexRef.current = next;
      setChunkIndex(next);

      if (next < chunksRef.current.length) {
        // Use ref to avoid circular declaration (speakChunk self-reference)
        setTimeout(() => {
          if (playStateRef.current === "playing") speakChunkRef.current(next);
        }, 300);
      } else {
        setPlayState("idle");
        setChunkIndex(0);
        chunkIndexRef.current = 0;
        if (activeStop === stopRef.current) activeStop = null;
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== "interrupted" && e.error !== "canceled") {
        setPlayState("idle");
      }
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // Keep refs updated
  useEffect(() => { speakChunkRef.current = speakChunk; }, [speakChunk]);

  const stopPlayback = useCallback(() => {
    window.speechSynthesis.cancel();
    setPlayState("idle");
    setChunkIndex(0);
    chunkIndexRef.current = 0;
    if (activeStop === stopRef.current) activeStop = null;
  }, []);

  useEffect(() => { stopRef.current = stopPlayback; }, [stopPlayback]);

  const play = useCallback(() => {
    if (!supported) return;
    if (activeStop && activeStop !== stopRef.current) activeStop();
    activeStop = stopRef.current;

    window.speechSynthesis.cancel();
    const startIndex = playState === "paused" ? chunkIndexRef.current : 0;
    chunkIndexRef.current = startIndex;
    setChunkIndex(startIndex);
    setPlayState("playing");
    speakChunk(startIndex);
  }, [supported, playState, speakChunk]);

  const pause = useCallback(() => {
    window.speechSynthesis.cancel();
    setPlayState("paused");
  }, []);

  const resume = useCallback(() => {
    setPlayState("playing");
    speakChunk(chunkIndexRef.current);
  }, [speakChunk]);

  function handleSpeedChange(s: Speed) {
    setSpeed(s);
    speedRef.current = s;
    if (playStateRef.current === "playing") {
      window.speechSynthesis.cancel();
      setTimeout(() => speakChunk(chunkIndexRef.current), 50);
    }
  }

  if (!supported) return null;

  const progress = totalChunks > 0 ? Math.round((chunkIndex / totalChunks) * 100) : 0;

  return (
    <div className={`rounded-xl border transition-colors overflow-hidden ${
      playState === "playing" ? "bg-amber-50 border-amber-300" : "bg-gray-50 border-gray-200"
    }`}>
      {/* Main controls row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {playState === "playing" && (
          <div className="flex items-end gap-0.5 h-5 shrink-0">
            {[60, 100, 75, 90, 65].map((h, i) => (
              <span
                key={i}
                className="w-0.5 bg-amber-500 rounded-full animate-pulse"
                style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        )}

        <span className={`text-sm font-semibold shrink-0 ${playState === "playing" ? "text-amber-700" : "text-gray-700"}`}>
          {playState === "playing" ? "Lecture…" : playState === "paused" ? "En pause" : "Écouter l'article"}
        </span>

        <div className="flex items-center gap-1.5 ml-auto">
          {(playState === "idle" || playState === "paused") && (
            <button
              onClick={playState === "paused" ? resume : play}
              aria-label={playState === "paused" ? "Reprendre" : "Lire"}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              {playState === "paused" ? "Reprendre" : "Écouter"}
            </button>
          )}

          {playState === "playing" && (
            <button onClick={pause} aria-label="Pause"
              className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>
          )}

          {playState !== "idle" && (
            <button onClick={stopPlayback} aria-label="Arrêter"
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z" />
              </svg>
            </button>
          )}

          <div className="flex items-center gap-0.5 ml-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
            {(["slow", "normal", "fast"] as Speed[]).map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`px-2 py-1 text-[11px] font-bold transition-colors ${
                  speed === s
                    ? "bg-amber-500 text-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {SPEED_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {playState !== "idle" && totalChunks > 0 && (
        <div className="h-0.5 bg-amber-100">
          <div
            className="h-full bg-amber-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Voice selector */}
      {voices.length > 1 && playState === "idle" && (
        <div className="px-4 pb-3 flex items-center gap-2">
          <span className="text-[11px] text-gray-400 shrink-0">Voix :</span>
          <select
            value={selectedVoiceUri}
            onChange={(e) => setSelectedVoiceUri(e.target.value)}
            className="text-[11px] text-gray-600 bg-transparent border-0 outline-none cursor-pointer"
          >
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={`px-4 pb-2 ${voices.length > 1 && playState === "idle" ? "" : "pt-0"}`}>
        <p className="text-[10px] text-gray-400">
          Lecture automatique par synthèse vocale. Qualité dépendante du navigateur.
        </p>
      </div>
    </div>
  );
}
