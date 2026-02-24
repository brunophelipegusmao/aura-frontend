"use client";

import { useMemo } from "react";
import Caroussel from "@/components/Caroussel";
import { ProductCard } from "@/components/ProductCard";
import { buildProductHref } from "@/lib/storefront-catalog";
import { useStorefrontCatalog } from "@/lib/use-storefront-catalog";

export function ProductCarousel() {
  const products = useStorefrontCatalog();

  const carouselItems = useMemo(() => {
    const sortedProducts = [...products].sort((a, b) => {
      const featuredComparison = Number(b.isNew) - Number(a.isNew);
      if (featuredComparison !== 0) {
        return featuredComparison;
      }

      return b.price - a.price;
    });

    return sortedProducts.slice(0, 12).map((product) => ({
      id: product.id,
      imageUrl: product.image.url,
      alt: product.image.alt,
      title: product.name,
      reference: product.reference,
      ctaLabel: product.ctaLabel,
      href: buildProductHref(product.slug),
    }));
  }, [products]);

  if (carouselItems.length === 0) {
    return null;
  }

  return (
    <Caroussel
      items={carouselItems}
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
          href={item.href}
        />
      )}
    />
  );
}
