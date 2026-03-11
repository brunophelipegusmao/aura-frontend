import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  imageUrl: string;
  alt: string;
  title: string;
  reference: string;
  price: number;
  compareAtPrice?: number;
  badgeLabel?: string;
  ctaLabel?: string;
  href?: string;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductCard({
  imageUrl,
  alt,
  title,
  reference,
  price,
  compareAtPrice,
  badgeLabel,
  ctaLabel = "EU QUERO",
  href,
}: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-secondary/15 bg-paper shadow-[0_10px_22px_rgba(11,11,15,0.08)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-primary-soft/30">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          quality={72}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {badgeLabel ? (
          <span className="absolute left-3 top-3 z-10 rounded-full border border-paper/70 bg-paper/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-secondary">
            {badgeLabel}
          </span>
        ) : null}
      </div>

      <div className="space-y-3 p-3 md:p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink md:text-base">
            {title}
          </h3>
          <p className="line-clamp-1 text-[11px] text-muted md:text-xs">{reference}</p>
        </div>

        <div className="flex items-end gap-2">
          <p className="text-base font-black text-ink md:text-lg">
            {currencyFormatter.format(price)}
          </p>
          {compareAtPrice && compareAtPrice > price ? (
            <p className="pb-0.5 text-[11px] text-muted line-through md:text-xs">
              {currencyFormatter.format(compareAtPrice)}
            </p>
          ) : null}
        </div>

        {href ? (
          <Link
            href={href}
            prefetch={false}
            className="block w-full rounded-lg bg-ink py-2.5 text-center text-xs font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-secondary md:text-sm"
          >
            {ctaLabel}
          </Link>
        ) : (
          <button
            type="button"
            className="w-full rounded-lg bg-ink py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-secondary md:text-sm"
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </article>
  );
}
