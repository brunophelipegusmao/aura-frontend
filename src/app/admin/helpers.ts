import type { MockProduct } from "../../../mock/catalog";
import { mockProducts } from "../../../mock/catalog";
import { heroCarouselItems, productCarouselItems } from "../../../mock/carousel";
import { ADMIN_STORAGE_KEY } from "@/lib/storefront-catalog";
import type {
  AdminTab,
  AdminOrderStatus,
  PaymentStatus,
  AdminOrderItem,
  AdminOrder,
  AdminProduct,
  AdminProductVariant,
  ProductVariantDraft,
  ProductDraft,
  CarouselDraft,
  AdminCarouselSlide,
  AdminStore,
  StockMovement,
} from "./types";

export const tabItems: Array<{ id: AdminTab; label: string; description: string }> = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "KPI, alertas e resumo operacional",
  },
  {
    id: "products",
    label: "Produtos",
    description: "Cadastrar, editar e excluir produtos",
  },
  {
    id: "carousel",
    label: "Carrosseis",
    description: "Gerenciar banners e ordem de exibicao",
  },
  {
    id: "orders",
    label: "Pedidos",
    description: "Visualizar pedidos e atualizar status",
  },
  {
    id: "stock",
    label: "Estoque",
    description: "Controle completo por variante",
  },
];

export const orderStatusOptions: Array<{ value: AdminOrderStatus; label: string }> = [
  { value: "pending", label: "Aguardando pagamento" },
  { value: "paid", label: "Pago" },
  { value: "picking", label: "Separacao" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregue" },
  { value: "cancelled", label: "Cancelado" },
  { value: "refunded", label: "Reembolsado" },
];

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  pending: "Pendente",
  paid: "Pago",
  failed: "Falhou",
  refunded: "Reembolsado",
};

export const orderStatusBadgeClass: Record<AdminOrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  paid: "bg-sky-100 text-sky-800 border-sky-300",
  picking: "bg-indigo-100 text-indigo-800 border-indigo-300",
  shipped: "bg-violet-100 text-violet-800 border-violet-300",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-300",
  cancelled: "bg-rose-100 text-rose-800 border-rose-300",
  refunded: "bg-zinc-200 text-zinc-700 border-zinc-300",
};

export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
});

export const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export const inputClassName =
  "w-full rounded-xl border border-secondary/20 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-secondary";

export const createId = (prefix: string) => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
};

export const nowIso = () => new Date().toISOString();

export const daysAgoIso = (days: number) => {
  const value = new Date();
  value.setDate(value.getDate() - days);
  return value.toISOString();
};

export const sanitizeCode = (value: string) => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toUpperCase();
};

