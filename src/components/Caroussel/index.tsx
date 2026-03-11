"use client";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Carousel from "react-material-ui-carousel";
import CustomCard from "../CustonCard";
import {
  type CarouselItem,
  heroCarouselItems,
} from "../../../mock/carousel";

type CarousselProps = {
  items?: CarouselItem[];
  itemsPerSlide?: number;
  fullWidth?: boolean;
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  showSideClickNavigation?: boolean;
  mediaHeight?: {
    xs: number;
    sm: number;
    md: number;
  };
  renderItem?: (item: CarouselItem) => ReactNode;
};

export default function Caroussel({
  items = heroCarouselItems,
  itemsPerSlide = 1,
  fullWidth = true,
  autoPlay = true,
  interval = 5000,
  showIndicators = true,
  showSideClickNavigation = true,
  mediaHeight = { xs: 280, sm: 420, md: 540 },
  renderItem,
}: CarousselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const normalizedItemsPerSlide = Math.max(1, itemsPerSlide);

  const slides = useMemo(() => {
    if (items.length === 0) return [];
    if (normalizedItemsPerSlide === 1) return items.map((item) => [item]);

    const groupedItems: CarouselItem[][] = [];
    for (let index = 0; index < items.length; index += normalizedItemsPerSlide) {
      groupedItems.push(items.slice(index, index + normalizedItemsPerSlide));
    }
    return groupedItems;
  }, [items, normalizedItemsPerSlide]);

  const totalSlides = slides.length;
  const normalizedActiveIndex =
    totalSlides === 0 ? 0 : ((activeIndex % totalSlides) + totalSlides) % totalSlides;

  const goToPrevious = () => {
    if (totalSlides === 0) return;
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    if (totalSlides === 0) return;
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  if (totalSlides === 0) return null;

  return (
    <section
      className={
        fullWidth
          ? "relative left-1/2 right-1/2 w-screen -translate-x-1/2"
          : "relative w-full"
      }
    >
      <Carousel
        index={normalizedActiveIndex}
        onChange={(now) => {
          if (typeof now === "number") setActiveIndex(now);
        }}
        animation="slide"
        autoPlay={autoPlay}
        interval={interval}
        indicators={showIndicators}
        navButtonsAlwaysInvisible
        cycleNavigation
        stopAutoPlayOnHover
        IndicatorIcon={
          <span
            style={{
              display: "block",
              width: "8px",
              height: "8px",
              borderRadius: "9999px",
              background: "currentColor",
            }}
          />
        }
        indicatorContainerProps={{
          style: {
            position: "absolute",
            left: "50%",
            bottom: "18px",
            transform: "translateX(-50%)",
            zIndex: 20,
            width: "fit-content",
            borderRadius: "9999px",
            padding: "6px 10px",
            display: "flex",
            gap: "4px",
            background: "rgba(255, 255, 255, 0.65)",
            border: "1px solid rgba(199, 193, 230, 0.9)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            boxShadow: "0 6px 20px rgba(11, 11, 15, 0.08)",
          },
        }}
        indicatorIconButtonProps={{
          style: {
            padding: "4px",
            color: "rgba(110, 99, 168, 0.35)",
            transition: "all 180ms ease",
          },
        }}
        activeIndicatorIconButtonProps={{
          style: {
            color: "#6E63A8",
            transform: "scale(1.2)",
          },
        }}
      >
        {slides.map((slideItems, slideIndex) => (
          <div
            key={`slide-${slideIndex}`}
            className={
              normalizedItemsPerSlide === 1
                ? ""
                : "grid grid-cols-2 gap-3 px-2 py-2 md:grid-cols-4"
            }
          >
            {slideItems.map((item) => (
              <div key={item.id}>
                {renderItem ? (
                  renderItem(item)
                ) : (
                  <CustomCard
                    url={item.imageUrl}
                    alt={item.alt}
                    href={item.href}
                    sizes={
                      normalizedItemsPerSlide === 1
                        ? "100vw"
                        : "(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 25vw"
                    }
                    priority={normalizedItemsPerSlide === 1 && slideIndex === 0}
                    mediaHeight={
                      normalizedItemsPerSlide === 1
                        ? mediaHeight
                        : { xs: 180, sm: 220, md: 260 }
                    }
                    borderRadius={normalizedItemsPerSlide === 1 ? 0 : 12}
                  />
                )}
              </div>
            ))}
            {normalizedItemsPerSlide > 1 &&
              slideItems.length < normalizedItemsPerSlide &&
              Array.from({
                length: normalizedItemsPerSlide - slideItems.length,
              }).map((_, placeholderIndex) => (
                <div
                  key={`placeholder-${slideIndex}-${placeholderIndex}`}
                  className="hidden md:block"
                />
              ))}
          </div>
        ))}
      </Carousel>

      {showSideClickNavigation && (
        <>
          <button
            type="button"
            aria-label="Imagem anterior"
            onClick={goToPrevious}
            className="absolute inset-y-0 left-0 z-10 w-1/2 bg-transparent cursor-w-resize"
          />
          <button
            type="button"
            aria-label="Próxima imagem"
            onClick={goToNext}
            className="absolute inset-y-0 right-0 z-10 w-1/2 bg-transparent cursor-e-resize"
          />
        </>
      )}
    </section>
  );
}
