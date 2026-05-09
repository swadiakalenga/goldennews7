type ArticleStatus = "draft" | "published" | "archived" | "scheduled";

const config: Record<ArticleStatus, { label: string; class: string; dot: string }> = {
  published: {
    label: "Publié",
    class: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
    dot: "bg-emerald-400",
  },
  draft: {
    label: "Brouillon",
    class: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30",
    dot: "bg-amber-400",
  },
  archived: {
    label: "Archivé",
    class: "bg-gray-500/15 text-gray-400 ring-1 ring-gray-500/30",
    dot: "bg-gray-400",
  },
  scheduled: {
    label: "Planifié",
    class: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30",
    dot: "bg-blue-400",
  },
};

export default function StatusBadge({ status }: { status: ArticleStatus }) {
  const meta = config[status] ?? config.draft;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${meta.class}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${meta.dot}`} />
      {meta.label}
    </span>
  );
}
