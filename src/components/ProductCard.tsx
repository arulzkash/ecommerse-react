// import React from 'react';
// import { Product } from '../types';
// import { useCart } from '../context/CartContext';
// import { ShoppingCart, Heart } from 'lucide-react';
// import { toast } from 'react-hot-toast';

// interface ProductCardProps {
//   product: Product;
//   isWishlisted: boolean;
//   addToWishlist: (product: Product) => void;
//   removeFromWishlist: (productId: string) => void;
// }

// export const ProductCard: React.FC<ProductCardProps> = ({
//   product,
//   isWishlisted,
//   addToWishlist,
//   removeFromWishlist,
// }) => {
//   const { dispatch } = useCart();

//   const handleAddToCart = () => {
//     // Tambahkan produk ke cart
//     dispatch({ type: 'ADD_TO_CART', payload: product });

//     // Hapus produk dari wishlist jika ada di wishlist
//     if (isWishlisted) {
//       removeFromWishlist(product.id);
//     }

//     // Notifikasi sukses
//     toast.success(`${product.name} added to cart!`);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
//       <img
//         src={product.image}
//         alt={product.name}
//         className="w-full h-48 object-cover"
//       />
//       <div className="p-4">
//         <div className="flex justify-between items-start">
//           <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
//           <button
//             onClick={() => {
//               if (isWishlisted) {
//                 removeFromWishlist(product.id);
//               } else {
//                 addToWishlist(product);
//               }
//             }}
//             className={`p-2 rounded-full ${
//               isWishlisted ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
//             }`}
//           >
//             <Heart className="h-5 w-5" />
//           </button>
//         </div>
//         <p className="text-gray-600 text-sm mt-1">{product.description}</p>
//         <div className="mt-4 flex items-center justify-between">
//           <span className="text-xl font-bold text-gray-900">
//             ${product.price.toFixed(2)}
//           </span>
//           <button
//             onClick={handleAddToCart}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
//           >
//             <ShoppingCart size={20} />
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void; // Pastikan fungsi ini ada
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  addToWishlist,
  removeFromWishlist,
}) => {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    // Tambahkan produk ke cart
    dispatch({ type: 'ADD_TO_CART', payload: product });

    // Hapus produk dari wishlist jika ada di wishlist
    if (isWishlisted) {
      removeFromWishlist(product.id);
    }

    // Notifikasi sukses
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          {
          <button
            onClick={() => {
              if (isWishlisted) {
                removeFromWishlist(product.id);
                toast.success(`${product.name} has been removed from your wishlist!`);
              } else {
                addToWishlist(product);
                toast.success(`${product.name} has been added to your wishlist!`);
              }
            }}
            className={`p-2 rounded-full ${
              isWishlisted ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart className="h-5 w-5" />
          </button>
          }
        </div>
        <p className="text-gray-600 text-sm mt-1">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
