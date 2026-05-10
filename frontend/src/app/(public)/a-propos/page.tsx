import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos | GoldenNews7",
  description: "GoldenNews7 est un média d'information numérique indépendant dédié à l'actualité africaine et internationale. Nous vous apportons le monde, une vérité à la fois.",
  openGraph: {
    title: "À propos | GoldenNews7",
    description: "GoldenNews7 est un média d'information numérique indépendant dédié à l'actualité africaine et internationale.",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
            Notre histoire
          </span>
          <h1 className="text-4xl sm:text-5xl font-black font-serif leading-tight mb-5">
            À propos de GoldenNews7
          </h1>
          <p className="text-xl text-amber-300 font-semibold italic">
            Nous vous apportons le monde, une vérité à la fois.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14 max-w-3xl">

        {/* Who we are */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-5 flex items-center gap-3">
            <span className="w-1 h-7 bg-amber-500 rounded-full shrink-0" />
            Qui sommes-nous
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              GoldenNews7 est un média d&apos;information numérique indépendant fondé en 2022, dédié à l&apos;actualité africaine et internationale. Depuis notre création, notre vocation est claire : offrir à nos lecteurs — où qu&apos;ils se trouvent dans le monde — une information fiable, rigoureuse et accessible, portée par une équipe de journalistes passionnés qui placent la vérité au centre de leur métier.
            </p>
            <p>
              Basés aux États-Unis avec des racines profondes en Afrique, nous couvrons l&apos;ensemble du spectre de l&apos;actualité : politique, économie, sécurité, société, sport, culture, santé, technologie et enquêtes de fond. Notre ligne éditoriale repose sur une conviction simple : l&apos;information de qualité n&apos;a pas de frontières, et le continent africain mérite une couverture médiatique à la hauteur de sa complexité et de son dynamisme.
            </p>
          </div>

          <blockquote className="mt-7 border-l-4 border-amber-500 pl-5 py-1">
            <p className="text-gray-600 italic leading-relaxed">
              « Informer, éclairer, connecter. Dans un monde saturé de bruit, GoldenNews7 s&apos;engage à être une voix de clarté — un espace où l&apos;actualité est traitée avec la profondeur et l&apos;honnêteté qu&apos;elle exige. »
            </p>
          </blockquote>
        </section>

        {/* Mission */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-5 flex items-center gap-3">
            <span className="w-1 h-7 bg-amber-500 rounded-full shrink-0" />
            Notre mission
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Dans un paysage médiatique souvent fragmenté, GoldenNews7 s&apos;est donné pour mission de combler le fossé informationnel entre le continent africain et le reste du monde. Nous croyons que chaque événement, chaque crise, chaque avancée — qu&apos;elle ait lieu à Kinshasa, à Washington, à Paris ou à Pékin — mérite d&apos;être racontée avec justesse et mise en perspective.
            </p>
            <p>
              Notre rédaction produit quotidiennement des articles d&apos;actualité, des analyses approfondies et des enquêtes exclusives. Nous nous efforçons de donner la parole à ceux qui en sont souvent privés, tout en offrant à nos lecteurs les clés pour comprendre les enjeux qui façonnent notre époque.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-1 h-7 bg-amber-500 rounded-full shrink-0" />
            Nos valeurs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Rigueur",
                text: "Chaque information est vérifiée, chaque source est recoupée. La précision est notre exigence première.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
              },
              {
                title: "Indépendance",
                text: "Aucune pression politique, économique ou partisane ne dicte notre ligne éditoriale.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                ),
              },
              {
                title: "Accessibilité",
                text: "L'information de qualité doit être accessible à tous, sans barrières géographiques ni sociales.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                ),
              },
              {
                title: "Engagement",
                text: "Nous nous engageons pour un journalisme qui éclaire les consciences et nourrit le débat citoyen.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                ),
              },
            ].map((v) => (
              <div key={v.title} className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-2.5 mb-2">
                  <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {v.icon}
                  </svg>
                  <h3 className="font-black text-gray-900">{v.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Founder */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-1 h-7 bg-amber-500 rounded-full shrink-0" />
            Notre fondateur
          </h2>
          <div className="flex items-start gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <span className="text-xl font-black text-amber-600">S</span>
            </div>
            <div>
              <p className="font-black text-gray-900 text-lg leading-tight">Stephane Mbenga</p>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Fondateur &amp; CEO · Journaliste</p>
              <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                <p>
                  Journaliste de carrière, Stephane Mbenga a fait ses premières armes dans les rédactions de la République Démocratique du Congo, où il a développé une connaissance intime des réalités africaines et une passion indéfectible pour le journalisme d&apos;investigation. Aujourd&apos;hui basé aux États-Unis, il dirige GoldenNews7 avec la conviction que le journalisme africain a vocation à rayonner bien au-delà des frontières du continent.
                </p>
                <p>
                  Sous sa direction, GoldenNews7 s&apos;est imposé comme une source de référence pour les lecteurs francophones et anglophones à la recherche d&apos;une information rigoureuse sur l&apos;Afrique et le monde.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GoldenGroup7 */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-5 flex items-center gap-3">
            <span className="w-1 h-7 bg-amber-500 rounded-full shrink-0" />
            GoldenGroup7 : un écosystème entrepreneurial
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed mb-6">
            <p>
              GoldenNews7 est une propriété du <strong>GoldenGroup7</strong>, une holding entrepreneuriale fondée par Stephane Mbenga qui regroupe plusieurs entreprises innovantes opérant dans des secteurs variés. Cette diversification reflète une ambition plus large : bâtir un écosystème de marques et de services qui contribuent au développement économique et culturel de la diaspora africaine et au-delà.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: "GoldenNews7", sector: "Média & Information", color: "bg-amber-500" },
              { name: "Kelasi", sector: "Éducation", color: "bg-blue-500" },
              { name: "The Bride", sector: "Événementiel", color: "bg-rose-500" },
            ].map((company) => (
              <div key={company.name} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                <span className={`w-2 h-8 rounded-full shrink-0 ${company.color}`} />
                <div>
                  <p className="font-black text-gray-900 text-sm">{company.name}</p>
                  <p className="text-xs text-gray-500">{company.sector}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community CTA */}
        <section className="rounded-2xl bg-gray-950 text-white p-8 text-center">
          <h2 className="text-2xl font-black mb-3">Rejoignez notre communauté</h2>
          <p className="text-gray-400 leading-relaxed mb-6 max-w-lg mx-auto text-sm">
            Que vous soyez en Afrique, en Europe, aux Amériques ou ailleurs, notre contenu est conçu pour vous. Abonnez-vous à notre newsletter et suivez-nous sur les réseaux sociaux.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-full transition-colors text-sm"
            >
              Nous contacter
            </Link>
            <Link
              href="/"
              className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-full transition-colors text-sm border border-white/10"
            >
              Lire les actualités
            </Link>
          </div>
        </section>

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-gray-400">
          © GoldenGroup7. Tous droits réservés. — GoldenNews7, l&apos;information africaine sans frontières.
        </p>
      </div>
    </div>
  );
}