export const toNumber = (value: string, fallback = 0) => {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) {
    return fallback;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const toInteger = (value: string, fallback = 0) => {
  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const sumOrderItems = (items: AdminOrderItem[]) => {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
};

export const calculateOrderTotal = (order: Pick<AdminOrder, "items" | "shippingAmount" | "discountAmount">) => {
  return sumOrderItems(order.items) + order.shippingAmount - order.discountAmount;
};

export const makeVariantKey = (productId: string, variantId: string) => {
  return `${productId}::${variantId}`;
};

export const makeVariantSku = (reference: string, size: string, colorName: string, index = 0) => {
  const normalizedReference = sanitizeCode(reference || "AURA");
  const normalizedSize = sanitizeCode(size || "UN");
  const normalizedColor = sanitizeCode(colorName || "COLOR");
  const suffix = index > 0 ? `-${index + 1}` : "";

  return `${normalizedReference}-${normalizedSize}-${normalizedColor}${suffix}`;
};

export const computeProductInStock = (product: Pick<AdminProduct, "variants">) => {
  return product.variants.some((variant) => variant.quantity > 0);
};

export const createEmptyVariantDraft = (): ProductVariantDraft => ({
  id: createId("variant-draft"),
  sku: "",
  size: "M",
  colorName: "Preto",
  colorHex: "#111111",
  quantity: "0",
});

export const createEmptyProductDraft = (): ProductDraft => ({
  name: "",
  reference: "",
  category: "",
  collection: "",
  imageUrl: "",
  price: "0",
  compareAtPrice: "",
  isActive: true,
  isFeatured: false,
  lowStockThreshold: "6",
  variants: [createEmptyVariantDraft()],
});

export const createEmptyCarouselDraft = (): CarouselDraft => ({
  placement: "home-hero",
  title: "",
  subtitle: "",
  imageUrl: "",
  alt: "",
  ctaLabel: "",
  ctaHref: "",
  isActive: true,
});

export const toProductDraft = (product: AdminProduct): ProductDraft => ({
  name: product.name,
  reference: product.reference,
  category: product.category,
  collection: product.collection,
  imageUrl: product.imageUrl,
  price: product.price.toString(),
  compareAtPrice: product.compareAtPrice ? product.compareAtPrice.toString() : "",
  isActive: product.isActive,
  isFeatured: product.isFeatured,
  lowStockThreshold: product.lowStockThreshold.toString(),
  variants: product.variants.map((variant) => ({
    id: variant.id,
    sku: variant.sku,
    size: variant.size,
    colorName: variant.colorName,
    colorHex: variant.colorHex,
    quantity: variant.quantity.toString(),
  })),
});

export const toCarouselDraft = (slide: AdminCarouselSlide): CarouselDraft => ({
  placement: slide.placement,
  title: slide.title,
  subtitle: slide.subtitle,
  imageUrl: slide.imageUrl,
  alt: slide.alt,
  ctaLabel: slide.ctaLabel,
  ctaHref: slide.ctaHref,
  isActive: slide.isActive,
});

export const buildSeedProducts = (baseProducts: MockProduct[]): AdminProduct[] => {
  return baseProducts.map((product, productIndex) => {
    const reference = product.reference.replace(/^Ref:\s*/i, "").trim();
    const colors = product.colors.length > 0 ? product.colors : [{ name: "Preto", hex: "#111111" }];
    const sizes = product.sizes.length > 0 ? product.sizes : ["UN"];

    const variants = sizes.flatMap((size, sizeIndex) => {
      return colors.map((color, colorIndex) => {
        const seed = (productIndex + 1) * 17 + (sizeIndex + 1) * 11 + (colorIndex + 1) * 7;
        const baseQuantity = seed % 28;
        const adjustedQuantity = product.inStock
          ? Math.max(2, baseQuantity)
          : Math.max(0, baseQuantity - 18);

        return {
          id: `${product.id}-variant-${sizeIndex + 1}-${colorIndex + 1}`,
          sku: makeVariantSku(reference, size, color.name, colorIndex),
          size,
          colorName: color.name,
          colorHex: color.hex,
          quantity: adjustedQuantity,
        } satisfies AdminProductVariant;
      });
    });

    const inStock = computeProductInStock({ variants });

    return {
      id: product.id,
      name: product.name,
      reference,
      category: product.category,
      collection: product.collection,
      imageUrl: product.image.url,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      isActive: true,
      isFeatured: product.isNew,
      inStock,
      lowStockThreshold: 6,
      variants,
      createdAt: daysAgoIso(40 - productIndex),
      updatedAt: daysAgoIso(5 + (productIndex % 6)),
    } satisfies AdminProduct;
  });
};

export const buildSeedSlides = (): AdminCarouselSlide[] => {
  const heroSlides = heroCarouselItems.map((item, index) => ({
    id: `slide-hero-${index + 1}`,
    placement: "home-hero" as const,
    title: `Banner Hero ${index + 1}`,
    subtitle: "Campanha institucional",
    imageUrl: item.imageUrl,
    alt: item.alt,
    ctaLabel: "Ver colecao",
    ctaHref: "/collections",
    isActive: true,
    order: index + 1,
    createdAt: daysAgoIso(35 - index),
    updatedAt: daysAgoIso(8 - index),
  }));

  const productSlides = productCarouselItems.slice(0, 8).map((item, index) => ({
    id: `slide-products-${index + 1}`,
    placement: "home-products" as const,
    title: item.title ?? `Produto ${index + 1}`,
    subtitle: item.reference ?? "Linha em destaque",
    imageUrl: item.imageUrl,
    alt: item.alt,
    ctaLabel: item.ctaLabel ?? "Comprar",
    ctaHref: "/products",
    isActive: index < 6,
    order: index + 1,
    createdAt: daysAgoIso(24 - index),
    updatedAt: daysAgoIso(3 + index),
  }));

  return [...heroSlides, ...productSlides];
};

export const createSeedOrderItem = (
  product: AdminProduct,
  variant: AdminProductVariant,
  quantity: number,
  discountRatio = 0,
): AdminOrderItem => {
  const safeRatio = Math.min(Math.max(discountRatio, 0), 0.9);

  return {
    id: createId("order-item"),
    productId: product.id,
    productName: product.name,
    variantId: variant.id,
    sku: variant.sku,
    size: variant.size,
    colorName: variant.colorName,
    quantity,
    unitPrice: Number((product.price * (1 - safeRatio)).toFixed(2)),
  };
};

export const buildSeedOrders = (products: AdminProduct[]): AdminOrder[] => {
  if (products.length === 0) {
    return [];
  }

  const pickProduct = (index: number) => products[index] ?? products[0];
  const pickVariant = (product: AdminProduct, index: number) =>
    product.variants[index] ?? product.variants[0];

  const orderSeeds = [
    {
      id: "order-1001",
      number: "1001",
      customerName: "Bianca Freitas",
      customerEmail: "bianca.freitas@email.com",
      customerPhone: "(22) 99876-1150",
      status: "pending" as const,
      paymentStatus: "pending" as const,
      shippingMethod: "SEDEX",
      shippingAmount: 25,
      discountAmount: 0,
      notes: "Cliente pediu envio apos confirmacao de pagamento.",
      createdAt: daysAgoIso(1),
      updatedAt: daysAgoIso(1),
      items: [
        createSeedOrderItem(pickProduct(0), pickVariant(pickProduct(0), 0), 1),
        createSeedOrderItem(pickProduct(1), pickVariant(pickProduct(1), 2), 1),
      ],
    },
    {
      id: "order-1002",
      number: "1002",
      customerName: "Amanda Souza",
      customerEmail: "amanda.souza@email.com",
      customerPhone: "(21) 99741-3280",
      status: "paid" as const,
      paymentStatus: "paid" as const,
      shippingMethod: "Jadlog",
      shippingAmount: 18.5,
      discountAmount: 14,
      notes: "Pedido com cupom INVERNO14.",
      createdAt: daysAgoIso(2),
      updatedAt: daysAgoIso(1),
      items: [
        createSeedOrderItem(pickProduct(4), pickVariant(pickProduct(4), 1), 1, 0.05),
      ],
    },
    {
      id: "order-1003",
      number: "1003",
      customerName: "Joana Moura",
      customerEmail: "joana.moura@email.com",
      customerPhone: "(11) 99407-2152",
      status: "picking" as const,
      paymentStatus: "paid" as const,
      shippingMethod: "PAC",
      shippingAmount: 15.9,
      discountAmount: 0,
      notes: "Separar embalagem para presente.",
      createdAt: daysAgoIso(3),
      updatedAt: daysAgoIso(2),
      items: [
        createSeedOrderItem(pickProduct(2), pickVariant(pickProduct(2), 0), 2),
      ],
    },
    {
      id: "order-1004",
      number: "1004",
      customerName: "Luiza Castro",
      customerEmail: "luiza.castro@email.com",
      customerPhone: "(31) 99812-4421",
      status: "shipped" as const,
      paymentStatus: "paid" as const,
      shippingMethod: "SEDEX",
      shippingAmount: 27,
      discountAmount: 20,
      notes: "Cliente prefere entrega comercial.",
      createdAt: daysAgoIso(5),
      updatedAt: daysAgoIso(3),
      items: [
        createSeedOrderItem(pickProduct(8), pickVariant(pickProduct(8), 0), 1),
        createSeedOrderItem(pickProduct(6), pickVariant(pickProduct(6), 1), 1),
      ],
    },
    {
      id: "order-1005",
      number: "1005",
      customerName: "Gabriela Dias",
      customerEmail: "g.dias@email.com",
      customerPhone: "(51) 99111-8890",
      status: "delivered" as const,
      paymentStatus: "paid" as const,
      shippingMethod: "SEDEX",
      shippingAmount: 22,
      discountAmount: 0,
      notes: "Entregue sem ocorrencias.",
      createdAt: daysAgoIso(8),
      updatedAt: daysAgoIso(4),
      items: [
        createSeedOrderItem(pickProduct(10), pickVariant(pickProduct(10), 1), 1),
      ],
    },
    {
      id: "order-1006",
      number: "1006",
      customerName: "Rafaela Pires",
      customerEmail: "rafaela.pires@email.com",
      customerPhone: "(41) 99228-1107",
      status: "cancelled" as const,
      paymentStatus: "failed" as const,
      shippingMethod: "SEDEX",
      shippingAmount: 0,
      discountAmount: 0,
      notes: "Pagamento recusado pela operadora.",
      createdAt: daysAgoIso(9),
      updatedAt: daysAgoIso(8),
      items: [
        createSeedOrderItem(pickProduct(3), pickVariant(pickProduct(3), 0), 1),
      ],
    },
  ];

  return orderSeeds;
};

export const buildSeedStore = (): AdminStore => {
  const products = buildSeedProducts(mockProducts);
  const orders = buildSeedOrders(products);

  return {
    products,
    slides: buildSeedSlides(),
    orders,
    stockMovements: [],
  };
};

export const parsePersistedStore = (value: string): AdminStore | null => {
  try {
    const parsed = JSON.parse(value) as Partial<AdminStore>;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !Array.isArray(parsed.products) ||
      !Array.isArray(parsed.slides) ||
      !Array.isArray(parsed.orders)
    ) {
      return null;
    }

    return {
      products: parsed.products as AdminProduct[],
      slides: parsed.slides as AdminCarouselSlide[],
      orders: parsed.orders as AdminOrder[],
      stockMovements: Array.isArray(parsed.stockMovements)
        ? (parsed.stockMovements as StockMovement[])
        : [],
    };
  } catch {
    return null;
  }
};

export const getInitialStore = (): AdminStore => {
  if (typeof window === "undefined") {
    return buildSeedStore();
  }

  const persisted = window.localStorage.getItem(ADMIN_STORAGE_KEY);
  const parsed = persisted ? parsePersistedStore(persisted) : null;
  return parsed ?? buildSeedStore();
};
