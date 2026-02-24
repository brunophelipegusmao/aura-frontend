"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { MockProduct } from "../../../mock/catalog";
import { mockProducts } from "../../../mock/catalog";
import { heroCarouselItems, productCarouselItems } from "../../../mock/carousel";
import {
  ADMIN_STORAGE_KEY,
  ADMIN_STORE_UPDATED_EVENT,
} from "@/lib/storefront-catalog";

type AdminTab = "dashboard" | "products" | "carousel" | "orders" | "stock";

type AdminOrderStatus =
  | "pending"
  | "paid"
  | "picking"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

type StockMovementType = "in" | "out" | "adjustment";

type AdminProductVariant = {
  id: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  quantity: number;
};

type AdminProduct = {
  id: string;
  name: string;
  reference: string;
  category: string;
  collection: string;
  imageUrl: string;
  price: number;
  compareAtPrice?: number;
  isActive: boolean;
  isFeatured: boolean;
  inStock: boolean;
  lowStockThreshold: number;
  variants: AdminProductVariant[];
  createdAt: string;
  updatedAt: string;
};

type CarouselPlacement = "home-hero" | "home-products";

type AdminCarouselSlide = {
  id: string;
  placement: CarouselPlacement;
  title: string;
  subtitle: string;
  imageUrl: string;
  alt: string;
  ctaLabel: string;
  ctaHref: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

type AdminOrderItem = {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  sku: string;
  size: string;
  colorName: string;
  quantity: number;
  unitPrice: number;
};

type AdminOrder = {
  id: string;
  number: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: AdminOrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  shippingMethod: string;
  shippingAmount: number;
  discountAmount: number;
  notes: string;
  items: AdminOrderItem[];
};

type StockMovement = {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  sku: string;
  size: string;
  colorName: string;
  type: StockMovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  actor: string;
  createdAt: string;
};

type AdminStore = {
  products: AdminProduct[];
  slides: AdminCarouselSlide[];
  orders: AdminOrder[];
  stockMovements: StockMovement[];
};

type ProductVariantDraft = {
  id: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  quantity: string;
};

type ProductDraft = {
  name: string;
  reference: string;
  category: string;
  collection: string;
  imageUrl: string;
  price: string;
  compareAtPrice: string;
  isActive: boolean;
  isFeatured: boolean;
  lowStockThreshold: string;
  variants: ProductVariantDraft[];
};

type CarouselDraft = {
  placement: CarouselPlacement;
  title: string;
  subtitle: string;
  imageUrl: string;
  alt: string;
  ctaLabel: string;
  ctaHref: string;
  isActive: boolean;
};

type StockMovementDraft = {
  variantKey: string;
  type: StockMovementType;
  quantity: string;
  reason: string;
  actor: string;
};

type Feedback = {
  type: "success" | "error";
  message: string;
};

type StockRow = {
  key: string;
  productId: string;
  productName: string;
  productReference: string;
  category: string;
  collection: string;
  variantId: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  quantity: number;
  lowStockThreshold: number;
  isProductActive: boolean;
};

const tabItems: Array<{ id: AdminTab; label: string; description: string }> = [
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

const orderStatusOptions: Array<{ value: AdminOrderStatus; label: string }> = [
  { value: "pending", label: "Aguardando pagamento" },
  { value: "paid", label: "Pago" },
  { value: "picking", label: "Separacao" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregue" },
  { value: "cancelled", label: "Cancelado" },
  { value: "refunded", label: "Reembolsado" },
];

const paymentStatusLabel: Record<PaymentStatus, string> = {
  pending: "Pendente",
  paid: "Pago",
  failed: "Falhou",
  refunded: "Reembolsado",
};

const orderStatusBadgeClass: Record<AdminOrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  paid: "bg-sky-100 text-sky-800 border-sky-300",
  picking: "bg-indigo-100 text-indigo-800 border-indigo-300",
  shipped: "bg-violet-100 text-violet-800 border-violet-300",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-300",
  cancelled: "bg-rose-100 text-rose-800 border-rose-300",
  refunded: "bg-zinc-200 text-zinc-700 border-zinc-300",
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const inputClassName =
  "w-full rounded-xl border border-secondary/20 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-secondary";

const createId = (prefix: string) => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
};

const nowIso = () => new Date().toISOString();

const daysAgoIso = (days: number) => {
  const value = new Date();
  value.setDate(value.getDate() - days);
  return value.toISOString();
};

const sanitizeCode = (value: string) => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toUpperCase();
};

const toNumber = (value: string, fallback = 0) => {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) {
    return fallback;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toInteger = (value: string, fallback = 0) => {
  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const sumOrderItems = (items: AdminOrderItem[]) => {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
};

const calculateOrderTotal = (order: Pick<AdminOrder, "items" | "shippingAmount" | "discountAmount">) => {
  return sumOrderItems(order.items) + order.shippingAmount - order.discountAmount;
};

const makeVariantKey = (productId: string, variantId: string) => {
  return `${productId}::${variantId}`;
};

const makeVariantSku = (reference: string, size: string, colorName: string, index = 0) => {
  const normalizedReference = sanitizeCode(reference || "AURA");
  const normalizedSize = sanitizeCode(size || "UN");
  const normalizedColor = sanitizeCode(colorName || "COLOR");
  const suffix = index > 0 ? `-${index + 1}` : "";

  return `${normalizedReference}-${normalizedSize}-${normalizedColor}${suffix}`;
};

const computeProductInStock = (product: Pick<AdminProduct, "variants">) => {
  return product.variants.some((variant) => variant.quantity > 0);
};

const createEmptyVariantDraft = (): ProductVariantDraft => ({
  id: createId("variant-draft"),
  sku: "",
  size: "M",
  colorName: "Preto",
  colorHex: "#111111",
  quantity: "0",
});

const createEmptyProductDraft = (): ProductDraft => ({
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

const createEmptyCarouselDraft = (): CarouselDraft => ({
  placement: "home-hero",
  title: "",
  subtitle: "",
  imageUrl: "",
  alt: "",
  ctaLabel: "",
  ctaHref: "",
  isActive: true,
});

const toProductDraft = (product: AdminProduct): ProductDraft => ({
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

const toCarouselDraft = (slide: AdminCarouselSlide): CarouselDraft => ({
  placement: slide.placement,
  title: slide.title,
  subtitle: slide.subtitle,
  imageUrl: slide.imageUrl,
  alt: slide.alt,
  ctaLabel: slide.ctaLabel,
  ctaHref: slide.ctaHref,
  isActive: slide.isActive,
});

const buildSeedProducts = (baseProducts: MockProduct[]): AdminProduct[] => {
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

const buildSeedSlides = (): AdminCarouselSlide[] => {
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

const createSeedOrderItem = (
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

const buildSeedOrders = (products: AdminProduct[]): AdminOrder[] => {
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

const buildSeedStore = (): AdminStore => {
  const products = buildSeedProducts(mockProducts);
  const orders = buildSeedOrders(products);

  return {
    products,
    slides: buildSeedSlides(),
    orders,
    stockMovements: [],
  };
};

const parsePersistedStore = (value: string): AdminStore | null => {
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

const getInitialStore = (): AdminStore => {
  if (typeof window === "undefined") {
    return buildSeedStore();
  }

  const persisted = window.localStorage.getItem(ADMIN_STORAGE_KEY);
  const parsed = persisted ? parsePersistedStore(persisted) : null;
  return parsed ?? buildSeedStore();
};

export default function AdminPage() {
  const [store, setStore] = useState<AdminStore>(getInitialStore);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [productEditingId, setProductEditingId] = useState<string | null>(null);
  const [productDraft, setProductDraft] = useState<ProductDraft>(() =>
    createEmptyProductDraft(),
  );

  const [carouselEditingId, setCarouselEditingId] = useState<string | null>(null);
  const [carouselDraft, setCarouselDraft] = useState<CarouselDraft>(() =>
    createEmptyCarouselDraft(),
  );

  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<AdminOrderStatus | "all">(
    "all",
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [stockSearch, setStockSearch] = useState("");
  const [stockOnlyLow, setStockOnlyLow] = useState(false);
  const [stockMovementDraft, setStockMovementDraft] = useState<StockMovementDraft>({
    variantKey: "",
    type: "in",
    quantity: "1",
    reason: "",
    actor: "admin@auraactivewear.com",
  });

  useEffect(() => {
    window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event(ADMIN_STORE_UPDATED_EVENT));
  }, [store]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setFeedback(null);
    }, 3200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [feedback]);

  const products = store.products;
  const slides = store.slides;
  const orders = store.orders;
  const stockMovements = store.stockMovements;

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [products]);

  const sortedSlides = useMemo(() => {
    return [...slides].sort((a, b) => {
      if (a.placement !== b.placement) {
        return a.placement.localeCompare(b.placement);
      }

      return a.order - b.order;
    });
  }, [slides]);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders]);

  const stockRows = useMemo<StockRow[]>(() => {
    return products.flatMap((product) => {
      return product.variants.map((variant) => ({
        key: makeVariantKey(product.id, variant.id),
        productId: product.id,
        productName: product.name,
        productReference: product.reference,
        category: product.category,
        collection: product.collection,
        variantId: variant.id,
        sku: variant.sku,
        size: variant.size,
        colorName: variant.colorName,
        colorHex: variant.colorHex,
        quantity: variant.quantity,
        lowStockThreshold: product.lowStockThreshold,
        isProductActive: product.isActive,
      }));
    });
  }, [products]);

  const effectiveVariantKey =
    stockMovementDraft.variantKey &&
    stockRows.some((row) => row.key === stockMovementDraft.variantKey)
      ? stockMovementDraft.variantKey
      : stockRows[0]?.key ?? "";

  const filteredOrders = useMemo(() => {
    const normalizedSearch = orderSearch.trim().toLowerCase();

    return sortedOrders.filter((order) => {
      if (orderStatusFilter !== "all" && order.status !== orderStatusFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchable = `${order.number} ${order.customerName} ${order.customerEmail}`.toLowerCase();
      return searchable.includes(normalizedSearch);
    });
  }, [sortedOrders, orderSearch, orderStatusFilter]);

  const selectedOrder = useMemo(() => {
    const fallbackOrderId = sortedOrders[0]?.id ?? null;
    const activeOrderId = selectedOrderId ?? fallbackOrderId;

    if (!activeOrderId) {
      return null;
    }

    return orders.find((order) => order.id === activeOrderId) ?? null;
  }, [orders, selectedOrderId, sortedOrders]);

  const filteredStockRows = useMemo(() => {
    const normalizedSearch = stockSearch.trim().toLowerCase();

    return stockRows.filter((row) => {
      if (stockOnlyLow && row.quantity > row.lowStockThreshold) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchable = `${row.productName} ${row.sku} ${row.category} ${row.collection} ${row.colorName} ${row.size}`.toLowerCase();
      return searchable.includes(normalizedSearch);
    });
  }, [stockRows, stockSearch, stockOnlyLow]);

  const latestOrders = useMemo(() => {
    return sortedOrders.slice(0, 5);
  }, [sortedOrders]);

  const latestMovements = useMemo(() => {
    return [...stockMovements].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [stockMovements]);

  const lowStockRows = useMemo(() => {
    return stockRows.filter((row) => row.quantity <= row.lowStockThreshold);
  }, [stockRows]);

  const dashboardMetrics = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter((product) => product.isActive).length;
    const totalVariants = products.reduce((sum, product) => sum + product.variants.length, 0);
    const totalUnitsInStock = stockRows.reduce((sum, row) => sum + row.quantity, 0);
    const orderCountOpen = orders.filter((order) => {
      return ["pending", "paid", "picking", "shipped"].includes(order.status);
    }).length;
    const orderCountDelivered = orders.filter((order) => order.status === "delivered").length;
    const revenuePaid = orders
      .filter((order) => order.paymentStatus === "paid")
      .reduce((sum, order) => sum + calculateOrderTotal(order), 0);

    return {
      totalProducts,
      activeProducts,
      totalVariants,
      totalUnitsInStock,
      lowStockCount: lowStockRows.length,
      orderCountOpen,
      orderCountDelivered,
      revenuePaid,
    };
  }, [products, stockRows, orders, lowStockRows.length]);

  const orderStatusCount = useMemo(() => {
    return orderStatusOptions.map((status) => ({
      status: status.value,
      label: status.label,
      count: orders.filter((order) => order.status === status.value).length,
    }));
  }, [orders]);

  const notify = (type: Feedback["type"], message: string) => {
    setFeedback({ type, message });
  };

  const resetProductForm = () => {
    setProductEditingId(null);
    setProductDraft(createEmptyProductDraft());
  };

  const resetCarouselForm = () => {
    setCarouselEditingId(null);
    setCarouselDraft(createEmptyCarouselDraft());
  };

  const handleResetDemoData = () => {
    if (!window.confirm("Restaurar dados de demonstracao e apagar alteracoes locais?")) {
      return;
    }

    const freshStore = buildSeedStore();
    window.localStorage.removeItem(ADMIN_STORAGE_KEY);
    setStore(freshStore);
    resetProductForm();
    resetCarouselForm();
    setOrderSearch("");
    setOrderStatusFilter("all");
    setStockSearch("");
    setStockOnlyLow(false);
    notify("success", "Painel restaurado com dados de demonstracao.");
  };

  const handleProductVariantDraftChange = (
    variantId: string,
    field: keyof ProductVariantDraft,
    value: string,
  ) => {
    setProductDraft((current) => ({
      ...current,
      variants: current.variants.map((variant) => {
        if (variant.id !== variantId) {
          return variant;
        }

        return {
          ...variant,
          [field]: value,
        };
      }),
    }));
  };

  const handleAddVariantDraft = () => {
    setProductDraft((current) => ({
      ...current,
      variants: [...current.variants, createEmptyVariantDraft()],
    }));
  };

  const handleRemoveVariantDraft = (variantId: string) => {
    setProductDraft((current) => {
      if (current.variants.length <= 1) {
        return current;
      }

      return {
        ...current,
        variants: current.variants.filter((variant) => variant.id !== variantId),
      };
    });
  };

  const handleEditProduct = (product: AdminProduct) => {
    setActiveTab("products");
    setProductEditingId(product.id);
    setProductDraft(toProductDraft(product));
  };

  const handleDeleteProduct = (productId: string) => {
    if (!store) {
      return;
    }

    const product = store.products.find((item) => item.id === productId);
    if (!product) {
      return;
    }

    if (!window.confirm(`Excluir o produto \"${product.name}\"?`)) {
      return;
    }

    setStore((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        products: current.products.filter((item) => item.id !== productId),
      };
    });

    if (productEditingId === productId) {
      resetProductForm();
    }

    notify("success", "Produto excluido com sucesso.");
  };

  const handleProductSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!store) {
      return;
    }

    const normalizedName = productDraft.name.trim();
    if (!normalizedName) {
      notify("error", "Informe o nome do produto.");
      return;
    }

    const normalizedReference = productDraft.reference.trim();
    const normalizedCategory = productDraft.category.trim();
    const normalizedCollection = productDraft.collection.trim();
    const normalizedImageUrl = productDraft.imageUrl.trim();

    const price = toNumber(productDraft.price, 0);
    if (price <= 0) {
      notify("error", "O preco precisa ser maior que zero.");
      return;
    }

    const compareAtPriceValue = toNumber(productDraft.compareAtPrice, 0);
    const compareAtPrice = compareAtPriceValue > price ? compareAtPriceValue : undefined;

    const lowStockThreshold = Math.max(0, toInteger(productDraft.lowStockThreshold, 6));

    const normalizedVariants: AdminProductVariant[] = [];

    for (const [index, variantDraft] of productDraft.variants.entries()) {
      const size = variantDraft.size.trim();
      const colorName = variantDraft.colorName.trim();
      const colorHex = variantDraft.colorHex.trim() || "#111111";
      const quantity = Math.max(0, toInteger(variantDraft.quantity, 0));
      const sku =
        variantDraft.sku.trim() ||
        makeVariantSku(normalizedReference || normalizedName, size, colorName, index);

      if (!size || !colorName) {
        notify("error", "Toda variante precisa de tamanho e cor.");
        return;
      }

      normalizedVariants.push({
        id: productEditingId ? variantDraft.id : createId("variant"),
        sku,
        size,
        colorName,
        colorHex,
        quantity,
      });
    }

    if (!normalizedVariants.length) {
      notify("error", "Adicione ao menos uma variante para salvar o produto.");
      return;
    }

    const duplicateSkus = new Set<string>();
    for (const variant of normalizedVariants) {
      if (duplicateSkus.has(variant.sku)) {
        notify("error", "Existem SKUs duplicados no produto.");
        return;
      }

      duplicateSkus.add(variant.sku);
    }

    const timestamp = nowIso();

    setStore((current) => {
      if (!current) {
        return current;
      }

      const isEditing = !!productEditingId;
      const existing = isEditing
        ? current.products.find((product) => product.id === productEditingId)
        : null;

      const productToSave: AdminProduct = {
        id: existing?.id ?? createId("product"),
        name: normalizedName,
        reference: normalizedReference,
        category: normalizedCategory || "Sem categoria",
        collection: normalizedCollection || "Sem colecao",
        imageUrl: normalizedImageUrl,
        price,
        compareAtPrice,
        isActive: productDraft.isActive,
        isFeatured: productDraft.isFeatured,
        lowStockThreshold,
        variants: normalizedVariants,
        inStock: computeProductInStock({ variants: normalizedVariants }),
        createdAt: existing?.createdAt ?? timestamp,
        updatedAt: timestamp,
      };

      const nextProducts = isEditing
        ? current.products.map((product) =>
            product.id === productToSave.id ? productToSave : product,
          )
        : [productToSave, ...current.products];

      return {
        ...current,
        products: nextProducts,
      };
    });

    resetProductForm();
    notify(
      "success",
      productEditingId
        ? "Produto atualizado com sucesso."
        : "Produto criado com sucesso.",
    );
  };

  const handleEditSlide = (slide: AdminCarouselSlide) => {
    setActiveTab("carousel");
    setCarouselEditingId(slide.id);
    setCarouselDraft(toCarouselDraft(slide));
  };

  const handleDeleteSlide = (slideId: string) => {
    if (!store) {
      return;
    }

    const targetSlide = store.slides.find((slide) => slide.id === slideId);
    if (!targetSlide) {
      return;
    }

    if (!window.confirm(`Excluir o slide \"${targetSlide.title || targetSlide.alt}\"?`)) {
      return;
    }

    setStore((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        slides: current.slides.filter((slide) => slide.id !== slideId),
      };
    });

    if (carouselEditingId === slideId) {
      resetCarouselForm();
    }

    notify("success", "Slide removido com sucesso.");
  };

  const handleMoveSlide = (slideId: string, direction: -1 | 1) => {
    setStore((current) => {
      if (!current) {
        return current;
      }

      const slide = current.slides.find((item) => item.id === slideId);
      if (!slide) {
        return current;
      }

      const samePlacement = current.slides
        .filter((item) => item.placement === slide.placement)
        .sort((a, b) => a.order - b.order);

      const index = samePlacement.findIndex((item) => item.id === slide.id);
      const target = samePlacement[index + direction];
      if (!target) {
        return current;
      }

      const slideOrder = slide.order;
      const targetOrder = target.order;

      return {
        ...current,
        slides: current.slides.map((item) => {
          if (item.id === slide.id) {
            return {
              ...item,
              order: targetOrder,
              updatedAt: nowIso(),
            };
          }

          if (item.id === target.id) {
            return {
              ...item,
              order: slideOrder,
              updatedAt: nowIso(),
            };
          }

          return item;
        }),
      };
    });
  };

  const handleCarouselSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!store) {
      return;
    }

    const normalizedImageUrl = carouselDraft.imageUrl.trim();
    const normalizedAlt = carouselDraft.alt.trim();

    if (!normalizedImageUrl || !normalizedAlt) {
      notify("error", "Slide precisa de imagem e texto alternativo.");
      return;
    }

    const timestamp = nowIso();

    setStore((current) => {
      if (!current) {
        return current;
      }

      const existing = carouselEditingId
        ? current.slides.find((slide) => slide.id === carouselEditingId)
        : null;

      const highestOrder = current.slides
        .filter((slide) => slide.placement === carouselDraft.placement)
        .reduce((max, slide) => Math.max(max, slide.order), 0);

      const slideToSave: AdminCarouselSlide = {
        id: existing?.id ?? createId("slide"),
        placement: carouselDraft.placement,
        title: carouselDraft.title.trim(),
        subtitle: carouselDraft.subtitle.trim(),
        imageUrl: normalizedImageUrl,
        alt: normalizedAlt,
        ctaLabel: carouselDraft.ctaLabel.trim(),
        ctaHref: carouselDraft.ctaHref.trim(),
        isActive: carouselDraft.isActive,
        order:
          existing && existing.placement === carouselDraft.placement
            ? existing.order
            : highestOrder + 1,
        createdAt: existing?.createdAt ?? timestamp,
        updatedAt: timestamp,
      };

      const nextSlides = existing
        ? current.slides.map((slide) =>
            slide.id === slideToSave.id ? slideToSave : slide,
          )
        : [...current.slides, slideToSave];

      return {
        ...current,
        slides: nextSlides,
      };
    });

    resetCarouselForm();
    notify(
      "success",
      carouselEditingId
        ? "Slide atualizado com sucesso."
        : "Slide adicionado com sucesso.",
    );
  };

  const handleOrderStatusChange = (orderId: string, status: AdminOrderStatus) => {
    setStore((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        orders: current.orders.map((order) => {
          if (order.id !== orderId) {
            return order;
          }

          return {
            ...order,
            status,
            updatedAt: nowIso(),
          };
        }),
      };
    });
  };

  const handleStockMovementSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const quantity = Math.max(0, toInteger(stockMovementDraft.quantity, 0));
    if (quantity <= 0) {
      notify("error", "Informe uma quantidade valida para movimentacao.");
      return;
    }

    if (!effectiveVariantKey) {
      notify("error", "Selecione uma variante para movimentar.");
      return;
    }

    const selectedStockRow = stockRows.find((row) => row.key === effectiveVariantKey);
    if (!selectedStockRow) {
      notify("error", "Variante selecionada nao encontrada.");
      return;
    }

    if (stockMovementDraft.type === "out" && quantity > selectedStockRow.quantity) {
      notify("error", "Nao ha estoque suficiente para esta saida.");
      return;
    }

    const [productId, variantId] = effectiveVariantKey.split("::");
    const previousQuantity = selectedStockRow.quantity;

    const newQuantity =
      stockMovementDraft.type === "in"
        ? previousQuantity + quantity
        : stockMovementDraft.type === "out"
          ? previousQuantity - quantity
          : quantity;

    const reason = stockMovementDraft.reason.trim() || "Ajuste manual";
    const actor = stockMovementDraft.actor.trim() || "admin@auraactivewear.com";

    setStore((current) => {
      const timestamp = nowIso();

      const nextProducts = current.products.map((product) => {
        if (product.id !== productId) {
          return product;
        }

        const nextVariants = product.variants.map((variant) => {
          if (variant.id !== variantId) {
            return variant;
          }

          return {
            ...variant,
            quantity: newQuantity,
          };
        });

        return {
          ...product,
          variants: nextVariants,
          inStock: computeProductInStock({ variants: nextVariants }),
          updatedAt: timestamp,
        };
      });

      const movement: StockMovement = {
        id: createId("movement"),
        productId: selectedStockRow.productId,
        productName: selectedStockRow.productName,
        variantId: selectedStockRow.variantId,
        sku: selectedStockRow.sku,
        size: selectedStockRow.size,
        colorName: selectedStockRow.colorName,
        type: stockMovementDraft.type,
        quantity,
        previousQuantity,
        newQuantity,
        reason,
        actor,
        createdAt: timestamp,
      };

      return {
        ...current,
        products: nextProducts,
        stockMovements: [movement, ...current.stockMovements],
      };
    });

    setStockMovementDraft((current) => ({
      ...current,
      quantity: "1",
      reason: "",
    }));

    notify("success", "Movimentacao de estoque registrada.");
  };

  return (
    <section className="relative py-8 pb-14">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_5%,rgba(255,255,255,0.7),transparent_35%),radial-gradient(circle_at_86%_85%,rgba(110,99,168,0.18),transparent_35%)]" />

      <div className="space-y-6">
        <header className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm md:p-7">
          <p className="font-roboto text-xs font-black uppercase tracking-[0.2em] text-secondary">
            PAINEL ADMINISTRATIVO
          </p>
          <h1 className="font-roboto mt-2 text-2xl font-black uppercase tracking-[0.08em] text-ink md:text-3xl">
            Gestao Aura Activewear
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-muted md:text-base">
            Area de operacao para produtos, carrosseis, pedidos e estoque. Os dados
            estao persistidos localmente neste navegador ate o backend ser integrado.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href="/products"
              prefetch={false}
              className="rounded-full border border-secondary/30 bg-paper px-4 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-primary-soft/35"
            >
              Ir para vitrine
            </Link>
            <button
              type="button"
              onClick={handleResetDemoData}
              className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-primary"
            >
              Restaurar dados demo
            </button>
          </div>
        </header>

        {feedback ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
              feedback.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-rose-300 bg-rose-50 text-rose-800"
            }`}
          >
            {feedback.message}
          </div>
        ) : null}

        <nav className="grid gap-2 rounded-3xl border border-secondary/20 bg-white p-3 shadow-sm md:grid-cols-5">
          {tabItems.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-2xl border px-3 py-3 text-left transition-colors ${
                  isActive
                    ? "border-secondary bg-primary-soft/45"
                    : "border-secondary/15 hover:border-secondary/40"
                }`}
              >
                <p className="font-roboto text-sm font-black uppercase tracking-[0.12em] text-secondary">
                  {tab.label}
                </p>
                <p className="mt-1 text-xs text-muted">{tab.description}</p>
              </button>
            );
          })}
        </nav>

        {activeTab === "dashboard" ? (
          <div className="space-y-6">
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-secondary/20 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Produtos ativos
                </p>
                <p className="mt-2 text-2xl font-black text-secondary">
                  {dashboardMetrics.activeProducts}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {dashboardMetrics.totalProducts} no catalogo
                </p>
              </article>

              <article className="rounded-2xl border border-secondary/20 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Variantes em estoque
                </p>
                <p className="mt-2 text-2xl font-black text-secondary">
                  {dashboardMetrics.totalUnitsInStock}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {dashboardMetrics.totalVariants} SKUs monitorados
                </p>
              </article>

              <article className="rounded-2xl border border-secondary/20 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Pedidos em andamento
                </p>
                <p className="mt-2 text-2xl font-black text-secondary">
                  {dashboardMetrics.orderCountOpen}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {dashboardMetrics.orderCountDelivered} entregues
                </p>
              </article>

              <article className="rounded-2xl border border-secondary/20 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Receita pedidos pagos
                </p>
                <p className="mt-2 text-2xl font-black text-secondary">
                  {currencyFormatter.format(dashboardMetrics.revenuePaid)}
                </p>
                <p className="mt-1 text-xs text-muted">Baseada no status de pagamento</p>
              </article>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <article className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
                    Alertas de estoque
                  </h2>
                  <span className="rounded-full border border-secondary/25 bg-primary-soft/35 px-2.5 py-1 text-xs font-semibold text-secondary">
                    {dashboardMetrics.lowStockCount} alertas
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  {lowStockRows.slice(0, 6).map((row) => (
                    <div
                      key={`dashboard-low-${row.key}`}
                      className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2"
                    >
                      <p className="text-sm font-semibold text-amber-900">{row.productName}</p>
                      <p className="mt-0.5 text-xs text-amber-800">
                        SKU {row.sku} | {row.size} | {row.colorName}
                      </p>
                      <p className="mt-0.5 text-xs text-amber-800">
                        {row.quantity} un. disponiveis (limite {row.lowStockThreshold})
                      </p>
                    </div>
                  ))}

                  {lowStockRows.length === 0 ? (
                    <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                      Nenhum item abaixo do limite minimo.
                    </p>
                  ) : null}
                </div>
              </article>

              <article className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
                <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
                  Ultimos pedidos
                </h2>
                <div className="mt-4 space-y-2.5">
                  {latestOrders.map((order) => (
                    <button
                      key={`dashboard-order-${order.id}`}
                      type="button"
                      onClick={() => {
                        setActiveTab("orders");
                        setSelectedOrderId(order.id);
                      }}
                      className="w-full rounded-xl border border-secondary/15 px-3 py-2 text-left transition-colors hover:border-secondary/40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-ink">Pedido #{order.number}</p>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${orderStatusBadgeClass[order.status]}`}
                        >
                          {orderStatusOptions.find((item) => item.value === order.status)?.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted">{order.customerName}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {dateFormatter.format(new Date(order.createdAt))} | {currencyFormatter.format(calculateOrderTotal(order))}
                      </p>
                    </button>
                  ))}
                </div>
              </article>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <article className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
                <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
                  Distribuicao de pedidos
                </h2>
                <div className="mt-4 space-y-2">
                  {orderStatusCount.map((statusCount) => (
                    <div
                      key={`status-count-${statusCount.status}`}
                      className="flex items-center justify-between rounded-xl border border-secondary/15 px-3 py-2"
                    >
                      <p className="text-sm text-ink">{statusCount.label}</p>
                      <span className="text-sm font-bold text-secondary">{statusCount.count}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
                <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
                  Ultimas movimentacoes de estoque
                </h2>
                <div className="mt-4 space-y-2">
                  {latestMovements.slice(0, 6).map((movement) => (
                    <div
                      key={`movement-dashboard-${movement.id}`}
                      className="rounded-xl border border-secondary/15 px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-ink">{movement.productName}</p>
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                          {movement.type === "in"
                            ? "entrada"
                            : movement.type === "out"
                              ? "saida"
                              : "ajuste"}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted">
                        {movement.previousQuantity} -&gt; {movement.newQuantity} un. | {movement.reason}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {dateTimeFormatter.format(new Date(movement.createdAt))}
                      </p>
                    </div>
                  ))}

                  {!latestMovements.length ? (
                    <p className="rounded-xl border border-secondary/15 px-3 py-2 text-sm text-muted">
                      Ainda nao ha movimentacoes registradas.
                    </p>
                  ) : null}
                </div>
              </article>
            </section>
          </div>
        ) : null}

        {activeTab === "products" ? (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.6fr)]">
            <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
                    {productEditingId ? "Editar produto" : "Novo produto"}
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    Cadastro completo com variacoes de tamanho/cor e estoque inicial.
                  </p>
                </div>

                {productEditingId ? (
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="rounded-full border border-secondary/30 px-3 py-1.5 text-xs font-semibold text-secondary"
                  >
                    Cancelar
                  </button>
                ) : null}
              </div>

              <form className="mt-4 space-y-3" onSubmit={handleProductSubmit}>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="product-name">
                    Nome
                  </label>
                  <input
                    id="product-name"
                    className={inputClassName}
                    value={productDraft.name}
                    onChange={(event) =>
                      setProductDraft((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Nome do produto"
                    required
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="product-reference">
                      Referencia
                    </label>
                    <input
                      id="product-reference"
                      className={inputClassName}
                      value={productDraft.reference}
                      onChange={(event) =>
                        setProductDraft((current) => ({
                          ...current,
                          reference: event.target.value,
                        }))
                      }
                      placeholder="K5241-A"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="product-category">
                      Categoria
                    </label>
                    <input
                      id="product-category"
                      className={inputClassName}
                      value={productDraft.category}
                      onChange={(event) =>
                        setProductDraft((current) => ({
                          ...current,
                          category: event.target.value,
                        }))
                      }
                      placeholder="Legging, Top, Macacao..."
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="product-collection">
                      Colecao
                    </label>
                    <input
                      id="product-collection"
                      className={inputClassName}
                      value={productDraft.collection}
                      onChange={(event) =>
                        setProductDraft((current) => ({
                          ...current,
                          collection: event.target.value,
                        }))
                      }
                      placeholder="Legacy, Boost..."
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="product-image-url">
                      URL da imagem
                    </label>
                    <input
                      id="product-image-url"
                      className={inputClassName}
                      value={productDraft.imageUrl}
                      onChange={(event) =>
                        setProductDraft((current) => ({
                          ...current,
                          imageUrl: event.target.value,
                        }))
                      }
                      placeholder="/Products/imagem.jpeg"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="product-price">
                      Preco
                    </label>
                    <input
                      id="product-price"
                      className={inputClassName}
                      inputMode="decimal"
                      value={productDraft.price}
                      onChange={(event) =>
                        setProductDraft((current) => ({
                          ...current,
                          price: event.target.value,
                        }))
                      }
                      placeholder="149.90"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="product-compare-at-price">
                      Preco antigo
                    </label>
                    <input
                      id="product-compare-at-price"
                      className={inputClassName}
                      inputMode="decimal"
                      value={productDraft.compareAtPrice}
                      onChange={(event) =>
                        setProductDraft((current) => ({
                          ...current,
                          compareAtPrice: event.target.value,
                        }))
                      }
                      placeholder="199.90"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="product-low-stock-threshold">
                      Limite estoque baixo
                    </label>
                    <input
                      id="product-low-stock-threshold"
                      className={inputClassName}
                      inputMode="numeric"
                      value={productDraft.lowStockThreshold}
                      onChange={(event) =>
                        setProductDraft((current) => ({
                          ...current,
                          lowStockThreshold: event.target.value,
                        }))
                      }
                      placeholder="6"
                    />
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-xl border border-secondary/20 px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      className="accent-secondary"
                      checked={productDraft.isActive}
                      onChange={(event) =>
                        setProductDraft((current) => ({
                          ...current,
                          isActive: event.target.checked,
                        }))
                      }
                    />
                    Produto ativo
                  </label>
                  <label className="flex items-center gap-2 rounded-xl border border-secondary/20 px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      className="accent-secondary"
                      checked={productDraft.isFeatured}
                      onChange={(event) =>
                        setProductDraft((current) => ({
                          ...current,
                          isFeatured: event.target.checked,
                        }))
                      }
                    />
                    Produto em destaque
                  </label>
                </div>

                <div className="rounded-2xl border border-secondary/20 bg-paper/60 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                      Variantes
                    </p>
                    <button
                      type="button"
                      onClick={handleAddVariantDraft}
                      className="rounded-full border border-secondary/30 px-3 py-1.5 text-xs font-semibold text-secondary"
                    >
                      + Variante
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {productDraft.variants.map((variantDraft) => (
                      <div
                        key={variantDraft.id}
                        className="rounded-xl border border-secondary/15 bg-white p-3"
                      >
                        <div className="grid gap-2 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted" htmlFor={`variant-sku-${variantDraft.id}`}>
                              SKU
                            </label>
                            <input
                              id={`variant-sku-${variantDraft.id}`}
                              className={inputClassName}
                              value={variantDraft.sku}
                              onChange={(event) =>
                                handleProductVariantDraftChange(
                                  variantDraft.id,
                                  "sku",
                                  event.target.value,
                                )
                              }
                              placeholder="AURA-..."
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted" htmlFor={`variant-size-${variantDraft.id}`}>
                              Tamanho
                            </label>
                            <input
                              id={`variant-size-${variantDraft.id}`}
                              className={inputClassName}
                              value={variantDraft.size}
                              onChange={(event) =>
                                handleProductVariantDraftChange(
                                  variantDraft.id,
                                  "size",
                                  event.target.value,
                                )
                              }
                              placeholder="P, M, G..."
                            />
                          </div>
                        </div>

                        <div className="mt-2 grid gap-2 sm:grid-cols-3">
                          <div>
                            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted" htmlFor={`variant-color-name-${variantDraft.id}`}>
                              Cor
                            </label>
                            <input
                              id={`variant-color-name-${variantDraft.id}`}
                              className={inputClassName}
                              value={variantDraft.colorName}
                              onChange={(event) =>
                                handleProductVariantDraftChange(
                                  variantDraft.id,
                                  "colorName",
                                  event.target.value,
                                )
                              }
                              placeholder="Preto"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted" htmlFor={`variant-color-hex-${variantDraft.id}`}>
                              HEX
                            </label>
                            <input
                              id={`variant-color-hex-${variantDraft.id}`}
                              className={inputClassName}
                              value={variantDraft.colorHex}
                              onChange={(event) =>
                                handleProductVariantDraftChange(
                                  variantDraft.id,
                                  "colorHex",
                                  event.target.value,
                                )
                              }
                              placeholder="#111111"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted" htmlFor={`variant-quantity-${variantDraft.id}`}>
                              Quantidade
                            </label>
                            <input
                              id={`variant-quantity-${variantDraft.id}`}
                              className={inputClassName}
                              inputMode="numeric"
                              value={variantDraft.quantity}
                              onChange={(event) =>
                                handleProductVariantDraftChange(
                                  variantDraft.id,
                                  "quantity",
                                  event.target.value,
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="mt-2 flex justify-end">
                          <button
                            type="button"
                            disabled={productDraft.variants.length <= 1}
                            onClick={() => handleRemoveVariantDraft(variantDraft.id)}
                            className="text-xs font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Remover variante
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-primary"
                >
                  {productEditingId ? "Salvar alteracoes" : "Cadastrar produto"}
                </button>
              </form>
            </section>

            <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
                  Produtos cadastrados
                </h2>
                <span className="rounded-full border border-secondary/25 bg-primary-soft/35 px-2.5 py-1 text-xs font-semibold text-secondary">
                  {sortedProducts.length} itens
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full text-sm">
                  <thead>
                    <tr className="border-b border-secondary/20 text-left text-xs uppercase tracking-[0.12em] text-muted">
                      <th className="pb-2 pr-3">Produto</th>
                      <th className="pb-2 pr-3">Preco</th>
                      <th className="pb-2 pr-3">Colecao</th>
                      <th className="pb-2 pr-3">Variantes</th>
                      <th className="pb-2 pr-3">Estoque</th>
                      <th className="pb-2 pr-3">Status</th>
                      <th className="pb-2 text-right">Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProducts.map((product) => {
                      const productStock = product.variants.reduce(
                        (sum, variant) => sum + variant.quantity,
                        0,
                      );

                      return (
                        <tr
                          key={product.id}
                          className="border-b border-secondary/10 align-top"
                        >
                          <td className="py-3 pr-3">
                            <p className="font-semibold text-ink">{product.name}</p>
                            <p className="mt-1 text-xs text-muted">{product.reference || "Sem referencia"}</p>
                            <p className="mt-1 text-xs text-muted">{product.category}</p>
                          </td>
                          <td className="py-3 pr-3">
                            <p className="font-semibold text-ink">
                              {currencyFormatter.format(product.price)}
                            </p>
                            {product.compareAtPrice ? (
                              <p className="text-xs text-muted line-through">
                                {currencyFormatter.format(product.compareAtPrice)}
                              </p>
                            ) : null}
                          </td>
                          <td className="py-3 pr-3 text-ink">{product.collection}</td>
                          <td className="py-3 pr-3 text-ink">{product.variants.length}</td>
                          <td className="py-3 pr-3">
                            <p className="font-semibold text-ink">{productStock} un.</p>
                            <p className="text-xs text-muted">
                              limite: {product.lowStockThreshold}
                            </p>
                          </td>
                          <td className="py-3 pr-3">
                            <span
                              className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${
                                product.isActive
                                  ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                                  : "border-zinc-300 bg-zinc-100 text-zinc-700"
                              }`}
                            >
                              {product.isActive ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditProduct(product)}
                                className="rounded-full border border-secondary/25 px-3 py-1 text-xs font-semibold text-secondary"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="rounded-full border border-rose-300 px-3 py-1 text-xs font-semibold text-rose-700"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        ) : null}

        {activeTab === "carousel" ? (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
            <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
                    {carouselEditingId ? "Editar slide" : "Novo slide"}
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    Controle de banners de home hero e carrossel de produtos.
                  </p>
                </div>

                {carouselEditingId ? (
                  <button
                    type="button"
                    onClick={resetCarouselForm}
                    className="rounded-full border border-secondary/30 px-3 py-1.5 text-xs font-semibold text-secondary"
                  >
                    Cancelar
                  </button>
                ) : null}
              </div>

              <form className="mt-4 space-y-3" onSubmit={handleCarouselSubmit}>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="slide-placement">
                    Local de exibicao
                  </label>
                  <select
                    id="slide-placement"
                    className={inputClassName}
                    value={carouselDraft.placement}
                    onChange={(event) =>
                      setCarouselDraft((current) => ({
                        ...current,
                        placement: event.target.value as CarouselPlacement,
                      }))
                    }
                  >
                    <option value="home-hero">Home - Hero principal</option>
                    <option value="home-products">Home - Produtos em destaque</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="slide-title">
                    Titulo
                  </label>
                  <input
                    id="slide-title"
                    className={inputClassName}
                    value={carouselDraft.title}
                    onChange={(event) =>
                      setCarouselDraft((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Campanha nova"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="slide-subtitle">
                    Subtitulo
                  </label>
                  <input
                    id="slide-subtitle"
                    className={inputClassName}
                    value={carouselDraft.subtitle}
                    onChange={(event) =>
                      setCarouselDraft((current) => ({
                        ...current,
                        subtitle: event.target.value,
                      }))
                    }
                    placeholder="Colecao Inverno"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="slide-image-url">
                    URL da imagem
                  </label>
                  <input
                    id="slide-image-url"
                    className={inputClassName}
                    value={carouselDraft.imageUrl}
                    onChange={(event) =>
                      setCarouselDraft((current) => ({
                        ...current,
                        imageUrl: event.target.value,
                      }))
                    }
                    placeholder="https://..."
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="slide-alt">
                    Alt da imagem
                  </label>
                  <input
                    id="slide-alt"
                    className={inputClassName}
                    value={carouselDraft.alt}
                    onChange={(event) =>
                      setCarouselDraft((current) => ({
                        ...current,
                        alt: event.target.value,
                      }))
                    }
                    placeholder="Descricao acessivel da imagem"
                    required
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="slide-cta-label">
                      CTA texto
                    </label>
                    <input
                      id="slide-cta-label"
                      className={inputClassName}
                      value={carouselDraft.ctaLabel}
                      onChange={(event) =>
                        setCarouselDraft((current) => ({
                          ...current,
                          ctaLabel: event.target.value,
                        }))
                      }
                      placeholder="Compre agora"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="slide-cta-href">
                      CTA link
                    </label>
                    <input
                      id="slide-cta-href"
                      className={inputClassName}
                      value={carouselDraft.ctaHref}
                      onChange={(event) =>
                        setCarouselDraft((current) => ({
                          ...current,
                          ctaHref: event.target.value,
                        }))
                      }
                      placeholder="/products"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 rounded-xl border border-secondary/20 px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    className="accent-secondary"
                    checked={carouselDraft.isActive}
                    onChange={(event) =>
                      setCarouselDraft((current) => ({
                        ...current,
                        isActive: event.target.checked,
                      }))
                    }
                  />
                  Slide ativo
                </label>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-primary"
                >
                  {carouselEditingId ? "Salvar alteracoes" : "Adicionar slide"}
                </button>
              </form>
            </section>

            <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
                  Slides cadastrados
                </h2>
                <span className="rounded-full border border-secondary/25 bg-primary-soft/35 px-2.5 py-1 text-xs font-semibold text-secondary">
                  {sortedSlides.length} slides
                </span>
              </div>

              <div className="space-y-2.5">
                {sortedSlides.map((slide) => (
                  <article
                    key={slide.id}
                    className="rounded-2xl border border-secondary/15 p-3"
                  >
                    <div className="flex gap-3">
                      <div className="h-20 w-20 overflow-hidden rounded-lg border border-secondary/15 bg-paper">
                        {slide.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={slide.imageUrl}
                            alt={slide.alt}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-[11px] text-muted">
                            sem imagem
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-secondary/25 bg-primary-soft/35 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-secondary">
                            {slide.placement === "home-hero" ? "Home Hero" : "Home Produtos"}
                          </span>
                          <span className="rounded-full border border-secondary/25 px-2 py-0.5 text-[11px] text-muted">
                            Ordem {slide.order}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                              slide.isActive
                                ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                                : "border-zinc-300 bg-zinc-100 text-zinc-700"
                            }`}
                          >
                            {slide.isActive ? "Ativo" : "Inativo"}
                          </span>
                        </div>

                        <p className="mt-2 truncate text-sm font-semibold text-ink">
                          {slide.title || slide.alt}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted">
                          {slide.subtitle || "Sem subtitulo"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(slide.id, -1)}
                        className="rounded-full border border-secondary/25 px-2.5 py-1 text-xs font-semibold text-secondary"
                      >
                        Subir
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSlide(slide.id, 1)}
                        className="rounded-full border border-secondary/25 px-2.5 py-1 text-xs font-semibold text-secondary"
                      >
                        Descer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditSlide(slide)}
                        className="rounded-full border border-secondary/25 px-2.5 py-1 text-xs font-semibold text-secondary"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="rounded-full border border-rose-300 px-2.5 py-1 text-xs font-semibold text-rose-700"
                      >
                        Excluir
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {activeTab === "orders" ? (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-end gap-3">
                <div className="min-w-[220px] flex-1">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="order-search">
                    Buscar pedido
                  </label>
                  <input
                    id="order-search"
                    className={inputClassName}
                    value={orderSearch}
                    onChange={(event) => setOrderSearch(event.target.value)}
                    placeholder="Numero, cliente ou e-mail"
                  />
                </div>

                <div className="w-full sm:w-56">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="order-status-filter">
                    Filtrar status
                  </label>
                  <select
                    id="order-status-filter"
                    className={inputClassName}
                    value={orderStatusFilter}
                    onChange={(event) =>
                      setOrderStatusFilter(event.target.value as AdminOrderStatus | "all")
                    }
                  >
                    <option value="all">Todos</option>
                    {orderStatusOptions.map((status) => (
                      <option key={`filter-${status.value}`} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[780px] w-full text-sm">
                  <thead>
                    <tr className="border-b border-secondary/20 text-left text-xs uppercase tracking-[0.12em] text-muted">
                      <th className="pb-2 pr-3">Pedido</th>
                      <th className="pb-2 pr-3">Cliente</th>
                      <th className="pb-2 pr-3">Data</th>
                      <th className="pb-2 pr-3">Pagamento</th>
                      <th className="pb-2 pr-3">Total</th>
                      <th className="pb-2 pr-3">Status</th>
                      <th className="pb-2 text-right">Detalhes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-secondary/10 align-top"
                      >
                        <td className="py-3 pr-3">
                          <p className="font-semibold text-ink">#{order.number}</p>
                          <p className="mt-0.5 text-xs text-muted">{order.shippingMethod}</p>
                        </td>
                        <td className="py-3 pr-3">
                          <p className="font-semibold text-ink">{order.customerName}</p>
                          <p className="mt-0.5 text-xs text-muted">{order.customerEmail}</p>
                        </td>
                        <td className="py-3 pr-3 text-ink">
                          {dateFormatter.format(new Date(order.createdAt))}
                        </td>
                        <td className="py-3 pr-3 text-ink">
                          {paymentStatusLabel[order.paymentStatus]}
                        </td>
                        <td className="py-3 pr-3 font-semibold text-ink">
                          {currencyFormatter.format(calculateOrderTotal(order))}
                        </td>
                        <td className="py-3 pr-3">
                          <select
                            className="rounded-lg border border-secondary/20 bg-white px-2 py-1 text-xs"
                            value={order.status}
                            onChange={(event) =>
                              handleOrderStatusChange(
                                order.id,
                                event.target.value as AdminOrderStatus,
                              )
                            }
                          >
                            {orderStatusOptions.map((status) => (
                              <option key={`status-${order.id}-${status.value}`} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderId(order.id)}
                            className="rounded-full border border-secondary/25 px-3 py-1 text-xs font-semibold text-secondary"
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
              <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
                Detalhes do pedido
              </h2>

              {selectedOrder ? (
                <div className="mt-4 space-y-4">
                  <div className="rounded-xl border border-secondary/15 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-base font-bold text-ink">Pedido #{selectedOrder.number}</p>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${orderStatusBadgeClass[selectedOrder.status]}`}
                      >
                        {orderStatusOptions.find((item) => item.value === selectedOrder.status)?.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{selectedOrder.customerName}</p>
                    <p className="text-sm text-muted">{selectedOrder.customerEmail}</p>
                    <p className="text-sm text-muted">{selectedOrder.customerPhone}</p>
                    <p className="mt-1 text-xs text-muted">
                      Criado em {dateTimeFormatter.format(new Date(selectedOrder.createdAt))}
                    </p>
                    <p className="text-xs text-muted">
                      Atualizado em {dateTimeFormatter.format(new Date(selectedOrder.updatedAt))}
                    </p>
                  </div>

                  <div className="rounded-xl border border-secondary/15 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      Itens
                    </p>
                    <div className="mt-2 space-y-2">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-lg border border-secondary/10 px-3 py-2"
                        >
                          <p className="text-sm font-semibold text-ink">{item.productName}</p>
                          <p className="mt-0.5 text-xs text-muted">
                            SKU {item.sku} | Tam {item.size} | Cor {item.colorName}
                          </p>
                          <p className="mt-0.5 text-xs text-muted">
                            {item.quantity}x {currencyFormatter.format(item.unitPrice)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-secondary/15 p-3">
                    <p className="flex items-center justify-between text-sm">
                      <span className="text-muted">Subtotal</span>
                      <span className="font-semibold text-ink">
                        {currencyFormatter.format(sumOrderItems(selectedOrder.items))}
                      </span>
                    </p>
                    <p className="mt-1 flex items-center justify-between text-sm">
                      <span className="text-muted">Frete</span>
                      <span className="font-semibold text-ink">
                        {currencyFormatter.format(selectedOrder.shippingAmount)}
                      </span>
                    </p>
                    <p className="mt-1 flex items-center justify-between text-sm">
                      <span className="text-muted">Desconto</span>
                      <span className="font-semibold text-ink">
                        - {currencyFormatter.format(selectedOrder.discountAmount)}
                      </span>
                    </p>
                    <p className="mt-2 flex items-center justify-between border-t border-secondary/15 pt-2 text-sm">
                      <span className="font-semibold text-ink">Total</span>
                      <span className="text-base font-black text-secondary">
                        {currencyFormatter.format(calculateOrderTotal(selectedOrder))}
                      </span>
                    </p>
                  </div>

                  <div className="rounded-xl border border-secondary/15 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      Observacoes
                    </p>
                    <p className="mt-2 text-sm text-ink">
                      {selectedOrder.notes || "Sem observacoes para este pedido."}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 rounded-xl border border-secondary/15 px-3 py-2 text-sm text-muted">
                  Selecione um pedido para visualizar os detalhes.
                </p>
              )}
            </section>
          </div>
        ) : null}

        {activeTab === "stock" ? (
          <div className="space-y-5">
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-secondary/20 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  SKUs monitorados
                </p>
                <p className="mt-2 text-2xl font-black text-secondary">{stockRows.length}</p>
              </article>

              <article className="rounded-2xl border border-secondary/20 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Unidades disponiveis
                </p>
                <p className="mt-2 text-2xl font-black text-secondary">
                  {stockRows.reduce((sum, row) => sum + row.quantity, 0)}
                </p>
              </article>

              <article className="rounded-2xl border border-secondary/20 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Estoque baixo
                </p>
                <p className="mt-2 text-2xl font-black text-amber-700">{lowStockRows.length}</p>
              </article>

              <article className="rounded-2xl border border-secondary/20 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Movimentacoes
                </p>
                <p className="mt-2 text-2xl font-black text-secondary">
                  {stockMovements.length}
                </p>
              </article>
            </section>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)]">
              <article className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
                <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
                  Registrar movimentacao
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Entrada, saida ou ajuste direto por SKU.
                </p>

                <form className="mt-4 space-y-3" onSubmit={handleStockMovementSubmit}>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="movement-variant">
                      SKU / variante
                    </label>
                    <select
                      id="movement-variant"
                      className={inputClassName}
                      value={effectiveVariantKey}
                      onChange={(event) =>
                        setStockMovementDraft((current) => ({
                          ...current,
                          variantKey: event.target.value,
                        }))
                      }
                    >
                      {stockRows.map((row) => (
                        <option key={`movement-row-${row.key}`} value={row.key}>
                          {row.sku} | {row.productName} | {row.size} | {row.colorName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="movement-type">
                        Tipo
                      </label>
                      <select
                        id="movement-type"
                        className={inputClassName}
                        value={stockMovementDraft.type}
                        onChange={(event) =>
                          setStockMovementDraft((current) => ({
                            ...current,
                            type: event.target.value as StockMovementType,
                          }))
                        }
                      >
                        <option value="in">Entrada (+)</option>
                        <option value="out">Saida (-)</option>
                        <option value="adjustment">Ajuste (valor final)</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="movement-quantity">
                        Quantidade
                      </label>
                      <input
                        id="movement-quantity"
                        className={inputClassName}
                        inputMode="numeric"
                        value={stockMovementDraft.quantity}
                        onChange={(event) =>
                          setStockMovementDraft((current) => ({
                            ...current,
                            quantity: event.target.value,
                          }))
                        }
                        placeholder="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="movement-reason">
                      Motivo
                    </label>
                    <input
                      id="movement-reason"
                      className={inputClassName}
                      value={stockMovementDraft.reason}
                      onChange={(event) =>
                        setStockMovementDraft((current) => ({
                          ...current,
                          reason: event.target.value,
                        }))
                      }
                      placeholder="Compra de fornecedor, ajuste inventario..."
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="movement-actor">
                      Responsavel
                    </label>
                    <input
                      id="movement-actor"
                      className={inputClassName}
                      value={stockMovementDraft.actor}
                      onChange={(event) =>
                        setStockMovementDraft((current) => ({
                          ...current,
                          actor: event.target.value,
                        }))
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-primary"
                  >
                    Registrar movimentacao
                  </button>
                </form>
              </article>

              <article className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
                <div className="mb-4 flex flex-wrap items-end gap-3">
                  <div className="min-w-[220px] flex-1">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted" htmlFor="stock-search">
                      Buscar SKU ou produto
                    </label>
                    <input
                      id="stock-search"
                      className={inputClassName}
                      value={stockSearch}
                      onChange={(event) => setStockSearch(event.target.value)}
                      placeholder="Nome, SKU, categoria"
                    />
                  </div>

                  <label className="flex items-center gap-2 rounded-xl border border-secondary/20 px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      className="accent-secondary"
                      checked={stockOnlyLow}
                      onChange={(event) => setStockOnlyLow(event.target.checked)}
                    />
                    Mostrar apenas estoque baixo
                  </label>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-[980px] w-full text-sm">
                    <thead>
                      <tr className="border-b border-secondary/20 text-left text-xs uppercase tracking-[0.12em] text-muted">
                        <th className="pb-2 pr-3">Produto</th>
                        <th className="pb-2 pr-3">SKU</th>
                        <th className="pb-2 pr-3">Variante</th>
                        <th className="pb-2 pr-3">Categoria</th>
                        <th className="pb-2 pr-3">Colecao</th>
                        <th className="pb-2 pr-3">Estoque atual</th>
                        <th className="pb-2 pr-3">Limite</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStockRows.map((row) => {
                        const statusLabel =
                          row.quantity === 0
                            ? "Sem estoque"
                            : row.quantity <= row.lowStockThreshold
                              ? "Abaixo do limite"
                              : "Normal";

                        const statusClass =
                          row.quantity === 0
                            ? "border-rose-300 bg-rose-100 text-rose-700"
                            : row.quantity <= row.lowStockThreshold
                              ? "border-amber-300 bg-amber-100 text-amber-800"
                              : "border-emerald-300 bg-emerald-100 text-emerald-700";

                        return (
                          <tr key={`stock-row-${row.key}`} className="border-b border-secondary/10">
                            <td className="py-2.5 pr-3">
                              <p className="font-semibold text-ink">{row.productName}</p>
                              <p className="text-xs text-muted">{row.productReference || "Sem referencia"}</p>
                            </td>
                            <td className="py-2.5 pr-3 text-ink">{row.sku}</td>
                            <td className="py-2.5 pr-3 text-ink">
                              {row.size} | {row.colorName}
                            </td>
                            <td className="py-2.5 pr-3 text-ink">{row.category}</td>
                            <td className="py-2.5 pr-3 text-ink">{row.collection}</td>
                            <td className="py-2.5 pr-3 font-semibold text-ink">{row.quantity}</td>
                            <td className="py-2.5 pr-3 text-ink">{row.lowStockThreshold}</td>
                            <td className="py-2.5">
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusClass}`}
                              >
                                {statusLabel}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </article>
            </section>

            <section className="rounded-3xl border border-secondary/20 bg-white p-5 shadow-sm">
              <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
                Historico de movimentacoes
              </h2>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-[900px] w-full text-sm">
                  <thead>
                    <tr className="border-b border-secondary/20 text-left text-xs uppercase tracking-[0.12em] text-muted">
                      <th className="pb-2 pr-3">Data</th>
                      <th className="pb-2 pr-3">Produto</th>
                      <th className="pb-2 pr-3">SKU</th>
                      <th className="pb-2 pr-3">Tipo</th>
                      <th className="pb-2 pr-3">Qtd.</th>
                      <th className="pb-2 pr-3">Saldo</th>
                      <th className="pb-2 pr-3">Motivo</th>
                      <th className="pb-2">Responsavel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestMovements.map((movement) => (
                      <tr key={movement.id} className="border-b border-secondary/10">
                        <td className="py-2.5 pr-3 text-ink">
                          {dateTimeFormatter.format(new Date(movement.createdAt))}
                        </td>
                        <td className="py-2.5 pr-3">
                          <p className="font-semibold text-ink">{movement.productName}</p>
                          <p className="text-xs text-muted">
                            {movement.size} | {movement.colorName}
                          </p>
                        </td>
                        <td className="py-2.5 pr-3 text-ink">{movement.sku}</td>
                        <td className="py-2.5 pr-3">
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                              movement.type === "in"
                                ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                                : movement.type === "out"
                                  ? "border-rose-300 bg-rose-100 text-rose-700"
                                  : "border-sky-300 bg-sky-100 text-sky-700"
                            }`}
                          >
                            {movement.type === "in"
                              ? "Entrada"
                              : movement.type === "out"
                                ? "Saida"
                                : "Ajuste"}
                          </span>
                        </td>
                        <td className="py-2.5 pr-3 text-ink">{movement.quantity}</td>
                        <td className="py-2.5 pr-3 text-ink">
                          {movement.previousQuantity} -&gt; {movement.newQuantity}
                        </td>
                        <td className="py-2.5 pr-3 text-ink">{movement.reason}</td>
                        <td className="py-2.5 text-ink">{movement.actor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!latestMovements.length ? (
                <p className="mt-3 rounded-xl border border-secondary/15 px-3 py-2 text-sm text-muted">
                  Nenhuma movimentacao registrada ate o momento.
                </p>
              ) : null}
            </section>
          </div>
        ) : null}
      </div>
    </section>
  );
}
