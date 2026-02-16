import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

type CustomCardProps = {
  url: string;
  alt: string;
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
  mediaHeight = { xs: 280, sm: 420, md: 540 },
  borderRadius = 0,
}: CustomCardProps) => {
  return (
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
};

export default CustomCard;
