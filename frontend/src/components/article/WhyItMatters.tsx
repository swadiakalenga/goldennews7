interface WhyItMattersProps {
  text: string;
}

export default function WhyItMatters({ text }: WhyItMattersProps) {
  if (!text.trim()) return null;

  return (
    <aside className="my-8 relative pl-5 border-l-4 border-amber-400">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-black uppercase tracking-widest text-amber-600">
          Pourquoi c&apos;est important
        </span>
      </div>
      <p className="text-base text-gray-800 leading-relaxed font-medium italic">
        {text}
      </p>
    </aside>
  );
}
