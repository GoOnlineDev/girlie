import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { ResponsiveImage } from "./ResponsiveImage";

interface Product {
  _id: string;
  name: string;
  category: "makeup" | "skincare" | "haircare" | "fragrance" | "accessories" | "bathandbody" | "nails" | "bags" | "shoes";
  description: string;
  originalPrice: number;
  ordinaryPrice: number;
  originalImageUrl: string | null;
  ordinaryImageUrl: string | null;
  inStock: boolean;
  views?: number;
  likes?: number;
  rating?: number;
  reviewCount?: number;
}

interface ProductCardProps {
  product: Product;
  onProductClick: (productId: string) => void;
}

export function ProductCard({ product, onProductClick }: ProductCardProps) {
  const [selectedVersion, setSelectedVersion] = useState<"original" | "ordinary">("original");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  
  const addToCart = useMutation(api.cart.add);
  const trackView = useMutation(api.analytics.trackProductView);
  const toggleLike = useMutation(api.analytics.toggleProductLike);
  const isLiked = useQuery(api.analytics.isProductLiked, { productId: product._id as any });

  const currentPrice = selectedVersion === "original" ? product.originalPrice : product.ordinaryPrice;
  const currentImage = selectedVersion === "original" ? product.originalImageUrl : product.ordinaryImageUrl;

  // Track view when component mounts
  useEffect(() => {
    trackView({ productId: product._id as any, sessionId });
  }, [product._id, trackView, sessionId]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await addToCart({
        productId: product._id as any,
        version: selectedVersion,
        quantity: 1,
      });
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleLike({ productId: product._id as any });
    } catch (error) {
      toast.error("Please sign in to like products");
    }
  };

  const handleVersionChange = (e: React.MouseEvent, version: "original" | "ordinary") => {
    e.stopPropagation();
    setSelectedVersion(version);
  };

  const formatCategoryName = (category: string) => {
    if (category === "bathandbody") return "Bath & Body";
    if (category === "haircare") return "Hair Care";
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div 
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-purple-200"
      onClick={() => onProductClick(product._id)}
    >
      {/* Image Container with Enhanced Overlays */}
      <div className="relative">
        <ResponsiveImage
          src={currentImage}
          alt={product.name}
          className="shadow-lg group-hover:shadow-xl"
          aspectRatio="square"
          priority={false}
          hover={true}
          overlayEffect="scale"
          placeholder="blur"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium backdrop-blur-sm border border-white/10">
            {formatCategoryName(product.category)}
          </span>
        </div>
        
        {/* Stats Badge */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
          <div className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
            {product.views && product.views > 0 && (
              <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
                {product.views}
              </span>
            )}
          </div>
        </div>
        
        {/* Like Button - Enhanced for mobile */}
        <button
          onClick={handleToggleLike}
          className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 p-3 sm:p-3.5 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all duration-200 touch-manipulation shadow-lg hover:shadow-xl min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <svg 
            className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-400'}`} 
            fill={isLiked ? "currentColor" : "none"} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        
        {/* Stock Indicator */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold text-sm sm:text-base shadow-lg border border-red-400/20">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Out of Stock</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-3 sm:p-4 lg:p-5 space-y-3">
        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="font-serif font-semibold text-[#171717] line-clamp-2 text-sm sm:text-base lg:text-lg leading-tight">
            {product.name}
          </h3>
          
          <p className="text-xs sm:text-sm text-[#171717]/60 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Rating */}
        {product.rating && product.reviewCount && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}
        
        {/* Version Selection - Enhanced Mobile Layout */}
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="flex bg-gray-100 rounded-xl p-1 space-x-1 w-full">
              <button
                onClick={(e) => handleVersionChange(e, "original")}
                className={`px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg font-semibold transition-all duration-200 touch-manipulation min-h-[40px] flex-1 ${
                  selectedVersion === "original"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-[1.02]"
                    : "bg-transparent text-[#171717] hover:bg-white hover:text-purple-700 hover:shadow-md"
                }`}
              >
                Original
              </button>
              <button
                onClick={(e) => handleVersionChange(e, "ordinary")}
                className={`px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg font-semibold transition-all duration-200 touch-manipulation min-h-[40px] flex-1 ${
                  selectedVersion === "ordinary"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-[1.02]"
                    : "bg-transparent text-[#171717] hover:bg-white hover:text-purple-700 hover:shadow-md"
                }`}
              >
                Ordinary
              </button>
            </div>
          </div>
          
          {/* Likes Count */}
          {product.likes && product.likes > 0 && (
            <div className="flex justify-center">
              <span className="text-xs sm:text-sm text-gray-500 flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-full">
                <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
                <span>{product.likes} likes</span>
              </span>
            </div>
          )}
        </div>
        
        {/* Price and Add to Cart - Enhanced Mobile Layout */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-[#171717] mb-1">
              ${currentPrice.toFixed(2)}
            </div>
            {product.inStock ? (
              <span className="inline-flex items-center text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
                Out of Stock
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isLoading}
            className={`w-full px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 touch-manipulation min-h-[44px] ${
              !product.inStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isLoading
                ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-500 cursor-wait"
                : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                <span>Adding to Cart...</span>
              </div>
            ) : !product.inStock ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Out of Stock</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-bold">Add to Cart</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
