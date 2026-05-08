export default function TopBar() {
  const dateStr = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="bg-gray-900 text-gray-300 text-xs py-1.5">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <span className="capitalize">{dateStr}</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-amber-400 transition-colors">
            Facebook
          </a>
          <a href="#" className="hover:text-amber-400 transition-colors">
            Twitter / X
          </a>
          <a href="#" className="hover:text-amber-400 transition-colors">
            YouTube
          </a>
          <a href="#" className="hover:text-amber-400 transition-colors">
            Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
