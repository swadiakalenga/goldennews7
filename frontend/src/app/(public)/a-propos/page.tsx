export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { getPublicStaticPage } from "@/lib/api/staticPages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicStaticPage("a-propos");
  return {
    title: page?.seo_title ?? "À propos | GoldenNews7",
    description: page?.seo_description ?? "Découvrez GoldenNews7, la plateforme d'information africaine de référence.",
  };
}

export default async function AboutPage() {
  const page = await getPublicStaticPage("a-propos");

  if (page?.content) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 font-serif leading-tight">
            {page.title}
          </h1>
          {page.excerpt && (
            <p className="text-lg text-gray-600 leading-relaxed">{page.excerpt}</p>
          )}
        </div>
        <div
          className="prose prose-gray max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    );
  }

  // Fallback to static content
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-12 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Notre histoire</span>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 font-serif leading-tight">
          L&apos;information africaine<br />sans frontières
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
          GoldenNews7 est né d&apos;une conviction : l&apos;Afrique mérite une information de qualité, indépendante et accessible à tous.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[
          { label: "Articles publiés", value: "2 400+" },
          { label: "Lecteurs actifs", value: "180 000+" },
          { label: "Pays couverts", value: "54" },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-6 bg-amber-50 rounded-2xl border border-amber-100">
            <p className="text-3xl font-black text-amber-600 mb-1">{stat.value}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-6 text-gray-700 leading-relaxed mb-12">
        <p>
          Fondé en 2024, <strong>GoldenNews7</strong> couvre l&apos;actualité africaine avec rigueur et indépendance.
          Notre équipe de journalistes passionnés travaille 24h/24 pour vous apporter les informations politiques,
          économiques, culturelles et sportives qui façonnent le continent.
        </p>
        <p>
          Notre mission : démocratiser l&apos;accès à une information fiable, rapide et contextualisée.
          Nous croyons fermement que chaque Africain, où qu&apos;il se trouve, a le droit d&apos;être
          informé de ce qui se passe sur son continent.
        </p>
        <p>
          GoldenNews7, c&apos;est aussi une communauté : lecteurs, journalistes, contributeurs qui partagent
          une même vision d&apos;une Afrique debout, informée et connectée.
        </p>
      </div>

      <div className="text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-full transition-colors"
        >
          Nous contacter
        </Link>
      </div>
    </div>
  );
}
