import Image from "next/image";
import Link from "next/link";
import {
  MotionReveal,
  MotionStagger,
  MotionStaggerItem,
} from "@/components/motion/Reveal";

const values = [
  {
    title: "Tecnologia aplicada",
    description:
      "Modelagens desenvolvidas para sustentar o treino sem perder conforto.",
  },
  {
    title: "Design com identidade",
    description:
      "Colecoes com personalidade, equilibrio visual e foco em versatilidade.",
  },
  {
    title: "Performance real",
    description:
      "Pecas pensadas para acompanhar da academia ao dia a dia com estilo.",
  },
];

const milestones = [
  {
    year: "2021",
    label: "Inicio da marca",
    detail:
      "Nascimento da Aura Activewear com foco em moda fitness feminina autoral.",
  },
  {
    year: "2023",
    label: "Evolucao de modelagens",
    detail:
      "Novas estruturas de tecido e cortes para elevar ajuste e durabilidade.",
  },
  {
    year: "2025",
    label: "Expansao digital",
    detail:
      "Fortalecimento das vendas online com experiencia mobile-first no catalogo.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-secondary/15 bg-gradient-to-br from-paper via-accent/45 to-primary-soft/55 py-6 sm:py-7 md:py-8">
        <MotionReveal className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-10 2xl:px-12">
          <p className="font-roboto text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary/85">
            Nossa historia
          </p>
          <h1 className="font-roboto mt-2 text-2xl font-bold tracking-[-0.015em] text-ink sm:text-[2rem] md:text-[2.45rem]">
            Sobre a Aura
          </h1>
          <p className="mt-2.5 max-w-xl text-sm text-muted md:text-[0.95rem]">
            Moda fitness com identidade autoral, desempenho real e conforto
            pensado para mulheres em movimento.
          </p>
        </MotionReveal>
      </section>

      <section className="py-6 md:py-10">
        <div className="grid gap-4 lg:grid-cols-[1.05fr_minmax(0,1fr)] lg:gap-6">
          <MotionReveal>
            <article className="overflow-hidden rounded-3xl border border-secondary/20 bg-paper shadow-[0_14px_36px_rgba(11,11,15,0.1)]">
              <div className="relative h-[260px] sm:h-[320px]">
                <Image
                  src="/Products/WhatsApp%20Image%202026-02-09%20at%2018.19.48%20(1).jpeg"
                  alt="Campanha Aura Activewear"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 p-4 sm:p-5">
                <h2 className="font-roboto text-lg font-black uppercase tracking-[0.08em] text-secondary sm:text-2xl">
                  Essencia em movimento
                </h2>
                <p className="text-sm leading-relaxed text-muted">
                  A Aura nasceu para conectar performance e estilo. Cada colecao
                  e criada para valorizar o corpo em movimento com tecidos
                  tecnicos, acabamento premium e identidade forte.
                </p>
                <p className="text-sm leading-relaxed text-muted">
                  Mais do que roupa de treino, entregamos confianca para uma
                  rotina ativa, moderna e consistente.
                </p>
              </div>
            </article>
          </MotionReveal>

          <MotionStagger className="space-y-4" staggerChildren={0.07}>
            <MotionStaggerItem>
              <div className="grid grid-cols-2 gap-2">
                <article className="rounded-2xl border border-secondary/20 bg-paper p-3 text-center shadow-[0_8px_20px_rgba(11,11,15,0.08)] sm:p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    Base
                  </p>
                  <p className="mt-1 text-base font-black text-secondary sm:text-xl">
                    Fitness
                  </p>
                </article>
                <article className="rounded-2xl border border-secondary/20 bg-paper p-3 text-center shadow-[0_8px_20px_rgba(11,11,15,0.08)] sm:p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    Foco
                  </p>
                  <p className="mt-1 text-base font-black text-secondary sm:text-xl">
                    Conforto
                  </p>
                </article>
                <article className="rounded-2xl border border-secondary/20 bg-paper p-3 text-center shadow-[0_8px_20px_rgba(11,11,15,0.08)] sm:p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    Estilo
                  </p>
                  <p className="mt-1 text-base font-black text-secondary sm:text-xl">
                    Autoral
                  </p>
                </article>
                <article className="rounded-2xl border border-secondary/20 bg-paper p-3 text-center shadow-[0_8px_20px_rgba(11,11,15,0.08)] sm:p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    Jornada
                  </p>
                  <p className="mt-1 text-base font-black text-secondary sm:text-xl">
                    Mobile
                  </p>
                </article>
              </div>
            </MotionStaggerItem>

            <MotionStaggerItem>
              <div className="rounded-3xl border border-secondary/20 bg-paper p-4 shadow-[0_12px_30px_rgba(11,11,15,0.08)] sm:p-5">
                <h3 className="font-roboto text-sm font-black uppercase tracking-[0.12em] text-secondary">
                  Valores da marca
                </h3>
                <div className="mt-4 space-y-3">
                  {values.map((value) => (
                    <article
                      key={value.title}
                      className="rounded-xl border border-secondary/15 bg-primary-soft/20 p-3"
                    >
                      <h4 className="text-sm font-bold text-ink">{value.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">
                        {value.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </MotionStaggerItem>
          </MotionStagger>
        </div>
      </section>

      <section className="pb-6 md:pb-10">
        <MotionReveal className="rounded-3xl border border-secondary/20 bg-paper p-4 shadow-[0_12px_30px_rgba(11,11,15,0.08)] sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-roboto text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary/85">
                TRAJETORIA
              </p>
              <h2 className="font-roboto mt-1 text-xl font-bold tracking-[-0.01em] text-ink sm:text-2xl">
                Nossa evolucao
              </h2>
            </div>
            <Link
              href="/collections"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-xl border border-secondary/25 bg-paper px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-secondary transition-colors hover:bg-primary-soft/35 sm:text-sm"
            >
              Ver colecoes
            </Link>
          </div>

          <MotionStagger className="mt-5 space-y-3" staggerChildren={0.07}>
            {milestones.map((item) => (
              <MotionStaggerItem key={item.year}>
                <article className="rounded-2xl border border-secondary/15 bg-primary-soft/20 p-3.5 sm:p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-secondary">
                    {item.year}
                  </p>
                  <h3 className="mt-1 text-sm font-black text-ink sm:text-base">
                    {item.label}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">
                    {item.detail}
                  </p>
                </article>
              </MotionStaggerItem>
            ))}
          </MotionStagger>
        </MotionReveal>
      </section>
    </>
  );
}
