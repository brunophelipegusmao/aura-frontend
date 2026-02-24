"use client";

import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  MotionReveal,
  MotionStagger,
  MotionStaggerItem,
} from "@/components/motion/Reveal";
import { useState, type ChangeEvent, type FormEvent } from "react";

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialForm: ContactForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const contactChannels = [
  {
    title: "WhatsApp",
    detail: "(22) 99895-9800",
    helper: "Atendimento rapido para pedidos e duvidas",
    href: "https://wa.me/5522998959800",
    icon: WhatsAppIcon,
  },
  {
    title: "E-mail",
    detail: "contato@auraactivewear.com.br",
    helper: "Retorno em ate 1 dia util",
    href: "mailto:contato@auraactivewear.com.br",
    icon: EmailRoundedIcon,
  },
  {
    title: "Telefone",
    detail: "(22) 99895-9800",
    helper: "Seg a Sex, de 09h as 18h",
    href: "tel:+5522998959800",
    icon: PhoneRoundedIcon,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onChangeField =
    (field: keyof ContactForm) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setSent(false);
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setSent(true);
      setForm(initialForm);
    }, 700);
  };

  return (
    <>
      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-secondary/15 bg-gradient-to-br from-paper via-accent/45 to-primary-soft/55 py-8 sm:py-10">
        <MotionReveal className="mx-auto w-full max-w-6xl px-3 sm:px-6 lg:px-8">
          <p className="font-roboto text-xs font-semibold tracking-[0.24em] text-secondary">
            CONTATO
          </p>
          <h1 className="font-roboto mt-2 text-2xl font-black uppercase tracking-[0.12em] text-ink sm:text-3xl md:text-5xl">
            Fale com a Aura
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
            Estamos prontas para te ajudar com pedidos, trocas, revenda e
            suporte geral.
          </p>
        </MotionReveal>
      </section>

      <section className="py-6 md:py-10">
        <MotionStagger
          className="grid gap-3 sm:gap-4 lg:grid-cols-3"
          staggerChildren={0.07}
        >
          {contactChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <MotionStaggerItem key={channel.title}>
                <a
                  href={channel.href}
                  className="block h-full rounded-2xl border border-secondary/20 bg-paper p-4 shadow-[0_8px_20px_rgba(11,11,15,0.08)] outline-none transition-colors hover:bg-primary-soft/20 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/12 text-secondary">
                      <Icon fontSize="small" />
                    </span>
                    <p className="text-sm font-black text-secondary">
                      {channel.title}
                    </p>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink">
                    {channel.detail}
                  </p>
                  <p className="mt-1 text-xs text-muted">{channel.helper}</p>
                </a>
              </MotionStaggerItem>
            );
          })}
        </MotionStagger>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_minmax(0,1fr)] lg:gap-6">
          <MotionReveal>
            <article className="rounded-3xl border border-secondary/20 bg-paper p-4 shadow-[0_14px_34px_rgba(11,11,15,0.1)] sm:p-5">
              <h2 className="font-roboto text-lg font-black uppercase tracking-[0.1em] text-secondary sm:text-2xl">
                Envie sua mensagem
              </h2>
              <p className="mt-2 text-sm text-muted">
                Preencha os dados abaixo e retornaremos o mais rapido possivel.
              </p>

              <form className="mt-4 space-y-3" onSubmit={onSubmit}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                      Nome
                    </span>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={onChangeField("name")}
                      placeholder="Seu nome"
                      className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                      E-mail
                    </span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={onChangeField("email")}
                      placeholder="voce@email.com"
                      className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                      Telefone
                    </span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={onChangeField("phone")}
                      placeholder="(00) 00000-0000"
                      className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                      Assunto
                    </span>
                    <select
                      required
                      value={form.subject}
                      onChange={onChangeField("subject")}
                      className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                    >
                      <option value="">Selecione</option>
                      <option value="pedido">Pedido</option>
                      <option value="troca">Troca e devolucao</option>
                      <option value="revenda">Revenda</option>
                      <option value="outro">Outro assunto</option>
                    </select>
                  </label>
                </div>

                <label className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                    Mensagem
                  </span>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={onChangeField("message")}
                    placeholder="Como podemos ajudar?"
                    className="w-full rounded-xl border border-secondary/25 bg-paper px-3 py-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-secondary px-4 text-sm font-bold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-48"
                >
                  {isSubmitting ? "Enviando..." : "Enviar mensagem"}
                </button>
              </form>

              {sent ? (
                <p className="mt-3 rounded-xl border border-secondary/25 bg-primary-soft/25 px-3 py-2 text-sm text-secondary">
                  Mensagem enviada com sucesso. Nosso time vai te responder em
                  breve.
                </p>
              ) : null}
            </article>
          </MotionReveal>

          <MotionStagger className="space-y-4" staggerChildren={0.07}>
            <MotionStaggerItem>
              <article className="rounded-3xl border border-secondary/20 bg-paper p-4 shadow-[0_10px_24px_rgba(11,11,15,0.08)] sm:p-5">
                <h3 className="font-roboto text-sm font-black uppercase tracking-[0.12em] text-secondary">
                  Informacoes
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-muted">
                  <li className="flex items-start gap-2">
                    <AccessTimeRoundedIcon
                      fontSize="small"
                      className="mt-0.5 text-secondary"
                    />
                    <span>Segunda a sexta, das 09h as 18h.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <LocationOnRoundedIcon
                      fontSize="small"
                      className="mt-0.5 text-secondary"
                    />
                    <span>Atendimento online para todo o Brasil.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <EmailRoundedIcon
                      fontSize="small"
                      className="mt-0.5 text-secondary"
                    />
                    <span>contato@auraactivewear.com.br</span>
                  </li>
                </ul>
              </article>
            </MotionStaggerItem>

            <MotionStaggerItem>
              <article className="rounded-3xl border border-secondary/20 bg-paper p-4 shadow-[0_10px_24px_rgba(11,11,15,0.08)] sm:p-5">
                <h3 className="font-roboto text-sm font-black uppercase tracking-[0.12em] text-secondary">
                  Duvidas frequentes
                </h3>
                <div className="mt-3 space-y-2">
                  <details className="rounded-xl border border-secondary/15 bg-primary-soft/20 p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-ink">
                      Qual o prazo de resposta?
                    </summary>
                    <p className="mt-1 text-xs text-muted sm:text-sm">
                      Nosso tempo medio de resposta e de ate 1 dia util.
                    </p>
                  </details>
                  <details className="rounded-xl border border-secondary/15 bg-primary-soft/20 p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-ink">
                      Voces atendem revendedoras?
                    </summary>
                    <p className="mt-1 text-xs text-muted sm:text-sm">
                      Sim, temos condicoes especiais para revenda.
                    </p>
                  </details>
                  <details className="rounded-xl border border-secondary/15 bg-primary-soft/20 p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-ink">
                      Como solicitar troca?
                    </summary>
                    <p className="mt-1 text-xs text-muted sm:text-sm">
                      Fale com nosso suporte via WhatsApp com o numero do
                      pedido.
                    </p>
                  </details>
                </div>
              </article>
            </MotionStaggerItem>
          </MotionStagger>
        </div>
      </section>
    </>
  );
}
