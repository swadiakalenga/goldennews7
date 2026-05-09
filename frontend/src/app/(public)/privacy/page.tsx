import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité | GoldenNews7",
  description: "Comment GoldenNews7 collecte, utilise et protège vos données personnelles.",
};

export default function PrivacyPage() {
  const updated = "8 mai 2026";

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 mb-2 font-serif">Politique de confidentialité</h1>
        <p className="text-sm text-gray-500">Dernière mise à jour : {updated}</p>
      </div>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
        {[
          {
            title: "1. Collecte des données",
            content: "Nous collectons uniquement les données nécessaires au fonctionnement de nos services : adresse email lors de l'inscription à la newsletter, données de navigation anonymisées à des fins d'analyse d'audience (via Vercel Analytics, sans cookies de tracking). Nous ne vendons jamais vos données à des tiers.",
          },
          {
            title: "2. Utilisation des données",
            content: "Vos données sont utilisées exclusivement pour vous envoyer notre newsletter (si vous y êtes inscrit) et améliorer l'expérience de lecture sur notre site. Vous pouvez vous désinscrire de la newsletter à tout moment en nous contactant.",
          },
          {
            title: "3. Cookies",
            content: "GoldenNews7 utilise un nombre minimal de cookies techniques nécessaires au bon fonctionnement du site (session, préférences). Nous n'utilisons pas de cookies publicitaires ou de suivi comportemental.",
          },
          {
            title: "4. Durée de conservation",
            content: "Les adresses email des abonnés à la newsletter sont conservées jusqu'à désinscription. Les données d'analyse d'audience sont conservées de manière agrégée et anonymisée pour une durée de 12 mois.",
          },
          {
            title: "5. Vos droits",
            content: "Conformément au RGPD et aux lois locales applicables, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à l'adresse : privacy@goldennews7.com.",
          },
          {
            title: "6. Sécurité",
            content: "Vos données sont stockées de manière sécurisée via nos infrastructures cloud (Supabase). Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé.",
          },
          {
            title: "7. Modifications",
            content: "Nous nous réservons le droit de modifier cette politique à tout moment. Toute modification substantielle sera communiquée sur cette page. Nous vous encourageons à la consulter régulièrement.",
          },
          {
            title: "8. Contact",
            content: "Pour toute question relative à cette politique de confidentialité, contactez notre délégué à la protection des données : privacy@goldennews7.com",
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
