"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { addToCart } from "@/lib/cart-store";
import { buildProductHref } from "@/lib/storefront-catalog";
import { useStorefrontCatalog } from "@/lib/use-storefront-catalog";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type SizeGuideRow = {
  size: string;
  bust: string;
  waist: string;
  hip: string;
};

type ProductProfile = {
  compression: string;
  fabric: string;
  composition: string;
  lining: string;
  transparency: string;
  support: string;
  fit: string;
  idealUse: string;
  benefits: string[];
  care: string[];
};

const sizeGuidePreset: Record<string, Omit<SizeGuideRow, "size">> = {
  PP: { bust: "80-84 cm", waist: "60-64 cm", hip: "86-90 cm" },
  P: { bust: "84-90 cm", waist: "64-70 cm", hip: "90-96 cm" },
  M: { bust: "90-96 cm", waist: "70-76 cm", hip: "96-102 cm" },
  G: { bust: "96-104 cm", waist: "76-84 cm", hip: "102-110 cm" },
  GG: { bust: "104-112 cm", waist: "84-92 cm", hip: "110-118 cm" },
  UN: { bust: "84-104 cm", waist: "64-92 cm", hip: "90-118 cm" },
};

const defaultProfile: ProductProfile = {
  compression: "Media",
  fabric: "Malha de poliamida com elastano de toque macio.",
  composition: "82% poliamida | 18% elastano.",
  lining: "Sem forro interno.",
  transparency: "Baixa transparencia em uso correto.",
  support: "Sustentacao media para treino funcional.",
  fit: "Ajuste ao corpo com conforto para uso prolongado.",
  idealUse: "Treino de academia, pilates e rotina diaria.",
  benefits: [
    "Modelagem que acompanha movimento sem marcar excesso.",
    "Recuperacao elastica para manter o ajuste apos lavagens.",
    "Toque macio com foco em conforto durante o treino.",
  ],
  care: [
    "Lavar a mao ou ciclo delicado em agua fria.",
    "Nao usar alvejante ou amaciante.",
    "Secar a sombra e evitar secadora.",
    "Nao passar ferro sobre estampas ou etiquetas.",
  ],
};

const profileByCategory: Record<string, Partial<ProductProfile>> = {
  top: {
    compression: "Media",
    support: "Sustentacao media para treinos de medio impacto.",
    fit: "Estrutura firme no busto com liberdade de ombros.",
    idealUse: "Musculacao, aula funcional e caminhada.",
    benefits: [
      "Base firme para reduzir movimento excessivo durante exercicios.",
      "Alcas e cavas com ajuste confortavel para longos periodos.",
      "Toque respiravel para manter conforto termico.",
    ],
  },
  legging: {
    compression: "Alta",
    support: "Compressao alta em cintura e quadril.",
    fit: "Cintura alta com efeito sculpt e seguranca no movimento.",
    idealUse: "Treino de pernas, corrida e treino de resistencia.",
    benefits: [
      "Compressao consistente para melhor percepcao de firmeza.",
      "Cintura alta que ajuda a manter a peca no lugar.",
      "Cobertura uniforme com baixa transparencia.",
    ],
  },
  short: {
    compression: "Media",
    support: "Estabilidade na cintura sem restringir mobilidade.",
    fit: "Comprimento estrategico para conforto no movimento.",
    idealUse: "Corrida, bike indoor e treino funcional.",
    benefits: [
      "Mobilidade livre para treinos dinamicos.",
      "Secagem rapida e toque leve.",
      "Cintura com boa estabilidade durante atividade intensa.",
    ],
  },
  regata: {
    compression: "Leve",
    support: "Caimento solto com respirabilidade elevada.",
    fit: "Shape fluido para treino e uso casual.",
    idealUse: "Treinos leves, caminhada e composicao de look fitness.",
    benefits: [
      "Respirabilidade e leveza para treinos de baixa e media intensidade.",
      "Camada versatil para sobreposicao com top.",
      "Caimento que nao limita amplitude de movimento.",
    ],
  },
  jaqueta: {
    compression: "Leve",
    fabric: "Tecido leve corta-vento com secagem rapida.",
    composition: "100% poliamida com acabamento repelente.",
    support: "Protecao contra vento sem peso excessivo.",
    fit: "Modelagem regular para sobreposicao com top e regata.",
    idealUse: "Corrida ao ar livre e deslocamento diario.",
    benefits: [
      "Camada leve para protecao em clima ameno.",
      "Estrutura compacta para levar na bolsa sem volume.",
      "Acabamento funcional para uso esportivo urbano.",
    ],
  },
  macacao: {
    compression: "Media",
    support: "Compressao estrategica em tronco e quadril.",
    fit: "Modelagem unica com ajuste integral ao corpo.",
    idealUse: "Treinos funcionais e looks fitness premium.",
    benefits: [
      "Visual unico com modelagem que valoriza silhueta.",
      "Menos pontos de ajuste durante o treino.",
      "Conforto estrutural para treino e uso diario.",
    ],
  },
  "conjunto": {
    compression: "Media",
    support: "Equilibrio entre sustentacao e liberdade de movimento.",
    fit: "Modelagem coordenada para look completo e funcional.",
    idealUse: "Treino em academia e composicao athleisure.",
    benefits: [
      "Coordenacao visual pronta para compra rapida.",
      "Pecas com ajuste pensado para funcionar em conjunto.",
      "Transicao facil entre treino e rotina.",
    ],
  },
};

