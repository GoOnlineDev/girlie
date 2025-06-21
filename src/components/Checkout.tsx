import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface CheckoutProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function Checkout({ onBack, onSuccess }: CheckoutProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const cartItems = useQuery(api.cart.list);
  const createOrder = useMutation(api.orders.createOrder);

  const total = cartItems?.reduce((sum, item) => {
    const price = item.version === "original" 
      ? item.product.originalPrice 
      : item.product.ordinaryPrice;
    return sum + (price * item.quantity);
  }, 0) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createOrder({
        shippingAddress: formData,
      });
      
      toast.success("Order placed successfully!");
      onSuccess();
    } catch (error) {
      toast.error("Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-serif font-bold text-[#171717] mb-4">Your cart is empty</h2>
        <p className="text-[#171717]/60 mb-8">Add some items to proceed with checkout</p>
        <button
          onClick={onBack}
          className="bg-[#D5975B] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#D5975B]/90 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex items-center mb-6 sm:mb-8">
        <button
          onClick={onBack}
          className="p-2 text-[#171717] hover:text-[#D5975B] transition-colors mr-4"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171717]">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Order Summary */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#171717] mb-4 sm:mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => {
              const price = item.version === "original" 
                ? item.product.originalPrice 
                : item.product.ordinaryPrice;
              const imageUrl = item.version === "original"
                ? item.product.originalImageUrl
                : item.product.ordinaryImageUrl;

              return (
                <div key={item._id} className="flex items-center space-x-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#171717] text-sm sm:text-base truncate">{item.product.name}</h3>
                    <p className="text-xs sm:text-sm text-[#171717]/60 capitalize">
                      {item.version} version • Qty: {item.quantity}
                    </p>
                  </div>
                  
                  <div className="text-sm sm:text-lg font-semibold text-[#171717] flex-shrink-0">
                    ${(price * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between text-xl font-bold text-[#171717]">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Form */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#171717] mb-4 sm:mb-6">Shipping Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#171717] mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D5975B] focus:border-transparent outline-none text-sm sm:text-base"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#171717] mb-2">
                Address
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D5975B] focus:border-transparent outline-none text-sm sm:text-base"
                placeholder="Enter your address"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#171717] mb-2">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D5975B] focus:border-transparent outline-none text-sm sm:text-base"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#171717] mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D5975B] focus:border-transparent outline-none text-sm sm:text-base"
                  placeholder="Postal code"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#171717] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D5975B] focus:border-transparent outline-none text-sm sm:text-base"
                placeholder="Enter your phone number"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#D5975B] text-white py-3 sm:py-3 rounded-lg font-medium hover:bg-[#D5975B]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 text-sm sm:text-base touch-manipulation"
            >
              {isLoading ? "Placing Order..." : `Place Order - $${total.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
