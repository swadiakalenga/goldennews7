export default function TopBar() {
  const dateStr = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const socials = [
    { label: "Facebook", href: "#" },
    { label: "Twitter / X", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "Telegram", href: "#" },
  ];

  return (
    <div className="bg-gray-950 text-gray-400 text-[11px] py-1.5">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <span className="capitalize tracking-wide">{dateStr}</span>
        <div className="flex items-center divide-x divide-gray-700">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="px-3 first:pl-0 last:pr-0 hover:text-amber-400 transition-opacity hover:opacity-100 opacity-80 font-medium"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
