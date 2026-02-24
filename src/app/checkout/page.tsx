"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { clearCart, getCartItemsCount, getCartSubtotal } from "@/lib/cart-store";
import {
  createCheckoutOrder,
  persistCheckoutOrder,
  type CheckoutPaymentMethod,
  type CheckoutShippingMethod,
} from "@/lib/checkout-store";
import { useCartStore } from "@/lib/use-cart-store";

type CheckoutFormState = {
  name: string;
  email: string;
  phone: string;
  document: string;
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
  notes: string;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const inputClassName =
  "w-full rounded-xl border border-secondary/20 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-secondary";

const initialFormState: CheckoutFormState = {
  name: "",
  email: "",
  phone: "",
  document: "",
  zipCode: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  complement: "",
  notes: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStore();

  const [formState, setFormState] = useState<CheckoutFormState>(initialFormState);
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>("pix");
  const [shippingMethod, setShippingMethod] = useState<CheckoutShippingMethod>("sedex");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const itemsCount = getCartItemsCount(cart);
  const subtotalAmount = getCartSubtotal(cart);

  const shippingAmount = useMemo(() => {
    if (subtotalAmount === 0) {
      return 0;
    }

    return shippingMethod === "sedex" ? 24.9 : 16.9;
  }, [shippingMethod, subtotalAmount]);

  const totalAmount = subtotalAmount + shippingAmount;

  const handleFormFieldChange = (field: keyof CheckoutFormState, value: string) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (cart.items.length === 0) {
      return "Seu carrinho esta vazio.";
    }

    if (!formState.name.trim()) {
      return "Informe o nome completo.";
    }

    if (!formState.email.trim()) {
      return "Informe o e-mail.";
    }

    if (!formState.phone.trim()) {
      return "Informe o telefone.";
    }

    if (!formState.zipCode.trim()) {
      return "Informe o CEP.";
    }

    if (!formState.street.trim() || !formState.number.trim()) {
      return "Informe endereco e numero.";
    }

    if (!formState.neighborhood.trim() || !formState.city.trim() || !formState.state.trim()) {
      return "Informe bairro, cidade e estado.";
    }

    return null;
  };

  const handleSubmitOrder = () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const order = createCheckoutOrder({
      cart,
      customer: {
        name: formState.name.trim(),
        email: formState.email.trim(),
        phone: formState.phone.trim(),
        document: formState.document.trim(),
      },
      address: {
        zipCode: formState.zipCode.trim(),
        street: formState.street.trim(),
        number: formState.number.trim(),
        neighborhood: formState.neighborhood.trim(),
        city: formState.city.trim(),
        state: formState.state.trim(),
        complement: formState.complement.trim(),
      },
      paymentMethod,
      shippingMethod,
      shippingAmount,
      notes: formState.notes.trim(),
    });

    persistCheckoutOrder(order);
    clearCart();

    router.push(`/checkout/success/${order.orderNumber}`);
  };

  return (
    <section className="relative py-8 pb-14">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_10%,rgba(255,255,255,0.72),transparent_35%),radial-gradient(circle_at_88%_82%,rgba(110,99,168,0.16),transparent_35%)]" />

      <div className="space-y-5">
        <header className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm md:p-7">
          <p className="font-roboto text-xs font-black uppercase tracking-[0.2em] text-secondary">
            FLUXO DE COMPRA
          </p>
          <h1 className="font-roboto mt-2 text-2xl font-black uppercase tracking-[0.08em] text-ink md:text-3xl">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-muted md:text-base">
            Preencha seus dados para concluir o pedido.
          </p>
        </header>

        {cart.items.length === 0 ? (
          <div className="rounded-3xl border border-secondary/20 bg-white p-8 text-center shadow-sm">
            <h2 className="font-roboto text-xl font-black uppercase tracking-[0.1em] text-secondary">
              Carrinho vazio
            </h2>
            <p className="mt-2 text-sm text-muted">
              Adicione produtos antes de seguir para o checkout.
            </p>
            <Link
              href="/products"
              prefetch={false}
              className="mt-5 inline-flex rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-paper"
            >
              Ir para produtos
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
              <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
                Dados para entrega
              </h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="checkout-name">
                    Nome completo
                  </label>
                  <input
                    id="checkout-name"
                    className={inputClassName}
                    value={formState.name}
                    onChange={(event) => handleFormFieldChange("name", event.target.value)}
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="checkout-email">
                    E-mail
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    className={inputClassName}
                    value={formState.email}
                    onChange={(event) => handleFormFieldChange("email", event.target.value)}
                    placeholder="voce@email.com"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="checkout-phone">
                    Telefone
                  </label>
                  <input
                    id="checkout-phone"
                    className={inputClassName}
                    value={formState.phone}
                    onChange={(event) => handleFormFieldChange("phone", event.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="checkout-document">
                    CPF (opcional)
                  </label>
                  <input
                    id="checkout-document"
                    className={inputClassName}
                    value={formState.document}
                    onChange={(event) => handleFormFieldChange("document", event.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="checkout-zip-code">
                    CEP
                  </label>
                  <input
                    id="checkout-zip-code"
                    className={inputClassName}
                    value={formState.zipCode}
                    onChange={(event) => handleFormFieldChange("zipCode", event.target.value)}
                    placeholder="00000-000"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="checkout-street">
                    Endereco
                  </label>
                  <input
                    id="checkout-street"
                    className={inputClassName}
                    value={formState.street}
                    onChange={(event) => handleFormFieldChange("street", event.target.value)}
                    placeholder="Rua, avenida..."
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="checkout-number">
                    Numero
                  </label>
                  <input
                    id="checkout-number"
                    className={inputClassName}
                    value={formState.number}
                    onChange={(event) => handleFormFieldChange("number", event.target.value)}
                    placeholder="123"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="checkout-complement">
                    Complemento
                  </label>
                  <input
                    id="checkout-complement"
                    className={inputClassName}
                    value={formState.complement}
                    onChange={(event) => handleFormFieldChange("complement", event.target.value)}
                    placeholder="Apto, bloco..."
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="checkout-neighborhood">
                    Bairro
                  </label>
                  <input
                    id="checkout-neighborhood"
                    className={inputClassName}
                    value={formState.neighborhood}
                    onChange={(event) =>
                      handleFormFieldChange("neighborhood", event.target.value)
                    }
                    placeholder="Seu bairro"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="checkout-city">
                    Cidade
                  </label>
                  <input
                    id="checkout-city"
                    className={inputClassName}
                    value={formState.city}
                    onChange={(event) => handleFormFieldChange("city", event.target.value)}
                    placeholder="Sua cidade"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="checkout-state">
                    Estado
                  </label>
                  <input
                    id="checkout-state"
                    className={inputClassName}
                    value={formState.state}
                    onChange={(event) => handleFormFieldChange("state", event.target.value)}
                    placeholder="RJ"
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-secondary/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                    Frete
                  </p>
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center gap-2 text-sm text-ink">
                      <input
                        type="radio"
                        name="shipping-method"
                        className="accent-secondary"
                        checked={shippingMethod === "sedex"}
                        onChange={() => setShippingMethod("sedex")}
                      />
                      SEDEX ({currencyFormatter.format(24.9)})
                    </label>
                    <label className="flex items-center gap-2 text-sm text-ink">
                      <input
                        type="radio"
                        name="shipping-method"
                        className="accent-secondary"
                        checked={shippingMethod === "pac"}
                        onChange={() => setShippingMethod("pac")}
                      />
                      PAC ({currencyFormatter.format(16.9)})
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl border border-secondary/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                    Pagamento
                  </p>
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center gap-2 text-sm text-ink">
                      <input
                        type="radio"
                        name="payment-method"
                        className="accent-secondary"
                        checked={paymentMethod === "pix"}
                        onChange={() => setPaymentMethod("pix")}
                      />
                      PIX
                    </label>
                    <label className="flex items-center gap-2 text-sm text-ink">
                      <input
                        type="radio"
                        name="payment-method"
                        className="accent-secondary"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                      />
                      Cartao
                    </label>
                    <label className="flex items-center gap-2 text-sm text-ink">
                      <input
                        type="radio"
                        name="payment-method"
                        className="accent-secondary"
                        checked={paymentMethod === "boleto"}
                        onChange={() => setPaymentMethod("boleto")}
                      />
                      Boleto
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="checkout-notes">
                  Observacoes (opcional)
                </label>
                <textarea
                  id="checkout-notes"
                  className={`${inputClassName} min-h-24 resize-y`}
                  value={formState.notes}
                  onChange={(event) => handleFormFieldChange("notes", event.target.value)}
                  placeholder="Informacoes adicionais para entrega"
                />
              </div>

              {errorMessage ? (
                <p className="mt-3 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {errorMessage}
                </p>
              ) : null}
            </section>

            <aside className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
              <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
                Resumo do pedido
              </h2>

              <div className="mt-3 space-y-2 border-b border-secondary/15 pb-3">
                {cart.items.map((item) => (
                  <p
                    key={`checkout-item-${item.id}`}
                    className="flex items-start justify-between gap-2 text-sm"
                  >
                    <span className="text-muted">
                      {item.quantity}x {item.productName}
                    </span>
                    <span className="font-semibold text-ink">
                      {currencyFormatter.format(item.unitPrice * item.quantity)}
                    </span>
                  </p>
                ))}
              </div>

              <div className="mt-3 space-y-2 text-sm">
                <p className="flex items-center justify-between">
                  <span className="text-muted">Itens ({itemsCount})</span>
                  <span className="font-semibold text-ink">
                    {currencyFormatter.format(subtotalAmount)}
                  </span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-muted">Frete</span>
                  <span className="font-semibold text-ink">
                    {currencyFormatter.format(shippingAmount)}
                  </span>
                </p>
                <p className="flex items-center justify-between border-t border-secondary/15 pt-2">
                  <span className="font-semibold text-ink">Total</span>
                  <span className="text-lg font-black text-secondary">
                    {currencyFormatter.format(totalAmount)}
                  </span>
                </p>
              </div>

              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitOrder}
                className="mt-5 w-full rounded-xl bg-ink px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Processando..." : "Confirmar pedido"}
              </button>

              <Link
                href="/cart"
                prefetch={false}
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-secondary/25 px-4 py-2 text-sm font-semibold text-secondary"
              >
                Voltar ao carrinho
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
