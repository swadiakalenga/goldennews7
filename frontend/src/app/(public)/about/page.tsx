import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos | GoldenNews7",
  description: "Découvrez GoldenNews7, la plateforme d'information africaine de référence — notre mission, notre équipe et nos valeurs.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Hero */}
      <div className="mb-12 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Notre histoire</span>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 font-serif leading-tight">
          L&apos;information africaine<br />sans frontières
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
          GoldenNews7 est né d&apos;une conviction : l&apos;Afrique mérite une information de qualité, indépendante et accessible à tous.
        </p>
      </div>

      {/* Sections */}
      <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Notre mission</h2>
          <p>
            GoldenNews7 a pour vocation d&apos;offrir une couverture rigoureuse et plurielle de l&apos;actualité africaine et internationale. Nous croyons que l&apos;accès à une information fiable est un droit fondamental, et nous mettons tout en œuvre pour respecter les standards les plus élevés du journalisme professionnel.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Nos valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "🎯", title: "Exactitude", desc: "Chaque information est vérifiée avant publication." },
              { icon: "⚖️", title: "Indépendance", desc: "Nous ne répondons qu'à nos lecteurs, jamais à des intérêts particuliers." },
              { icon: "🌍", title: "Diversité", desc: "Nous donnons la parole à toutes les voix du continent." },
              { icon: "⚡", title: "Réactivité", desc: "L'actualité en continu, 24h/24 et 7j/7." },
            ].map((v) => (
              <div key={v.title} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                <span className="text-2xl">{v.icon}</span>
                <div>
                  <p className="font-bold text-gray-900">{v.title}</p>
                  <p className="text-sm text-gray-600">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Notre équipe</h2>
          <p>
            GoldenNews7 réunit des journalistes, reporters et correspondants à travers l&apos;Afrique et dans le monde entier. Notre équipe éditoriale est composée de professionnels expérimentés, issus des meilleures écoles de journalisme et dotés d&apos;une connaissance approfondie des réalités africaines.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Nous contacter</h2>
          <p>
            Vous avez une question, une information à nous soumettre ou souhaitez rejoindre notre équipe ?
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold rounded-full transition-colors">
            Nous écrire →
          </Link>
        </section>
      </div>
    </div>
  );
}