const collectionAdjustments: Array<{ keyword: string; updates: Partial<ProductProfile> }> = [
  {
    keyword: "seamless",
    updates: {
      fabric: "Malha seamless de alta elasticidade com toque suave.",
      composition: "90% poliamida | 10% elastano.",
      lining: "Estrutura sem costuras com reforco em zonas de suporte.",
      transparency: "Baixa transparencia com cobertura uniforme.",
    },
  },
  {
    keyword: "running",
    updates: {
      fabric: "Tecido tecnico leve com secagem acelerada.",
      composition: "88% poliamida | 12% elastano.",
      support: "Estabilidade com boa ventilacao para ritmo intenso.",
    },
  },
  {
    keyword: "legacy",
    updates: {
      fabric: "Canelado premium com elasticidade bidirecional.",
      composition: "84% poliamida | 16% elastano.",
      fit: "Ajuste mais estruturado com foco em modelagem.",
    },
  },
];

const logisticsPoints = [
  "Prazo e disponibilidade de envio sao informados no checkout.",
  "Condicoes de frete sao exibidas conforme CEP e itens do pedido.",
  "Atualizacoes de entrega ficam disponiveis apos confirmacao do pedido.",
];

const exchangePoints = [
  "Trocas seguem a politica vigente da loja.",
  "Para avaliacao, mantenha a peca sem uso e com etiquetas.",
  "Reembolso segue o fluxo do meio de pagamento escolhido.",
];

const getSizeGuideRows = (sizes: string[]): SizeGuideRow[] => {
  return sizes.map((size) => {
    const normalizedSize = size.trim().toUpperCase();
    const preset = sizeGuidePreset[normalizedSize] ?? {
      bust: "Consulte atendimento",
      waist: "Consulte atendimento",
      hip: "Consulte atendimento",
    };

    return {
      size,
      bust: preset.bust,
      waist: preset.waist,
      hip: preset.hip,
    };
  });
};

const getProductProfile = (category: string, collection: string): ProductProfile => {
  const normalizedCategory = category.trim().toLowerCase();
  const normalizedCollection = collection.trim().toLowerCase();

  let profile: ProductProfile = {
    ...defaultProfile,
    benefits: [...defaultProfile.benefits],
    care: [...defaultProfile.care],
  };

  const categoryPreset = profileByCategory[normalizedCategory];
  if (categoryPreset) {
    profile = {
      ...profile,
      ...categoryPreset,
      benefits: categoryPreset.benefits ?? profile.benefits,
      care: categoryPreset.care ?? profile.care,
    };
  }

  const collectionPreset = collectionAdjustments.find((entry) =>
    normalizedCollection.includes(entry.keyword),
  );

  if (collectionPreset) {
    profile = {
      ...profile,
      ...collectionPreset.updates,
      benefits: collectionPreset.updates.benefits ?? profile.benefits,
      care: collectionPreset.updates.care ?? profile.care,
    };
  }

  return profile;
};

