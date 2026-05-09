import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'utilisation | GoldenNews7",
  description: "Conditions générales d'utilisation du site GoldenNews7.",
};

export default function TermsPage() {
  const updated = "8 mai 2026";

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 mb-2 font-serif">Conditions d&apos;utilisation</h1>
        <p className="text-sm text-gray-500">Dernière mise à jour : {updated}</p>
      </div>

      <div className="space-y-8 text-gray-700">
        {[
          {
            title: "1. Acceptation des conditions",
            content: "En accédant au site GoldenNews7, vous acceptez les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.",
          },
          {
            title: "2. Propriété intellectuelle",
            content: "Tous les contenus publiés sur GoldenNews7 (articles, photographies, illustrations, logos, etc.) sont protégés par les droits d'auteur et demeurent la propriété de GoldenNews7 ou de leurs auteurs respectifs. Toute reproduction, même partielle, sans autorisation écrite préalable est strictement interdite.",
          },
          {
            title: "3. Utilisation du site",
            content: "Le site GoldenNews7 est destiné à un usage personnel et non commercial. Vous vous engagez à ne pas utiliser ce site à des fins illégales, diffamatoires, abusives ou contraires à l'ordre public.",
          },
          {
            title: "4. Exactitude des informations",
            content: "GoldenNews7 s'efforce de publier des informations exactes et vérifiées. Cependant, nous ne pouvons garantir l'exactitude absolue de toutes les informations et déclinons toute responsabilité pour les erreurs ou omissions éventuelles.",
          },
          {
            title: "5. Liens externes",
            content: "GoldenNews7 peut contenir des liens vers des sites tiers. Nous n'assumons aucune responsabilité quant au contenu de ces sites et leur inclusion ne signifie pas que nous les approuvons.",
          },
          {
            title: "6. Newsletter",
            content: "L'inscription à notre newsletter est volontaire. Vous pouvez vous désinscrire à tout moment en nous contactant. Nous traitons vos données conformément à notre politique de confidentialité.",
          },
          {
            title: "7. Commentaires et contributions",
            content: "GoldenNews7 se réserve le droit de modérer ou supprimer tout contenu soumis par des utilisateurs qui serait contraire à nos valeurs éditoriales, illégal ou offensant.",
          },
          {
            title: "8. Limitation de responsabilité",
            content: "Dans les limites permises par la loi applicable, GoldenNews7 ne saurait être tenu responsable de dommages directs ou indirects résultant de l'utilisation de son site ou de l'impossibilité d'y accéder.",
          },
          {
            title: "9. Droit applicable",
            content: "Ces conditions sont soumises au droit en vigueur dans le pays de domiciliation de GoldenNews7. Tout litige relèvera de la compétence exclusive des tribunaux compétents.",
          },
          {
            title: "10. Modifications",
            content: "GoldenNews7 se réserve le droit de modifier ces conditions à tout moment. Les modifications prennent effet dès leur publication sur cette page.",
          },
        ].map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-black text-gray-900 mb-2">{section.title}</h2>
            <p className="leading-relaxed">{section.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
