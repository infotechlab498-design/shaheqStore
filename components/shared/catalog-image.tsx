'use client';

import * as React from 'react';
import Image, { ImageProps } from 'next/image';
import { fallbackCatalogSrc, safeCatalogSrc } from '@/lib/utils/catalog-image';

type CatalogImageProps = Omit<ImageProps, 'src'> & {
  src?: string;
  seed: string;
};

export function CatalogImage({ src, seed, alt, onError, ...props }: CatalogImageProps) {
  const initial = safeCatalogSrc(src, seed);
  const [current, setCurrent] = React.useState(initial);

  React.useEffect(() => {
    setCurrent(safeCatalogSrc(src, seed));
  }, [src, seed]);

  return (
    <Image
      {...props}
      src={current}
      alt={alt}
      onError={(event) => {
        const fallback = fallbackCatalogSrc(`${seed}-fallback`);
        if (current !== fallback) setCurrent(fallback);
        onError?.(event);
      }}
    />
  );
}
