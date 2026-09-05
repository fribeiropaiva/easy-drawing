import Image from "next/image";

import { getPublicAssetUrl } from "@/lib/assets/public-url";
import { cn } from "@/lib/utils";

interface TutorialImageProps {
  /** R2 object key; resolved through lib/assets, never a raw URL. */
  imageKey: string;
  alt: string;
  /** Responsive `sizes` hint so the browser picks a sensible width. */
  sizes: string;
  priority?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

/** Worksheets are vertical sheets; the default intrinsic size keeps a 3:4 ratio. */
export function TutorialImage({
  imageKey,
  alt,
  sizes,
  priority = false,
  width = 900,
  height = 1200,
  className,
}: TutorialImageProps) {
  const src = getPublicAssetUrl(imageKey);
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      unoptimized={src.endsWith(".svg")}
      className={cn("h-auto w-full", className)}
    />
  );
}
