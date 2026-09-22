const DEAD_IMAGE_MARKERS = [
  '1581092335397-9583fe92d232',
];

export function fallbackCatalogSrc(seed: string): string {
  const safe = seed.replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 40) || 'alphatech';
  return `https://picsum.photos/seed/${safe}/800/800`;
}

export function safeCatalogSrc(src: string | undefined, seed: string): string {
  if (!src || DEAD_IMAGE_MARKERS.some((marker) => src.includes(marker))) {
    return fallbackCatalogSrc(seed);
  }
  return src;
}
