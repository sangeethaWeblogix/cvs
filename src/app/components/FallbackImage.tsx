"use client";
import Image from "next/image";
import { useState } from "react";

export default function FallbackImage({ src, fallback, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      onError={() => { if (fallback) setImgSrc(fallback); }}
      unoptimized
      alt={props.alt || "image"}
    />
  );
}
