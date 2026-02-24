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

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function CartPage() {
  const cart = useCartStore();

  const itemsCount = getCartItemsCount(cart);
  const subtotalAmount = getCartSubtotal(cart);
  const shippingEstimate = subtotalAmount >= 349 || subtotalAmount === 0 ? 0 : 19.9;
  const totalAmount = subtotalAmount + shippingEstimate;

  return (
    <section className="relative py-8 pb-14">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_8%,rgba(255,255,255,0.75),transparent_36%),radial-gradient(circle_at_88%_84%,rgba(110,99,168,0.16),transparent_34%)]" />

      <div className="space-y-5">
        <header className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm md:p-7">
          <p className="font-roboto text-xs font-black uppercase tracking-[0.2em] text-secondary">
            FLUXO DE COMPRA
          </p>
          <h1 className="font-roboto mt-2 text-2xl font-black uppercase tracking-[0.08em] text-ink md:text-3xl">
            Carrinho
          </h1>
          <p className="mt-2 text-sm text-muted md:text-base">
            Revise os itens antes de finalizar seu pedido.
          </p>
        </header>

        {cart.items.length === 0 ? (
          <div className="rounded-3xl border border-secondary/20 bg-white p-8 text-center shadow-sm">
            <h2 className="font-roboto text-xl font-black uppercase tracking-[0.1em] text-secondary">
              Seu carrinho esta vazio
            </h2>
            <p className="mt-2 text-sm text-muted">
              Adicione produtos para iniciar seu pedido.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <Link
                href="/products"
                prefetch={false}
                className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-paper"
              >
                Ir para produtos
              </Link>
              <Link
                href="/collections"
                prefetch={false}
                className="rounded-full border border-secondary/25 px-4 py-2 text-sm font-semibold text-secondary"
              >
                Ver colecoes
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
            <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
                  Itens no carrinho
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
                          <div className="inline-flex items-center rounded-full border border-secondary/20">
                            <button
                              type="button"
                              onClick={() =>
                                updateCartItemQuantity(item.id, item.quantity - 1)
                              }
                              className="px-3 py-1.5 text-sm font-bold text-secondary"
                            >
                              -
                            </button>
                            <span className="px-2 text-sm font-semibold text-ink">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateCartItemQuantity(item.id, item.quantity + 1)
                              }
                              className="px-3 py-1.5 text-sm font-bold text-secondary"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs font-semibold uppercase tracking-wide text-rose-700"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2.5">
                <Link
                  href="/products"
                  prefetch={false}
                  className="rounded-full border border-secondary/25 px-4 py-2 text-sm font-semibold text-secondary"
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

            <aside className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
              <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
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
                <p className="flex items-center justify-between border-t border-secondary/15 pt-2">
                  <span className="font-semibold text-ink">Total</span>
                  <span className="text-lg font-black text-secondary">
                    {currencyFormatter.format(totalAmount)}
                  </span>
                </p>
              </div>

              <Link
                href="/checkout"
                prefetch={false}
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-ink px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-secondary"
              >
                Finalizar compra
              </Link>

              <p className="mt-3 text-xs text-muted">
                Ambiente de checkout em modo demonstracao.
              </p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
