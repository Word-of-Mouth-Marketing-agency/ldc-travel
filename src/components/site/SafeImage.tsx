"use client";

import Image from "next/image";
import { useState } from "react";

type SafeImageProps = {
  alt: string;
  className?: string;
  sizes: string;
  src: string;
};

export function SafeImage({ alt, className = "", sizes, src }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="image-fallback" role="img" aria-label={alt}>
        <strong>LDC Travel</strong>
        <span>Travel image unavailable</span>
      </div>
    );
  }

  return <Image className={className} src={src} alt={alt} fill sizes={sizes} onError={() => setFailed(true)} />;
}
