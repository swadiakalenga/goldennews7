import type { Category } from "@/types";
import { getCategoryColor, getCategoryColorLight } from "@/lib/utils";

interface CategoryHeroProps {
  category: Category;
  count: number;
}

const categoryDescriptions: Partial<Record<Category, string>> = {
  Actualité: "Toute l'actualité du moment, en temps réel et sans frontières.",
  Politique: "Analyses, décryptages et reportages sur la vie politique africaine et internationale.",
  Sécurité: "Conflits, défense, terrorisme : le suivi des enjeux sécuritaires du continent.",
  Économie: "Marchés, entreprises, finance : l'économie africaine en profondeur.",
  Société: "Les grandes questions sociales qui façonnent l'Afrique contemporaine.",
  Afrique: "Le continent dans toute sa diversité, ses défis et ses réussites.",
  Monde: "L'Afrique dans le monde, le monde vu d'Afrique.",
  Technologie: "Innovation, numérique et tech : l'Afrique à la pointe de demain.",
  Sport: "Football, athlétisme, basket : les exploits sportifs africains.",
  Culture: "Arts, cinéma, musique, littérature : la culture africaine rayonne.",
  Santé: "Médecine, épidémies, bien-être : la santé au cœur de nos vies.",
  Opinion: "Tribunes, éditoriaux et analyses de nos experts et contributeurs.",
};

export default function CategoryHero({ category, count }: CategoryHeroProps) {
  const badgeClass = getCategoryColor(category);
  const lightClass = getCategoryColorLight(category);
  const description = categoryDescriptions[category] ?? "";

  return (
    <div className={`rounded-2xl border p-8 mb-8 ${lightClass}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span
            className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-3 ${badgeClass}`}
          >
            Rubrique
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 font-serif">
            {category}
          </h1>
          {description && (
            <p className="text-sm text-gray-600 max-w-lg leading-relaxed">{description}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-3xl font-black text-gray-900">{count}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide">articles</p>
        </div>
      </div>
    </div>
  );
}
