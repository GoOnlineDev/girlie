import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useState } from "react";
import { Checkout } from "./Checkout";
import { ResponsiveImage } from "./ResponsiveImage";

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
    if (newQuantity < 1) return;
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center space-x-4 py-4">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <h2 className="text-2xl lg:text-3xl font-serif font-bold text-[#171717]">Shopping Cart</h2>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse border border-gray-100">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 lg:py-24">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-12 lg:p-16 border border-purple-100">
          <div className="text-8xl lg:text-9xl mb-8">🛒</div>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#171717] mb-6">Your cart is empty</h2>
          <p className="text-lg text-[#171717]/60 mb-8 max-w-md mx-auto">
            Discover amazing products and start building your perfect collection!
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const total = cartItems.reduce((sum, item) => {
    const price = item.version === "original" 
      ? item.product.originalPrice 
      : item.product.ordinaryPrice;
    return sum + (price * item.quantity);
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between py-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl lg:text-3xl font-serif font-bold text-[#171717]">Shopping Cart</h2>
          <p className="text-purple-600 mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-2xl font-bold text-[#171717]">${total.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 py-6 lg:py-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          {cartItems.map((item) => {
            const price = item.version === "original" 
              ? item.product.originalPrice 
              : item.product.ordinaryPrice;
            const imageUrl = item.version === "original"
              ? item.product.originalImageUrl
              : item.product.ordinaryImageUrl;

            return (
              <div key={item._id} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <ResponsiveImage
                      src={imageUrl}
                      alt={item.product.name}
                      className="shadow-md"
                      sizes="md"
                      aspectRatio="square"
                      hover={true}
                      overlayEffect="fade"
                      placeholder="blur"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 space-y-4">
                    <div className="text-center sm:text-left">
                      <h3 className="font-serif font-semibold text-[#171717] text-lg">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-[#171717]/60 mt-1 capitalize">
                        {item.version} version • {item.product.category === "bathandbody" ? "Bath & Body" : 
                         item.product.category === "haircare" ? "Hair Care" : 
                         item.product.category}
                      </p>
                      <div className="text-xl font-bold text-[#171717] mt-2">
                        ${price.toFixed(2)} each
                      </div>
                    </div>
                    
                    {/* Mobile Layout - Enhanced */}
                    <div className="flex flex-col space-y-4 sm:hidden">
                      <div className="flex items-center justify-center space-x-4 bg-gray-50 rounded-xl p-3">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 hover:shadow-lg transition-all duration-200 text-xl font-bold touch-manipulation min-w-[44px] min-h-[44px] border border-gray-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                          </svg>
                        </button>
                        <div className="bg-white rounded-lg px-4 py-2 shadow-md border border-gray-200 min-w-[60px]">
                          <span className="text-xl font-bold text-[#171717] text-center block">{item.quantity}</span>
                        </div>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 hover:shadow-lg transition-all duration-200 text-xl font-bold touch-manipulation min-w-[44px] min-h-[44px] border border-gray-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-center space-y-3">
                        <div className="text-2xl font-bold text-[#171717] bg-gradient-to-r from-purple-50 to-pink-50 py-2 rounded-lg">
                          ${(price * item.quantity).toFixed(2)}
                        </div>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="bg-gradient-to-r from-red-50 to-red-100 text-red-600 px-6 py-3 rounded-xl hover:from-red-100 hover:to-red-200 transition-all duration-200 font-semibold touch-manipulation min-h-[44px] border border-red-200"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Remove Item</span>
                          </div>
                        </button>
                      </div>
                    </div>
                    
                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-600">Quantity:</span>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-lg font-bold touch-manipulation"
                          >
                            -
                          </button>
                          <span className="w-12 text-center text-lg font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-lg font-bold touch-manipulation"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-2xl font-bold text-[#171717]">
                          ${(price * item.quantity).toFixed(2)}
                        </div>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors touch-manipulation"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary - Enhanced Mobile Layout */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl p-4 sm:p-6 border border-purple-100 lg:sticky lg:top-4 shadow-lg">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#171717] mb-4 sm:mb-6 text-center lg:text-left">Order Summary</h3>
            
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex justify-between items-center text-gray-600 bg-white/50 rounded-lg p-3">
                <span className="font-medium">Items ({totalItems})</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 bg-white/50 rounded-lg p-3">
                <span className="font-medium">Shipping</span>
                <span className="text-green-600 font-bold flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Free
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-600 bg-white/50 rounded-lg p-3">
                <span className="font-medium">Tax</span>
                <span className="text-sm">At checkout</span>
              </div>
              <div className="border-t border-purple-200 pt-3 sm:pt-4">
                <div className="flex justify-between items-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border border-purple-200">
                  <span className="text-lg sm:text-xl font-bold text-[#171717]">Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-purple-700">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:from-purple-700 hover:to-pink-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl touch-manipulation min-h-[56px]"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Secure Checkout</span>
              </div>
            </button>
            
            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center justify-center lg:justify-start space-x-2 bg-white/50 rounded-lg p-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Free shipping worldwide</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 bg-white/50 rounded-lg p-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-2 bg-white/50 rounded-lg p-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