const getDiscountPercentage = (price: number, compareAtPrice?: number) => {
  if (!compareAtPrice || compareAtPrice <= price) {
    return 0;
  }

  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
};

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const products = useStorefrontCatalog();

  const product = products.find((item) => item.slug === params.slug);

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "UN");
  const [selectedColorName, setSelectedColorName] = useState(
    product?.colors[0]?.name ?? "Preto",
  );
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const selectedColor = useMemo(() => {
    if (!product) {
      return null;
    }

    return (
      product.colors.find((color) => color.name === selectedColorName) ??
      product.colors[0] ??
      null
    );
  }, [product, selectedColorName]);

  const sizeGuideRows = useMemo(() => {
    return product ? getSizeGuideRows(product.sizes) : [];
  }, [product]);

  const profile = useMemo(() => {
    return product
      ? getProductProfile(product.category, product.collection)
      : defaultProfile;
  }, [product]);

  const discountPercentage = product
    ? getDiscountPercentage(product.price, product.compareAtPrice)
    : 0;
  const installmentAmount = product ? product.price / 3 : 0;

  if (!product) {
    return (
      <section className="py-10">
        <div className="rounded-3xl border border-secondary/20 bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Produto
          </p>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-[0.1em] text-ink">
            Produto nao encontrado
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            O produto solicitado nao esta disponivel no catalogo atual.
          </p>
          <Link
            href="/products"
            prefetch={false}
            className="mt-5 inline-flex rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-paper"
          >
            Voltar para produtos
          </Link>
        </div>
      </section>
    );
  }

  const handleAddToCart = (redirectTo?: "/cart" | "/checkout") => {
    if (!selectedColor) {
      return;
    }

    addToCart({
      product,
      size: selectedSize,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      quantity: selectedQuantity,
    });

    if (redirectTo) {
      router.push(redirectTo);
    }
  };

  return (
    <section className="py-6 md:py-10">
      <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-muted">
        <Link href="/" prefetch={false} className="hover:text-secondary">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" prefetch={false} className="hover:text-secondary">
          Produtos
        </Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-secondary/15 bg-primary-soft/25">
            <Image
              src={product.image.url}
              alt={product.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
              priority
            />

            <div className="pointer-events-none absolute left-4 top-4 flex gap-2">
              {product.isNew ? (
                <span className="rounded-full border border-paper/70 bg-paper/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-secondary">
                  Novo
                </span>
              ) : null}
              {!product.inStock ? (
                <span className="rounded-full border border-paper/70 bg-paper/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-secondary">
                  Esgotado
                </span>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-secondary/15 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
              Galeria do produto
            </p>
            <p className="mt-1 text-sm text-muted">
              Visual principal da peca com foco em modelagem, textura e acabamento.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <div
                  key={`${product.id}-gallery-color-${color.name}`}
                  className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-primary-soft/20 px-2.5 py-1.5"
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-ink/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs font-medium text-ink">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-5 rounded-3xl border border-secondary/20 bg-white p-5 shadow-[0_12px_28px_rgba(11,11,15,0.08)] md:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary/85">
              {product.collection} | {product.category}
            </p>
            <h1 className="mt-2 text-2xl font-black leading-tight text-ink md:text-3xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-muted">{product.reference}</p>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-3xl font-black text-ink">
                {currencyFormatter.format(product.price)}
              </p>
              {product.compareAtPrice && product.compareAtPrice > product.price ? (
                <p className="pb-1 text-sm text-muted line-through">
                  {currencyFormatter.format(product.compareAtPrice)}
                </p>
              ) : null}
              {discountPercentage > 0 ? (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-paper">
                  {discountPercentage}% OFF
                </span>
              ) : null}
            </div>

            <p className="text-sm font-medium text-ink">
              Simulação em 3 parcelas de {currencyFormatter.format(installmentAmount)}
            </p>

            <ul className="space-y-1 text-xs text-muted">
              <li>Condicoes de frete calculadas no checkout.</li>
              <li>Trocas conforme politica vigente da loja.</li>
              <li>
                {product.inStock
                  ? "Disponibilidade de envio confirmada na finalizacao."
                  : "Produto sem estoque no momento."}
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">
                Tamanho
              </p>
              <a
                href="#size-guide"
                className="text-[11px] font-semibold uppercase tracking-[0.08em] text-secondary hover:underline"
              >
                Ver tabela
              </a>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-4">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;

                return (
                  <button
                    key={`product-size-${product.id}-${size}`}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-lg border px-2 py-2 text-xs font-semibold uppercase tracking-[0.06em] transition-colors ${
                      isSelected
                        ? "border-secondary bg-secondary text-paper"
                        : "border-secondary/20 bg-primary-soft/20 text-secondary"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">
              Cor
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => {
                const isSelected = selectedColorName === color.name;

                return (
                  <button
                    key={`product-color-${product.id}-${color.name}`}
                    type="button"
                    onClick={() => setSelectedColorName(color.name)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      isSelected
                        ? "border-secondary bg-primary-soft/35 text-secondary"
                        : "border-secondary/20 text-ink"
                    }`}
                  >
                    <span
                      className="h-4 w-4 rounded-full border border-ink/10"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">
              Quantidade
            </p>
            <div className="inline-flex items-center rounded-full border border-secondary/20 bg-primary-soft/15">
              <button
                type="button"
                onClick={() => setSelectedQuantity((current) => Math.max(1, current - 1))}
                className="px-3 py-1.5 text-sm font-bold text-secondary"
              >
                -
              </button>
              <span className="min-w-10 px-2 text-center text-sm font-semibold text-ink">
                {selectedQuantity}
              </span>
              <button
                type="button"
                onClick={() => setSelectedQuantity((current) => current + 1)}
                className="px-3 py-1.5 text-sm font-bold text-secondary"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleAddToCart("/checkout")}
              className="aura-cta aura-cta-comprar w-full py-3 text-sm"
            >
              Comprar agora
            </button>

            <button
              type="button"
              onClick={() => handleAddToCart("/cart")}
              className="aura-cta aura-cta-considerar w-full py-3 text-sm"
            >
              Adicionar ao carrinho
            </button>

            <a
              href="https://wa.me/5522998959800"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-xs font-semibold uppercase tracking-[0.08em] text-secondary hover:underline"
            >
              Tirar duvida no WhatsApp
            </a>
          </div>
        </aside>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Beneficios da peca
          </p>
          <h2 className="mt-2 text-xl font-black uppercase tracking-[0.08em] text-ink">
            Performance com foco em conforto
          </h2>
          <ul className="mt-4 space-y-2.5">
            {profile.benefits.map((benefit) => (
              <li
                key={`benefit-${product.id}-${benefit}`}
                className="rounded-xl border border-secondary/15 bg-primary-soft/15 px-3 py-2.5 text-sm text-ink"
              >
                {benefit}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Ficha tecnica
          </p>
          <h2 className="mt-2 text-xl font-black uppercase tracking-[0.08em] text-ink">
            Dados de tecido e caimento
          </h2>

          <dl className="mt-4 divide-y divide-secondary/10 rounded-2xl border border-secondary/15">
            <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 px-4 py-3 text-sm">
              <dt className="font-semibold text-secondary">Tecido</dt>
              <dd className="text-ink">{profile.fabric}</dd>
            </div>
            <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 px-4 py-3 text-sm">
              <dt className="font-semibold text-secondary">Compressao</dt>
              <dd className="text-ink">{profile.compression}</dd>
            </div>
            <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 px-4 py-3 text-sm">
              <dt className="font-semibold text-secondary">Composicao</dt>
              <dd className="text-ink">{profile.composition}</dd>
            </div>
            <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 px-4 py-3 text-sm">
              <dt className="font-semibold text-secondary">Forro</dt>
              <dd className="text-ink">{profile.lining}</dd>
            </div>
            <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 px-4 py-3 text-sm">
              <dt className="font-semibold text-secondary">Transparencia</dt>
              <dd className="text-ink">{profile.transparency}</dd>
            </div>
            <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 px-4 py-3 text-sm">
              <dt className="font-semibold text-secondary">Sustentacao</dt>
              <dd className="text-ink">{profile.support}</dd>
            </div>
            <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 px-4 py-3 text-sm">
              <dt className="font-semibold text-secondary">Caimento</dt>
              <dd className="text-ink">{profile.fit}</dd>
            </div>
            <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 px-4 py-3 text-sm">
              <dt className="font-semibold text-secondary">Uso ideal</dt>
              <dd className="text-ink">{profile.idealUse}</dd>
            </div>
          </dl>
        </article>
      </div>

      <article
        id="size-guide"
        className="mt-4 rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Tabela de medidas
            </p>
            <h2 className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-ink">
              Escolha o tamanho com seguranca
            </h2>
          </div>
          <p className="text-xs text-muted">
            Meça busto, cintura e quadril com fita metrica sem apertar.
          </p>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-secondary/15">
          <table className="min-w-[540px] w-full text-left text-sm">
            <thead className="bg-primary-soft/35 text-secondary">
              <tr>
                <th className="px-3 py-2 font-black uppercase tracking-[0.08em]">Tam</th>
                <th className="px-3 py-2 font-black uppercase tracking-[0.08em]">Busto</th>
                <th className="px-3 py-2 font-black uppercase tracking-[0.08em]">Cintura</th>
                <th className="px-3 py-2 font-black uppercase tracking-[0.08em]">Quadril</th>
              </tr>
            </thead>
            <tbody>
              {sizeGuideRows.map((row) => (
                <tr
                  key={`size-guide-${product.id}-${row.size}`}
                  className="border-t border-secondary/10"
                >
                  <td className="px-3 py-2 font-semibold text-ink">{row.size}</td>
                  <td className="px-3 py-2 text-muted">{row.bust}</td>
                  <td className="px-3 py-2 text-muted">{row.waist}</td>
                  <td className="px-3 py-2 text-muted">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Cuidados da peca
          </p>
          <h2 className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-ink">
            Durabilidade e acabamento
          </h2>
          <ul className="mt-4 space-y-2">
            {profile.care.map((careItem) => (
              <li
                key={`care-${product.id}-${careItem}`}
                className="rounded-xl border border-secondary/15 bg-primary-soft/15 px-3 py-2 text-sm text-ink"
              >
                {careItem}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Troca e frete
          </p>
          <h2 className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-ink">
            Politicas para compra com confianca
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-semibold text-secondary">Envio</p>
              <ul className="mt-2 space-y-2">
                {logisticsPoints.map((point) => (
                  <li
                    key={`logistics-${point}`}
                    className="rounded-xl border border-secondary/15 bg-primary-soft/15 px-3 py-2 text-sm text-ink"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-secondary">Troca</p>
              <ul className="mt-2 space-y-2">
                {exchangePoints.map((point) => (
                  <li
                    key={`exchange-${point}`}
                    className="rounded-xl border border-secondary/15 bg-primary-soft/15 px-3 py-2 text-sm text-ink"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>

      <article className="mt-4 rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          Prova social
        </p>
        <h2 className="mt-1 text-xl font-black uppercase tracking-[0.08em] text-ink">
          Avaliacoes de clientes
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Espaco dedicado a avaliacoes de clientes e experiencias de uso da peca.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-secondary/15 bg-primary-soft/15 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-secondary">
              Resumo de notas
            </p>
            <p className="mt-1 text-sm text-ink">
              Avaliacoes aparecem aqui conforme disponibilidade.
            </p>
          </div>
          <div className="rounded-2xl border border-secondary/15 bg-primary-soft/15 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-secondary">
              Comentarios por tamanho
            </p>
            <p className="mt-1 text-sm text-ink">
              Relatos de caimento sao exibidos nesta secao.
            </p>
          </div>
          <div className="rounded-2xl border border-secondary/15 bg-primary-soft/15 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-secondary">
              Fotos de clientes
            </p>
            <p className="mt-1 text-sm text-ink">
              Registros de uso podem ser publicados neste espaco.
            </p>
          </div>
        </div>
      </article>

      {products.length > 1 ? (
        <div className="mt-6 rounded-3xl border border-secondary/20 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-secondary">
            Continue explorando
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {products
              .filter((item) => item.id !== product.id)
              .slice(0, 6)
              .map((item) => (
                <Link
                  key={`related-${item.id}`}
                  href={buildProductHref(item.slug)}
                  prefetch={false}
                  className="rounded-full border border-secondary/25 px-3 py-1.5 text-xs font-semibold text-secondary transition-colors hover:bg-primary-soft/30"
                >
                  {item.name}
                </Link>
              ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
