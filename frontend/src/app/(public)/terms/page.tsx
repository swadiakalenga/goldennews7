export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getPublicStaticPage } from "@/lib/api/staticPages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicStaticPage("terms");
  return {
    title: page?.seo_title ?? "Conditions d'utilisation | GoldenNews7",
    description: page?.seo_description ?? "Conditions générales d'utilisation du site GoldenNews7.",
  };
}

const STATIC_SECTIONS = [
  {
    title: "1. Objet",
    content: "Les présentes conditions générales d'utilisation régissent l'accès et l'utilisation du site GoldenNews7. En accédant au site, vous acceptez sans réserve les présentes conditions.",
  },
  {
    title: "2. Accès au service",
    content: "Le site GoldenNews7 est accessible gratuitement à tout utilisateur disposant d'un accès Internet. Tous les frais liés à l'accès au service (matériel, logiciel, connexion) sont à la charge de l'utilisateur.",
  },
  {
    title: "3. Propriété intellectuelle",
    content: "L'ensemble du contenu publié sur GoldenNews7 (textes, images, vidéos, graphiques) est protégé par le droit de la propriété intellectuelle. Toute reproduction, même partielle, est strictement interdite sans autorisation écrite préalable.",
  },
  {
    title: "4. Responsabilité",
    content: "GoldenNews7 s'efforce de fournir des informations exactes et à jour. Toutefois, nous ne saurions garantir l'exactitude, l'exhaustivité ou l'actualité des informations diffusées. L'utilisation de ces informations est sous la responsabilité exclusive de l'utilisateur.",
  },
  {
    title: "5. Liens hypertextes",
    content: "Le site peut contenir des liens vers des sites tiers. GoldenNews7 n'est pas responsable du contenu de ces sites et n'exerce aucun contrôle sur eux.",
  },
  {
    title: "6. Modification des conditions",
    content: "GoldenNews7 se réserve le droit de modifier les présentes conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur le site.",
  },
  {
    title: "7. Droit applicable",
    content: "Les présentes conditions sont régies par le droit applicable dans le pays de résidence de l'éditeur. Tout litige sera soumis à la juridiction compétente.",
  },
];

export default async function TermsPage() {
  const page = await getPublicStaticPage("terms");
  const updated = page?.updated_at
    ? new Date(page.updated_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "8 mai 2026";

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 mb-2 font-serif">
          {page?.title ?? "Conditions d'utilisation"}
        </h1>
        <p className="text-sm text-gray-500">Dernière mise à jour : {updated}</p>
      </div>

      {page?.content ? (
        <div
          className="prose prose-gray max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : (
        <div className="space-y-8 text-gray-700">
          {STATIC_SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-black text-gray-900 mb-2">{section.title}</h2>
              <p className="leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
