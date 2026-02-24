import type { StorefrontProduct } from "@/lib/storefront-catalog";

export const CART_STORAGE_KEY = "aura-cart-v1";
export const CART_UPDATED_EVENT = "aura-cart-updated";

export type CartItem = {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  imageUrl: string;
  size: string;
  colorName: string;
  colorHex: string;
  quantity: number;
  unitPrice: number;
};

export type CartState = {
  items: CartItem[];
};

type AddToCartInput = {
  product: StorefrontProduct;
  size: string;
  colorName: string;
  colorHex: string;
  quantity: number;
};

const emptyCartState: CartState = { items: [] };

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const parseCartState = (rawValue: string): CartState | null => {
  try {
    const parsed = JSON.parse(rawValue) as unknown;

    if (!isObjectRecord(parsed) || !Array.isArray(parsed.items)) {
      return null;
    }

    const items = parsed.items
      .filter((item) => isObjectRecord(item))
      .map((item) => ({
        id: typeof item.id === "string" ? item.id : "",
        productId: typeof item.productId === "string" ? item.productId : "",
        productSlug: typeof item.productSlug === "string" ? item.productSlug : "",
        productName: typeof item.productName === "string" ? item.productName : "",
        imageUrl: typeof item.imageUrl === "string" ? item.imageUrl : "",
        size: typeof item.size === "string" ? item.size : "",
        colorName: typeof item.colorName === "string" ? item.colorName : "",
        colorHex: typeof item.colorHex === "string" ? item.colorHex : "#111111",
        quantity: typeof item.quantity === "number" ? item.quantity : 0,
        unitPrice: typeof item.unitPrice === "number" ? item.unitPrice : 0,
      }))
      .filter(
        (item) =>
          item.id &&
          item.productId &&
          item.productSlug &&
          item.productName &&
          item.imageUrl &&
          item.size &&
          item.colorName &&
          item.quantity > 0 &&
          item.unitPrice >= 0,
      );

    return { items };
  } catch {
    return null;
  }
};

const getNextCartItemId = (productId: string, size: string, colorName: string) => {
  return `${productId}::${size}::${colorName}`;
};

const readCartState = (): CartState => {
  if (typeof window === "undefined") {
    return emptyCartState;
  }

  const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!rawValue) {
    return emptyCartState;
  }

  return parseCartState(rawValue) ?? emptyCartState;
};

const writeCartState = (state: CartState) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
};

export const getCartSnapshot = (): CartState => {
  return readCartState();
};

export const getEmptyCartSnapshot = (): CartState => {
  return emptyCartState;
};

export const addToCart = ({
  product,
  size,
  colorName,
  colorHex,
  quantity,
}: AddToCartInput) => {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedQuantity = Math.max(1, Math.floor(quantity));
  const nextId = getNextCartItemId(product.id, size, colorName);
  const currentState = readCartState();

  const existingItemIndex = currentState.items.findIndex((item) => item.id === nextId);

  if (existingItemIndex >= 0) {
    const nextItems = [...currentState.items];
    const currentItem = nextItems[existingItemIndex];
    nextItems[existingItemIndex] = {
      ...currentItem,
      quantity: currentItem.quantity + normalizedQuantity,
    };

    writeCartState({ items: nextItems });
    return;
  }

  const nextItem: CartItem = {
    id: nextId,
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    imageUrl: product.image.url,
    size,
    colorName,
    colorHex,
    quantity: normalizedQuantity,
    unitPrice: product.price,
  };

  writeCartState({
    items: [...currentState.items, nextItem],
  });
};

export const removeFromCart = (itemId: string) => {
  if (typeof window === "undefined") {
    return;
  }

  const currentState = readCartState();
  writeCartState({
    items: currentState.items.filter((item) => item.id !== itemId),
  });
};

export const updateCartItemQuantity = (itemId: string, quantity: number) => {
  if (typeof window === "undefined") {
    return;
  }

  if (quantity <= 0) {
    removeFromCart(itemId);
    return;
  }

  const nextQuantity = Math.floor(quantity);
  const currentState = readCartState();

  writeCartState({
    items: currentState.items.map((item) => {
      if (item.id !== itemId) {
        return item;
      }

      return {
        ...item,
        quantity: nextQuantity,
      };
    }),
  });
};

export const clearCart = () => {
  writeCartState(emptyCartState);
};

export const getCartItemsCount = (state: CartState) => {
  return state.items.reduce((total, item) => total + item.quantity, 0);
};

export const getCartSubtotal = (state: CartState) => {
  return state.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
};
