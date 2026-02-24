import type { MockColor, MockProduct } from "../../mock/catalog";
import { mockProducts } from "../../mock/catalog";

export const ADMIN_STORAGE_KEY = "aura-admin-store-v1";
export const ADMIN_STORE_UPDATED_EVENT = "aura-admin-store-updated";

export type StorefrontProduct = Omit<MockProduct, "id"> & {
  id: string;
  slug: string;
  source: "mock" | "admin";
};

type AdminVariantRecord = {
  id?: string;
  size?: string;
  colorName?: string;
  colorHex?: string;
  quantity?: number;
};

type AdminProductRecord = {
  id?: string;
  name?: string;
  reference?: string;
  category?: string;
  collection?: string;
  imageUrl?: string;
  price?: number;
  compareAtPrice?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
  variants?: AdminVariantRecord[];
};

type AdminStoreRecord = {
  products?: AdminProductRecord[];
};

const defaultFallbackImage =
  "/Products/WhatsApp%20Image%202026-02-09%20at%2018.19.48.jpeg";

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const slugify = (value: string) => {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return normalized || "produto";
};

const dedupeStrings = (values: string[]) => {
  return Array.from(new Set(values.filter(Boolean)));
};

const normalizeColorHex = (hex: string) => {
  if (!hex.startsWith("#")) {
    return `#${hex}`;
  }

  return hex;
};

const ensureUniqueSlugs = <T extends { id: string; slugBase: string }>(items: T[]) => {
  const seen = new Map<string, number>();

  return items.map((item) => {
    const currentCount = seen.get(item.slugBase) ?? 0;
    seen.set(item.slugBase, currentCount + 1);

    return {
      ...item,
      slug: currentCount === 0 ? item.slugBase : `${item.slugBase}-${currentCount + 1}`,
    };
  });
};

const withoutSlugBase = <T extends { slugBase: string }>(item: T): Omit<T, "slugBase"> => {
  return Object.fromEntries(
    Object.entries(item).filter(([key]) => key !== "slugBase"),
  ) as Omit<T, "slugBase">;
};

const parseAdminStore = (rawValue: string): AdminStoreRecord | null => {
  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (!isObjectRecord(parsed)) {
      return null;
    }

    if (!Array.isArray(parsed.products)) {
      return null;
    }

    return {
      products: parsed.products as AdminProductRecord[],
    };
  } catch {
    return null;
  }
};

const mapMockToStorefront = (products: MockProduct[]): StorefrontProduct[] => {
  const withSlugBase = ensureUniqueSlugs(
    products.map((product) => ({
      ...product,
      source: "mock" as const,
      slugBase: slugify(product.reference || product.name),
    })),
  );

  return withSlugBase.map((product) => withoutSlugBase(product));
};

const mapAdminToStorefront = (products: AdminProductRecord[]): StorefrontProduct[] => {
  const mappedWithSlug = ensureUniqueSlugs(
    products
      .filter((product) => product.isActive !== false)
      .map((product, index) => {
        const variants = Array.isArray(product.variants) ? product.variants : [];

        const sizes = dedupeStrings(
          variants.map((variant) => (variant.size || "").trim()).filter(Boolean),
        );

        const colors = dedupeStrings(
          variants
            .map((variant) => (variant.colorName || "").trim())
            .filter(Boolean),
        ).map((colorName): MockColor => {
          const matchingVariant = variants.find(
            (variant) => (variant.colorName || "").trim() === colorName,
          );

          const rawHex = (matchingVariant?.colorHex || "#111111").trim();

          return {
            name: colorName,
            hex: normalizeColorHex(rawHex),
          };
        });

        const inStockFromVariants = variants.some(
          (variant) => typeof variant.quantity === "number" && variant.quantity > 0,
        );

        const productName = (product.name || "Produto Aura").trim();
        const productReference = (product.reference || "").trim();

        return {
          id: (product.id || `admin-product-${index + 1}`).trim(),
          name: productName,
          reference: productReference,
          ctaLabel: "VER PRODUTO",
          image: {
            id: `admin-image-${index + 1}`,
            url: (product.imageUrl || defaultFallbackImage).trim(),
            alt: productName,
          },
          category: (product.category || "Sem categoria").trim(),
          collection: (product.collection || "Sem colecao").trim(),
          sizes: sizes.length > 0 ? sizes : ["UN"],
          colors: colors.length > 0 ? colors : [{ name: "Preto", hex: "#111111" }],
          price:
            typeof product.price === "number" && Number.isFinite(product.price)
              ? product.price
              : 0,
          compareAtPrice:
            typeof product.compareAtPrice === "number" &&
            Number.isFinite(product.compareAtPrice)
              ? product.compareAtPrice
              : undefined,
          isNew: Boolean(product.isFeatured),
          inStock: inStockFromVariants || Boolean(product.inStock),
          source: "admin" as const,
          slugBase: slugify(productReference || productName),
        };
      }),
  );

  return mappedWithSlug.map((product) => withoutSlugBase(product));
};

export const fallbackStorefrontProducts = mapMockToStorefront(mockProducts);

export const getStorefrontProductsFromStorage = (): StorefrontProduct[] => {
  if (typeof window === "undefined") {
    return fallbackStorefrontProducts;
  }

  const rawValue = window.localStorage.getItem(ADMIN_STORAGE_KEY);
  if (!rawValue) {
    return fallbackStorefrontProducts;
  }

  const parsed = parseAdminStore(rawValue);
  if (!parsed?.products?.length) {
    return fallbackStorefrontProducts;
  }

  const mappedProducts = mapAdminToStorefront(parsed.products);
  return mappedProducts.length > 0 ? mappedProducts : fallbackStorefrontProducts;
};

export const buildProductHref = (slug: string) => {
  return `/products/${slug}`;
};
