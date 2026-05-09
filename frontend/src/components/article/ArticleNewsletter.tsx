export default function ArticleNewsletter() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
      <div className="max-w-md">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
          Newsletter
        </span>
        <h3 className="text-2xl font-black mb-2">
          L&apos;actualité africaine chaque matin
        </h3>
        <p className="text-sm text-gray-400 mb-5">
          Rejoignez plus de 50 000 lecteurs qui font confiance à GoldenNews7 pour rester
          informés. Gratuit, sans spam.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="votre@email.com"
            className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-amber-400 transition-colors"
          />
          <button className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm rounded-lg transition-colors whitespace-nowrap">
            S&apos;abonner
          </button>
        </div>
      </div>
    </div>
  );
}
