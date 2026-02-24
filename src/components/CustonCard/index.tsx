import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
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
};

const CustomCard = ({
  url,
  alt,
  href,
  mediaHeight = { xs: 280, sm: 420, md: 540 },
  borderRadius = 0,
}: CustomCardProps) => {
  const content = (
    <Card
      sx={{
        borderRadius,
        overflow: "hidden",
        boxShadow: "none",
      }}
    >
      <CardMedia
        component="img"
        image={url}
        alt={alt}
        sx={{
          width: "100%",
          height: mediaHeight,
          objectFit: "cover",
        }}
      />
    </Card>
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
