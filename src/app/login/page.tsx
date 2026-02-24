"use client";

import GoogleIcon from "@mui/icons-material/Google";
import Link from "next/link";
import {
  MotionReveal,
  MotionStagger,
  MotionStaggerItem,
} from "@/components/motion/Reveal";

const trustItems = [
  "Acesso rapido com conta Google",
  "Histórico de pedidos e favoritos",
  "Checkout mais agil no mobile",
];

export default function LoginPage() {
  return (
    <>
      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-secondary/15 bg-gradient-to-br from-paper via-accent/45 to-primary-soft/55 py-8 sm:py-10">
        <MotionReveal className="mx-auto w-full max-w-6xl px-3 sm:px-6 lg:px-8">
          <p className="font-roboto text-xs font-semibold tracking-[0.24em] text-secondary">
            SUA CONTA
          </p>
          <h1 className="font-roboto mt-2 text-2xl font-black uppercase tracking-[0.12em] text-ink sm:text-3xl md:text-5xl">
            Login
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
            Entre para acompanhar pedidos, acessar favoritos e ter uma
            experiencia mais rapida no catalogo.
          </p>
        </MotionReveal>
      </section>

      <section className="py-6 md:py-10">
        <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,1.1fr)] lg:gap-6">
          <MotionStagger
            className="rounded-3xl border border-secondary/20 bg-paper p-4 shadow-[0_12px_30px_rgba(11,11,15,0.08)] sm:p-5"
            staggerChildren={0.07}
          >
            <MotionStaggerItem>
              <h2 className="font-roboto text-lg font-black uppercase tracking-[0.08em] text-secondary sm:text-2xl">
                Bem-vinda de volta
              </h2>
            </MotionStaggerItem>
            <MotionStaggerItem>
              <p className="mt-2 text-sm text-muted">
                Seu ambiente Aura com foco em praticidade para compras e
                gerenciamento de conta.
              </p>
            </MotionStaggerItem>

            <MotionStagger className="mt-4 space-y-2" staggerChildren={0.05}>
              {trustItems.map((item) => (
                <MotionStaggerItem key={item} y={8} duration={0.28}>
                  <article className="rounded-xl border border-secondary/15 bg-primary-soft/20 px-3 py-2.5 text-sm text-ink">
                    {item}
                  </article>
                </MotionStaggerItem>
              ))}
            </MotionStagger>

            <MotionStaggerItem>
              <p className="mt-5 text-xs text-muted sm:text-sm">
                Ainda nao tem conta?{" "}
                <Link
                  href="/register"
                  prefetch={false}
                  className="font-bold text-secondary underline-offset-2 hover:underline"
                >
                  Criar cadastro
                </Link>
              </p>
            </MotionStaggerItem>
          </MotionStagger>

          <MotionReveal>
            <article className="rounded-3xl border border-secondary/20 bg-paper p-4 shadow-[0_14px_34px_rgba(11,11,15,0.1)] sm:p-5">
              <h2 className="font-roboto text-lg font-black uppercase tracking-[0.1em] text-secondary sm:text-2xl">
                Entrar
              </h2>
              <p className="mt-2 text-sm text-muted">
                Escolha seu metodo preferido para acessar.
              </p>

              <button
                type="button"
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-secondary/25 bg-paper text-sm font-bold text-ink transition-colors hover:bg-primary-soft/25"
              >
                <GoogleIcon fontSize="small" />
                <span>Continuar com Google</span>
              </button>

              <div className="my-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-secondary/20" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  ou com email
                </span>
                <span className="h-px flex-1 bg-secondary/20" />
              </div>

              <form className="space-y-3">
                <label className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                    E-mail
                  </span>
                  <input
                    required
                    type="email"
                    placeholder="voce@email.com"
                    className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-secondary">
                    Senha
                  </span>
                  <input
                    required
                    type="password"
                    placeholder="Sua senha"
                    className="h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  />
                </label>

                <div className="flex items-center justify-between pt-1">
                  <label className="inline-flex items-center gap-2 text-xs text-muted">
                    <input type="checkbox" className="accent-secondary" />
                    Lembrar de mim
                  </label>
                  <Link
                    href="/contact"
                    prefetch={false}
                    className="text-xs font-semibold text-secondary hover:underline"
                  >
                    Esqueci minha senha
                  </Link>
                </div>

                <button
                  type="submit"
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-secondary px-4 text-sm font-bold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-primary"
                >
                  Entrar
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-muted sm:text-sm">
                Novo por aqui?{" "}
                <Link
                  href="/register"
                  prefetch={false}
                  className="font-bold text-secondary underline-offset-2 hover:underline"
                >
                  Criar conta
                </Link>
              </p>
            </article>
          </MotionReveal>
        </div>
      </section>
    </>
  );
}
