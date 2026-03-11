export type MockImageAsset = {
  id: string;
  url: string;
  alt: string;
};

export type MockColor = {
  name: string;
  hex: string;
};

export type MockProduct = {
  id: string;
  name: string;
  reference: string;
  ctaLabel: string;
  image: MockImageAsset;
  category: string;
  collection: string;
  sizes: string[];
  colors: MockColor[];
  price: number;
  compareAtPrice?: number;
  isNew: boolean;
  inStock: boolean;
};

export const mockHeroImages: MockImageAsset[] = [
  {
    id: "hero-1",
    url: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1600&q=70",
    alt: "Modelo com roupa esportiva Aura em estúdio",
  },
  {
    id: "hero-2",
    url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=70",
    alt: "Treino funcional com look fitness Aura",
  },
  {
    id: "hero-3",
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=70",
    alt: "Atleta correndo com conjunto esportivo",
  },
  {
    id: "hero-4",
    url: "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1600&q=70",
    alt: "Close em tecido técnico de activewear",
  },
];

const mockProductImageFiles = [
  "WhatsApp Image 2026-02-05 at 15.22.07.jpeg",
  "WhatsApp Image 2026-02-09 at 18.19.48 (1).jpeg",
  "WhatsApp Image 2026-02-09 at 18.19.48.jpeg",
  "WhatsApp Image 2026-02-09 at 18.19.49 (1).jpeg",
  "WhatsApp Image 2026-02-09 at 18.19.49.jpeg",
];

const productImageUrls = mockProductImageFiles.map(
  (file) => `/Products/${encodeURIComponent(file)}`,
);

const palette = {
  boysenberry: { name: "Boysenberry", hex: "#6E3D74" },
  preta: { name: "Preto", hex: "#111111" },
  rosa: { name: "Rosa Quartz", hex: "#D98AA5" },
  areia: { name: "Areia", hex: "#E9D7C8" },
  verde: { name: "Verde Sage", hex: "#8BAA9A" },
  offWhite: { name: "Off White", hex: "#F6F1EA" },
  marinho: { name: "Azul Marinho", hex: "#1C3159" },
  vinho: { name: "Vinho", hex: "#6A273E" },
} satisfies Record<string, MockColor>;

