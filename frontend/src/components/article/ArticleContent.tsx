"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";

interface ArticleContentProps {
  content: string;
}

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
  "blockquote", "h2", "h3", "h4", "hr", "img", "figure", "figcaption",
  "table", "thead", "tbody", "tr", "th", "td", "code", "pre", "span", "div",
];
const ALLOWED_ATTR = ["href", "src", "alt", "title", "class", "target", "rel", "style"];

export default function ArticleContent({ content }: ArticleContentProps) {
  const safe = useMemo(() => {
    if (typeof window === "undefined") return content;
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      ALLOW_DATA_ATTR: false,
      FORCE_BODY: true,
    }) as string;
  }, [content]);

  return (
    <div
      className="article-prose"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
