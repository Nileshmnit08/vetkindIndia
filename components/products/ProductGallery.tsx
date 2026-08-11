"use client";

import Image from "next/image";

interface ProductGalleryProps {
  image: string | null;
  productName: string;
}

export function ProductGallery({ image, productName }: ProductGalleryProps) {
  const displayImage = image || '/product-mockup.png';

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
        <Image
          src={displayImage}
          alt={productName}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
