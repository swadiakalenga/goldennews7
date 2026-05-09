"use client";

import { useEffect, useRef, useState } from "react";

interface ContextCard {
  keyword: string;
  title: string;
  content: string;
}

interface ContextCardLayerProps {
  cards: ContextCard[];
  children: React.ReactNode;
}

interface TooltipState {
  x: number;
  y: number;
  title: string;
  content: string;
  visible: boolean;
}

export default function ContextCardLayer({ cards, children }: ContextCardLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({ x: 0, y: 0, title: "", content: "", visible: false });

  useEffect(() => {
    const el = containerRef.current;
    if (!el || cards.length === 0) return;

    // Walk all text nodes and wrap keywords
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const nodesToProcess: Text[] = [];

    let node: Node | null;
    while ((node = walker.nextNode())) {
      // Skip nodes inside already-processed spans
      if ((node.parentElement as HTMLElement)?.dataset?.ctxKw !== undefined) continue;
      nodesToProcess.push(node as Text);
    }

    for (const textNode of nodesToProcess) {
      const text = textNode.textContent ?? "";
      if (!text.trim()) continue;

      for (const card of cards) {
        const kw = card.keyword;
        const regex = new RegExp(`\\b(${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`, "gi");
        if (!regex.test(text)) continue;
        regex.lastIndex = 0;

        const parent = textNode.parentNode;
        if (!parent) continue;

        const frag = document.createDocumentFragment();
        let last = 0;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(text)) !== null) {
          if (match.index > last) {
            frag.appendChild(document.createTextNode(text.slice(last, match.index)));
          }
          const span = document.createElement("span");
          span.textContent = match[0];
          span.dataset.ctxKw = "1";
          span.dataset.title = card.title;
          span.dataset.content = card.content;
          span.className = "ctx-kw border-b border-dotted border-amber-500 text-amber-700 cursor-help";
          frag.appendChild(span);
          last = match.index + match[0].length;
        }
        if (last < text.length) {
          frag.appendChild(document.createTextNode(text.slice(last)));
        }
        parent.replaceChild(frag, textNode);
        break; // one keyword per text node to avoid re-processing issues
      }
    }

    // Delegated event listener on container
    function onEnter(e: Event) {
      const span = (e.target as HTMLElement).closest("[data-ctx-kw]") as HTMLElement | null;
      if (!span) return;
      const rect = span.getBoundingClientRect();
      const containerRect = el!.getBoundingClientRect();
      setTooltip({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.bottom - containerRect.top + 8,
        title: span.dataset.title ?? "",
        content: span.dataset.content ?? "",
        visible: true,
      });
    }

    function onLeave(e: Event) {
      const span = (e.target as HTMLElement).closest("[data-ctx-kw]");
      if (!span) return;
      setTooltip((t) => ({ ...t, visible: false }));
    }

    el.addEventListener("mouseenter", onEnter, true);
    el.addEventListener("mouseleave", onLeave, true);
    el.addEventListener("touchstart", onEnter, { passive: true, capture: true });

    return () => {
      el.removeEventListener("mouseenter", onEnter, true);
      el.removeEventListener("mouseleave", onLeave, true);
      el.removeEventListener("touchstart", onEnter, true);
    };
  }, [cards]);

  return (
    <div ref={containerRef} className="relative">
      {children}
      {tooltip.visible && (
        <div
          className="absolute z-50 w-64 p-3 bg-gray-900 text-white rounded-xl shadow-xl border border-white/10 pointer-events-none"
          style={{ left: Math.max(0, tooltip.x - 128), top: tooltip.y }}
        >
          <p className="text-xs font-black text-amber-400 mb-1">{tooltip.title}</p>
          <p className="text-xs text-gray-300 leading-relaxed">{tooltip.content}</p>
        </div>
      )}
    </div>
  );
}
