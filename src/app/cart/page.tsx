"use client";

import Link from "next/link";
import {
  clearCart,
  getCartItemsCount,
  getCartSubtotal,
  removeFromCart,
  updateCartItemQuantity,
} from "@/lib/cart-store";
import { buildProductHref } from "@/lib/storefront-catalog";
import { useCartStore } from "@/lib/use-cart-store";
import { useStorefrontCatalog } from "@/lib/use-storefront-catalog";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const FREE_SHIPPING_THRESHOLD = 349;

export default function CartPage() {
  const cart = useCartStore();
  const products = useStorefrontCatalog();

  const itemsCount = getCartItemsCount(cart);
  const subtotalAmount = getCartSubtotal(cart);
  const shippingEstimate = subtotalAmount >= FREE_SHIPPING_THRESHOLD || subtotalAmount === 0 ? 0 : 19.9;
  const totalAmount = subtotalAmount + shippingEstimate;

  const remainingToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalAmount);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotalAmount / FREE_SHIPPING_THRESHOLD) * 100),
  );
  const cartProductIds = new Set(cart.items.map((item) => item.productId));
  const combineWithProducts = products
    .filter((product) => !cartProductIds.has(product.id) && product.inStock)
    .slice(0, 3);

  return (
    <section className="relative py-8 pb-14">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_8%,rgba(255,255,255,0.75),transparent_36%),radial-gradient(circle_at_88%_84%,rgba(110,99,168,0.16),transparent_34%)]" />

      <div className="space-y-5">
        <header className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Finalizacao do pedido
          </p>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-[0.08em] text-ink md:text-3xl">
            Seu carrinho Aura
          </h1>
          <p className="mt-2 text-sm text-muted md:text-base">
            Revise produtos e total antes de seguir para a finalizacao.
          </p>
        </header>

        {cart.items.length === 0 ? (
          <div className="rounded-3xl border border-secondary/20 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-black uppercase tracking-[0.1em] text-secondary">
              Seu carrinho esta vazio
            </h2>
            <p className="mt-2 text-sm text-muted">
              Escolha suas pecas e volte para concluir o pedido.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <Link
                href="/products"
                prefetch={false}
                className="aura-cta aura-cta-explorar"
              >
                Ir para produtos
              </Link>
              <Link
                href="/collections"
                prefetch={false}
                className="aura-cta aura-cta-considerar"
              >
                Ver colecoes
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
              <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-black uppercase tracking-[0.16em] text-secondary">
                    Itens selecionados
                  </h2>
                  <span className="rounded-full border border-secondary/25 bg-primary-soft/35 px-2.5 py-1 text-xs font-semibold text-secondary">
                    {itemsCount} item(ns)
                  </span>
                </div>

                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-secondary/15 bg-paper/65 p-3"
                    >
                      <div className="flex gap-3">
                        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-secondary/15 bg-primary-soft/25">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <Link
                            href={buildProductHref(item.productSlug)}
                            prefetch={false}
                            className="line-clamp-2 text-sm font-semibold text-ink hover:text-secondary"
                          >
                            {item.productName}
                          </Link>
                          <p className="mt-1 text-xs text-muted">
                            Tam {item.size} | Cor {item.colorName}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-secondary">
                            {currencyFormatter.format(item.unitPrice)}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                            <div className="inline-flex items-center rounded-full border border-secondary/20 bg-white">
                              <button
                                type="button"
                                onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                className="px-3 py-1.5 text-sm font-bold text-secondary"
                                aria-label={`Diminuir quantidade de ${item.productName}`}
                              >
                                -
                              </button>
                              <span className="px-2 text-sm font-semibold text-ink">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-1.5 text-sm font-bold text-secondary"
                                aria-label={`Aumentar quantidade de ${item.productName}`}
                              >
                                +
                              </button>
                            </div>

                            <p className="text-sm font-black text-ink">
                              {currencyFormatter.format(item.unitPrice * item.quantity)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="mt-2 text-xs font-semibold uppercase tracking-wide text-rose-700"
                          >
                            Remover item
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Link
                    href="/products"
                    prefetch={false}
                    className="aura-cta aura-cta-explorar"
                  >
                    Continuar comprando
                  </Link>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700"
                  >
                    Limpar carrinho
                  </button>
                </div>
              </section>

              <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
                <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
                  <h2 className="text-sm font-black uppercase tracking-[0.16em] text-secondary">
                    Resumo do pedido
                  </h2>

                  <div className="mt-4 space-y-2 text-sm">
                    <p className="flex items-center justify-between">
                      <span className="text-muted">Subtotal</span>
                      <span className="font-semibold text-ink">
                        {currencyFormatter.format(subtotalAmount)}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-muted">Frete estimado</span>
                      <span className="font-semibold text-ink">
                        {shippingEstimate === 0
                          ? "Gratis"
                          : currencyFormatter.format(shippingEstimate)}
                      </span>
                    </p>
                    <p className="flex items-center justify-between text-xs text-muted">
                      <span>Entrega e rastreio</span>
                      <span>Informados após confirmação</span>
                    </p>
                    <p className="flex items-center justify-between border-t border-secondary/15 pt-2">
                      <span className="font-semibold text-ink">Total</span>
                      <span className="text-lg font-black text-secondary">
                        {currencyFormatter.format(totalAmount)}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 rounded-2xl border border-secondary/15 bg-primary-soft/20 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-secondary">
                      Faixa de frete
                    </p>
                    <p className="mt-1 text-sm text-ink">
                      {remainingToFreeShipping > 0
                        ? `Simulação atual: faltam ${currencyFormatter.format(remainingToFreeShipping)} para a faixa de frete configurada.`
                        : "Simulação atual dentro da faixa de frete configurada."}
                    </p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper">
                      <div
                        className="h-full rounded-full bg-secondary"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    prefetch={false}
                    className="mt-5 aura-cta aura-cta-comprar w-full py-2.5 text-sm"
                  >
                    Finalizar compra
                  </Link>
                </section>

                <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
                  <h3 className="text-xs font-black uppercase tracking-[0.16em] text-secondary">
                    Compra com confianca
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-ink">
                    <li className="rounded-xl border border-secondary/15 bg-primary-soft/15 px-3 py-2">
                      Politica de troca disponivel antes da confirmacao.
                    </li>
                    <li className="rounded-xl border border-secondary/15 bg-primary-soft/15 px-3 py-2">
                      Dados de entrega exibidos na finalizacao.
                    </li>
                    <li className="rounded-xl border border-secondary/15 bg-primary-soft/15 px-3 py-2">
                      Canais oficiais da marca para duvidas do pedido.
                    </li>
                  </ul>
                </section>
              </aside>
            </div>

            {combineWithProducts.length > 0 ? (
              <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-black uppercase tracking-[0.16em] text-secondary">
                    Combine com
                  </h2>
                  <Link
                    href="/products"
                    prefetch={false}
                    className="text-xs font-semibold uppercase tracking-[0.08em] text-secondary hover:underline"
                  >
                    Ver mais produtos
                  </Link>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {combineWithProducts.map((product) => (
                    <article
                      key={`combine-${product.id}`}
                      className="rounded-2xl border border-secondary/15 bg-paper/65 p-3"
                    >
                      <div className="h-36 overflow-hidden rounded-xl border border-secondary/15 bg-primary-soft/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image.url}
                          alt={product.image.alt}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-ink">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm font-black text-secondary">
                        {currencyFormatter.format(product.price)}
                      </p>
                      <Link
                        href={buildProductHref(product.slug)}
                        prefetch={false}
                        className="mt-3 aura-cta aura-cta-considerar w-full text-xs"
                      >
                        Ver produto
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
