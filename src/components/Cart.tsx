import React from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';

export const Cart: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { state, dispatch } = useCart();

  if (!isOpen) return null;

  const handleCheckout = () => {
    dispatch({ type: 'CLEAR_CART' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart /> Shopping Cart
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {state.items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4">
              {state.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                        {
                          if (item.quantity === 1) {
                            // Jika quantity sudah 1, hapus produk dari keranjang
                            dispatch({
                              type: 'REMOVE_FROM_CART',
                              payload: item.id,
                            });
                          } else {
                            // Jika quantity lebih dari 1, kurangi quantity
                            dispatch({
                              type: 'UPDATE_QUANTITY',
                              payload: {
                                id: item.id,
                                quantity: item.quantity - 1,
                              },
                            });
                          }
                        }
                        }
                        className="p-1 rounded-full hover:bg-gray-200"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'UPDATE_QUANTITY',
                            payload: {
                              id: item.id,
                              quantity: item.quantity + 1,
                            },
                          })
                        }
                        className="p-1 rounded-full hover:bg-gray-200"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'REMOVE_FROM_CART',
                            payload: item.id,
                          })
                        }
                        className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between text-xl font-bold mb-4">
                <span>Total:</span>
                <span>${state.total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};