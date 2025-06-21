import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useState } from "react";
import { Checkout } from "./Checkout";

export function Cart() {
  const [showCheckout, setShowCheckout] = useState(false);
  const cartItems = useQuery(api.cart.list);
  const removeFromCart = useMutation(api.cart.remove);
  const updateQuantity = useMutation(api.cart.updateQuantity);

  const handleRemove = async (itemId: string) => {
    try {
      await removeFromCart({ id: itemId as any });
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      await updateQuantity({ id: itemId as any, quantity: newQuantity });
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    toast.success("Order placed successfully! Check your orders in your profile.");
  };

  if (showCheckout) {
    return (
      <Checkout 
        onBack={() => setShowCheckout(false)}
        onSuccess={handleCheckoutSuccess}
      />
    );
  }

  if (cartItems === undefined) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#171717] mb-6 sm:mb-8">Shopping Cart</h2>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 sm:p-6 animate-pulse">
              <div className="flex space-x-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-8 sm:py-12">
        <div className="text-4xl sm:text-6xl mb-4">🛒</div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#171717] mb-4">Your cart is empty</h2>
        <p className="text-[#171717]/60">Add some beautiful items to get started!</p>
      </div>
    );
  }

  const total = cartItems.reduce((sum, item) => {
    const price = item.version === "original" 
      ? item.product.originalPrice 
      : item.product.ordinaryPrice;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#171717] mb-6 sm:mb-8">Shopping Cart</h2>
      
      <div className="space-y-4 mb-6 sm:mb-8">
        {cartItems.map((item) => {
          const price = item.version === "original" 
            ? item.product.originalPrice 
            : item.product.ordinaryPrice;
          const imageUrl = item.version === "original"
            ? item.product.originalImageUrl
            : item.product.ordinaryImageUrl;

          return (
            <div key={item._id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-serif font-medium text-[#171717] mb-1 text-sm sm:text-base">
                    {item.product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#171717]/60 mb-3 sm:mb-2 capitalize">
                    {item.version} version • {item.product.category}
                  </p>
                  
                  {/* Mobile Layout */}
                  <div className="flex flex-col space-y-3 sm:hidden">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-lg font-medium"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-lg font-medium"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-lg font-bold text-[#171717]">
                      ${(price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="mx-auto p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-lg font-bold text-[#171717]">
                      ${(price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {/* Desktop Remove Button */}
                <button
                  onClick={() => handleRemove(item._id)}
                  className="hidden sm:block p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between text-lg sm:text-xl font-bold text-[#171717] mb-4">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button 
          onClick={() => setShowCheckout(true)}
          className="w-full bg-[#D5975B] text-white py-3 sm:py-4 rounded-lg font-medium hover:bg-[#D5975B]/90 transition-colors text-sm sm:text-base"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
