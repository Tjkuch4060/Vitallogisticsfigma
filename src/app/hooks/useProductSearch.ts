import Fuse from 'fuse.js';
import { useMemo } from 'react';
import { Product } from '../data/mockData';

const searchOptions = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'brand', weight: 0.3 },
    { name: 'description', weight: 0.2 },
    { name: 'category', weight: 0.1 },
  ],
  threshold: 0.3, // Lower = stricter matching
  includeScore: true,
};

export function useProductSearch(products: Product[], query: string) {
  const fuse = useMemo(
    () => new Fuse(products, searchOptions),
    [products]
  );

  const results = useMemo(() => {
    if (!query) return products;
    return fuse.search(query).map(result => result.item);
  }, [query, fuse, products]);

  return results;
}
