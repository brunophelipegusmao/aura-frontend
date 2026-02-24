"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { addToCart } from "@/lib/cart-store";
import { MotionReveal } from "@/components/motion/Reveal";
import { buildProductHref } from "@/lib/storefront-catalog";
import { useStorefrontCatalog } from "@/lib/use-storefront-catalog";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const products = useStorefrontCatalog();

  const product = products.find((item) => item.slug === params.slug);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "UN");
  const [selectedColorName, setSelectedColorName] = useState(
    product?.colors[0]?.name ?? "Preto",
  );
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  if (!product) {
    return (
      <section className="py-10">
        <div className="rounded-3xl border border-secondary/20 bg-white p-8 text-center shadow-sm">
          <p className="font-roboto text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Produto
          </p>
          <h1 className="font-roboto mt-2 text-2xl font-black uppercase tracking-[0.12em] text-ink">
            Produto nao encontrado
          </h1>
          <p className="mt-3 text-sm text-muted">
            Esse slug nao existe no catalogo atual. Se voce criou o produto no admin,
            confirme se ele esta ativo.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <Link
              href="/products"
              prefetch={false}
              className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-paper"
            >
              Voltar para produtos
            </Link>
            <Link
              href="/admin"
              prefetch={false}
              className="rounded-full border border-secondary/25 px-4 py-2 text-sm font-semibold text-secondary"
            >
              Ir para admin
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const colorNames = product.colors.map((color) => color.name).join(", ");
  const sizeNames = product.sizes.join(", ");

  const presentationText = `${product.name} foi desenvolvido para unir conforto, seguranca e estilo em movimento. A proposta da colecao ${product.collection} valoriza performance com toque macio e modelagem ${product.category.toLowerCase()} para acompanhar seu ritmo de treino e rotina.`;

  const descriptionText = `Esta peca entrega ajuste ao corpo com visual premium e acabamento pensado para uso frequente. Disponivel nos tamanhos ${sizeNames} e nas cores ${colorNames}, e uma opcao versatil para montar looks fitness com identidade Aura.`;

  const technicalHighlights = [
    "Modelagem com foco em mobilidade e conforto prolongado.",
    "Acabamento premium para uso em treino e dia a dia.",
    `Variacoes de tamanho: ${sizeNames}.`,
    `Variacoes de cor: ${colorNames}.`,
    product.inStock ? "Produto disponivel para envio." : "Produto atualmente esgotado.",
  ];

  const resolveSelectedColor = () => {
    return (
      product.colors.find((color) => color.name === selectedColorName) ??
      product.colors[0] ??
      null
    );
  };

  const addCurrentSelectionToCart = () => {
    const selectedColor = resolveSelectedColor();
    if (!selectedColor) {
      return false;
    }

    addToCart({
      product,
      size: selectedSize,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      quantity: selectedQuantity,
    });

    return true;
  };

  return (
    <>
      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-secondary/15 bg-gradient-to-br from-paper via-accent/45 to-primary-soft/55 py-8 sm:py-10 md:py-12">
        <MotionReveal className="mx-auto w-full max-w-6xl px-3 sm:px-6 lg:px-8">
          <p className="font-roboto text-xs font-semibold tracking-[0.24em] text-secondary">
            AURA ACTIVEWEAR
          </p>
          <h1 className="font-roboto mt-2 text-2xl font-black uppercase tracking-[0.12em] text-ink sm:text-3xl md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
            {product.collection} | {product.category}
          </p>
        </MotionReveal>
      </section>

      <section className="py-6 md:py-10">
        <div className="grid gap-6 rounded-3xl border border-secondary/20 bg-white p-4 shadow-[0_12px_30px_rgba(11,11,15,0.08)] sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-primary-soft/35">
            <Image
              src={product.image.url}
              alt={product.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">
                Referencia
              </p>
              <p className="text-sm text-ink">{product.reference || "Sem referencia"}</p>
            </div>

            <div className="flex items-end gap-2">
              <p className="text-3xl font-black text-ink">
                {currencyFormatter.format(product.price)}
              </p>
              {product.compareAtPrice ? (
                <p className="mb-1 text-sm text-muted line-through">
                  {currencyFormatter.format(product.compareAtPrice)}
                </p>
              ) : null}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">
                Tamanhos
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                    key={`product-size-${product.id}-${size}`}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded border px-3 py-1 text-sm font-semibold transition-colors ${
                      isSelected
                        ? "border-secondary bg-secondary text-paper"
                        : "border-secondary/20 bg-primary-soft/25 text-secondary"
                    }`}
                  >
                    {size}
                  </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">
                Cores
              </p>
              <div className="mt-2 flex flex-wrap gap-2.5">
                {product.colors.map((color) => {
                  const isSelected = selectedColorName === color.name;
                  return (
                    <button
                    key={`product-color-${product.id}-${color.name}`}
                    type="button"
                    onClick={() => setSelectedColorName(color.name)}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors ${
                      isSelected
                        ? "border-secondary bg-primary-soft/40"
                        : "border-secondary/15"
                    }`}
                  >
                    <span
                      className="h-5 w-5 rounded-full border border-ink/10"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-sm text-ink">{color.name}</span>
                  </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-secondary/20 bg-primary-soft/20 p-4">
              <p className="text-sm text-ink">
                Status: {product.inStock ? "Disponivel em estoque" : "Esgotado"}
              </p>
              <p className="mt-1 text-xs text-muted">
                Checkout e carrinho serao conectados no backend.
              </p>
            </div>

            <div className="rounded-2xl border border-secondary/20 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">
                Quantidade
              </p>
              <div className="mt-2 inline-flex items-center rounded-full border border-secondary/20">
                <button
                  type="button"
                  onClick={() => setSelectedQuantity((current) => Math.max(1, current - 1))}
                  className="px-3 py-1.5 text-sm font-bold text-secondary"
                >
                  -
                </button>
                <span className="px-2 text-sm font-semibold text-ink">{selectedQuantity}</span>
                <button
                  type="button"
                  onClick={() => setSelectedQuantity((current) => current + 1)}
                  className="px-3 py-1.5 text-sm font-bold text-secondary"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const itemAdded = addCurrentSelectionToCart();
                  if (!itemAdded) {
                    return;
                  }

                  router.push("/cart");
                }}
                className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-secondary"
              >
                Adicionar ao carrinho
              </button>
              <button
                type="button"
                onClick={() => {
                  const itemAdded = addCurrentSelectionToCart();
                  if (!itemAdded) {
                    return;
                  }

                  router.push("/checkout");
                }}
                className="rounded-full border border-secondary/25 px-5 py-2.5 text-sm font-semibold text-secondary"
              >
                Comprar agora
              </button>
              <Link
                href="/products"
                prefetch={false}
                className="rounded-full border border-secondary/25 px-5 py-2.5 text-sm font-semibold text-secondary"
              >
                Voltar para listagem
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm sm:p-6">
            <p className="font-roboto text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Apresentacao do Produto
            </p>
            <h2 className="font-roboto mt-2 text-xl font-black uppercase tracking-[0.1em] text-ink">
              Essencia Aura em Movimento
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
              {presentationText}
            </p>
          </article>

          <article className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm sm:p-6">
            <p className="font-roboto text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Descricao e Detalhes
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
              {descriptionText}
            </p>

            <ul className="mt-4 space-y-2">
              {technicalHighlights.map((highlight, index) => (
                <li
                  key={`product-highlight-${product.id}-${index}`}
                  className="rounded-xl border border-secondary/15 bg-primary-soft/15 px-3 py-2 text-sm text-ink"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </article>
        </div>

        {products.length > 1 ? (
          <div className="mt-6 rounded-3xl border border-secondary/20 bg-white p-4 shadow-sm sm:p-5">
            <p className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
              Outros produtos
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {products
                .filter((item) => item.id !== product.id)
                .slice(0, 6)
                .map((item) => (
                  <Link
                    key={`related-${item.id}`}
                    href={buildProductHref(item.slug)}
                    prefetch={false}
                    className="rounded-full border border-secondary/25 px-3 py-1.5 text-xs font-semibold text-secondary transition-colors hover:bg-primary-soft/30"
                  >
                    {item.name}
                  </Link>
                ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
