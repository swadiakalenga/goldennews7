import type { Article, NavItem } from "@/types";

export const navItems: NavItem[] = [
  { label: "Actualité", href: "/actualite" },
  { label: "Politique", href: "/politique" },
  { label: "Sécurité", href: "/securite" },
  { label: "Économie", href: "/economie" },
  { label: "Société", href: "/societe" },
  { label: "Afrique", href: "/afrique" },
  { label: "Monde", href: "/monde" },
  { label: "Technologie", href: "/technologie" },
  { label: "Sport", href: "/sport" },
  { label: "Culture", href: "/culture" },
  { label: "Santé", href: "/sante" },
  { label: "Opinion", href: "/opinion" },
];

export const breakingNewsItems: string[] = [
  "Le Parlement adopte la nouvelle loi sur la sécurité numérique après un débat historique",
  "Sommet de l'Union Africaine : les chefs d'État se réunissent à Addis-Abeba pour discuter du développement durable",
  "Crise économique mondiale : les marchés réagissent aux nouvelles politiques de la Banque Centrale Européenne",
  "Accord historique signé entre plusieurs nations africaines sur le libre-échange continental",
];

export const articles: Article[] = [
  {
    id: "1",
    slug: "sommet-africain-developpement-durable",
    title: "Sommet Africain : Un accord historique pour le développement durable du continent",
    excerpt:
      "Les dirigeants de 54 nations africaines ont signé un accord sans précédent visant à accélérer la transition énergétique et réduire les inégalités économiques sur le continent.",
    category: "Afrique",
    author: { name: "Marie Dubois", role: "Correspondante Afrique" },
    publishedAt: "2026-05-08T08:00:00Z",
    readingTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1200&q=80",
    imageAlt: "Réunion de dirigeants africains",
    isFeatured: true,
    tags: ["Afrique", "Diplomatie", "Développement"],
  },
  {
    id: "2",
    slug: "reforme-fiscale-controversee",
    title: "Réforme fiscale : Le gouvernement face à une opposition grandissante",
    excerpt:
      "Le projet de loi sur la réforme fiscale suscite de vives critiques de l'opposition et des syndicats, qui dénoncent une politique défavorable aux classes moyennes.",
    category: "Politique",
    author: { name: "Jean-Paul Martin", role: "Journaliste Politique" },
    publishedAt: "2026-05-08T07:30:00Z",
    readingTime: 4,
    imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
    imageAlt: "Assemblée nationale",
    isBreaking: true,
    tags: ["Politique", "Économie", "Fiscalité"],
  },
  {
    id: "3",
    slug: "ia-sante-revolution-diagnostics",
    title: "Intelligence artificielle : La révolution silencieuse dans les hôpitaux africains",
    excerpt:
      "Des algorithmes d'IA permettent désormais de détecter des maladies tropicales avec une précision inégalée, transformant la médecine dans les régions les plus reculées.",
    category: "Technologie",
    author: { name: "Amara Koné", role: "Journaliste Tech & Santé" },
    publishedAt: "2026-05-08T06:45:00Z",
    readingTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    imageAlt: "Technologie médicale",
    tags: ["IA", "Santé", "Innovation"],
  },
  {
    id: "4",
    slug: "insecurite-sahel-nouvelles-strategies",
    title: "Sahel : Les nouvelles stratégies militaires face à la recrudescence des attaques",
    excerpt:
      "Les forces armées de la région renforcent leur coopération pour faire face à la montée des groupes armés, avec le soutien croissant de partenaires internationaux.",
    category: "Sécurité",
    author: { name: "Ibrahim Diallo", role: "Expert Sécurité" },
    publishedAt: "2026-05-08T06:00:00Z",
    readingTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
    imageAlt: "Forces militaires au Sahel",
    isBreaking: true,
    tags: ["Sécurité", "Sahel", "Militaire"],
  },
  {
    id: "5",
    slug: "croissance-economique-afrique-subsaharienne",
    title: "L'Afrique subsaharienne affiche une croissance de 5,2% au premier trimestre",
    excerpt:
      "Portée par l'essor des PME numériques et l'amélioration des infrastructures, la croissance économique régionale dépasse les prévisions des experts du FMI.",
    category: "Économie",
    author: { name: "Fatou Ndiaye", role: "Journaliste Économique" },
    publishedAt: "2026-05-08T05:30:00Z",
    readingTime: 4,
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    imageAlt: "Marchés financiers africains",
    tags: ["Économie", "Croissance", "Finance"],
  },
  {
    id: "6",
    slug: "can-2026-preparation-equipes",
    title: "CAN 2026 : Les équipes africaines intensifient leur préparation à six mois de la compétition",
    excerpt:
      "Le Sénégal, le Maroc et la Côte d'Ivoire figurent parmi les favoris pour la prochaine Coupe d'Afrique des Nations, dont les qualifications battent leur plein.",
    category: "Sport",
    author: { name: "Moussa Traoré", role: "Journaliste Sportif" },
    publishedAt: "2026-05-07T20:00:00Z",
    readingTime: 3,
    imageUrl: "https://images.unsplash.com/photo-1551854838-212c9a7d8b7c?w=800&q=80",
    imageAlt: "Football africain",
    tags: ["Football", "CAN", "Sport"],
  },
  {
    id: "7",
    slug: "culture-cinema-africain-renaissance",
    title: "Cinéma africain : Une renaissance portée par la nouvelle génération de réalisateurs",
    excerpt:
      "De Dakar à Nairobi, des cinéastes de moins de 35 ans révolutionnent le 7e art africain et s'imposent sur la scène internationale avec des œuvres primées.",
    category: "Culture",
    author: { name: "Chioma Osei", role: "Critique Culturelle" },
    publishedAt: "2026-05-07T18:00:00Z",
    readingTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1485095329183-d0797cdc5676?w=800&q=80",
    imageAlt: "Festival de cinéma africain",
    tags: ["Cinéma", "Culture", "Arts"],
  },
  {
    id: "8",
    slug: "sante-paludisme-nouveau-vaccin",
    title: "Paludisme : Un nouveau vaccin africain montre des résultats prometteurs en phase III",
    excerpt:
      "Des chercheurs du Ghana et du Kenya ont développé un vaccin anti-paludéen à moindre coût qui pourrait sauver des millions de vies sur le continent chaque année.",
    category: "Santé",
    author: { name: "Dr. Aïssatou Ba", role: "Journaliste Santé" },
    publishedAt: "2026-05-07T16:00:00Z",
    readingTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
    imageAlt: "Recherche médicale",
    tags: ["Santé", "Médecine", "Recherche"],
  },
  {
    id: "9",
    slug: "opinion-democratie-numerique",
    title: "Tribune : La démocratie à l'ère numérique — entre espoir et menaces",
    excerpt:
      "Les réseaux sociaux ont transformé l'espace politique africain, à la fois comme outil de mobilisation citoyenne et comme vecteur de désinformation massive.",
    category: "Opinion",
    author: { name: "Prof. Oumar Sy", role: "Politologue" },
    publishedAt: "2026-05-07T14:00:00Z",
    readingTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80",
    imageAlt: "Démocratie numérique",
    tags: ["Opinion", "Politique", "Numérique"],
  },
];

export const featuredArticle = articles.find((a) => a.isFeatured) ?? articles[0];
export const latestArticles = articles.filter((a) => !a.isFeatured).slice(0, 6);
export const sidebarArticles = articles.slice(0, 5);
