import Link from "next/link";
import Caroussel from "@/components/Caroussel";
import { ProductCarousel } from "@/components/ProductCarousel";
import { CategoryCard } from "@/components/CategoryCard";
import {
  MotionReveal,
  MotionStagger,
  MotionStaggerItem,
} from "@/components/motion/Reveal";

export default function Home() {
  const categories = [
    {
      id: "tops",
      imageUrl:
        "/Products/WhatsApp%20Image%202026-02-09%20at%2018.19.48%20(1).jpeg",
      alt: "Categoria Tops",
      title: "TOPS",
      subtitle: "Sustentacao firme e conforto para treino de media a alta intensidade.",
      ctaLabel: "Ver tops",
      href: `/products?category=${encodeURIComponent("Top")}`,
    },
    {
      id: "leggings",
      imageUrl: "/Products/WhatsApp%20Image%202026-02-09%20at%2018.19.48.jpeg",
      alt: "Categoria Leggings",
      title: "LEGGINGS",
      subtitle: "Compressao na medida certa para modelar e acompanhar cada movimento.",
      ctaLabel: "Ver leggings",
      href: `/products?category=${encodeURIComponent("Legging")}`,
    },
    {
      id: "shorts",
      imageUrl: "/Products/WhatsApp%20Image%202026-02-09%20at%2018.19.49.jpeg",
      alt: "Categoria Shorts",
      title: "SHORTS",
      subtitle: "Leves, funcionais e versateis para treinos e rotina fora da academia.",
      ctaLabel: "Ver shorts",
      href: `/products?category=${encodeURIComponent("Short")}`,
    },
    {
      id: "macacoes",
      imageUrl: "/Products/WhatsApp%20Image%202026-02-05%20at%2015.22.07.jpeg",
      alt: "Categoria Macacões e Macaquinhos",
      title: "MACACÕES",
      subtitle: "Pecas statement com modelagem premium para treinar com presenca.",
      ctaLabel: "Ver macacões",
      href: `/products?category=${encodeURIComponent("Macacão")}`,
    },
  ];

  return (
    <>
      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-secondary/15 bg-gradient-to-br from-paper via-accent/45 to-primary-soft/55">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.78),transparent_40%),radial-gradient(circle_at_85%_78%,rgba(110,99,168,0.16),transparent_40%)]" />

        <div className="mx-auto grid w-full max-w-[1520px] items-center gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-10 lg:px-10 lg:py-12 2xl:px-12">
          <MotionReveal amount={0.12}>
            <p className="font-roboto text-xs font-semibold tracking-[0.24em] text-secondary">
              AURA ACTIVEWEAR
            </p>
            <h1 className="font-roboto mt-2 text-3xl font-black uppercase leading-[1.08] tracking-[0.08em] text-ink sm:text-4xl lg:text-5xl">
              Moda fitness premium para mulheres que treinam com atitude
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              Modelagem que valoriza o corpo, tecidos confortáveis de alta
              performance e design forte para acompanhar seu ritmo no treino e
              fora dele.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/products"
                prefetch={false}
                className="aura-cta aura-cta-comprar"
              >
                Comprar agora
              </Link>
              <Link
                href="/collections"
                prefetch={false}
                className="aura-cta aura-cta-explorar"
              >
                Ver coleções
              </Link>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <div className="rounded-full border border-secondary/20 bg-paper/85 px-3 py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-secondary">
                Condições de frete no checkout
              </div>
              <div className="rounded-full border border-secondary/20 bg-paper/85 px-3 py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-secondary">
                Política de troca disponível
              </div>
              <div className="rounded-full border border-secondary/20 bg-paper/85 px-3 py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-secondary">
                Modelagem premium
              </div>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.06} amount={0.2}>
            <div className="overflow-hidden rounded-3xl border border-secondary/20 bg-paper shadow-[0_18px_40px_rgba(11,11,15,0.16)]">
              <Caroussel
                fullWidth={false}
                interval={4200}
                showSideClickNavigation={false}
                mediaHeight={{ xs: 320, sm: 420, md: 520 }}
              />
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="py-12 md:py-14">
        <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-10 2xl:px-12">
          <MotionReveal amount={0.1}>
            <p className="font-roboto text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
              Qualidade e modelagem
            </p>
            <h2 className="font-roboto mt-2 text-2xl font-black uppercase tracking-[0.1em] text-ink sm:text-3xl md:text-4xl">
              Conforto e presença para rotina de treino real
            </h2>
          </MotionReveal>

          <MotionStagger
            className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            staggerChildren={0.05}
            amount={0.2}
          >
            <MotionStaggerItem>
              <article className="rounded-2xl border border-secondary/20 bg-paper p-4 shadow-[0_10px_24px_rgba(11,11,15,0.08)]">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-secondary">
                  Sustentação
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Modelagens com firmeza para acompanhar treino funcional, força
                  e cardio sem desconforto.
                </p>
              </article>
            </MotionStaggerItem>

            <MotionStaggerItem>
              <article className="rounded-2xl border border-secondary/20 bg-paper p-4 shadow-[0_10px_24px_rgba(11,11,15,0.08)]">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-secondary">
                  Acabamento premium
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Tecidos com toque macio, recortes estratégicos e construção
                  pensada para uso frequente.
                </p>
              </article>
            </MotionStaggerItem>

            <MotionStaggerItem>
              <article className="rounded-2xl border border-secondary/20 bg-paper p-4 shadow-[0_10px_24px_rgba(11,11,15,0.08)]">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-secondary">
                  Compra com apoio
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Canal de atendimento para dúvidas de tamanho, modelagem e
                  escolha de peças.
                </p>
              </article>
            </MotionStaggerItem>
          </MotionStagger>
        </div>
      </section>

      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-white py-14">
        <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-10 2xl:px-12">
          <MotionReveal amount={0.1}>
            <p className="font-roboto text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
              Destaque de coleção
            </p>
            <h2 className="font-roboto mt-2 text-2xl font-black uppercase tracking-[0.1em] text-ink sm:text-3xl md:text-4xl">
              Compre por categoria
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
              Encontre rapidamente o que combina com seu tipo de treino e com o
              visual que você quer construir.
            </p>
          </MotionReveal>

          <div className="mt-7 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                imageUrl={category.imageUrl}
                alt={category.alt}
                title={category.title}
                subtitle={category.subtitle}
                ctaLabel={category.ctaLabel}
                href={category.href}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-14">
        <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-10 2xl:px-12">
          <MotionReveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-roboto text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
                Produtos em destaque
              </p>
              <h2 className="font-roboto mt-2 text-2xl font-black uppercase tracking-[0.1em] text-ink sm:text-3xl md:text-4xl">
                Curadoria para compra rápida
              </h2>
            </div>
            <Link
              href="/products"
              prefetch={false}
              className="aura-cta aura-cta-explorar"
            >
              Ver catálogo completo
            </Link>
          </MotionReveal>

          <div className="mt-6">
            <ProductCarousel interval={3200} />
          </div>
        </div>
      </section>

      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-paper py-14">
        <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-10 2xl:px-12">
          <MotionReveal amount={0.1}>
            <p className="font-roboto text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
              Prova social
            </p>
            <h2 className="font-roboto mt-2 text-2xl font-black uppercase tracking-[0.1em] text-ink sm:text-3xl md:text-4xl">
              O que mais ouvimos da comunidade Aura
            </h2>
          </MotionReveal>

          <MotionStagger
            className="mt-6 grid gap-3 md:grid-cols-3"
            staggerChildren={0.05}
            amount={0.2}
          >
            <MotionStaggerItem>
              <article className="rounded-2xl border border-secondary/20 bg-white p-4 shadow-[0_10px_24px_rgba(11,11,15,0.08)]">
                <p className="text-sm leading-relaxed text-ink">
                  “A modelagem veste firme, sem limitar movimento no treino.”
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
                  Cliente Aura
                </p>
              </article>
            </MotionStaggerItem>

            <MotionStaggerItem>
              <article className="rounded-2xl border border-secondary/20 bg-white p-4 shadow-[0_10px_24px_rgba(11,11,15,0.08)]">
                <p className="text-sm leading-relaxed text-ink">
                  “O tecido tem toque premium e continua confortável ao longo do dia.”
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
                  Cliente Aura
                </p>
              </article>
            </MotionStaggerItem>

            <MotionStaggerItem>
              <article className="rounded-2xl border border-secondary/20 bg-white p-4 shadow-[0_10px_24px_rgba(11,11,15,0.08)]">
                <p className="text-sm leading-relaxed text-ink">
                  “Consegui escolher tamanho com ajuda rápida no atendimento.”
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
                  Cliente Aura
                </p>
              </article>
            </MotionStaggerItem>
          </MotionStagger>
        </div>
      </section>

      <section className="pb-14 pt-10 md:pb-16">
        <MotionReveal className="rounded-3xl border border-secondary/20 bg-gradient-to-r from-secondary to-primary p-6 text-paper shadow-[0_16px_36px_rgba(11,11,15,0.2)] sm:p-8">
          <p className="font-roboto text-xs font-semibold uppercase tracking-[0.24em] text-paper/80">
            Pronta para o próximo treino?
          </p>
          <h2 className="font-roboto mt-2 text-2xl font-black uppercase tracking-[0.1em] sm:text-3xl md:text-4xl">
            Monte seu look Aura hoje
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-paper/90 md:text-base">
            Explore o catálogo completo e encontre peças com ajuste premium para
            treinar com confiança, estilo e conforto.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link
              href="/products"
              prefetch={false}
              className="aura-cta aura-cta-comprar border border-paper bg-paper text-secondary"
            >
              Comprar agora
            </Link>
            <a
              href="https://wa.me/5522998959800"
              target="_blank"
              rel="noopener noreferrer"
              className="aura-cta aura-cta-considerar border-paper/45 text-paper hover:bg-paper/12"
            >
              Falar com consultora
            </a>
          </div>
        </MotionReveal>
      </section>
    </>
  );
}
