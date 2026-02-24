"use client";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Produtos", href: "/products" },
  { label: "Coleções", href: "/collections" },
  { label: "Sobre", href: "/about" },
  { label: "Contato", href: "/contact" },
];

const mobileTabItems = [
  { label: "Home", href: "/", icon: HomeRoundedIcon },
  { label: "Produtos", href: "/products", icon: StorefrontRoundedIcon },
];

const isActivePath = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
};

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-[10010] border-b border-secondary/25 bg-primary/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-3 sm:h-[4.5rem] sm:px-6 lg:px-8">
          <Link
            href="/"
            prefetch={false}
            aria-label="Aura Activewear Home"
            className="shrink-0 transition-opacity hover:opacity-90"
          >
            <Image
              src="/Images/logo/png/logo-bg-t2.png"
              alt="Aura Activewear Logo"
              width={108}
              height={96}
              className="h-auto w-[88px] sm:w-[104px]"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-paper text-secondary"
                      : "text-paper hover:bg-paper/15"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Link
              href="/login"
              prefetch={false}
              className="inline-flex items-center gap-1.5 rounded-full border border-paper/35 bg-paper/10 px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-paper hover:text-secondary"
            >
              <LoginRoundedIcon fontSize="small" />
              <span>Login</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/35 bg-paper/12 text-paper transition-colors hover:bg-paper/24 lg:hidden"
          >
            {isMenuOpen ? (
              <CloseRoundedIcon fontSize="small" />
            ) : (
              <MenuRoundedIcon fontSize="small" />
            )}
          </button>
        </div>
      </header>

      {isMenuOpen ? (
        <div
          className="fixed inset-0 z-[10020] bg-ink/45 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-[calc(4.25rem+env(safe-area-inset-top))] lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <aside
            className="mx-auto max-w-md overflow-hidden rounded-3xl border border-secondary/20 bg-paper shadow-[0_28px_60px_rgba(11,11,15,0.28)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-secondary/15 bg-gradient-to-r from-primary-soft/60 to-accent/55 px-5 py-4">
              <p className="font-roboto text-xs font-black uppercase tracking-[0.2em] text-secondary">
                Menu
              </p>
            </div>

            <nav className="space-y-2 p-4">
              {navItems.map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                      active
                        ? "border-secondary bg-primary-soft/40 text-secondary"
                        : "border-secondary/15 bg-paper text-ink hover:border-secondary/35"
                    }`}
                  >
                    <span>{item.label}</span>
                    {active ? (
                      <span className="text-[11px] uppercase tracking-wide">
                        atual
                      </span>
                    ) : null}
                  </Link>
                );
              })}

              <Link
                href="/login"
                prefetch={false}
                onClick={() => setIsMenuOpen(false)}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl bg-secondary px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-paper"
              >
                <LoginRoundedIcon fontSize="small" />
                <span>Entrar</span>
              </Link>
            </nav>
          </aside>
        </div>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-[10005] border-t border-secondary/20 bg-paper/95 px-2 pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-2 backdrop-blur md:hidden">
        <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-1">
          {mobileTabItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={`mobile-tab-${item.href}`}
                href={item.href}
                prefetch={false}
                className={`flex flex-col items-center justify-center rounded-xl px-2 py-1.5 text-[11px] font-semibold tracking-wide transition-colors ${
                  active
                    ? "bg-primary-soft/55 text-secondary"
                    : "text-muted hover:bg-primary-soft/35"
                }`}
              >
                <Icon fontSize="small" />
                <span className="mt-0.5">{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className={`flex flex-col items-center justify-center rounded-xl px-2 py-1.5 text-[11px] font-semibold tracking-wide transition-colors ${
              isMenuOpen
                ? "bg-primary-soft/55 text-secondary"
                : "text-muted hover:bg-primary-soft/35"
            }`}
          >
            <MenuRoundedIcon fontSize="small" />
            <span className="mt-0.5">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
}
