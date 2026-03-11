"use client";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import CollectionsBookmarkRoundedIcon from "@mui/icons-material/CollectionsBookmarkRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCartItemsCount } from "@/lib/cart-store";
import { useCartStore } from "@/lib/use-cart-store";

type NavItem = {
  label: string;
  href: string;
};

const desktopNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Produtos", href: "/products" },
  { label: "Coleções", href: "/collections" },
  { label: "Sobre", href: "/about" },
];

const mobileNavItems = [
  { label: "Home", href: "/", icon: HomeRoundedIcon },
  { label: "Produtos", href: "/products", icon: StorefrontRoundedIcon },
  {
    label: "Coleções",
    href: "/collections",
    icon: CollectionsBookmarkRoundedIcon,
  },
];

const isActivePath = (pathname: string, href: string) => {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
};

export function Header() {
  const pathname = usePathname();
  const cart = useCartStore();
  const cartItemsCount = getCartItemsCount(cart);
  const cartLabel =
    cartItemsCount > 0 ? `Carrinho (${cartItemsCount})` : "Carrinho";

  return (
    <>
      <header className="sticky top-0 z-[10010] border-b border-secondary/25 bg-primary/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full max-w-[1520px] items-center justify-between px-4 sm:h-[4.75rem] sm:px-6 lg:px-10 2xl:px-12">
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
              className="h-auto w-[90px] sm:w-[108px]"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1.5 lg:flex">
            {desktopNavItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
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

          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              prefetch={false}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-paper/35 bg-paper/10 px-3.5 text-sm font-semibold text-paper transition-colors hover:bg-paper hover:text-secondary sm:px-4"
            >
              <LoginRoundedIcon fontSize="small" />
              <span className="hidden sm:inline">Entrar</span>
            </Link>

            <Link
              href="/cart"
              prefetch={false}
              className="hidden h-10 items-center justify-center rounded-full bg-paper px-4 text-sm font-bold text-secondary transition-colors hover:bg-primary-soft lg:inline-flex"
            >
              {cartLabel}
            </Link>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-[10005] border-t border-secondary/20 bg-paper/95 px-2 pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-2 backdrop-blur lg:hidden">
        <div className="mx-auto grid w-full max-w-md grid-cols-4 gap-1">
          {mobileNavItems.map((item) => {
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

          <Link
            href="/cart"
            prefetch={false}
            className="flex flex-col items-center justify-center rounded-xl bg-secondary px-2 py-1.5 text-[11px] font-bold tracking-wide text-paper transition-colors hover:bg-primary"
          >
            <ShoppingBagRoundedIcon fontSize="small" />
            <span className="mt-0.5">
              {cartItemsCount > 0 ? `Sacola (${cartItemsCount})` : "Sacola"}
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
