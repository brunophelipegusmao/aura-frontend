import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Image from "next/image";

type ProductCardProps = {
  imageUrl: string;
  alt: string;
  title: string;
  reference: string;
  ctaLabel?: string;
};

export function ProductCard({
  imageUrl,
  alt,
  title,
  reference,
  ctaLabel = "EU QUERO",
}: ProductCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-sm bg-paper">
      <div className="relative h-[340px] w-full md:h-[520px]">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>

      <button
        type="button"
        aria-label={`Favoritar ${title}`}
        className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-paper/85 text-muted backdrop-blur-sm transition hover:bg-paper hover:text-secondary"
      >
        <FavoriteBorderIcon fontSize="small" />
      </button>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 pb-3 pt-14">
        <p className="w-fit bg-ink px-2 py-1 text-[11px] leading-tight text-paper md:text-xs">
          {title}
        </p>
        <p className="mt-1 w-fit bg-ink/90 px-2 py-1 text-[11px] text-paper/90">
          {reference}
        </p>
        <button
          type="button"
          className="mt-3 w-full bg-ink py-2 text-sm font-semibold tracking-wide text-paper transition-colors hover:bg-secondary"
        >
          {ctaLabel}
        </button>
      </div>
    </article>
  );
}
