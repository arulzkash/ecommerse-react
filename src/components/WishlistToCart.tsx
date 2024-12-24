import React from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { Product } from '../types';

interface WishlistToCartProps {
  wishlist: Product[];
}

export const WishlistToCart: React.FC<WishlistToCartProps> = ({ wishlist }) => {
  const { dispatch } = useCart();

  const handleAddAllToCart = () => {
    if (wishlist.length > 0) {
      // Dispatch action to add all items to cart
      dispatch({ type: 'ADD_MULTIPLE_TO_CART', payload: wishlist });
      toast.success('All wishlist items added to cart');
    } else {
      toast.error('Your wishlist is empty');
    }
  };
  return (
      <button
      onClick={handleAddAllToCart}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
    //   className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
    >
      Add All Wishlist to Cart
    </button>
  );
};
