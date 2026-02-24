"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const clearTransitionState = () => {
  const root = document.documentElement;
  root.classList.remove(
    "is-changing",
    "is-rendering",
    "is-animating",
    "is-leaving",
    "to-circle",
    "from-circle",
  );

  const container = document.getElementById("swup");
  if (container) {
    container.style.clipPath = "none";
  }
};

export function SwupProvider() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.style.setProperty("--click-x", "0.5");
    document.documentElement.style.setProperty("--click-y", "0.5");
    clearTransitionState();

    return () => {
      clearTransitionState();
    };
  }, [pathname]);

  return null;
}
