import Caroussel from "@/components/Caroussel";
import { ProductCarousel } from "@/components/ProductCarousel";
import { CategoryCard } from "@/components/CategoryCard";
import { MotionReveal } from "@/components/motion/Reveal";

export default function Home() {
  const categories = [
    {
      id: "tops",
      imageUrl:
        "/Products/WhatsApp%20Image%202026-02-09%20at%2018.19.48%20(1).jpeg",
      alt: "Categoria Tops",
      title: "TOPS",
      href: `/products?category=${encodeURIComponent("Top")}`,
    },
    {
      id: "leggings",
      imageUrl: "/Products/WhatsApp%20Image%202026-02-09%20at%2018.19.48.jpeg",
      alt: "Categoria Leggings",
      title: "LEGGINGS",
      href: `/products?category=${encodeURIComponent("Legging")}`,
    },
    {
      id: "shorts",
      imageUrl: "/Products/WhatsApp%20Image%202026-02-09%20at%2018.19.49.jpeg",
      alt: "Categoria Shorts",
      title: "SHORTS",
      href: `/products?category=${encodeURIComponent("Short")}`,
    },
    {
      id: "macacoes",
      imageUrl: "/Products/WhatsApp%20Image%202026-02-05%20at%2015.22.07.jpeg",
      alt: "Categoria Macacões e Macaquinhos",
      title: "MACACÕES",
      subtitle: "MACAQUINHOS",
      href: `/products?category=${encodeURIComponent("Macacão")}`,
    },
  ];

  return (
    <>
      <section>
        <MotionReveal amount={0.12}>
          <Caroussel />
        </MotionReveal>
      </section>

      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-white py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 sm:px-6 lg:px-8">
          <h2 className="font-roboto text-xs font-semibold tracking-[0.24em] text-secondary text-xl md:text-4xl">
            PRODUTOS EM DESTAQUE
          </h2>
          <ProductCarousel />
        </div>
      </section>

      <section className="relative py-14">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(199,193,230,0.35),transparent_45%),radial-gradient(circle_at_80%_75%,rgba(143,132,198,0.22),transparent_45%)]" />

        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 sm:px-6 lg:px-8">
          <MotionReveal>
            <p className="font-roboto text-xs font-semibold tracking-[0.24em] text-secondary text-xl md:text-4xl">
              MODA FITNESS
            </p>
          </MotionReveal>

          <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                imageUrl={category.imageUrl}
                alt={category.alt}
                title={category.title}
                subtitle={category.subtitle}
                href={category.href}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-white py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 sm:px-6 lg:px-8">
          <h2 className="font-roboto text-xs font-semibold tracking-[0.24em] text-secondary text-xl md:text-4xl">
            LINHA BÁSICA
          </h2>
          <ProductCarousel />
        </div>
      </section>
    </>
  );
}
