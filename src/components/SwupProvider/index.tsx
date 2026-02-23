"use client";

import { useEffect } from "react";
import Swup from "swup";
import SwupParallelPlugin from "@swup/parallel-plugin";

const getPathname = (url: string) => {
  try {
    return new URL(url, window.location.origin).pathname;
  } catch {
    return url.split(/[?#]/)[0] || "/";
  }
};

const isHomePath = (url: string) => {
  return getPathname(url) === "/";
};

const getClickOrigin = (event?: Event) => {
  if (event instanceof MouseEvent) {
    return {
      x: event.clientX / window.innerWidth,
      y: event.clientY / window.innerHeight,
    };
  }

  return { x: 0.5, y: 0.5 };
};

export function SwupProvider() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    document.documentElement.style.setProperty("--click-x", "0.5");
    document.documentElement.style.setProperty("--click-y", "0.5");

    const swup = new Swup({
      containers: ["#swup"],
      animationScope: "html",
      animationSelector: ".transition-reveal",
      plugins: [new SwupParallelPlugin()],
      hooks: {
        "visit:start": (visit) => {
          const { x, y } = getClickOrigin(visit.trigger.event);
          document.documentElement.style.setProperty("--click-x", String(x));
          document.documentElement.style.setProperty("--click-y", String(y));

          const isHomeTransition =
            isHomePath(visit.from.url) || isHomePath(visit.to.url);
          const shouldAnimate = isHomeTransition && !prefersReducedMotion;

          visit.animation.animate = shouldAnimate;
          visit.animation.name = shouldAnimate ? "circle" : undefined;
        },
      },
    });

    return () => {
      void swup.destroy();
    };
  }, []);

  return null;
}
