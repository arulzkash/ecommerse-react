import React from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { Product } from '../types';

interface WishlistToCartProps {
  wishlist: Product[];
}

export const WishlistToCart: React.FC<WishlistToCartProps> = ({ wishlist }) => {
  const { dispatch: cartDispatch } = useCart();

  const handleAddAllToCart = () => {
    if (wishlist.length > 0) {
      // Tambahkan semua item dari wishlist ke cart
      wishlist.forEach((item) => {
        cartDispatch({ type: 'ADD_TO_CART', payload: item });
      });

      // Notifikasi sukses
      toast.success('All wishlist items have been added to the cart!');
    } else {
      // Notifikasi jika wishlist kosong
      toast.error('Your wishlist is empty!');
    }
  };

  return (
    <button
      onClick={handleAddAllToCart}
      className="bg-green-500 text-white px-4 py-2 rounded mb-4"
    >
      Add All Wishlist to Cart
    </button>
  );
};
