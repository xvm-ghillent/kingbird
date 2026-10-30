export type RecipeId = "spritz" | "shandy" | "garibaldi";
export type Action =
  "next" | "shop" | "ingredients" | "recipes" | "flavor" | "sources" | RecipeId;
export type Story = {
  id: string;
  sequence: number;
  chapter: string;
  headline: string;
  copy: string;
  media: string;
  mediaType: "image" | "video";
  poster?: string;
  durationMs?: number;
  cutoffSeconds?: number;
  detail?: string;
  alt: string;
  mediaPosition: string;
  layout: "photo" | "product" | "flavor" | "purchase" | "recognition";
  theme: "dark" | "light";
  cta: { label: string; action: Action };
  animation: "reveal" | "still";
  productId?: string;
  recipeId?: RecipeId;
  analytics: { creative: string; experiment: string; variant: string };
};
const photo = (name: string) => `/assets/kingbird-${name}.webp`;
export const commerce = {
  productUrl:
    "https://shop.kingbird.fyi/products/kingbird?variant=49350975029530",
  variantId: "49350975029530",
  productId: "9511574208794",
  price: 72,
  currency: "USD",
  bottles: 2,
  bottleSizeMl: 750,
  verifiedAt: "2026-10-29",
};
export const stories: Story[] = [
  {
    mediaType: "image",
    mediaPosition: "50% 60%",
    layout: "photo",
    theme: "dark",
    animation: "reveal",
    durationMs: 7000,
    analytics: {
      creative: "invitation-round-two",
      experiment: "story-sequence",
      variant: "b",
    },
    id: "invitation",
    chapter: "The invitation",
    headline: "Be the life of the dinner party.",
    copy: "Meet the American aperitif that belongs wherever good people gather.",
    media: "/assets/kingbird-cheers-pizzaparty.webp",
    alt: "Friends clink Kingbird cocktails over bottles and citrus at a pizza party.",
    cta: {
      label: "Meet Kingbird",
      action: "next",
    },
    sequence: 1,
  },
  {
    mediaType: "image",
    mediaPosition: "50% 50%",
    layout: "product",
    theme: "light",
    animation: "reveal",
    durationMs: 7000,
    analytics: {
      creative: "american-aperitif-round-two",
      experiment: "story-sequence",
      variant: "b",
    },
    id: "american-aperitif",
    chapter: "Meet the American aperitif",
    headline: "American roots. Tropical spirit.",
    copy: "Finger Lakes white wine. Fresh pineapple, citrus and botanicals. Made in New York.",
    media: "/assets/kingbird-bottle-photo.webp",
    alt: "A real Kingbird bottle photographed against a dark studio background.",
    cta: {
      label: "Discover what’s inside",
      action: "ingredients",
    },
    productId: "9511574208794",
    sequence: 2,
  },
  {
    mediaType: "image",
    mediaPosition: "50% 65%",
    layout: "photo",
    theme: "dark",
    animation: "reveal",
    durationMs: 7000,
    analytics: {
      creative: "aperitif-hour-round-two",
      experiment: "story-sequence",
      variant: "b",
    },
    id: "aperitif-hour",
    chapter: "Find your aperitif hour",
    headline: "A little ice. A little sparkle.",
    copy: "Dry, tropical and delicately bitter. Add bubbles and make an occasion of it.",
    media: "/assets/kingbird-spritz-fashion.webp",
    alt: "A Kingbird bottle beside a spritz over ice.",
    cta: {
      label: "Find your pour",
      action: "spritz",
    },
    recipeId: "spritz",
    sequence: 3,
  },
  {
    mediaType: "video",
    mediaPosition: "50% 50%",
    layout: "photo",
    theme: "dark",
    animation: "reveal",
    durationMs: 7000,
    analytics: {
      creative: "easy-company-round-two",
      experiment: "story-sequence",
      variant: "b",
    },
    id: "easy-company",
    chapter: "No mixology required",
    headline: "Good company. Easy company.",
    copy: "A glass, some ice and a splash of sparkling water. Start with the Kingbird Spritz.",
    media: "/assets/video/easy-pour.mp4",
    alt: "A creator shares a citrus-garnished Kingbird drink with the bottle in view.",
    cta: {
      label: "See the recipe",
      action: "spritz",
    },
    poster: "/assets/video/easy-pour.webp",
    cutoffSeconds: 8,
    recipeId: "spritz",
    detail: "A Kingbird moment with @luisaurabites.",
    sequence: 4,
  },
  {
    mediaType: "image",
    mediaPosition: "50% 50%",
    layout: "photo",
    theme: "dark",
    animation: "reveal",
    durationMs: 7000,
    analytics: {
      creative: "possibilities-round-two",
      experiment: "story-sequence",
      variant: "b",
    },
    id: "possibilities",
    chapter: "Find your favorite",
    headline: "One bottle. A few good ideas.",
    copy: "A sparkling Spritz. A citrusy Garibaldi. A crisp Shandy. Find your kind of Kingbird.",
    media: "/assets/kingbird-highball-pizzaparty.webp",
    alt: "Kingbird and a citrus-garnished highball on a tabletop.",
    cta: {
      label: "Explore cocktails",
      action: "recipes",
    },
    sequence: 5,
  },
  {
    mediaType: "video",
    mediaPosition: "50% 50%",
    layout: "photo",
    theme: "dark",
    animation: "reveal",
    durationMs: 7000,
    analytics: {
      creative: "made-here-round-two",
      experiment: "story-sequence",
      variant: "b",
    },
    id: "made-here",
    chapter: "From New York, with love",
    headline: "Made here. Made to share.",
    copy: "Finger Lakes wine. Our own Hudson Valley production. A distinctly New York aperitif.",
    media: "/assets/video/made-here.mp4",
    alt: "Archival footage from Kingbird’s actual production process.",
    cta: {
      label: "Meet the botanicals",
      action: "ingredients",
    },
    poster: "/assets/video/made-here.webp",
    cutoffSeconds: 9,
    detail: "From our 2020–2023 making-of archive.",
    sequence: 6,
  },
  {
    mediaType: "image",
    mediaPosition: "50% 50%",
    layout: "recognition",
    theme: "light",
    animation: "reveal",
    durationMs: 10000,
    analytics: {
      creative: "good-company-round-two",
      experiment: "story-sequence",
      variant: "b",
    },
    id: "good-company",
    chapter: "A little recognition",
    headline: "In very good company.",
    copy: "On a few very good lists. At a few very good tables.",
    media: "/assets/kingbird-bottle-photo.webp",
    alt: "The Kingbird bird emblem.",
    cta: {
      label: "Read the stories",
      action: "sources",
    },
    sequence: 7,
  },
  {
    mediaType: "video",
    mediaPosition: "50% 50%",
    layout: "photo",
    theme: "dark",
    animation: "reveal",
    durationMs: 7000,
    analytics: {
      creative: "company-in-motion-round-two",
      experiment: "story-sequence",
      variant: "b",
    },
    id: "company-in-motion",
    chapter: "Good people. Real moments.",
    headline: "Real people. Real Kingbird.",
    copy: "A bottle, a few friends and a very good reason to gather.",
    media: "/assets/video/good-company.mp4",
    alt: "Creator @privatechefli opens a bottle of Kingbird at the table.",
    cta: {
      label: "Bring a bottle",
      action: "shop",
    },
    poster: "/assets/video/good-company.webp",
    cutoffSeconds: 12,
    detail: "A Kingbird moment with @privatechefli.",
    sequence: 8,
  },
  {
    mediaType: "image",
    mediaPosition: "50% 50%",
    layout: "purchase",
    theme: "light",
    animation: "reveal",
    durationMs: 7000,
    analytics: {
      creative: "bring-it-home-round-two",
      experiment: "story-sequence",
      variant: "b",
    },
    id: "bring-it-home",
    chapter: "Your next invitation",
    headline: "Your next great gathering starts here.",
    copy: "One for the table. One for the next invitation. Bring a little Kingbird to both.",
    media: "/assets/kingbird-bottle-photo.webp",
    alt: "Kingbird bottle photographed in the studio; the offer includes two bottles.",
    cta: {
      label: "Bring Kingbird Home",
      action: "shop",
    },
    productId: "9511574208794",
    detail: "Featured in the WSJ 2025 gift guide.",
    sequence: 9,
  },
];
export type Recipe = {
  id: RecipeId;
  name: string;
  note: string;
  ingredients: { amount: string; name: string }[];
  steps: string[];
  garnish: string;
  image: string;
  imageCaption: string;
};
export const recipes: Record<RecipeId, Recipe> = {
  spritz: {
    id: "spritz",
    name: "Kingbird Spritz",
    note: "A little sparkle goes a long way.",
    ingredients: [
      { amount: "2.5 oz", name: "Kingbird" },
      { amount: "3 dashes", name: "Grapefruit bitters" },
      { amount: "To top", name: "Club soda or sparkling mineral water" },
    ],
    steps: [
      "Add Kingbird and grapefruit bitters to a wine glass over ice.",
      "Top with sparkling water and stir until mixed.",
      "Garnish with grapefruit peel.",
    ],
    garnish: "Grapefruit peel",
    image: photo("spritz-fashion"),
    imageCaption:
      "Kingbird serving inspiration. Recipe from Kingbird Cocktails.",
  },
  shandy: {
    id: "shandy",
    name: "Kingbird Shandy",
    note: "For the beer drinker at the table.",
    ingredients: [
      { amount: "2 oz", name: "Kingbird" },
      { amount: "4 oz", name: "Pilsner-style beer" },
      { amount: "0.5 oz", name: "Grapefruit cordial" },
    ],
    steps: [
      "Add Kingbird and grapefruit cordial to a highball glass over ice.",
      "Top with pilsner-style beer and stir until mixed.",
      "Garnish with a grapefruit slice.",
    ],
    garnish: "Grapefruit slice",
    image: photo("highball-pizzaparty"),
    imageCaption:
      "Kingbird serving inspiration; not a photograph of this specific recipe.",
  },
  garibaldi: {
    id: "garibaldi",
    name: "Kingbird Garibaldi",
    note: "Two ingredients. Quite an entrance.",
    ingredients: [
      { amount: "3 oz", name: "Kingbird" },
      { amount: "3 oz", name: "Grapefruit juice" },
    ],
    steps: [
      "Build in a highball glass over ice.",
      "Stir to incorporate. No garnish needed.",
    ],
    garnish: "None",
    image: photo("highball-pizzaparty"),
    imageCaption:
      "Kingbird serving inspiration; not a photograph of this specific recipe.",
  },
};
