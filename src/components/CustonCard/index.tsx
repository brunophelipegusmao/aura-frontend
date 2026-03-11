import Image from "next/image";
import Link from "next/link";

type CustomCardProps = {
  url: string;
  alt: string;
  href?: string;
  mediaHeight?: {
    xs: number;
    sm: number;
    md: number;
  };
  borderRadius?: number;
  sizes?: string;
  priority?: boolean;
};

const CustomCard = ({
  url,
  alt,
  href,
  mediaHeight = { xs: 280, sm: 420, md: 540 },
  borderRadius = 0,
  sizes = "100vw",
  priority = false,
}: CustomCardProps) => {
  const heightStyle = `clamp(${mediaHeight.xs}px, 52vw, ${mediaHeight.md}px)`;

  const content = (
    <div
      className="overflow-hidden"
      style={{
        borderRadius,
      }}
    >
      <div
        className="relative w-full"
        style={{
          height: heightStyle,
          maxHeight: `${mediaHeight.md}px`,
          minHeight: `${mediaHeight.xs}px`,
        }}
      >
        <Image
          src={url}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={72}
          className="object-cover"
        />
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} prefetch={false} aria-label={alt} className="block">
      {content}
    </Link>
  );
};

export default CustomCard;