export const mockProducts: MockProduct[] = [
  {
    id: "product-1",
    name: "Macaquinho Canelado com Abertura nas Costas Boysenberry",
    reference: "Ref: K5241-A",
    ctaLabel: "EU QUERO",
    image: {
      id: "product-image-1",
      url: productImageUrls[0],
      alt: "Macaquinho canelado Aura",
    },
    category: "Macacão",
    collection: "Legacy",
    sizes: ["P", "M", "G"],
    colors: [palette.boysenberry, palette.preta],
    price: 169.9,
    compareAtPrice: 239.9,
    isNew: true,
    inStock: true,
  },
  {
    id: "product-2",
    name: "Top Canelado com Sustentação Média Boysenberry",
    reference: "Ref: K5241-B",
    ctaLabel: "EU QUERO",
    image: {
      id: "product-image-2",
      url: productImageUrls[1],
      alt: "Top esportivo Aura",
    },
    category: "Top",
    collection: "Legacy",
    sizes: ["PP", "P", "M", "G"],
    colors: [palette.boysenberry, palette.offWhite],
    price: 119.9,
    compareAtPrice: 159.9,
    isNew: false,
    inStock: true,
  },
  {
    id: "product-3",
    name: "Legging Canelada Cintura Alta Boysenberry",
    reference: "Ref: K5241-C",
    ctaLabel: "EU QUERO",
    image: {
      id: "product-image-3",
      url: productImageUrls[2],
      alt: "Legging canelada Aura",
    },
    category: "Legging",
    collection: "Legacy",
    sizes: ["P", "M", "G", "GG"],
    colors: [palette.boysenberry, palette.preta, palette.marinho],
    price: 149.9,
    compareAtPrice: 209.9,
    isNew: false,
    inStock: true,
  },
  {
    id: "product-4",
    name: "Macaquinho Canelado Modelagem Premium",
    reference: "Ref: K5241-D",
    ctaLabel: "EU QUERO",
    image: {
      id: "product-image-4",
      url: productImageUrls[3],
      alt: "Macaquinho premium Aura",
    },
    category: "Macacão",
    collection: "Boost",
    sizes: ["PP", "P", "M"],
    colors: [palette.preta, palette.rosa],
    price: 189.9,
    compareAtPrice: 259.9,
    isNew: true,
    inStock: true,
  },
  {
    id: "product-5",
    name: "Conjunto Fitness Aura Activewear Boysenberry",
    reference: "Ref: K5241-E",
    ctaLabel: "EU QUERO",
    image: {
      id: "product-image-5",
      url: productImageUrls[4],
      alt: "Conjunto fitness Aura",
    },
    category: "Conjunto",
    collection: "Boost",
    sizes: ["P", "M", "G"],
    colors: [palette.boysenberry, palette.areia],
    price: 219.9,
    compareAtPrice: 299.9,
    isNew: true,
    inStock: false,
  },
  {
    id: "product-6",
    name: "Short Running com Bolso Interno",
    reference: "Ref: R9831-A",
    ctaLabel: "EU QUERO",
    image: {
      id: "product-image-6",
      url: productImageUrls[3],
      alt: "Short running Aura",
    },
    category: "Short",
    collection: "Running",
    sizes: ["PP", "P", "M", "G"],
    colors: [palette.preta, palette.verde],
    price: 109.9,
    compareAtPrice: 149.9,
    isNew: false,
    inStock: true,
  },
  {
    id: "product-7",
    name: "Top Seamless Alta Compressão",
    reference: "Ref: SM102-B",
    ctaLabel: "EU QUERO",
    image: {
      id: "product-image-7",
      url: productImageUrls[1],
      alt: "Top seamless Aura",
    },
    category: "Top",
    collection: "Seamless",
    sizes: ["P", "M", "G"],
    colors: [palette.preta, palette.marinho],
    price: 129.9,
    compareAtPrice: 189.9,
    isNew: false,
    inStock: true,
  },
  {
    id: "product-8",
    name: "Legging Seamless Efeito Sculpt",
    reference: "Ref: SM102-C",
    ctaLabel: "EU QUERO",
    image: {
      id: "product-image-8",
      url: productImageUrls[2],
      alt: "Legging seamless Aura",
    },
    category: "Legging",
    collection: "Seamless",
    sizes: ["P", "M", "G", "GG"],
    colors: [palette.preta, palette.vinho, palette.verde],
    price: 169.9,
    compareAtPrice: 239.9,
    isNew: false,
    inStock: true,
  },
  {
    id: "product-9",
    name: "Jaqueta Corta Vento Dry Fit",
    reference: "Ref: JT741-A",
    ctaLabel: "EU QUERO",
    image: {
      id: "product-image-9",
      url: productImageUrls[0],
      alt: "Jaqueta corta vento Aura",
    },
    category: "Jaqueta",
    collection: "Running",
    sizes: ["P", "M", "G"],
    colors: [palette.preta, palette.areia],
    price: 199.9,
    compareAtPrice: 289.9,
    isNew: true,
    inStock: true,
  },
  {
    id: "product-10",
    name: "Regata Tech com Costas Nadador",
    reference: "Ref: RG311-C",
    ctaLabel: "EU QUERO",
    image: {
      id: "product-image-10",
      url: productImageUrls[4],
      alt: "Regata Aura",
    },
    category: "Regata",
    collection: "Wellness",
    sizes: ["PP", "P", "M", "G"],
    colors: [palette.offWhite, palette.rosa],
    price: 89.9,
    compareAtPrice: 119.9,
    isNew: false,
    inStock: true,
  },
  {
    id: "product-11",
    name: "Short Saia Performance com Forro",
    reference: "Ref: SS201-D",
    ctaLabel: "EU QUERO",
    image: {
      id: "product-image-11",
      url: productImageUrls[3],
      alt: "Short saia Aura",
    },
    category: "Short",
    collection: "Wellness",
    sizes: ["P", "M", "G"],
    colors: [palette.offWhite, palette.verde],
    price: 119.9,
    compareAtPrice: 169.9,
    isNew: true,
    inStock: false,
  },
  {
    id: "product-12",
    name: "Macaquinho One Piece com Recortes",
    reference: "Ref: OP801-F",
    ctaLabel: "EU QUERO",
    image: {
      id: "product-image-12",
      url: productImageUrls[0],
      alt: "Macaquinho one piece Aura",
    },
    category: "Macacão",
    collection: "Outset",
    sizes: ["P", "M", "G", "GG"],
    colors: [palette.preta, palette.vinho, palette.marinho],
    price: 179.9,
    compareAtPrice: 269.9,
    isNew: false,
    inStock: true,
  },
];
