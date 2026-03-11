"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = {
  imageUrl: string;
  alt: string;
  title: string;
  subtitle?: string;
  href?: string;
  ctaLabel?: string;
  index?: number;
};

export function CategoryCard({
  imageUrl,
  alt,
  title,
  subtitle,
  href,
  ctaLabel = "Ver produtos",
  index = 0,
}: CategoryCardProps) {
  const content = (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-2xl border border-secondary/20 bg-paper shadow-[0_12px_30px_rgba(11,11,15,0.1)]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-primary-soft/35">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-4 pb-4 pt-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-paper/80">
            Categoria
          </p>
          <h3 className="font-roboto mt-1 text-xl font-black uppercase tracking-[0.1em] text-paper sm:text-2xl">
            {title}
          </h3>
        </div>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        <p className="text-sm leading-relaxed text-muted">
          {subtitle ?? "Modelagens premium para treino com conforto e presença."}
        </p>
        <span className="inline-flex w-full items-center justify-center rounded-xl bg-ink px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-paper transition-colors group-hover:bg-secondary">
          {ctaLabel}
        </span>
      </div>
    </motion.article>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} prefetch={false} className="block">
      {content}
    </Link>
  );
}
