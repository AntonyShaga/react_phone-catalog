import { useMemo } from 'react';
import { useProducts } from './useProducts';
import { useAppSelector } from '../store/hooks';
import type { ProductFromServer } from '../types/product';

export type PreparedCartItem = {
  product: ProductFromServer;
  quantity: number;
};

export const useCartPage = () => {
  const cartItems = useAppSelector(state => state.cart.items);
  const { products, isLoading, hasError } = useProducts();

  const preparedCartItems = useMemo(() => {
    return cartItems
      .map(cartItem => {
        const product = products.find(item => item.itemId === cartItem.itemId);

        if (!product) {
          return null;
        }

        return {
          product,
          quantity: cartItem.quantity,
        };
      })
      .filter((item): item is PreparedCartItem => {
        return item !== null;
      });
  }, [cartItems, products]);

  const totalQuantity = preparedCartItems.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  const totalPrice = preparedCartItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const skeletonCount = Math.min(cartItems.length, 4);

  const shouldShowLoader = isLoading && cartItems.length === 0;

  const shouldShowSkeletons = isLoading && cartItems.length > 0;

  const shouldShowError = !isLoading && hasError;

  const shouldShowEmptyCart =
    !isLoading && !hasError && preparedCartItems.length === 0;

  const shouldShowCart =
    !isLoading && !hasError && preparedCartItems.length > 0;

  return {
    preparedCartItems,
    totalQuantity,
    totalPrice,
    skeletonCount,
    shouldShowLoader,
    shouldShowSkeletons,
    shouldShowError,
    shouldShowEmptyCart,
    shouldShowCart,
  };
};
