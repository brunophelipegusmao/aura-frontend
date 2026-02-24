"use client";

import { useSyncExternalStore } from "react";
import {
  ADMIN_STORAGE_KEY,
  ADMIN_STORE_UPDATED_EVENT,
  fallbackStorefrontProducts,
  getStorefrontProductsFromStorage,
  type StorefrontProduct,
} from "@/lib/storefront-catalog";

let cachedStorageValue: string | null | undefined;
let cachedSnapshot: StorefrontProduct[] = fallbackStorefrontProducts;

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorageChange = (event: StorageEvent) => {
    if (event.key === ADMIN_STORAGE_KEY) {
      onStoreChange();
    }
  };

  const onLocalUpdate = () => {
    onStoreChange();
  };

  window.addEventListener("storage", onStorageChange);
  window.addEventListener(ADMIN_STORE_UPDATED_EVENT, onLocalUpdate);

  return () => {
    window.removeEventListener("storage", onStorageChange);
    window.removeEventListener(ADMIN_STORE_UPDATED_EVENT, onLocalUpdate);
  };
};

const getSnapshot = (): StorefrontProduct[] => {
  if (typeof window === "undefined") {
    return fallbackStorefrontProducts;
  }

  const rawStorageValue = window.localStorage.getItem(ADMIN_STORAGE_KEY);
  if (rawStorageValue === cachedStorageValue) {
    return cachedSnapshot;
  }

  cachedStorageValue = rawStorageValue;
  cachedSnapshot = getStorefrontProductsFromStorage();
  return cachedSnapshot;
};

const getServerSnapshot = (): StorefrontProduct[] => {
  return fallbackStorefrontProducts;
};

export const useStorefrontCatalog = () => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
