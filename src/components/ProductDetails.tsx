import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { ReviewSection } from "./ReviewSection";
import { ResponsiveImage } from "./ResponsiveImage";

interface ProductDetailsProps {
  productId: string;
  onBack: () => void;
}

export function ProductDetails({ productId, onBack }: ProductDetailsProps) {
  const [selectedVersion, setSelectedVersion] = useState<"original" | "ordinary">("original");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  
  const product = useQuery(api.products.get, { id: productId as any });
  const addToCart = useMutation(api.cart.add);
  const trackView = useMutation(api.analytics.trackProductView);
  const toggleLike = useMutation(api.analytics.toggleProductLike);
  const isLiked = useQuery(api.analytics.isProductLiked, { productId: productId as any });

  // Track view when component mounts
  useEffect(() => {
    if (productId) {
      trackView({ productId: productId as any, sessionId });
    }
  }, [productId, trackView, sessionId]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsLoading(true);
    try {
      await addToCart({
        productId: product._id as any,
        version: selectedVersion,
        quantity,
      });
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLike = async () => {
    if (!product) return;
    
    try {
      await toggleLike({ productId: product._id as any });
    } catch (error) {
      toast.error("Please sign in to like products");
    }
  };

  const formatCategoryName = (category: string) => {
    if (category === "bathandbody") return "Bath & Body";
    if (category === "haircare") return "Hair Care";
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (product === undefined) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6 sm:space-y-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            <div className="aspect-square bg-gray-200 rounded-xl"></div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 lg:py-16">
        <div className="text-6xl lg:text-8xl mb-6">❌</div>
        <h2 className="text-2xl lg:text-3xl font-serif font-bold text-[#171717] mb-4">Product not found</h2>
        <p className="text-[#171717]/60 mb-8 text-lg">The product you're looking for doesn't exist.</p>
        <button
          onClick={onBack}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const currentPrice = selectedVersion === "original" ? product.originalPrice : product.ordinaryPrice;
  const currentImage = selectedVersion === "original" ? product.originalImageUrl : product.ordinaryImageUrl;
  const otherPrice = selectedVersion === "original" ? product.ordinaryPrice : product.originalPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 lg:space-y-12">
      {/* Back Button */}
      <div className="flex items-center space-x-4 py-4">
        <button
          onClick={onBack}
          className="p-3 text-[#171717] hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 touch-manipulation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#171717]">Product Details</h1>
          <p className="text-purple-600 mt-1">Everything you need to know</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Image */}
        <div className="space-y-4 sm:space-y-6">
          <div className="relative">
            <ResponsiveImage
              src={currentImage}
              alt={product.name}
              className="shadow-2xl"
              aspectRatio="square"
              priority={true}
              hover={true}
              overlayEffect="fade"
              placeholder="blur"
            />
            
            {/* Category Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm px-4 py-2 rounded-full font-medium backdrop-blur-sm border border-white/10 shadow-lg">
                {formatCategoryName(product.category)}
              </span>
            </div>

            {/* Stats */}
            <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
              {product.views && product.views > 0 && (
                <span className="bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-full flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  {product.views}
                </span>
              )}
              {product.likes && product.likes > 0 && (
                <span className="bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-full flex items-center">
                  <svg className="w-4 h-4 mr-2 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                  </svg>
                  {product.likes}
                </span>
              )}
            </div>

            {/* Like Button - Enhanced for mobile */}
            <button
              onClick={handleToggleLike}
              className="absolute bottom-4 right-4 z-10 p-4 sm:p-5 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-200 touch-manipulation shadow-lg hover:shadow-xl min-w-[52px] min-h-[52px] flex items-center justify-center"
            >
              <svg 
                className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-400'}`} 
                fill={isLiked ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#171717] mb-4">
              {product.name}
            </h2>
            <p className="text-lg text-[#171717]/70 mb-6 leading-relaxed">
              {product.description}
            </p>
            
            {/* Rating */}
            {product.rating && product.reviewCount && (
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Version Selection - Enhanced Mobile Layout */}
          <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-purple-100">
            <h3 className="text-lg sm:text-xl font-serif font-semibold text-[#171717] mb-4 sm:mb-6 text-center">Select Version</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => setSelectedVersion("original")}
                className={`p-4 sm:p-5 rounded-xl font-medium transition-all duration-200 border-2 touch-manipulation min-h-[80px] ${
                  selectedVersion === "original"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg transform scale-[1.02]"
                    : "bg-white text-[#171717] border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md"
                }`}
              >
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold mb-1">${product.originalPrice.toFixed(2)}</div>
                  <div className="text-sm sm:text-base opacity-90 font-semibold">Original Version</div>
                  <div className="text-xs opacity-75 mt-1">Premium Quality</div>
                </div>
              </button>
              <button
                onClick={() => setSelectedVersion("ordinary")}
                className={`p-4 sm:p-5 rounded-xl font-medium transition-all duration-200 border-2 touch-manipulation min-h-[80px] ${
                  selectedVersion === "ordinary"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg transform scale-[1.02]"
                    : "bg-white text-[#171717] border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md"
                }`}
              >
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold mb-1">${product.ordinaryPrice.toFixed(2)}</div>
                  <div className="text-sm sm:text-base opacity-90 font-semibold">Ordinary Version</div>
                  <div className="text-xs opacity-75 mt-1">Great Value</div>
                </div>
              </button>
            </div>
          </div>

          {/* Price Display */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg text-[#171717]/70">Current Price:</span>
              <span className="text-3xl font-bold text-[#171717]">
                ${currentPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-[#171717]/60 border-t border-gray-100 pt-4">
              <span>Alternative version:</span>
              <span className="font-medium">${otherPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Quantity Selection - Enhanced Mobile Layout */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-serif font-semibold text-[#171717] text-center">Quantity</h3>
            <div className="flex items-center justify-center space-x-4 sm:space-x-6 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-purple-100">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all duration-200 text-xl font-bold touch-manipulation min-w-[48px] min-h-[48px] border-2 border-gray-200 hover:border-purple-300"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                </svg>
              </button>
              <div className="bg-white rounded-xl px-6 py-3 sm:px-8 sm:py-4 shadow-lg border-2 border-purple-200 min-w-[80px]">
                <span className="text-2xl sm:text-3xl font-bold text-[#171717] text-center block">{quantity}</span>
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all duration-200 text-xl font-bold touch-manipulation min-w-[48px] min-h-[48px] border-2 border-gray-200 hover:border-purple-300"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-semibold text-lg ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Add to Cart Button - Enhanced Mobile Layout */}
          <div className="space-y-4 sm:space-y-6">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isLoading}
              className={`w-full py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all duration-200 touch-manipulation min-h-[56px] shadow-lg ${
                !product.inStock
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : isLoading
                  ? "bg-gradient-to-r from-purple-200 to-pink-200 text-purple-700 cursor-wait"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-6 h-6 border-3 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                  <span>Adding to Cart...</span>
                </div>
              ) : !product.inStock ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Out of Stock</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>{`Add ${quantity} to Cart • $${(currentPrice * quantity).toFixed(2)}`}</span>
                </div>
              )}
            </button>
            
            {!product.inStock && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-red-600 font-medium text-sm sm:text-base">This item is currently out of stock</p>
                <p className="text-red-500 text-xs sm:text-sm mt-1">We'll notify you when it becomes available</p>
              </div>
            )}
          </div>

          {/* Product Features */}
          {product.featured && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="font-semibold text-purple-900 text-lg">Featured Product</span>
              </div>
              <p className="text-purple-800 mt-2">This is one of our most popular items, loved by customers worldwide.</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection productId={productId} />
    </div>
  );
}
