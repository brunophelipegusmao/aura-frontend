"use client";

import Caroussel from "@/components/Caroussel";
import { ProductCard } from "@/components/ProductCard";
import { productCarouselItems } from "../../../mock/carousel";

export function ProductCarousel() {
  return (
    <Caroussel
      items={productCarouselItems}
      itemsPerSlide={4}
      fullWidth={false}
      interval={4500}
      renderItem={(item) => (
        <ProductCard
          imageUrl={item.imageUrl}
          alt={item.alt}
          title={item.title ?? "Produto Aura"}
          reference={item.reference ?? ""}
          ctaLabel={item.ctaLabel}
        />
      )}
    />
  );
}
