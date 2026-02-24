"use client";

import { useSyncExternalStore } from "react";
import {
  CART_STORAGE_KEY,
  CART_UPDATED_EVENT,
  getCartSnapshot,
  getEmptyCartSnapshot,
  type CartState,
} from "@/lib/cart-store";

let cachedStorageValue: string | null | undefined;
let cachedSnapshot: CartState = getEmptyCartSnapshot();

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorageChange = (event: StorageEvent) => {
    if (event.key === CART_STORAGE_KEY) {
      onStoreChange();
    }
  };

  const onLocalUpdate = () => {
    onStoreChange();
  };

  window.addEventListener("storage", onStorageChange);
  window.addEventListener(CART_UPDATED_EVENT, onLocalUpdate);

  return () => {
    window.removeEventListener("storage", onStorageChange);
    window.removeEventListener(CART_UPDATED_EVENT, onLocalUpdate);
  };
};

const getSnapshot = (): CartState => {
  if (typeof window === "undefined") {
    return getEmptyCartSnapshot();
  }

  const rawStorageValue = window.localStorage.getItem(CART_STORAGE_KEY);
  if (rawStorageValue === cachedStorageValue) {
    return cachedSnapshot;
  }

  cachedStorageValue = rawStorageValue;
  cachedSnapshot = getCartSnapshot();
  return cachedSnapshot;
};

const getServerSnapshot = (): CartState => {
  return getEmptyCartSnapshot();
};

export const useCartStore = () => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
