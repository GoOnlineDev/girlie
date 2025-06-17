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
        <h2 className="text-2xl font-serif font-bold text-[#171717] mb-8">Shopping Cart</h2>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
              <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
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
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-serif font-bold text-[#171717] mb-4">Your cart is empty</h2>
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
      <h2 className="text-2xl font-serif font-bold text-[#171717] mb-8">Shopping Cart</h2>
      
      <div className="space-y-4 mb-8">
        {cartItems.map((item) => {
          const price = item.version === "original" 
            ? item.product.originalPrice 
            : item.product.ordinaryPrice;
          const imageUrl = item.version === "original"
            ? item.product.originalImageUrl
            : item.product.ordinaryImageUrl;

          return (
            <div key={item._id} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-serif font-medium text-[#171717] mb-1">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-[#171717]/60 mb-2 capitalize">
                    {item.version} version • {item.product.category}
                  </p>
                  <div className="flex items-center space-x-4">
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
                
                <button
                  onClick={() => handleRemove(item._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between text-xl font-bold text-[#171717] mb-4">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button 
            onClick={() => setShowCheckout(true)}
            className="w-full bg-[#D5975B] text-white py-3 rounded-lg font-medium hover:bg-[#D5975B]/90 transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    );
  }
