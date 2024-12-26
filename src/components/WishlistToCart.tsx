import React from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { Product } from '../types';

interface WishlistToCartProps {
  wishlist: Product[];
  setWishlist: (newWishlist: Product[]) => void;
}

export const WishlistToCart: React.FC<WishlistToCartProps> = ({
  wishlist,
  setWishlist,
}) => {
  const { dispatch: cartDispatch } = useCart();

  const handleAddAllToCart = async () => {
    if (wishlist.length > 0) {
      try {
        wishlist.forEach((item) => {
          cartDispatch({ type: 'ADD_TO_CART', payload: item });
        });
  
        const response = await fetch('http://localhost:5000/api/wishlist', {
          method: 'DELETE',
        });
  
        if (response.ok) {
          setWishlist([]);
          toast.success('All wishlist items have been added to the cart and wishlist cleared!');
        } else {
          const errorData = await response.json();
          console.error('Server error:', errorData.message);
          toast.error('Failed to clear wishlist on the server.');
        }
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        toast.error('An error occurred while clearing the wishlist.');
      }
    } else {
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
