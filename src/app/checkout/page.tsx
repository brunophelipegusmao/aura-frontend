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

type CheckoutField = keyof CheckoutFormState;

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const baseInputClassName =
  "w-full rounded-xl border px-3 py-2 text-sm text-ink outline-none transition";

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

const requiredFields: CheckoutField[] = [
  "name",
  "email",
  "phone",
  "zipCode",
  "street",
  "number",
  "neighborhood",
  "city",
  "state",
];

const stepLabels = ["Contato", "Entrega", "Pagamento", "Revisao"];

const getOnlyDigits = (value: string) => value.replace(/\D/g, "");

const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStore();

  const [formState, setFormState] = useState<CheckoutFormState>(initialFormState);
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>("pix");
  const [shippingMethod, setShippingMethod] = useState<CheckoutShippingMethod>("sedex");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<CheckoutField, boolean>>>(
    {},
  );

  const itemsCount = getCartItemsCount(cart);
  const subtotalAmount = getCartSubtotal(cart);

  const shippingAmount = useMemo(() => {
    if (subtotalAmount === 0) {
      return 0;
    }

    return shippingMethod === "sedex" ? 24.9 : 16.9;
  }, [shippingMethod, subtotalAmount]);

  const totalAmount = subtotalAmount + shippingAmount;

  const fieldErrors = useMemo<Record<CheckoutField, string | null>>(() => {
    const zipDigits = getOnlyDigits(formState.zipCode);
    const phoneDigits = getOnlyDigits(formState.phone);

    return {
      name: formState.name.trim() ? null : "Informe seu nome completo.",
      email: isValidEmail(formState.email.trim()) ? null : "Informe um e-mail valido.",
      phone:
        phoneDigits.length >= 10
          ? null
          : "Informe um telefone com DDD.",
      document: null,
      zipCode: zipDigits.length === 8 ? null : "Informe um CEP valido com 8 digitos.",
      street: formState.street.trim() ? null : "Informe a rua ou avenida.",
      number: formState.number.trim() ? null : "Informe o numero do endereco.",
      neighborhood: formState.neighborhood.trim() ? null : "Informe o bairro.",
      city: formState.city.trim() ? null : "Informe a cidade.",
      state:
        formState.state.trim().length >= 2
          ? null
          : "Informe a UF com 2 letras.",
      complement: null,
      notes: null,
    };
  }, [formState]);

  const handleFormFieldChange = (field: CheckoutField, value: string) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));

    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const markFieldAsTouched = (field: CheckoutField) => {
    setTouchedFields((current) => ({
      ...current,
      [field]: true,
    }));
  };

  const getFieldError = (field: CheckoutField) => {
    const shouldShowError = submitAttempted || touchedFields[field];
    if (!shouldShowError) {
      return null;
    }

    return fieldErrors[field];
  };

  const getInputClassName = (field: CheckoutField) => {
    const hasError = !!getFieldError(field);

    return `${baseInputClassName} ${
      hasError
        ? "border-rose-300 bg-rose-50/70 focus:border-rose-500"
        : "border-secondary/20 bg-white focus:border-secondary"
    }`;
  };

  const handleSubmitOrder = () => {
    setSubmitAttempted(true);
    setTouchedFields(
      requiredFields.reduce<Partial<Record<CheckoutField, boolean>>>((accumulator, field) => {
        accumulator[field] = true;
        return accumulator;
      }, {}),
    );

    if (cart.items.length === 0) {
      setErrorMessage("Seu carrinho esta vazio.");
      return;
    }

    const firstValidationError = requiredFields
      .map((field) => fieldErrors[field])
      .find((message) => !!message);

    if (firstValidationError) {
      setErrorMessage(firstValidationError);
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
        state: formState.state.trim().toUpperCase(),
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Finalizacao do pedido
          </p>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-[0.08em] text-ink md:text-3xl">
            Checkout Aura
          </h1>
          <p className="mt-2 text-sm text-muted md:text-base">
            Preencha seus dados para confirmar pagamento, entrega e revisao final do pedido.
          </p>

          <ol className="mt-4 grid gap-2 sm:grid-cols-4">
            {stepLabels.map((label, index) => (
              <li
                key={`checkout-step-${label}`}
                className="rounded-xl border border-secondary/20 bg-primary-soft/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-secondary"
              >
                {index + 1}. {label}
              </li>
            ))}
          </ol>
        </header>

        {cart.items.length === 0 ? (
          <div className="rounded-3xl border border-secondary/20 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-black uppercase tracking-[0.1em] text-secondary">
              Carrinho vazio
            </h2>
            <p className="mt-2 text-sm text-muted">
              Adicione produtos antes de seguir para o checkout.
            </p>
            <Link
              href="/products"
              prefetch={false}
              className="mt-5 aura-cta aura-cta-explorar"
            >
              Ir para produtos
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <section className="space-y-4 rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm md:p-6">
              <article className="rounded-2xl border border-secondary/15 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-secondary">
                  1. Contato
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted"
                      htmlFor="checkout-name"
                    >
                      Nome completo
                    </label>
                    <input
                      id="checkout-name"
                      className={getInputClassName("name")}
                      value={formState.name}
                      onChange={(event) => handleFormFieldChange("name", event.target.value)}
                      onBlur={() => markFieldAsTouched("name")}
                      placeholder="Seu nome"
                    />
                    {getFieldError("name") ? (
                      <p className="mt-1 text-xs font-medium text-rose-700">{getFieldError("name")}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted"
                      htmlFor="checkout-email"
                    >
                      E-mail
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      className={getInputClassName("email")}
                      value={formState.email}
                      onChange={(event) => handleFormFieldChange("email", event.target.value)}
                      onBlur={() => markFieldAsTouched("email")}
                      placeholder="voce@email.com"
                    />
                    {getFieldError("email") ? (
                      <p className="mt-1 text-xs font-medium text-rose-700">{getFieldError("email")}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted"
                      htmlFor="checkout-phone"
                    >
                      Telefone
                    </label>
                    <input
                      id="checkout-phone"
                      className={getInputClassName("phone")}
                      value={formState.phone}
                      onChange={(event) => handleFormFieldChange("phone", event.target.value)}
                      onBlur={() => markFieldAsTouched("phone")}
                      placeholder="(00) 00000-0000"
                    />
                    {getFieldError("phone") ? (
                      <p className="mt-1 text-xs font-medium text-rose-700">{getFieldError("phone")}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted"
                      htmlFor="checkout-document"
                    >
                      CPF (opcional)
                    </label>
                    <input
                      id="checkout-document"
                      className={getInputClassName("document")}
                      value={formState.document}
                      onChange={(event) => handleFormFieldChange("document", event.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-secondary/15 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-secondary">
                  2. Endereco de entrega
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted"
                      htmlFor="checkout-zip-code"
                    >
                      CEP
                    </label>
                    <input
                      id="checkout-zip-code"
                      className={getInputClassName("zipCode")}
                      value={formState.zipCode}
                      onChange={(event) => handleFormFieldChange("zipCode", event.target.value)}
                      onBlur={() => markFieldAsTouched("zipCode")}
                      placeholder="00000-000"
                    />
                    {getFieldError("zipCode") ? (
                      <p className="mt-1 text-xs font-medium text-rose-700">{getFieldError("zipCode")}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted"
                      htmlFor="checkout-state"
                    >
                      Estado (UF)
                    </label>
                    <input
                      id="checkout-state"
                      className={getInputClassName("state")}
                      value={formState.state}
                      onChange={(event) => handleFormFieldChange("state", event.target.value)}
                      onBlur={() => markFieldAsTouched("state")}
                      placeholder="RJ"
                    />
                    {getFieldError("state") ? (
                      <p className="mt-1 text-xs font-medium text-rose-700">{getFieldError("state")}</p>
                    ) : null}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted"
                      htmlFor="checkout-street"
                    >
                      Endereco
                    </label>
                    <input
                      id="checkout-street"
                      className={getInputClassName("street")}
                      value={formState.street}
                      onChange={(event) => handleFormFieldChange("street", event.target.value)}
                      onBlur={() => markFieldAsTouched("street")}
                      placeholder="Rua, avenida..."
                    />
                    {getFieldError("street") ? (
                      <p className="mt-1 text-xs font-medium text-rose-700">{getFieldError("street")}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted"
                      htmlFor="checkout-number"
                    >
                      Numero
                    </label>
                    <input
                      id="checkout-number"
                      className={getInputClassName("number")}
                      value={formState.number}
                      onChange={(event) => handleFormFieldChange("number", event.target.value)}
                      onBlur={() => markFieldAsTouched("number")}
                      placeholder="123"
                    />
                    {getFieldError("number") ? (
                      <p className="mt-1 text-xs font-medium text-rose-700">{getFieldError("number")}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted"
                      htmlFor="checkout-complement"
                    >
                      Complemento (opcional)
                    </label>
                    <input
                      id="checkout-complement"
                      className={getInputClassName("complement")}
                      value={formState.complement}
                      onChange={(event) => handleFormFieldChange("complement", event.target.value)}
                      placeholder="Apto, bloco..."
                    />
                  </div>

                  <div>
                    <label
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted"
                      htmlFor="checkout-neighborhood"
                    >
                      Bairro
                    </label>
                    <input
                      id="checkout-neighborhood"
                      className={getInputClassName("neighborhood")}
                      value={formState.neighborhood}
                      onChange={(event) =>
                        handleFormFieldChange("neighborhood", event.target.value)
                      }
                      onBlur={() => markFieldAsTouched("neighborhood")}
                      placeholder="Seu bairro"
                    />
                    {getFieldError("neighborhood") ? (
                      <p className="mt-1 text-xs font-medium text-rose-700">
                        {getFieldError("neighborhood")}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted"
                      htmlFor="checkout-city"
                    >
                      Cidade
                    </label>
                    <input
                      id="checkout-city"
                      className={getInputClassName("city")}
                      value={formState.city}
                      onChange={(event) => handleFormFieldChange("city", event.target.value)}
                      onBlur={() => markFieldAsTouched("city")}
                      placeholder="Sua cidade"
                    />
                    {getFieldError("city") ? (
                      <p className="mt-1 text-xs font-medium text-rose-700">{getFieldError("city")}</p>
                    ) : null}
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-secondary/15 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-secondary">
                  3. Entrega e pagamento
                </p>

                <div className="mt-3 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-secondary/15 bg-primary-soft/15 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                      Frete
                    </p>
                    <div className="mt-3 space-y-2">
                      <label className="flex items-start gap-2 text-sm text-ink">
                        <input
                          type="radio"
                          name="shipping-method"
                          className="mt-0.5 accent-secondary"
                          checked={shippingMethod === "sedex"}
                          onChange={() => setShippingMethod("sedex")}
                        />
                        <span>
                          SEDEX ({currencyFormatter.format(24.9)})
                          <span className="mt-0.5 block text-xs text-muted">
                            Prazo informado após confirmação
                          </span>
                        </span>
                      </label>
                      <label className="flex items-start gap-2 text-sm text-ink">
                        <input
                          type="radio"
                          name="shipping-method"
                          className="mt-0.5 accent-secondary"
                          checked={shippingMethod === "pac"}
                          onChange={() => setShippingMethod("pac")}
                        />
                        <span>
                          PAC ({currencyFormatter.format(16.9)})
                          <span className="mt-0.5 block text-xs text-muted">
                            Prazo informado após confirmação
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-secondary/15 bg-primary-soft/15 p-3">
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
              </article>

              <article className="rounded-2xl border border-secondary/15 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-secondary">
                  4. Observacoes
                </p>
                <div className="mt-3">
                  <label
                    className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted"
                    htmlFor="checkout-notes"
                  >
                    Instrucoes para entrega (opcional)
                  </label>
                  <textarea
                    id="checkout-notes"
                    className={`${getInputClassName("notes")} min-h-24 resize-y`}
                    value={formState.notes}
                    onChange={(event) => handleFormFieldChange("notes", event.target.value)}
                    placeholder="Informacoes adicionais para facilitar a entrega"
                  />
                </div>
              </article>

              {errorMessage ? (
                <p className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {errorMessage}
                </p>
              ) : null}
            </section>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
              <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-secondary">
                  Resumo do pedido
                </h2>

                <div className="mt-3 max-h-52 space-y-2 overflow-auto border-b border-secondary/15 pb-3 pr-1">
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

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitOrder}
                  className="mt-5 aura-cta aura-cta-comprar w-full py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Confirmando pedido..." : "Confirmar pedido"}
                </button>

                <Link
                  href="/cart"
                  prefetch={false}
                  className="mt-2 aura-cta aura-cta-considerar w-full text-sm"
                >
                  Voltar ao carrinho
                </Link>
              </section>

              <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-[0.16em] text-secondary">
                  Seguranca e confianca
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-ink">
                  <li className="rounded-xl border border-secondary/15 bg-primary-soft/15 px-3 py-2">
                    Revise seus dados antes de confirmar o pedido.
                  </li>
                  <li className="rounded-xl border border-secondary/15 bg-primary-soft/15 px-3 py-2">
                    Politica de troca disponivel para consulta no atendimento.
                  </li>
                  <li className="rounded-xl border border-secondary/15 bg-primary-soft/15 px-3 py-2">
                    Canais oficiais da marca para duvidas do pedido.
                  </li>
                </ul>
              </section>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
