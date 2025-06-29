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
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  
  const trackView = useMutation(api.analytics.trackProductView);
  const toggleLike = useMutation(api.analytics.toggleProductLike);
  const isLiked = useQuery(api.analytics.isProductLiked, { productId: product._id as any });

  // Use original price as default for display
  const displayPrice = product.originalPrice;
  const displayImage = product.originalImageUrl || product.ordinaryImageUrl;

  // Track view when component mounts
  useEffect(() => {
    trackView({ productId: product._id as any, sessionId });
  }, [product._id, trackView, sessionId]);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <div 
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-purple-200"
      onClick={() => onProductClick(product._id)}
    >
      {/* Image Container with Enhanced Overlays */}
      <div className="relative">
        <ResponsiveImage
          src={displayImage}
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
      
      {/* Content - Simplified */}
      <div className="p-3 sm:p-4 lg:p-5 space-y-3">
        {/* Title Only */}
        <div className="space-y-2">
          <h3 className="font-serif font-semibold text-[#171717] line-clamp-2 text-sm sm:text-base lg:text-lg leading-tight">
            {product.name}
          </h3>
        </div>
        
        {/* Price and Stock Status */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-xl sm:text-2xl font-bold text-[#171717]">
              UGX {displayPrice.toLocaleString()}
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
        </div>
      </div>
    </div>
  );
}
