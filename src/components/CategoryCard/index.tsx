"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type CategoryCardProps = {
  imageUrl: string;
  alt: string;
  title: string;
  subtitle?: string;
  index?: number;
};

export function CategoryCard({
  imageUrl,
  alt,
  title,
  subtitle,
  index = 0,
}: CategoryCardProps) {
  const isLongTitle = title.length > 6;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="group relative overflow-hidden rounded-xl border border-white/30 bg-white/50 shadow-[0_10px_30px_rgba(11,11,15,0.12)] backdrop-blur-sm"
    >
      <div className="relative h-[320px] w-full md:h-[360px]">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      <div className="absolute inset-y-0 right-0 flex items-center justify-end bg-gradient-to-l from-black/65 via-black/35 to-transparent px-3">
        <p
          className={`font-roboto [writing-mode:vertical-rl] [text-orientation:upright] font-black text-paper drop-shadow-[0_6px_10px_rgba(110,99,168,0.55)] ${
            isLongTitle
              ? "text-lg tracking-[0.16em] md:text-2xl"
              : "text-2xl tracking-[0.22em] md:text-4xl"
          }`}
        >
          {title}
        </p>
      </div>

      {subtitle ? (
        <p className="font-roboto absolute bottom-3 left-3 z-20 rounded-md bg-black/45 px-2 py-1 text-sm font-semibold tracking-wide text-paper drop-shadow-[0_3px_8px_rgba(110,99,168,0.45)] backdrop-blur-sm">
          {subtitle}
        </p>
      ) : null}
    </motion.article>
  );
}
