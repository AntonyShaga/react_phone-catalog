import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from './useProducts';
import { useAppSelector } from '../store/hooks';

export const useFavoritesPage = () => {
  const [searchParams] = useSearchParams();

  const favoriteItemIds = useAppSelector(state => state.favorites.itemIds);
  const { products, isLoading, hasError } = useProducts();

  const query = searchParams.get('query')?.trim().toLowerCase() || '';

  const favoriteProducts = useMemo(() => {
    return products.filter(product => {
      return favoriteItemIds.includes(product.itemId);
    });
  }, [products, favoriteItemIds]);

  const searchedFavoriteProducts = useMemo(() => {
    if (!query) {
      return favoriteProducts;
    }

    return favoriteProducts.filter(product => {
      const searchableText = [
        product.name,
        product.category,
        product.screen,
        product.capacity,
        product.ram,
        product.color,
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [favoriteProducts, query]);

  const skeletonCount = Math.min(favoriteItemIds.length, 8);

  const shouldShowLoader = isLoading && favoriteItemIds.length === 0;

  const shouldShowSkeletons = isLoading && favoriteItemIds.length > 0;

  const shouldShowError = !isLoading && hasError;

  const shouldShowEmptyFavorites =
    !isLoading && !hasError && favoriteProducts.length === 0;

  const shouldShowEmptySearch =
    !isLoading &&
    !hasError &&
    favoriteProducts.length > 0 &&
    searchedFavoriteProducts.length === 0;

  const shouldShowFavorites =
    !isLoading && !hasError && searchedFavoriteProducts.length > 0;

  return {
    favoriteItemIds,
    searchedFavoriteProducts,
    skeletonCount,
    shouldShowLoader,
    shouldShowSkeletons,
    shouldShowError,
    shouldShowEmptyFavorites,
    shouldShowEmptySearch,
    shouldShowFavorites,
  };
};
