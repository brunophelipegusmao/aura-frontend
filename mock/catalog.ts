export type MockImageAsset = {
  id: string;
  url: string;
  alt: string;
};

export type MockProduct = {
  id: string;
  name: string;
  reference: string;
  ctaLabel: string;
  image: MockImageAsset;
};

export const mockHeroImages: MockImageAsset[] = [
  {
    id: "hero-1",
    url: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1600&q=80",
    alt: "Modelo com roupa esportiva Aura em estúdio",
  },
  {
    id: "hero-2",
    url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80",
    alt: "Treino funcional com look fitness Aura",
  },
  {
    id: "hero-3",
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80",
    alt: "Atleta correndo com conjunto esportivo",
  },
  {
    id: "hero-4",
    url: "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1600&q=80",
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

export const mockProducts: MockProduct[] = [
  {
    id: "product-1",
    name: "Macaquinho Canelado com Abertura nas Costas Boysenberry",
    reference: "Ref: K5241-A",
    ctaLabel: "EU QUERO",
    image: {
      id: "product-image-1",
      url: `/Products/${encodeURIComponent(mockProductImageFiles[0])}`,
      alt: "Produto Aura 1",
    },
  },
  {
    id: "product-2",
    name: "Top Canelado com Sustentação Média Boysenberry",
    reference: "Ref: K5241-B",
    ctaLabel: "EU QUERO",
    image: {
      id: "product-image-2",
      url: `/Products/${encodeURIComponent(mockProductImageFiles[1])}`,
      alt: "Produto Aura 2",
    },
  },
  {
    id: "product-3",
    name: "Legging Canelada Cintura Alta Boysenberry",
    reference: "Ref: K5241-C",
    ctaLabel: "EU QUERO",
    image: {
      id: "product-image-3",
      url: `/Products/${encodeURIComponent(mockProductImageFiles[2])}`,
      alt: "Produto Aura 3",
    },
  },
  {
    id: "product-4",
    name: "Macaquinho Canelado Modelagem Premium",
    reference: "Ref: K5241-D",
    ctaLabel: "EU QUERO",
    image: {
      id: "product-image-4",
      url: `/Products/${encodeURIComponent(mockProductImageFiles[3])}`,
      alt: "Produto Aura 4",
    },
  },
  {
    id: "product-5",
    name: "Conjunto Fitness Aura Activewear Boysenberry",
    reference: "Ref: K5241-E",
    ctaLabel: "EU QUERO",
    image: {
      id: "product-image-5",
      url: `/Products/${encodeURIComponent(mockProductImageFiles[4])}`,
      alt: "Produto Aura 5",
    },
  },
];
