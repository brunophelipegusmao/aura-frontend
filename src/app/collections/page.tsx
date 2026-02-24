"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MotionReveal,
  MotionStagger,
  MotionStaggerItem,
} from "@/components/motion/Reveal";
import { useStorefrontCatalog } from "@/lib/use-storefront-catalog";
import type { StorefrontProduct } from "@/lib/storefront-catalog";

type CollectionSummary = {
  name: string;
  imageUrl: string;
  imageAlt: string;
  products: number;
  inStock: number;
  averagePrice: number;
};

type CollectionCopy = {
  description: string;
  tag: string;
};

const collectionCopyMap: Record<string, CollectionCopy> = {
  "Aura Flow": {
    description:
      "Modelagens com compressao equilibrada para treinos intensos e rotina ativa.",
    tag: "Treino de alta energia",
  },
  "Aura Sculpt": {
    description:
      "Peças com foco em ajuste ao corpo, sustentacao e acabamento premium.",
    tag: "Ajuste e definicao",
  },
  "Aura Basic": {
    description:
      "Essenciais versateis para combinar entre si e usar dentro ou fora da academia.",
    tag: "Base do guarda-roupa",
  },
  "Aura Glow": {
    description:
      "Texturas e tons de destaque para looks fitness modernos e expressivos.",
    tag: "Visual marcante",
  },
};

const fallbackCopy: CollectionCopy = {
  description:
    "Capsula exclusiva com a identidade Aura: conforto, tecnologia e estilo.",
  tag: "Colecao exclusiva",
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const buildCollections = (products: StorefrontProduct[]): CollectionSummary[] => {
  const map = new Map<
    string,
    {
      name: string;
      imageUrl: string;
      imageAlt: string;
      products: number;
      inStock: number;
      totalPrice: number;
    }
  >();

  products.forEach((product) => {
    const current = map.get(product.collection);
    if (!current) {
      map.set(product.collection, {
        name: product.collection,
        imageUrl: product.image.url,
        imageAlt: product.image.alt,
        products: 1,
        inStock: product.inStock ? 1 : 0,
        totalPrice: product.price,
      });
      return;
    }

    current.products += 1;
    current.inStock += product.inStock ? 1 : 0;
    current.totalPrice += product.price;
    map.set(product.collection, current);
  });

  return Array.from(map.values())
    .map((item) => ({
      name: item.name,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
      products: item.products,
      inStock: item.inStock,
      averagePrice: item.totalPrice / item.products,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
};

export default function CollectionsPage() {
  const products = useStorefrontCatalog();
  const collections = buildCollections(products);
  const totalStock = collections.reduce((sum, item) => sum + item.inStock, 0);
  const averagePrice =
    products.length > 0
      ? products.reduce((sum, item) => sum + item.price, 0) / products.length
      : 0;

  return (
    <>
      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-secondary/15 bg-gradient-to-br from-paper via-accent/45 to-primary-soft/55 py-8 sm:py-10">
        <MotionReveal className="mx-auto w-full max-w-6xl px-3 sm:px-6 lg:px-8">
          <p className="font-roboto text-xs font-semibold tracking-[0.24em] text-secondary">
            AURA ACTIVEWEAR
          </p>
          <h1 className="font-roboto mt-2 text-2xl font-black uppercase tracking-[0.12em] text-ink sm:text-3xl md:text-5xl">
            Colecoes
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
            Navegue pelas capsulas da marca e encontre o estilo ideal para seu
            ritmo.
          </p>
        </MotionReveal>
      </section>

      <section className="py-6 md:py-10">
        <MotionStagger
          className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4"
          staggerChildren={0.06}
        >
          <MotionStaggerItem>
            <article className="rounded-2xl border border-secondary/20 bg-paper p-3 shadow-[0_8px_20px_rgba(11,11,15,0.08)] sm:p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Colecoes
              </p>
              <p className="mt-1 text-lg font-black text-secondary sm:text-2xl">
                {collections.length}
              </p>
            </article>
          </MotionStaggerItem>
          <MotionStaggerItem>
            <article className="rounded-2xl border border-secondary/20 bg-paper p-3 shadow-[0_8px_20px_rgba(11,11,15,0.08)] sm:p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Produtos
              </p>
              <p className="mt-1 text-lg font-black text-secondary sm:text-2xl">
                {products.length}
              </p>
            </article>
          </MotionStaggerItem>
          <MotionStaggerItem>
            <article className="rounded-2xl border border-secondary/20 bg-paper p-3 shadow-[0_8px_20px_rgba(11,11,15,0.08)] sm:p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Em estoque
              </p>
              <p className="mt-1 text-lg font-black text-secondary sm:text-2xl">
                {totalStock}
              </p>
            </article>
          </MotionStaggerItem>
          <MotionStaggerItem>
            <article className="rounded-2xl border border-secondary/20 bg-paper p-3 shadow-[0_8px_20px_rgba(11,11,15,0.08)] sm:p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Preco medio
              </p>
              <p className="mt-1 text-sm font-black text-secondary sm:text-base">
                {currencyFormatter.format(averagePrice)}
              </p>
            </article>
          </MotionStaggerItem>
        </MotionStagger>

        <MotionStagger
          className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 xl:grid-cols-3"
          staggerChildren={0.06}
          amount={0.1}
        >
          {collections.map((collection) => {
            const copy = collectionCopyMap[collection.name] ?? fallbackCopy;
            const collectionHref = `/products?collection=${encodeURIComponent(collection.name)}`;

            return (
              <MotionStaggerItem key={collection.name}>
                <Link
                  href={collectionHref}
                  prefetch={false}
                  className="group block overflow-hidden rounded-3xl border border-secondary/20 bg-paper shadow-[0_12px_32px_rgba(11,11,15,0.1)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-primary-soft/35">
                    <Image
                      src={collection.imageUrl}
                      alt={collection.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-4 pb-4 pt-12">
                      <p className="font-roboto text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/80">
                        {copy.tag}
                      </p>
                      <h2 className="font-roboto mt-1 text-xl font-black uppercase tracking-[0.1em] text-paper sm:text-2xl">
                        {collection.name}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 sm:p-5">
                    <p className="text-sm leading-relaxed text-muted">
                      {copy.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 rounded-2xl border border-secondary/15 bg-primary-soft/20 p-3 text-center">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                          Itens
                        </p>
                        <p className="mt-1 text-sm font-black text-secondary">
                          {collection.products}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                          Estoque
                        </p>
                        <p className="mt-1 text-sm font-black text-secondary">
                          {collection.inStock}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                          Ticket
                        </p>
                        <p className="mt-1 text-xs font-black text-secondary">
                          {currencyFormatter.format(collection.averagePrice)}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex w-full items-center justify-center rounded-xl bg-ink px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-paper transition-colors group-hover:bg-secondary">
                      Ver produtos
                    </span>
                  </div>
                </Link>
              </MotionStaggerItem>
            );
          })}
        </MotionStagger>
      </section>
    </>
  );
}
