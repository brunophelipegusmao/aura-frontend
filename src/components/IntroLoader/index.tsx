"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type IntroPhase = "hidden" | "loading" | "revealing";

const INTRO_HOLD_MS = 850;
const INTRO_REVEAL_MS = 1000;

export function IntroLoader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [phase, setPhase] = useState<IntroPhase>(() =>
    pathname === "/" ? "loading" : "hidden",
  );

  useEffect(() => {
    const root = document.documentElement;
    let showTimer: number | undefined;
    const clearRootIntro = () => {
      root.classList.remove("intro-loading", "intro-revealing");
    };
    const hideLoader = () => {
      showTimer = window.setTimeout(() => {
        setPhase("hidden");
      }, 0);
    };

    if (!isHome) {
      clearRootIntro();
      hideLoader();
      return () => {
        if (showTimer) {
          window.clearTimeout(showTimer);
        }
      };
    }

    root.style.setProperty("--click-x", "0.5");
    root.style.setProperty("--click-y", "0.5");
    root.classList.add("intro-loading");
    root.classList.remove("intro-revealing");
    showTimer = window.setTimeout(() => {
      setPhase("loading");
    }, 0);

    const revealTimer = window.setTimeout(() => {
      root.classList.add("intro-revealing");
      setPhase("revealing");
    }, INTRO_HOLD_MS);

    const doneTimer = window.setTimeout(() => {
      clearRootIntro();
      setPhase("hidden");
    }, INTRO_HOLD_MS + INTRO_REVEAL_MS);

    return () => {
      if (showTimer) {
        window.clearTimeout(showTimer);
      }
      window.clearTimeout(revealTimer);
      window.clearTimeout(doneTimer);
      clearRootIntro();
    };
  }, [isHome]);

  if (phase === "hidden") {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`intro-loader ${phase === "revealing" ? "is-revealing" : ""}`}
    >
      <div className="intro-loader__logo-shell">
        <Image
          src="/Images/logo/png/logo-bg-t2.png"
          alt=""
          width={160}
          height={160}
          priority
          className="intro-loader__logo"
        />
      </div>
    </div>
  );
}
