import { createServerSupabaseClient } from "@/lib/supabase/server";

// Server component — no JS needed; pure CSS marquee with pause-on-hover
export default async function BreakingNews() {
  const supabase = await createServerSupabaseClient();
  const now = new Date().toISOString();
  const result = (await supabase
    .from("articles")
    .select("title")
    .eq("is_breaking", true)
    .or(`status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${now})`)
    .or(`breaking_expires_at.is.null,breaking_expires_at.gt.${now}`)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(8)) as unknown as { data: { title: string }[] | null };

  const items = result.data?.map((r) => r.title) ?? [];
  if (items.length === 0) return null;

  // Duplicate items so the loop is seamless: animate -50% of total width = one copy
  const doubled = [...items, ...items];

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="flex items-center gap-0">
        {/* Static "URGENT" badge */}
        <div className="shrink-0 flex items-center pl-4 pr-3 z-10 bg-red-600">
          <span
            className="text-[10px] font-black uppercase tracking-widest bg-white text-red-600 px-2.5 py-1 rounded"
            style={{ boxShadow: "0 0 10px rgba(255,255,255,0.5)" }}
          >
            Urgent
          </span>
        </div>

        {/* Gradient fade on left edge */}
        <div className="shrink-0 w-6 bg-gradient-to-r from-red-600 to-transparent z-10" />

        {/* Infinite marquee track */}
        <div className="overflow-hidden flex-1 relative">
          <div className="animate-marquee">
            {doubled.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center shrink-0 text-sm font-medium pr-16 whitespace-nowrap"
              >
                {item}
                <span className="ml-16 text-red-300 text-xs" aria-hidden="true">◆</span>
              </span>
            ))}
          </div>
        </div>

        {/* Gradient fade on right edge */}
        <div className="shrink-0 w-8 bg-gradient-to-l from-red-600 to-transparent z-10" />
      </div>
    </div>
  );
}
