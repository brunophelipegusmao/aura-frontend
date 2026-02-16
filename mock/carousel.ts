import { mockHeroImages, mockProducts } from "./catalog";

export type CarouselItem = {
  id: string;
  imageUrl: string;
  alt: string;
  title?: string;
  reference?: string;
  ctaLabel?: string;
};

export const heroCarouselItems: CarouselItem[] = mockHeroImages.map((image) => ({
  id: image.id,
  imageUrl: image.url,
  alt: image.alt,
}));

export const productCarouselItems: CarouselItem[] = mockProducts.map(
  (product) => ({
    id: product.id,
    imageUrl: product.image.url,
    alt: product.image.alt,
    title: product.name,
    reference: product.reference,
    ctaLabel: product.ctaLabel,
  }),
);
