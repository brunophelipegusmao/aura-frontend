"use client";

import { useMemo } from "react";
import Caroussel from "@/components/Caroussel";
import { ProductCard } from "@/components/ProductCard";
import { buildProductHref } from "@/lib/storefront-catalog";
import { useStorefrontCatalog } from "@/lib/use-storefront-catalog";

type ProductCarouselProps = {
  interval?: number;
};

const getBadgeLabel = (isNew: boolean, inStock: boolean, price: number, compareAtPrice?: number) => {
  if (!inStock) {
    return "Esgotado";
  }

  if (isNew) {
    return "Novo";
  }

  if (compareAtPrice && compareAtPrice > price) {
    const discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
    return `-${discount}%`;
  }

  return undefined;
};

export function ProductCarousel({ interval = 4500 }: ProductCarouselProps) {
  const products = useStorefrontCatalog();

  const { carouselItems, productDetailsById } = useMemo(() => {
    const sortedProducts = [...products].sort((a, b) => {
      const featuredComparison = Number(b.isNew) - Number(a.isNew);
      if (featuredComparison !== 0) {
        return featuredComparison;
      }

      return b.price - a.price;
    });

    const visibleProducts = sortedProducts.slice(0, 12);
    const detailsById = new Map<
      string,
      {
        title: string;
        reference: string;
        price: number;
        compareAtPrice?: number;
        badgeLabel?: string;
      }
    >();

    const items = visibleProducts.map((product) => {
      detailsById.set(product.id, {
        title: product.name,
        reference: product.reference,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        badgeLabel: getBadgeLabel(
          product.isNew,
          product.inStock,
          product.price,
          product.compareAtPrice,
        ),
      });

      return {
        id: product.id,
        imageUrl: product.image.url,
        alt: product.image.alt,
        href: buildProductHref(product.slug),
      };
    });

    return {
      carouselItems: items,
      productDetailsById: detailsById,
    };
  }, [products]);

  if (carouselItems.length === 0) {
    return null;
  }

  return (
    <Caroussel
      items={carouselItems}
      itemsPerSlide={4}
      fullWidth={false}
      interval={interval}
      showSideClickNavigation={false}
      renderItem={(item) => {
        const details = productDetailsById.get(item.id);
        if (!details) {
          return null;
        }

        return (
          <ProductCard
            imageUrl={item.imageUrl}
            alt={item.alt}
            title={details.title || "Produto Aura"}
            reference={details.reference || ""}
            price={details.price}
            compareAtPrice={details.compareAtPrice}
            badgeLabel={details.badgeLabel}
            ctaLabel="EU QUERO"
            href={item.href}
          />
        );
      }}
    />
  );
}
