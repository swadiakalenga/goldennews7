type ArticleStatus = "draft" | "published" | "archived";

const config: Record<ArticleStatus, { label: string; class: string }> = {
  published: {
    label: "Publié",
    class: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
  },
  draft: {
    label: "Brouillon",
    class: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30",
  },
  archived: {
    label: "Archivé",
    class: "bg-gray-500/15 text-gray-400 ring-1 ring-gray-500/30",
  },
};

export default function StatusBadge({ status }: { status: ArticleStatus }) {
  const { label, class: cls } = config[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === "published" ? "bg-emerald-400" :
        status === "draft" ? "bg-amber-400" : "bg-gray-400"
      }`} />
      {label}
    </span>
  );
}
