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
    content: `
      <p>Réunis pendant trois jours à Addis-Abeba, les chefs d'État et de gouvernement de cinquante-quatre nations africaines ont paraphé vendredi un accord sans précédent sur le développement durable et la transition énergétique du continent. C'est la première fois depuis la fondation de l'Union Africaine qu'un texte de cette ampleur est signé à l'unanimité, sans réserves ni abstentions.</p>

      <p>L'accord, baptisé <strong>«Pacte d'Addis-Abeba pour un avenir durable»</strong>, fixe des objectifs ambitieux : atteindre 60 % d'énergies renouvelables dans le mix énergétique continental d'ici 2035, réduire les inégalités économiques de moitié d'ici 2040, et créer un fonds continental de 50 milliards de dollars pour financer les projets d'infrastructure verte à travers tout le continent.</p>

      <h2>Un consensus difficile à obtenir</h2>

      <p>Les négociations ont été longues et âpres. Pendant des semaines, les délégations de plusieurs pays producteurs de pétrole ont résisté aux clauses les plus contraignantes sur la réduction des énergies fossiles. C'est finalement un compromis soigneusement négocié sur le calendrier de la transition qui a permis de débloquer la situation et d'obtenir la signature de tous. «Nous avons trouvé un chemin qui respecte les réalités économiques de chaque nation tout en regardant résolument vers l'avenir», a déclaré la présidente de la Commission de l'UA lors de la cérémonie de signature.</p>

      <blockquote>«Cet accord démontre que l'Afrique est capable de parler d'une seule voix sur les grandes questions de notre temps. C'est un moment historique pour nos 1,4 milliard de citoyens.»</blockquote>

      <h2>Les réactions de la communauté internationale</h2>

      <p>La communauté internationale a salué cet accord comme un signal fort en faveur du multilatéralisme et de l'action climatique. L'Union européenne s'est dite prête à mobiliser des fonds supplémentaires pour accompagner sa mise en œuvre, tandis que les Nations Unies ont qualifié ce texte de «contribution majeure» aux objectifs de développement durable. Des experts soulignent toutefois que la véritable épreuve sera celle de l'application effective des engagements pris, dans des pays aux capacités institutionnelles très diverses.</p>

      <p>Sur le terrain économique, les marchés africains ont réagi positivement à l'annonce. Plusieurs grandes entreprises d'énergies renouvelables ont immédiatement annoncé leur intention d'accélérer leurs investissements sur le continent, voyant dans cet accord un signal de stabilité réglementaire à long terme. L'Afrique reste le continent qui recèle le plus grand potentiel de croissance pour les énergies solaires et éoliennes au monde.</p>
    `,
    category: "Afrique",
    author: { name: "Marie Dubois", role: "Correspondante Afrique" },
    publishedAt: "2026-05-08T08:00:00Z",
    readingTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1200&q=80",
    imageAlt: "Réunion de dirigeants africains",
    isFeatured: true,
    views: 14820,
    tags: ["Afrique", "Diplomatie", "Développement", "Énergie"],
  },
  {
    id: "2",
    slug: "reforme-fiscale-controversee",
    title: "Réforme fiscale : Le gouvernement face à une opposition grandissante",
    excerpt:
      "Le projet de loi sur la réforme fiscale suscite de vives critiques de l'opposition et des syndicats, qui dénoncent une politique défavorable aux classes moyennes.",
    content: `
      <p>Présenté lundi en conseil des ministres, le projet de réforme fiscale du gouvernement a immédiatement déclenché un tollé parmi les partis d'opposition et les grandes centrales syndicales. Le texte, qui prévoit une refonte complète des tranches d'imposition et la suppression de plusieurs niches fiscales, est accusé de pénaliser les ménages modestes et les classes moyennes au profit des contribuables les plus aisés.</p>

      <p>«Ce projet est profondément injuste et va à l'encontre du pacte social que nos citoyens sont en droit d'attendre de leurs gouvernants», a déclaré le chef de file de l'opposition lors d'une conférence de presse particulièrement suivie. Les syndicats, qui ont appelé à une journée de mobilisation nationale la semaine prochaine, partagent ce diagnostic et promettent de «bloquer ce texte par tous les moyens légaux à leur disposition».</p>

      <h2>Ce que contient réellement le projet</h2>

      <p>Selon le ministre des Finances, la réforme vise avant tout à simplifier un code fiscal devenu illisible et à élargir la base imposable pour réduire les déficits. Il assure que les foyers gagnant moins de deux fois le salaire médian seront «protégés» par des mesures compensatoires. Les économistes consultés par notre rédaction sont toutefois plus nuancés : si la direction générale de la réforme peut se justifier, plusieurs dispositions semblent mal calibrées et risquent de produire des effets redistributifs négatifs.</p>

      <blockquote>«La simplification fiscale est une nécessité reconnue de tous. Mais elle ne doit pas servir de prétexte à un transfert de charge fiscal vers ceux qui en ont le moins les moyens.» — Économiste indépendant</blockquote>

      <h2>Un calendrier parlementaire serré</h2>

      <p>Le gouvernement souhaite faire adopter ce texte avant la fin de la session parlementaire de juin, ce qui laisse peu de temps pour un débat approfondi. Les discussions en commission ont déjà tourné court, plusieurs élus de la majorité exprimant eux-mêmes des réserves sur certains articles. La semaine prochaine sera décisive pour savoir si l'exécutif dispose encore du rapport de force nécessaire pour faire passer sa réforme en l'état.</p>
    `,
    category: "Politique",
    author: { name: "Jean-Paul Martin", role: "Journaliste Politique" },
    publishedAt: "2026-05-08T07:30:00Z",
    readingTime: 4,
    imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
    imageAlt: "Assemblée nationale",
    isBreaking: true,
    views: 9340,
    tags: ["Politique", "Économie", "Fiscalité", "Syndicats"],
  },
  {
    id: "3",
    slug: "ia-sante-revolution-diagnostics",
    title: "Intelligence artificielle : La révolution silencieuse dans les hôpitaux africains",
    excerpt:
      "Des algorithmes d'IA permettent désormais de détecter des maladies tropicales avec une précision inégalée, transformant la médecine dans les régions les plus reculées.",
    content: `
      <p>Dans le couloir de l'hôpital régional de Tamale, au nord du Ghana, une tablette accrochée au mur affiche en quelques secondes le résultat d'une analyse de cliché radiologique. Ce n'est pas un radiologue qui a interprété l'image, mais un algorithme d'intelligence artificielle développé conjointement par une équipe de chercheurs ghanéens et une startup kényane. Cette scène, impensable il y a cinq ans, est aujourd'hui la réalité quotidienne de dizaines d'établissements de santé à travers l'Afrique subsaharienne.</p>

      <p>Ces systèmes d'IA, entraînés sur des millions d'images médicales collectées sur le continent lui-même, se montrent particulièrement efficaces pour détecter des pathologies comme le paludisme, la tuberculose et certaines formes de cancers courants dans la région. Leur principal avantage : ils peuvent fonctionner avec une connexion internet limitée, sur du matériel peu coûteux, et ne requièrent pas la présence d'un spécialiste sur place pour interpréter les résultats.</p>

      <h2>Des résultats qui dépassent les attentes</h2>

      <p>Une étude publiée dans le <em>Lancet Digital Health</em> a mesuré les performances de l'un de ces systèmes sur plus de 50 000 examens effectués dans quatre pays africains. Le taux de détection précoce du cancer du col de l'utérus a progressé de 34 % par rapport aux méthodes conventionnelles, et le délai entre le premier examen et le début du traitement a été réduit de plusieurs semaines en moyenne. Des chiffres qui, dans des contextes où les soins tardifs sont souvent synonymes de pronostic fatal, représentent des vies sauvées.</p>

      <blockquote>«L'IA ne remplace pas le médecin, elle lui permet d'être là où il ne peut pas être physiquement. C'est une révolution d'accessibilité, pas de substitution.» — Dr Kwame Asante, médecin-chercheur</blockquote>

      <p>Les défis restent nombreux : protection des données des patients, validation réglementaire, formation des personnels soignants et modèles économiques viables pour assurer la pérennité de ces outils. Mais l'élan est là, et les financements — publics comme privés — commencent à affluer vers cet écosystème d'innovation médicale africain qui pourrait, à terme, inspirer des solutions mondiales.</p>
    `,
    category: "Technologie",
    author: { name: "Amara Koné", role: "Journaliste Tech & Santé" },
    publishedAt: "2026-05-08T06:45:00Z",
    readingTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    imageAlt: "Technologie médicale",
    views: 7210,
    tags: ["IA", "Santé", "Innovation", "Ghana", "Kenya"],
  },
  {
    id: "4",
    slug: "insecurite-sahel-nouvelles-strategies",
    title: "Sahel : Les nouvelles stratégies militaires face à la recrudescence des attaques",
    excerpt:
      "Les forces armées de la région renforcent leur coopération pour faire face à la montée des groupes armés, avec le soutien croissant de partenaires internationaux.",
    content: `
      <p>Après une série d'attaques particulièrement meurtrières qui ont frappé plusieurs localités du Burkina Faso et du Mali au cours des dernières semaines, les états-majors des armées du Sahel ont annoncé une révision profonde de leur doctrine d'emploi des forces. Lors d'une réunion extraordinaire tenue à huis clos à Niamey, les chefs militaires de la région ont validé un nouveau cadre opérationnel qui mise davantage sur la coopération inter-États et sur le renseignement humain.</p>

      <p>La nouvelle approche rompt avec la doctrine précédente qui privilégiait les opérations offensives de grande envergure. Elle s'articule autour de trois piliers : des unités légères et mobiles capables de se déployer en moins de 24 heures, un réseau de capteurs et de drones pour la surveillance des zones grises, et un programme de réintégration des ex-combattants qui s'étend désormais à six pays de la région.</p>

      <h2>Des partenaires internationaux plus discrets mais plus présents</h2>

      <p>Si les contingents militaires étrangers ont officiellement réduit leur empreinte visible au Sahel, plusieurs sources concordantes indiquent que l'appui en matière de renseignement, de formation et de logistique s'est lui intensifié. Des formateurs de plusieurs pays européens et du Golfe interviennent désormais directement dans les bases avancées, aux côtés des officiers locaux. Cette présence, délibérément discrète, répond à une demande des gouvernements sahéliens soucieux de préserver leur souveraineté apparente.</p>

      <blockquote>«Nous ne pouvons pas gagner cette guerre uniquement avec des soldats. Nous devons gagner les populations, couper les financements, assécher les recrutements.» — Général de brigade, sous couvert d'anonymat</blockquote>

      <p>Sur le plan humanitaire, la situation reste préoccupante. Le nombre de personnes déplacées internes dans la zone sahélo-saharienne dépasse désormais 3,5 millions, un record absolu. Les organisations d'aide internationale peinent à accéder à de nombreuses zones où l'insécurité rend toute intervention risquée. La coordination entre acteurs militaires et humanitaires demeure l'un des défis les plus complexes à résoudre.</p>
    `,
    category: "Sécurité",
    author: { name: "Ibrahim Diallo", role: "Expert Sécurité" },
    publishedAt: "2026-05-08T06:00:00Z",
    readingTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
    imageAlt: "Forces militaires au Sahel",
    isBreaking: true,
    views: 11550,
    tags: ["Sécurité", "Sahel", "Militaire", "Terrorisme"],
  },
  {
    id: "5",
    slug: "croissance-economique-afrique-subsaharienne",
    title: "L'Afrique subsaharienne affiche une croissance de 5,2% au premier trimestre",
    excerpt:
      "Portée par l'essor des PME numériques et l'amélioration des infrastructures, la croissance économique régionale dépasse les prévisions des experts du FMI.",
    content: `
      <p>Les dernières données macroéconomiques publiées par la Banque africaine de développement confirment une tendance encourageante : l'Afrique subsaharienne a enregistré une croissance de 5,2 % au premier trimestre 2026, dépassant les prévisions initiales du FMI qui tablaient sur 4,7 %. Ce résultat place la région parmi les zones à la croissance la plus dynamique au monde, devant l'Asie du Sud-Est pour la deuxième fois consécutive.</p>

      <p>Plusieurs moteurs expliquent cette performance. L'essor des PME numériques, notamment dans les secteurs du paiement mobile, de l'e-commerce et de la fintech, contribue à hauteur d'un point de croissance selon les économistes. L'amélioration des infrastructures portuaires et routières dans des pays comme le Sénégal, la Côte d'Ivoire et l'Éthiopie facilite les échanges intra-africains, qui ont progressé de 18 % sur un an dans le cadre de la Zone de Libre-Échange Continentale Africaine.</p>

      <h2>Des disparités persistantes entre pays</h2>

      <p>Derrière ces chiffres globalement positifs se cachent des situations très contrastées. Certains pays producteurs de matières premières comme le Nigeria et l'Angola souffrent encore de la volatilité des cours mondiaux, tandis que des économies plus diversifiées comme le Rwanda ou Maurice affichent des performances particulièrement solides. Les économistes insistent sur la nécessité de politiques industrielles actives pour ne pas rester dépendants des exportations de ressources brutes.</p>

      <blockquote>«La croissance africaine est réelle, mais elle doit se traduire en emplois décents et en réduction des inégalités pour être soutenable. Les chiffres macroéconomiques ne racontent qu'une partie de l'histoire.» — Économiste de la BAD</blockquote>

      <p>Les perspectives pour le reste de l'année restent favorables, sous réserve d'une stabilisation des tensions géopolitiques mondiales et du maintien d'une météorologie clémente pour les productions agricoles. La Banque africaine de développement a révisé à la hausse ses prévisions annuelles, portant l'objectif de croissance pour l'ensemble de l'Afrique subsaharienne à 4,9 % pour 2026.</p>
    `,
    category: "Économie",
    author: { name: "Fatou Ndiaye", role: "Journaliste Économique" },
    publishedAt: "2026-05-08T05:30:00Z",
    readingTime: 4,
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    imageAlt: "Marchés financiers africains",
    views: 6430,
    tags: ["Économie", "Croissance", "Finance", "BAD", "FMI"],
  },
  {
    id: "6",
    slug: "can-2026-preparation-equipes",
    title: "CAN 2026 : Les équipes africaines intensifient leur préparation à six mois de la compétition",
    excerpt:
      "Le Sénégal, le Maroc et la Côte d'Ivoire figurent parmi les favoris pour la prochaine Coupe d'Afrique des Nations, dont les qualifications battent leur plein.",
    content: `
      <p>À six mois du coup d'envoi de la 35ème édition de la Coupe d'Afrique des Nations, les sélections du continent hausent le ton dans leurs préparations respectives. Les qualifications, qui entrent dans leur phase décisive, offrent déjà leur lot de surprises et de déceptions, avec plusieurs équipes historiquement fortes au bord de l'élimination et de nouveaux prétendants qui émergent avec une ambition affichée.</p>

      <p>Tenant du titre, le Sénégal de Sadio Mané — qui dispute vraisemblablement sa dernière grande compétition internationale — affiche une forme rassurante avec cinq victoires consécutives en qualifications. Le Maroc, auréolé de son parcours historique à la Coupe du Monde 2022, continue de monter en puissance sous la houlette d'un effectif de plus en plus européanisé. La Côte d'Ivoire, qui recevra la compétition, bénéficie du statut de pays hôte et de la pression supplémentaire que cela implique.</p>

      <h2>Les outsiders à surveiller</h2>

      <p>Plusieurs nations moins attendues pourraient créer la surprise. La République Démocratique du Congo, portée par une génération de joueurs évoluant dans les meilleurs clubs européens, fait figure de candidat sérieux pour les demi-finales. L'Égypte, malgré ses récentes contre-performances, dispose d'un effectif de qualité et de l'expérience des grandes compétitions. La Guinée et le Cameroun, en pleine reconstruction, jouent avec l'insouciance des équipes qui n'ont rien à perdre.</p>

      <blockquote>«La CAN reste la compétition de football la plus imprévisible et la plus passionnée du monde. C'est ce qui en fait un événement unique.» — Expert football africain</blockquote>

      <p>Sur le plan logistique, les organisateurs ivoiriens promettent une édition exemplaire, avec quatre stades entièrement rénovés et une capacité d'accueil portée à 100 000 visiteurs étrangers. La billetterie, ouverte depuis deux semaines, a déjà enregistré des chiffres records avec plus de 800 000 demandes pour 400 000 places disponibles, signe de l'engouement croissant pour cette compétition.</p>
    `,
    category: "Sport",
    author: { name: "Moussa Traoré", role: "Journaliste Sportif" },
    publishedAt: "2026-05-07T20:00:00Z",
    readingTime: 3,
    imageUrl: "https://images.unsplash.com/photo-1551854838-212c9a7d8b7c?w=800&q=80",
    imageAlt: "Football africain",
    views: 8920,
    tags: ["Football", "CAN", "Sport", "Sénégal", "Maroc"],
  },
  {
    id: "7",
    slug: "culture-cinema-africain-renaissance",
    title: "Cinéma africain : Une renaissance portée par la nouvelle génération de réalisateurs",
    excerpt:
      "De Dakar à Nairobi, des cinéastes de moins de 35 ans révolutionnent le 7e art africain et s'imposent sur la scène internationale avec des œuvres primées.",
    content: `
      <p>Il y a quelque chose de nouveau dans l'air du cinéma africain. Depuis deux ou trois ans, une vague de jeunes réalisateurs — pour la plupart formés à Dakar, Lagos, Nairobi ou dans des écoles de cinéma européennes — s'impose avec force sur les écrans internationaux. Leurs films, tournés avec des budgets souvent très limités mais une maîtrise technique et narrative impressionnante, récoltent des prix dans les festivals les plus prestigieux : Cannes, Berlin, Sundance, mais aussi et surtout les grandes compétitions africaines comme le FESPACO.</p>

      <p>Ce qui distingue cette génération de ses aînés, c'est avant tout son rapport au numérique. Les caméras légères et les logiciels de montage accessibles ont démocratisé la production, permettant à des cinéastes de s'affranchir des contraintes industrielles traditionnelles. Mais c'est surtout leur regard — ancré dans une Afrique contemporaine complexe, urbaine, mondialisée, traversée de contradictions — qui résonne si fort auprès des publics internationaux comme locaux.</p>

      <h2>Des plateformes qui changent la donne</h2>

      <p>L'irruption des plateformes de streaming dans le paysage audiovisuel africain a joué un rôle décisif dans cette renaissance. Netflix, Amazon Prime et plusieurs opérateurs locaux investissent massivement dans la production de contenus africains originaux, offrant des débouchés et des financements qui n'existaient pas il y a dix ans. La série nigériane «Lagos Nights», produite pour 12 millions de dollars, a été visionnée par plus de 40 millions de foyers à travers le monde, un record pour une production africaine.</p>

      <blockquote>«On nous a longtemps dit que nos histoires n'intéressaient que nous. Aujourd'hui, le monde entier veut entendre nos voix. Cette reconnaissance, nous ne la devons qu'à nous-mêmes.» — Réalisatrice sénégalaise, primée à Cannes</blockquote>

      <p>Les défis restent pourtant considérables : réseau de salles insuffisant sur le continent, piratage massif des œuvres, difficulté à former une main-d'œuvre technique qualifiée en nombre suffisant. Mais la dynamique est là, et pour la première fois depuis Sembène Ousmane, le cinéma africain semble sur le point d'imposer durablement sa voix dans le concert mondial des cultures.</p>
    `,
    category: "Culture",
    author: { name: "Chioma Osei", role: "Critique Culturelle" },
    publishedAt: "2026-05-07T18:00:00Z",
    readingTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1485095329183-d0797cdc5676?w=800&q=80",
    imageAlt: "Festival de cinéma africain",
    views: 5100,
    tags: ["Cinéma", "Culture", "Arts", "FESPACO", "Streaming"],
  },
  {
    id: "8",
    slug: "sante-paludisme-nouveau-vaccin",
    title: "Paludisme : Un nouveau vaccin africain montre des résultats prometteurs en phase III",
    excerpt:
      "Des chercheurs du Ghana et du Kenya ont développé un vaccin anti-paludéen à moindre coût qui pourrait sauver des millions de vies sur le continent chaque année.",
    content: `
      <p>C'est potentiellement l'une des avancées médicales les plus importantes de la décennie pour l'Afrique subsaharienne. Un consortium de chercheurs ghanéens et kényans, travaillant en partenariat avec l'université d'Oxford, vient de publier les résultats préliminaires des essais cliniques de phase III d'un nouveau vaccin contre le paludisme. Les données, partagées lors du congrès mondial de médecine tropicale à Genève, montrent une efficacité de 77 % sur dix-huit mois chez les enfants de moins de cinq ans, la tranche d'âge la plus vulnérable.</p>

      <p>Ce qui rend ce vaccin particulièrement prometteur, c'est avant tout son coût de production. Contrairement aux solutions actuellement disponibles — notamment le vaccin RTS,S/AS01 de GlaxoSmithKline — ce nouveau candidat-vaccin peut être produit à grande échelle pour moins de cinq dollars la dose, grâce à une formulation optimisée et à un processus de fabrication qui peut être mis en œuvre dans des laboratoires africains. Cette dimension est cruciale pour garantir un accès équitable aux populations les plus touchées par la maladie.</p>

      <h2>Un processus d'homologation accéléré</h2>

      <p>L'OMS a annoncé l'ouverture d'une procédure d'homologation accélérée pour ce vaccin, une décision rarissime qui traduit l'urgence sanitaire que représente le paludisme : 600 000 morts par an, dont 95 % en Afrique, et 250 millions de cas cliniques chaque année qui plombent les systèmes de santé et la productivité économique du continent. Si les essais confirment les résultats préliminaires, une autorisation de mise sur le marché pourrait être accordée dès 2027.</p>

      <blockquote>«Nous avons conçu ce vaccin pour l'Afrique, par des chercheurs africains, avec la volonté qu'il puisse être produit et distribué sur le continent. C'est une différence fondamentale avec les solutions précédentes.» — Dr Abena Mensah, chercheuse principale</blockquote>

      <p>Les gouvernements de plusieurs pays africains ont d'ores et déjà exprimé leur intérêt pour précommander des doses, et l'Union Africaine a promis de faciliter les processus d'approbation réglementaire simultanés dans plusieurs pays membres pour réduire les délais de déploiement. Les experts de santé publique estiment qu'une couverture vaccinale de 80 % chez les moins de cinq ans pourrait réduire la mortalité palustre de 40 % dans les cinq ans suivant le lancement.</p>
    `,
    category: "Santé",
    author: { name: "Dr. Aïssatou Ba", role: "Journaliste Santé" },
    publishedAt: "2026-05-07T16:00:00Z",
    readingTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
    imageAlt: "Recherche médicale",
    views: 9870,
    tags: ["Santé", "Médecine", "Recherche", "Paludisme", "Vaccin"],
  },
  {
    id: "9",
    slug: "opinion-democratie-numerique",
    title: "Tribune : La démocratie à l'ère numérique — entre espoir et menaces",
    excerpt:
      "Les réseaux sociaux ont transformé l'espace politique africain, à la fois comme outil de mobilisation citoyenne et comme vecteur de désinformation massive.",
    content: `
      <p>Il y a quinze ans, les experts en communication politique africaine parlaient de «printemps numériques» avec un enthousiasme débordant. Les réseaux sociaux allaient démocratiser l'accès à l'information, permettre aux citoyens de s'organiser, de contrôler leurs élus, d'exiger des comptes. Cette promesse n'est pas entièrement fausse — les mobilisations citoyennes de ces dernières années, au Sénégal, au Kenya, au Nigéria, ont montré que les outils numériques pouvaient effectivement servir la démocratie. Mais la réalité est bien plus complexe et plus sombre qu'on ne l'imaginait.</p>

      <p>Car en parallèle à ces usages émancipateurs, les mêmes plateformes sont devenues des vecteurs d'une désinformation industrielle qui érode les bases mêmes de notre vie démocratique. Des campagnes coordonnées de manipulation de l'opinion, souvent financées par des acteurs intérieurs ou extérieurs aux motivations opaques, polluent les débats électoraux, attisent les tensions ethniques, sapent la confiance dans les institutions. Et les plateformes, malgré leurs promesses répétées, peinent à endiguer le phénomène sur le continent africain, où leurs équipes de modération restent notoirement sous-dimensionnées.</p>

      <h2>La responsabilité des États, des plateformes et des citoyens</h2>

      <p>Face à ce défi, les réponses sont insuffisantes. Certains États ont cédé à la tentation autoritaire : coupures d'internet, censure des réseaux sociaux, poursuites contre des blogueurs et des journalistes citoyens. Ces mesures, présentées comme des réponses à la désinformation, servent souvent surtout à étouffer les voix critiques. La ligne entre réguler la parole toxique et museler la dissidence est mince, et trop souvent franchie sans scrupules. Ce n'est pas ainsi qu'on renforce la démocratie.</p>

      <blockquote>«La solution n'est pas moins de numérique, mais un numérique mieux régulé, plus transparent, et des citoyens mieux armés pour naviguer dans cet environnement informationnel complexe.»</blockquote>

      <p>La voie est étroite mais elle existe : une régulation qui impose aux plateformes des obligations de transparence sur les algorithmes de recommandation et les campagnes publicitaires politiques ; des programmes d'éducation aux médias intégrés dès l'école primaire ; le soutien à un journalisme professionnel indépendant capable de servir de contre-pouvoir aux flux d'informations non vérifiées. Aucune de ces solutions n'est simple à mettre en œuvre. Mais aucune n'est impossible. La démocratie africaine en vaut la peine.</p>
    `,
    category: "Opinion",
    author: { name: "Prof. Oumar Sy", role: "Politologue" },
    publishedAt: "2026-05-07T14:00:00Z",
    readingTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80",
    imageAlt: "Démocratie numérique",
    views: 4320,
    tags: ["Opinion", "Politique", "Numérique", "Démocratie"],
  },
  {
    id: "10",
    slug: "crise-eau-potable-villes-africaines",
    title: "Accès à l'eau potable : La crise silencieuse qui frappe les grandes villes africaines",
    excerpt:
      "Malgré des investissements records dans les infrastructures hydriques, des millions d'habitants des capitales africaines n'ont toujours pas accès à l'eau courante potable.",
    content: `
      <p>À Kinshasa, deuxième ville la plus peuplée d'Afrique, moins de 40 % des habitants ont accès à l'eau potable via le réseau de distribution municipal. À Dar es Salaam, la situation n'est guère meilleure : les coupures d'eau durent parfois plusieurs jours consécutifs dans des quartiers entiers, forçant les résidents à recourir à des vendeurs d'eau en jerricans dont la qualité microbiologique est rarement contrôlée. Ces situations, qui sembleraient inacceptables dans d'autres régions du monde, sont la réalité quotidienne de dizaines de millions d'Africains urbains.</p>

      <p>Pourtant, les investissements dans les infrastructures hydriques africaines n'ont jamais été aussi importants. La Banque mondiale, la BAD et plusieurs fonds bilatéraux ont injecté plus de 15 milliards de dollars dans des projets d'eau et d'assainissement sur le continent au cours des cinq dernières années. Le problème n'est pas tant le manque de financement que la gestion de ces infrastructures une fois construites, et la difficulté à réformer des sociétés publiques de distribution souvent peu efficaces et minées par la corruption.</p>

      <h2>Des solutions locales innovantes</h2>

      <p>Face à cette crise, des solutions locales innovantes émergent. Au Rwanda, des coopératives citoyennes gèrent leurs propres mini-réseaux de distribution avec des résultats comparables aux opérateurs publics, à un coût inférieur. En Tanzanie, des startups proposent des kiosques à eau connectés qui permettent un contrôle en temps réel de la qualité et de la consommation. Ces initiatives restent encore trop marginales pour changer la donne à grande échelle, mais elles montrent que des alternatives existent.</p>

      <blockquote>«L'eau est un droit humain fondamental. Le fait que des millions d'Africains vivent sans accès à l'eau potable en 2026 est un scandale auquel nous devons mettre fin urgemment.» — Directeur de l'UNICEF Afrique</blockquote>
    `,
    category: "Société",
    author: { name: "Léa Mbeki", role: "Journaliste Société" },
    publishedAt: "2026-05-07T12:00:00Z",
    readingTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=800&q=80",
    imageAlt: "Accès à l'eau en Afrique",
    views: 3870,
    tags: ["Société", "Eau", "Infrastructure", "Villes"],
  },
  {
    id: "11",
    slug: "diplomatie-africaine-onu-reforme",
    title: "Réforme de l'ONU : L'Afrique réclame deux sièges permanents au Conseil de sécurité",
    excerpt:
      "La pression diplomatique africaine pour une réforme du Conseil de sécurité de l'ONU s'intensifie, avec un front uni des 54 nations du continent comme jamais auparavant.",
    content: `
      <p>Les diplomates africains ont franchi un pas supplémentaire dans leur campagne pour une réforme profonde du Conseil de sécurité des Nations Unies. Réunis à New York en marge de la session de l'Assemblée générale, les représentants permanents des 54 États membres de l'Union Africaine ont présenté une déclaration commune réclamant l'attribution de deux sièges permanents avec droit de veto à l'Afrique, ainsi que de cinq sièges supplémentaires non permanents.</p>

      <p>Cette position, connue sous le nom de «Consensus d'Ezulwini», existe depuis 2005 mais n'avait jamais été portée avec une telle unité et une telle détermination sur la scène internationale. «Il est paradoxal que le continent qui est le plus souvent l'objet des discussions au Conseil de sécurité en soit le grand absent», a déclaré le président du Comité des Affaires politiques de l'UA lors d'une conférence de presse très suivie.</p>

      <h2>Des obstacles considérables</h2>

      <p>Les obstacles à cette réforme restent cependant considérables. Modifier la Charte de l'ONU requiert l'approbation des deux tiers des États membres et la ratification par les cinq membres permanents actuels — dont certains s'opposent fermement à toute extension du droit de veto. Les États-Unis, la Russie et la Chine ont des positions nuancées mais globalement réticentes. La France et le Royaume-Uni se sont montrés plus ouverts, sans pour autant s'engager fermement.</p>

      <blockquote>«Un Conseil de sécurité qui ignore l'Afrique est un Conseil de sécurité qui ignore la réalité du monde. La réforme n'est pas une faveur à faire à l'Afrique, c'est une nécessité pour l'efficacité de l'ONU.» — Ministre des Affaires étrangères africain</blockquote>
    `,
    category: "Monde",
    author: { name: "Aminata Kouyaté", role: "Correspondante ONU" },
    publishedAt: "2026-05-07T10:00:00Z",
    readingTime: 4,
    imageUrl: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80",
    imageAlt: "Nations Unies",
    views: 6780,
    tags: ["Monde", "ONU", "Diplomatie", "Afrique"],
  },
  {
    id: "12",
    slug: "energies-renouvelables-investissements-record",
    title: "Énergies renouvelables : L'Afrique attire des investissements records en 2026",
    excerpt:
      "Le secteur des énergies renouvelables en Afrique a attiré plus de 40 milliards de dollars d'investissements au premier semestre 2026, un record absolu pour le continent.",
    content: `
      <p>Le continent africain est devenu l'une des destinations les plus attractives au monde pour les investissements dans les énergies renouvelables. Selon un rapport publié cette semaine par l'Agence internationale pour les énergies renouvelables (IRENA), l'Afrique a attiré 40,3 milliards de dollars de financements verts au cours du premier semestre 2026, soit une progression de 65 % par rapport à la même période de l'année précédente.</p>

      <p>Cette explosion des investissements s'explique par plusieurs facteurs convergents. Le potentiel solaire et éolien de l'Afrique est considérable et reste largement sous-exploité. Les coûts de production des énergies renouvelables ont chuté de 90 % en dix ans, rendant des projets autrefois marginalement rentables très attractifs pour les investisseurs. Et le cadre réglementaire s'est amélioré dans une vingtaine de pays, offrant davantage de visibilité et de sécurité juridique aux capitaux étrangers.</p>

      <h2>Des projets emblématiques</h2>

      <p>Parmi les projets les plus emblématiques, le parc solaire de Noor Midelt au Maroc, le méga-projet éolien de Lake Turkana au Kenya, et la centrale hydroélectrique de Grand Inga en RDC concentrent à eux seuls plus de 15 milliards de dollars d'engagements financiers. Ces chantiers créeront des dizaines de milliers d'emplois directs et transformeront le paysage énergétique de leurs régions respectives.</p>

      <blockquote>«L'Afrique n'a pas besoin de répéter le modèle fossile des pays industrialisés. Elle peut sauter directement vers les énergies propres et construire une économie décarbonée dès le départ.» — Directrice d'IRENA</blockquote>
    `,
    category: "Actualité",
    author: { name: "Thomas Sow", role: "Journaliste Économie & Énergie" },
    publishedAt: "2026-05-07T08:00:00Z",
    readingTime: 4,
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
    imageAlt: "Panneaux solaires en Afrique",
    views: 5540,
    tags: ["Économie", "Énergie", "Renouvelable", "Investissement"],
  },
];

export const featuredArticle = articles.find((a) => a.isFeatured) ?? articles[0];
export const latestArticles = articles.filter((a) => !a.isFeatured).slice(0, 6);
export const sidebarArticles = articles.slice(0, 5);
