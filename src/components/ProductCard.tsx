import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

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
    e.stopPropagation(); // Prevent triggering product click
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
    e.stopPropagation(); // Prevent triggering product click
    try {
      await toggleLike({ productId: product._id as any });
    } catch (error) {
      toast.error("Please sign in to like products");
    }
  };

  const handleVersionChange = (e: React.MouseEvent, version: "original" | "ordinary") => {
    e.stopPropagation(); // Prevent triggering product click
    setSelectedVersion(version);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
      onClick={() => onProductClick(product._id)}
    >
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {currentImage ? (
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <span className="bg-purple-600 text-white text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full capitalize">
            {product.category === "bathandbody" ? "Bath & Body" : 
             product.category === "haircare" ? "Hair Care" : 
             product.category}
          </span>
        </div>
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
          {product.views && (
            <span className="bg-black/50 text-white text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full flex items-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
              {product.views}
            </span>
          )}
        </div>
        <button
          onClick={handleToggleLike}
          className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-2 sm:p-2.5 bg-white/80 rounded-full hover:bg-white transition-colors touch-manipulation"
        >
          <svg 
            className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
            fill={isLiked ? "currentColor" : "none"} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="p-3 sm:p-4">
        <h3 className="font-serif font-medium text-[#171717] mb-2 line-clamp-2 text-sm sm:text-base">
          {product.name}
        </h3>
        
        <p className="text-xs sm:text-sm text-[#171717]/60 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && product.reviewCount && (
          <div className="flex items-center space-x-1 mb-3">
            <div className="flex items-center">
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
            <span className="text-xs text-gray-500">
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={(e) => handleVersionChange(e, "original")}
              className={`px-2 py-1 sm:px-3 sm:py-1 text-xs rounded-full font-medium transition-colors touch-manipulation ${
                selectedVersion === "original"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-[#171717] hover:bg-purple-100"
              }`}
            >
              Original
            </button>
            <button
              onClick={(e) => handleVersionChange(e, "ordinary")}
              className={`px-2 py-1 sm:px-3 sm:py-1 text-xs rounded-full font-medium transition-colors touch-manipulation ${
                selectedVersion === "ordinary"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-[#171717] hover:bg-purple-100"
              }`}
            >
              Ordinary
            </button>
          </div>
          {product.likes && product.likes > 0 && (
            <span className="text-xs text-gray-500 flex items-center">
              <svg className="w-3 h-3 mr-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
              </svg>
              {product.likes}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-base sm:text-lg font-bold text-[#171717]">
            ${currentPrice.toFixed(2)}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isLoading}
            className="bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm touch-manipulation"
          >
            {isLoading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
        
        {!product.inStock && (
          <p className="text-red-500 text-sm mt-2">Out of stock</p>
        )}
      </div>
    </div>
  );
}
