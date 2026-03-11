import Image from "next/image";
import Link from "next/link";
import {
  buildProductHref,
  type StorefrontProduct,
} from "@/lib/storefront-catalog";

type ProductCatalogCardProps = {
  product: StorefrontProduct;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const getDiscountPercentage = (product: StorefrontProduct) => {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) {
    return 0;
  }

  const percentage = ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100;
  return Math.round(percentage);
};

export function ProductCatalogCard({ product }: ProductCatalogCardProps) {
  const discountPercentage = getDiscountPercentage(product);
  const badgeLabel = !product.inStock
    ? "Esgotado"
    : product.isNew
      ? "Novo"
      : discountPercentage > 0
        ? `-${discountPercentage}%`
        : null;

  return (
    <article className="group overflow-hidden rounded-xl border border-secondary/15 bg-paper shadow-[0_12px_26px_rgba(11,11,15,0.08)] md:rounded-2xl">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-primary-soft/35">
        <Image
          src={product.image.url}
          alt={product.image.alt}
          fill
          quality={72}
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />

        {badgeLabel ? (
          <span className="absolute left-3 top-3 z-10 rounded-full border border-paper/70 bg-paper/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-secondary">
            {badgeLabel}
          </span>
        ) : null}
      </div>

      <div className="space-y-3 p-3 sm:p-4">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary/85 sm:text-[11px]">
            {product.collection}
          </p>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink sm:text-base">
            {product.name}
          </h3>
          <p className="line-clamp-1 text-[11px] text-muted sm:text-xs">
            {product.reference}
          </p>
        </div>

        <div className="flex items-end gap-2">
          <p className="text-base font-black text-ink sm:text-lg md:text-xl">
            {currencyFormatter.format(product.price)}
          </p>
          {product.compareAtPrice && product.compareAtPrice > product.price ? (
            <p className="pb-0.5 text-[11px] text-muted line-through sm:text-xs">
              {currencyFormatter.format(product.compareAtPrice)}
            </p>
          ) : null}
        </div>

        <Link
          href={buildProductHref(product.slug)}
          prefetch={false}
          className="aura-cta aura-cta-considerar flex w-full text-center text-xs sm:text-sm"
        >
          Ver produto
        </Link>
      </div>
    </article>
  );
}
