import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
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

  return (
    <article className="group relative overflow-hidden rounded-xl border border-secondary/20 bg-paper shadow-[0_14px_30px_rgba(11,11,15,0.1)] md:rounded-2xl">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-primary-soft/35 sm:aspect-[4/5]">
        <Image
          src={product.image.url}
          alt={product.image.alt}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />

        <button
          type="button"
          aria-label={`Favoritar ${product.name}`}
          className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-paper/85 text-muted backdrop-blur-sm transition hover:bg-paper hover:text-secondary sm:right-3 sm:top-3 sm:h-10 sm:w-10"
        >
          <FavoriteBorderIcon fontSize="small" />
        </button>

        <div className="pointer-events-none absolute left-2 top-2 flex gap-1.5 sm:left-3 sm:top-3 sm:gap-2">
          {discountPercentage > 0 ? (
            <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-paper sm:px-2.5 sm:text-[11px]">
              -{discountPercentage}%
            </span>
          ) : null}
          {product.isNew ? (
            <span className="rounded-full border border-paper/70 bg-paper/30 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-paper backdrop-blur-sm sm:px-2.5 sm:text-[11px]">
              Novo
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-2.5 p-3 sm:space-y-3 sm:p-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary sm:text-[11px]">
            {product.collection}
          </p>
          <h3 className="mt-1 line-clamp-2 text-xs font-bold leading-snug text-ink sm:text-sm md:text-base">
            {product.name}
          </h3>
          <p className="mt-1 hidden text-[11px] text-muted sm:block">
            {product.reference}
          </p>
        </div>

        <div className="flex items-end gap-2">
          <p className="text-base font-black text-ink sm:text-lg">
            {currencyFormatter.format(product.price)}
          </p>
          {product.compareAtPrice ? (
            <p className="text-[11px] text-muted line-through sm:text-xs">
              {currencyFormatter.format(product.compareAtPrice)}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-1">
          {product.sizes.slice(0, 4).map((size) => (
            <span
              key={`${product.id}-${size}`}
              className="rounded border border-secondary/20 bg-primary-soft/30 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-secondary sm:px-2"
            >
              {size}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 3).map((color) => (
              <span
                key={`${product.id}-${color.name}`}
                title={color.name}
                className="h-3.5 w-3.5 rounded-full border border-ink/10 sm:h-4 sm:w-4"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.colors.length > 3 ? (
              <span className="text-[11px] font-semibold text-muted sm:text-xs">
                +{product.colors.length - 3}
              </span>
            ) : null}
          </div>
          {!product.inStock ? (
            <span className="rounded bg-ink/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-paper">
              Esgotado
            </span>
          ) : null}
        </div>

        <Link
          href={buildProductHref(product.slug)}
          prefetch={false}
          className="block w-full rounded-lg bg-ink py-2 text-center text-[11px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-secondary sm:rounded-md sm:py-2.5 sm:text-sm"
        >
          {product.ctaLabel}
        </Link>
      </div>
    </article>
  );
}
