"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  getCheckoutOrderByNumber,
} from "@/lib/checkout-store";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
  timeStyle: "short",
});

const paymentLabelMap: Record<string, string> = {
  pix: "PIX",
  card: "Cartao",
  boleto: "Boleto",
};

const shippingLabelMap: Record<string, string> = {
  sedex: "SEDEX",
  pac: "PAC",
};

export default function CheckoutSuccessPage() {
  const params = useParams<{ orderNumber: string }>();
  const order = useMemo(() => {
    return getCheckoutOrderByNumber(params.orderNumber);
  }, [params.orderNumber]);

  if (!order) {
    return (
      <section className="py-10">
        <div className="rounded-3xl border border-secondary/20 bg-white p-8 text-center shadow-sm">
          <p className="font-roboto text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Pedido
          </p>
          <h1 className="font-roboto mt-2 text-2xl font-black uppercase tracking-[0.12em] text-ink">
            Pedido nao encontrado
          </h1>
          <p className="mt-3 text-sm text-muted">
            Nao foi possivel localizar esse pedido no armazenamento local.
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
              Ver pedidos no admin
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-8 pb-14">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_12%,rgba(255,255,255,0.75),transparent_38%),radial-gradient(circle_at_85%_80%,rgba(110,99,168,0.16),transparent_34%)]" />

      <div className="space-y-5">
        <header className="rounded-3xl border border-emerald-300 bg-emerald-50 p-5 shadow-sm md:p-7">
          <p className="font-roboto text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
            PEDIDO CONFIRMADO
          </p>
          <h1 className="font-roboto mt-2 text-2xl font-black uppercase tracking-[0.08em] text-emerald-800 md:text-3xl">
            Obrigado por comprar na Aura
          </h1>
          <p className="mt-2 text-sm text-emerald-700 md:text-base">
            Pedido #{order.orderNumber} criado em {dateFormatter.format(new Date(order.createdAt))}.
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
            <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
              Itens do pedido
            </h2>

            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <article
                  key={`success-item-${item.id}`}
                  className="rounded-2xl border border-secondary/15 p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">{item.productName}</p>
                      <p className="mt-1 text-xs text-muted">
                        Tam {item.size} | Cor {item.colorName}
                      </p>
                      <p className="mt-1 text-xs text-muted">Quantidade: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-secondary">
                      {currencyFormatter.format(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
              <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
                Dados do cliente
              </h2>
              <p className="mt-3 text-sm text-ink">{order.customer.name}</p>
              <p className="text-sm text-muted">{order.customer.email}</p>
              <p className="text-sm text-muted">{order.customer.phone}</p>
            </section>

            <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
              <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
                Entrega e pagamento
              </h2>
              <p className="mt-3 text-sm text-ink">
                {order.address.street}, {order.address.number}
              </p>
              <p className="text-sm text-muted">
                {order.address.neighborhood} - {order.address.city}/{order.address.state}
              </p>
              <p className="text-sm text-muted">CEP {order.address.zipCode}</p>
              {order.address.complement ? (
                <p className="text-sm text-muted">Comp.: {order.address.complement}</p>
              ) : null}

              <p className="mt-3 text-sm text-ink">
                Frete: {shippingLabelMap[order.shippingMethod] ?? order.shippingMethod}
              </p>
              <p className="text-sm text-ink">
                Pagamento: {paymentLabelMap[order.paymentMethod] ?? order.paymentMethod}
              </p>
            </section>

            <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
              <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
                Total
              </h2>
              <p className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold text-ink">
                  {currencyFormatter.format(order.subtotalAmount)}
                </span>
              </p>
              <p className="mt-1 flex items-center justify-between text-sm">
                <span className="text-muted">Frete</span>
                <span className="font-semibold text-ink">
                  {currencyFormatter.format(order.shippingAmount)}
                </span>
              </p>
              <p className="mt-2 flex items-center justify-between border-t border-secondary/15 pt-2 text-sm">
                <span className="font-semibold text-ink">Total</span>
                <span className="text-lg font-black text-secondary">
                  {currencyFormatter.format(order.totalAmount)}
                </span>
              </p>
            </section>
          </aside>
        </div>

        <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/products"
              prefetch={false}
              className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-paper"
            >
              Continuar comprando
            </Link>
            <Link
              href="/admin"
              prefetch={false}
              className="rounded-full border border-secondary/25 px-4 py-2 text-sm font-semibold text-secondary"
            >
              Ver pedido no admin
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
