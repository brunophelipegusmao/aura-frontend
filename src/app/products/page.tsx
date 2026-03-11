"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCatalogCard } from "@/components/ProductCatalogCard";
import {
  MotionReveal,
  MotionStagger,
  MotionStaggerItem,
} from "@/components/motion/Reveal";
import { useStorefrontCatalog } from "@/lib/use-storefront-catalog";

type SortKey =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "discount-desc"
  | "newest";

type SpecialFilters = {
  promotions: boolean;
  newArrivals: boolean;
  readyToShip: boolean;
  highDiscount: boolean;
  freeShipping: boolean;
};

type OptionWithCount = {
  value: string;
  count: number;
};

type ColorOption = {
  name: string;
  hex: string;
  count: number;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const FREE_SHIPPING_THRESHOLD = 349;
const HIGH_DISCOUNT_THRESHOLD = 0.2;
const MAX_VISIBLE_FILTER_CHIPS = 6;

const countValues = (values: string[]) => {
  return values.reduce<Record<string, number>>((accumulator, value) => {
    accumulator[value] = (accumulator[value] ?? 0) + 1;
    return accumulator;
  }, {});
};

const getDiscountRatio = (price: number, compareAtPrice?: number) => {
  if (!compareAtPrice || compareAtPrice <= price) {
    return 0;
  }

  return (compareAtPrice - price) / compareAtPrice;
};

function ProductsPageContent() {
  const products = useStorefrontCatalog();
  const searchParams = useSearchParams();

  const initialCategoryFilter = searchParams.get("category");
  const initialCollectionFilter = searchParams.get("collection");

  const priceBounds = useMemo(() => {
    if (products.length === 0) {
      return { min: 0, max: 0 };
    }

    const prices = products.map((product) => product.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("featured");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    initialCategoryFilter ? [initialCategoryFilter] : [],
  );
  const [selectedCollections, setSelectedCollections] = useState<string[]>(() =>
    initialCollectionFilter ? [initialCollectionFilter] : [],
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [specialFilters, setSpecialFilters] = useState<SpecialFilters>({
    promotions: false,
    newArrivals: false,
    readyToShip: false,
    highDiscount: false,
    freeShipping: false,
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([
    priceBounds.min,
    priceBounds.max,
  ]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileFiltersOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFiltersOpen]);

  const categoryOptions = useMemo<OptionWithCount[]>(() => {
    const categoryCount = countValues(products.map((product) => product.category));

    return Object.entries(categoryCount)
      .sort(([a], [b]) => a.localeCompare(b, "pt-BR"))
      .map(([value, count]) => ({ value, count }));
  }, [products]);

  const collectionOptions = useMemo<OptionWithCount[]>(() => {
    const collectionCount = countValues(products.map((product) => product.collection));

    return Object.entries(collectionCount)
      .sort(([a], [b]) => a.localeCompare(b, "pt-BR"))
      .map(([value, count]) => ({ value, count }));
  }, [products]);

  const sizeOptions = useMemo<OptionWithCount[]>(() => {
    const sizes = products.flatMap((product) => product.sizes);
    const sizeCount = countValues(sizes);

    return Object.entries(sizeCount)
      .sort(([a], [b]) => a.localeCompare(b, "pt-BR"))
      .map(([value, count]) => ({ value, count }));
  }, [products]);

  const colorOptions = useMemo<ColorOption[]>(() => {
    const colorMap = new Map<string, { hex: string; count: number }>();

    products.forEach((product) => {
      product.colors.forEach((color) => {
        const current = colorMap.get(color.name);
        colorMap.set(color.name, {
          hex: color.hex,
          count: (current?.count ?? 0) + 1,
        });
      });
    });

    return Array.from(colorMap.entries())
      .map(([name, value]) => ({ name, hex: value.hex, count: value.count }))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }, [products]);

  const promotionCount = useMemo(() => {
    return products.filter(
      (product) => !!product.compareAtPrice && product.compareAtPrice > product.price,
    ).length;
  }, [products]);

  const newArrivalsCount = useMemo(() => {
    return products.filter((product) => product.isNew).length;
  }, [products]);

  const readyToShipCount = useMemo(() => {
    return products.filter((product) => product.inStock).length;
  }, [products]);

  const highDiscountCount = useMemo(() => {
    return products.filter((product) => {
      return (
        !!product.compareAtPrice &&
        getDiscountRatio(product.price, product.compareAtPrice) >=
          HIGH_DISCOUNT_THRESHOLD
      );
    }).length;
  }, [products]);

  const freeShippingCount = useMemo(() => {
    return products.filter((product) => product.price >= FREE_SHIPPING_THRESHOLD)
      .length;
  }, [products]);

  const toggleListValue = (
    value: string,
    setter: Dispatch<SetStateAction<string[]>>,
  ) => {
    setter((currentValues) =>
      currentValues.includes(value)
        ? currentValues.filter((current) => current !== value)
        : [...currentValues, value],
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedCollections([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSpecialFilters({
      promotions: false,
      newArrivals: false,
      readyToShip: false,
      highDiscount: false,
      freeShipping: false,
    });
    setPriceRange([priceBounds.min, priceBounds.max]);
  };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = products.filter((product) => {
      if (
        normalizedSearch &&
        !`${product.name} ${product.reference}`
          .toLowerCase()
          .includes(normalizedSearch)
      ) {
        return false;
      }

      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category)
      ) {
        return false;
      }

      if (
        selectedCollections.length > 0 &&
        !selectedCollections.includes(product.collection)
      ) {
        return false;
      }

      if (
        selectedSizes.length > 0 &&
        !selectedSizes.some((size) => product.sizes.includes(size))
      ) {
        return false;
      }

      if (
        selectedColors.length > 0 &&
        !product.colors.some((color) => selectedColors.includes(color.name))
      ) {
        return false;
      }

      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      if (
        specialFilters.promotions &&
        (!product.compareAtPrice || product.compareAtPrice <= product.price)
      ) {
        return false;
      }

      if (specialFilters.newArrivals && !product.isNew) {
        return false;
      }

      if (specialFilters.readyToShip && !product.inStock) {
        return false;
      }

      if (
        specialFilters.highDiscount &&
        getDiscountRatio(product.price, product.compareAtPrice) <
          HIGH_DISCOUNT_THRESHOLD
      ) {
        return false;
      }

      if (
        specialFilters.freeShipping &&
        product.price < FREE_SHIPPING_THRESHOLD
      ) {
        return false;
      }

      return true;
    });

    switch (sortBy) {
      case "price-asc":
        return [...filtered].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...filtered].sort((a, b) => b.price - a.price);
      case "discount-desc":
        return [...filtered].sort(
          (a, b) =>
            getDiscountRatio(b.price, b.compareAtPrice) -
            getDiscountRatio(a.price, a.compareAtPrice),
        );
      case "newest":
        return [...filtered].sort(
          (a, b) => Number(b.isNew) - Number(a.isNew),
        );
      default:
        return filtered;
    }
  }, [
    products,
    searchTerm,
    selectedCategories,
    selectedCollections,
    selectedSizes,
    selectedColors,
    priceRange,
    specialFilters,
    sortBy,
  ]);

  const hasActivePriceRange =
    priceRange[0] !== priceBounds.min || priceRange[1] !== priceBounds.max;

  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    selectedCategories.length > 0 ||
    selectedCollections.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    specialFilters.promotions ||
    specialFilters.newArrivals ||
    specialFilters.readyToShip ||
    specialFilters.highDiscount ||
    specialFilters.freeShipping ||
    hasActivePriceRange;

  const filterChipClass =
    "shrink-0 rounded-full border border-secondary/25 bg-paper px-3 py-1.5 text-xs font-semibold text-secondary";

  const specialFilterOptions: Array<{
    key: keyof SpecialFilters;
    label: string;
    count: number;
  }> = [
    { key: "promotions", label: "Promoções", count: promotionCount },
    { key: "newArrivals", label: "Lançamentos", count: newArrivalsCount },
    { key: "readyToShip", label: "Pronta entrega", count: readyToShipCount },
    { key: "highDiscount", label: "Desconto forte (20%+)", count: highDiscountCount },
    {
      key: "freeShipping",
      label: `Frete grátis (${currencyFormatter.format(FREE_SHIPPING_THRESHOLD)}+)`,
      count: freeShippingCount,
    },
  ];

  const activeFilterChips = [
    ...(searchTerm.trim()
      ? [
          {
            key: `chip-search-${searchTerm}`,
            label: `Busca: ${searchTerm.trim()}`,
            onRemove: () => setSearchTerm(""),
          },
        ]
      : []),
    ...selectedCategories.map((category) => ({
      key: `chip-category-${category}`,
      label: category,
      onRemove: () => toggleListValue(category, setSelectedCategories),
    })),
    ...selectedCollections.map((collection) => ({
      key: `chip-collection-${collection}`,
      label: collection,
      onRemove: () => toggleListValue(collection, setSelectedCollections),
    })),
    ...selectedSizes.map((size) => ({
      key: `chip-size-${size}`,
      label: `Tam ${size}`,
      onRemove: () => toggleListValue(size, setSelectedSizes),
    })),
    ...selectedColors.map((color) => ({
      key: `chip-color-${color}`,
      label: color,
      onRemove: () => toggleListValue(color, setSelectedColors),
    })),
    ...(specialFilters.promotions
      ? [
          {
            key: "chip-special-promotions",
            label: "Promoções",
            onRemove: () =>
              setSpecialFilters((current) => ({ ...current, promotions: false })),
          },
        ]
      : []),
    ...(specialFilters.newArrivals
      ? [
          {
            key: "chip-special-new-arrivals",
            label: "Lançamentos",
            onRemove: () =>
              setSpecialFilters((current) => ({ ...current, newArrivals: false })),
          },
        ]
      : []),
    ...(specialFilters.readyToShip
      ? [
          {
            key: "chip-special-ready",
            label: "Pronta entrega",
            onRemove: () =>
              setSpecialFilters((current) => ({ ...current, readyToShip: false })),
          },
        ]
      : []),
    ...(specialFilters.highDiscount
      ? [
          {
            key: "chip-special-discount",
            label: "Desconto forte",
            onRemove: () =>
              setSpecialFilters((current) => ({ ...current, highDiscount: false })),
          },
        ]
      : []),
    ...(specialFilters.freeShipping
      ? [
          {
            key: "chip-special-freeshipping",
            label: "Frete grátis",
            onRemove: () =>
              setSpecialFilters((current) => ({ ...current, freeShipping: false })),
          },
        ]
      : []),
    ...(hasActivePriceRange
      ? [
          {
            key: "chip-price-range",
            label: `${currencyFormatter.format(priceRange[0])} - ${currencyFormatter.format(
              priceRange[1],
            )}`,
            onRemove: () => setPriceRange([priceBounds.min, priceBounds.max]),
          },
        ]
      : []),
  ];

  const visibleFilterChips = activeFilterChips.slice(0, MAX_VISIBLE_FILTER_CHIPS);
  const hiddenFilterChipsCount = Math.max(
    activeFilterChips.length - visibleFilterChips.length,
    0,
  );

  const renderFilterPanel = (isMobile = false) => {
    return (
      <div className="space-y-5 pb-1">
        <div className="flex items-center justify-between">
          <h2 className="font-roboto text-sm font-black uppercase tracking-[0.16em] text-secondary">
            Filtros
          </h2>
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-semibold uppercase tracking-wide text-secondary hover:underline"
          >
            Limpar
          </button>
        </div>

        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            Categoria
          </h3>
          <div className="mt-2 space-y-2">
            {categoryOptions.map((option) => {
              const checked = selectedCategories.includes(option.value);
              return (
                <label
                  key={`category-${option.value}`}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-secondary/15 px-3 py-2 text-sm transition-colors hover:border-secondary/35"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-secondary"
                      checked={checked}
                      onChange={() =>
                        toggleListValue(option.value, setSelectedCategories)
                      }
                    />
                    <span>{option.value}</span>
                  </span>
                  <span className="text-xs text-muted">{option.count}</span>
                </label>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            Tamanho
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizeOptions.map((option) => {
              const checked = selectedSizes.includes(option.value);
              return (
                <button
                  key={`size-${option.value}`}
                  type="button"
                  onClick={() => toggleListValue(option.value, setSelectedSizes)}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                    checked
                      ? "border-secondary bg-secondary text-paper"
                      : "border-secondary/20 bg-paper text-secondary hover:border-secondary/45"
                  }`}
                >
                  {option.value}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            Cor
          </h3>
          <div className="mt-2 space-y-2">
            {colorOptions.map((option) => {
              const checked = selectedColors.includes(option.name);
              return (
                <button
                  key={`color-${option.name}`}
                  type="button"
                  onClick={() => toggleListValue(option.name, setSelectedColors)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                    checked
                      ? "border-secondary bg-primary-soft/35"
                      : "border-secondary/15 bg-paper hover:border-secondary/35"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-4 w-4 rounded-full border border-ink/15"
                      style={{ backgroundColor: option.hex }}
                    />
                    {option.name}
                  </span>
                  <span className="text-xs text-muted">{option.count}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            Faixa de preço
          </h3>
          <div className="mt-2 rounded-2xl border border-secondary/20 bg-primary-soft/18 p-3">
            <div className="mb-3 flex items-center justify-between text-xs font-semibold text-secondary">
              <span>{currencyFormatter.format(priceRange[0])}</span>
              <span>{currencyFormatter.format(priceRange[1])}</span>
            </div>

            <label className="block text-[11px] font-bold uppercase tracking-wide text-muted">
              Mínimo
            </label>
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              step={5}
              value={priceRange[0]}
              onChange={(event) => {
                const nextMin = Number(event.target.value);
                setPriceRange((currentRange) => [
                  Math.min(nextMin, currentRange[1]),
                  currentRange[1],
                ]);
              }}
              className="mt-2 w-full accent-secondary"
            />

            <label className="mt-3 block text-[11px] font-bold uppercase tracking-wide text-muted">
              Máximo
            </label>
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              step={5}
              value={priceRange[1]}
              onChange={(event) => {
                const nextMax = Number(event.target.value);
                setPriceRange((currentRange) => [
                  currentRange[0],
                  Math.max(nextMax, currentRange[0]),
                ]);
              }}
              className="mt-2 w-full accent-secondary"
            />
          </div>
        </section>

        <details className="rounded-2xl border border-secondary/20 bg-paper/70 p-3">
          <summary className="cursor-pointer list-none text-[11px] font-bold uppercase tracking-[0.16em] text-muted [&::-webkit-details-marker]:hidden">
            Filtros avançados
          </summary>

          <div className="mt-4 space-y-5">
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                Coleção
              </h3>
              <div className="mt-2 space-y-2">
                {collectionOptions.map((option) => {
                  const checked = selectedCollections.includes(option.value);
                  return (
                    <label
                      key={`collection-${option.value}`}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-secondary/15 px-3 py-2 text-sm transition-colors hover:border-secondary/35"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="accent-secondary"
                          checked={checked}
                          onChange={() =>
                            toggleListValue(option.value, setSelectedCollections)
                          }
                        />
                        <span>{option.value}</span>
                      </span>
                      <span className="text-xs text-muted">{option.count}</span>
                    </label>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                Especiais
              </h3>
              <div className="mt-2 space-y-2">
                {specialFilterOptions.map((option) => (
                  <label
                    key={`special-filter-${option.key}`}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-secondary/15 px-3 py-2 text-sm transition-colors hover:border-secondary/35"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-secondary"
                        checked={specialFilters[option.key]}
                        onChange={() =>
                          setSpecialFilters((current) => ({
                            ...current,
                            [option.key]: !current[option.key],
                          }))
                        }
                      />
                      <span>{option.label}</span>
                    </span>
                    <span className="text-xs text-muted">{option.count}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>
        </details>

        {isMobile ? (
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(false)}
            className="w-full rounded-xl bg-secondary py-3 text-sm font-bold uppercase tracking-wide text-paper"
          >
            Ver {filteredProducts.length} produtos
          </button>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-secondary/15 bg-gradient-to-br from-paper via-accent/45 to-primary-soft/55 py-6 sm:py-7 md:py-8">
        <MotionReveal className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-10 2xl:px-12">
          <p className="font-roboto text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary/85">
            AURA ACTIVEWEAR
          </p>
          <h1 className="font-roboto mt-2 text-2xl font-bold tracking-[-0.015em] text-ink sm:text-[2rem] md:text-[2.45rem]">
            Catálogo Aura
          </h1>
          <p className="mt-2.5 max-w-xl text-sm text-muted md:text-[0.95rem]">
            Filtre por categoria, cor e tamanho para encontrar sua peça ideal
            com mais rapidez.
          </p>
        </MotionReveal>
      </section>

      <section className="py-6 md:py-9">
        <MotionReveal className="space-y-4">
          <div className="rounded-2xl border border-secondary/20 bg-paper p-4 shadow-[0_10px_24px_rgba(11,11,15,0.06)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="w-full max-w-2xl">
                <label
                  htmlFor="product-search"
                  className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary"
                >
                  Buscar produto
                </label>
                <input
                  id="product-search"
                  type="search"
                  placeholder="Ex.: legging, top, boysenberry..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-[auto_minmax(0,220px)] lg:w-auto">
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-secondary/25 bg-paper px-3 text-sm font-semibold text-secondary lg:hidden"
                >
                  Filtros
                </button>

                <div className="min-w-0">
                  <label
                    htmlFor="sort-by"
                    className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary"
                  >
                    Ordenar
                  </label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortKey)}
                    className="mt-2 h-11 w-full rounded-xl border border-secondary/25 bg-paper px-3 text-sm text-ink outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  >
                    <option value="featured">Mais relevantes</option>
                    <option value="price-asc">Menor preço</option>
                    <option value="price-desc">Maior preço</option>
                    <option value="discount-desc">Maior desconto</option>
                    <option value="newest">Novidades</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {hasActiveFilters ? (
            <div className="rounded-2xl border border-secondary/20 bg-paper px-3 py-3 sm:px-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">
                  Filtros ativos
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-[11px] font-semibold uppercase tracking-wide text-secondary hover:underline"
                >
                  Limpar tudo
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                {visibleFilterChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    className={filterChipClass}
                  >
                    {chip.label} ×
                  </button>
                ))}
                {hiddenFilterChipsCount > 0 ? (
                  <span className="shrink-0 rounded-full border border-secondary/20 bg-primary-soft/30 px-3 py-1.5 text-xs font-semibold text-secondary">
                    +{hiddenFilterChipsCount} filtros
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-[272px_minmax(0,1fr)] xl:gap-7 2xl:grid-cols-[304px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-[6rem] rounded-2xl border border-secondary/20 bg-paper p-4 shadow-[0_12px_28px_rgba(11,11,15,0.08)]">
                {renderFilterPanel()}
              </div>
            </aside>

            <div>
              <div className="mb-4 flex items-center justify-between gap-2 rounded-2xl border border-secondary/20 bg-paper px-3 py-3 sm:px-4">
                <p className="text-sm font-semibold text-ink">
                  {filteredProducts.length} produto
                  {filteredProducts.length === 1 ? "" : "s"} encontrado
                  {filteredProducts.length === 1 ? "" : "s"}
                </p>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="hidden text-[11px] font-bold uppercase tracking-wide text-secondary hover:underline sm:inline"
                  >
                    Resetar filtros
                  </button>
                ) : null}
              </div>

              {filteredProducts.length > 0 ? (
                <MotionStagger
                  className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                  staggerChildren={0.05}
                  amount={0.08}
                >
                  {filteredProducts.map((product) => (
                    <MotionStaggerItem key={product.id} y={8} duration={0.3}>
                      <ProductCatalogCard product={product} />
                    </MotionStaggerItem>
                  ))}
                </MotionStagger>
              ) : (
                <div className="rounded-2xl border border-dashed border-secondary/35 bg-paper py-14 text-center">
                  <p className="font-roboto text-lg font-black uppercase tracking-wide text-secondary">
                    Nenhum produto encontrado
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Tente remover alguns filtros ou ajustar a faixa de preço.
                  </p>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="mt-4 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-paper"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </MotionReveal>
      </section>

      {isMobileFiltersOpen ? (
        <div
          className="fixed inset-0 z-[10030] flex items-end bg-ink/45 lg:hidden"
          onClick={() => setIsMobileFiltersOpen(false)}
        >
          <aside
            className="flex h-[86vh] w-full flex-col overflow-hidden rounded-t-3xl border border-secondary/15 bg-paper shadow-[0_-22px_48px_rgba(11,11,15,0.24)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-secondary/15 bg-paper/95 px-4 pb-3 pt-2 backdrop-blur-sm">
              <span className="mx-auto mb-2 block h-1.5 w-12 rounded-full bg-secondary/35" />
              <div className="flex items-center justify-between">
                <p className="font-roboto text-sm font-black uppercase tracking-[0.2em] text-secondary">
                  Filtros
                </p>
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="text-xs font-semibold uppercase tracking-wide text-secondary"
                >
                  Fechar
                </button>
              </div>
            </div>

            <div className="hide-scrollbar flex-1 overflow-y-auto px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
              {renderFilterPanel(true)}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <section className="py-10">
          <div className="rounded-3xl border border-secondary/20 bg-paper p-6 text-center text-sm text-muted">
            Carregando produtos...
          </div>
        </section>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
