import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { ReviewSection } from "./ReviewSection";

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

  if (product === undefined) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-gray-200 rounded mr-4"></div>
            <div className="h-8 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
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
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-serif font-bold text-[#171717] mb-4">Product not found</h2>
        <p className="text-[#171717]/60 mb-8">The product you're looking for doesn't exist.</p>
        <button
          onClick={onBack}
          className="bg-[#D5975B] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#D5975B]/90 transition-colors"
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
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Back Button */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="p-2 text-[#171717] hover:text-[#D5975B] transition-colors mr-4"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-3xl font-serif font-bold text-[#171717]">Product Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-4 right-4">
              <span className="bg-[#D5975B] text-white text-sm px-3 py-1 rounded-full capitalize">
                {product.category}
              </span>
            </div>

            {/* Stats */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {product.views && product.views > 0 && (
                <span className="bg-black/50 text-white text-sm px-3 py-1 rounded-full flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  {product.views}
                </span>
              )}
              {product.likes && product.likes > 0 && (
                <span className="bg-black/50 text-white text-sm px-3 py-1 rounded-full flex items-center">
                  <svg className="w-4 h-4 mr-1 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                  </svg>
                  {product.likes}
                </span>
              )}
            </div>

            {/* Like Button */}
            <button
              onClick={handleToggleLike}
              className="absolute bottom-4 right-4 p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
            >
              <svg 
                className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
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
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-serif font-bold text-[#171717] mb-2">
              {product.name}
            </h2>
            <p className="text-lg text-[#171717]/70 mb-4">
              {product.description}
            </p>
            
            {/* Rating */}
            {product.rating && product.reviewCount && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
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
                <span className="text-sm text-gray-600">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Version Selection */}
          <div>
            <h3 className="text-lg font-medium text-[#171717] mb-3">Select Version</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedVersion("original")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedVersion === "original"
                    ? "bg-[#D5975B] text-white"
                    : "bg-gray-100 text-[#171717] hover:bg-[#D5975B]/10"
                }`}
              >
                Original - ${product.originalPrice.toFixed(2)}
              </button>
              <button
                onClick={() => setSelectedVersion("ordinary")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedVersion === "ordinary"
                    ? "bg-[#D5975B] text-white"
                    : "bg-gray-100 text-[#171717] hover:bg-[#D5975B]/10"
                }`}
              >
                Ordinary - ${product.ordinaryPrice.toFixed(2)}
              </button>
            </div>
          </div>

          {/* Price Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg text-[#171717]/70">Current Price:</span>
              <span className="text-3xl font-bold text-[#171717]">
                ${currentPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-[#171717]/60">
              <span>Other version:</span>
              <span>${otherPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Quantity Selection */}
          <div>
            <h3 className="text-lg font-medium text-[#171717] mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                -
              </button>
              <span className="text-xl font-medium w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-medium ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Add to Cart Button */}
          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isLoading}
              className="w-full bg-[#D5975B] text-white py-4 rounded-lg font-medium text-lg hover:bg-[#D5975B]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Adding to Cart..." : `Add ${quantity} to Cart - $${(currentPrice * quantity).toFixed(2)}`}
            </button>
            
            {!product.inStock && (
              <p className="text-red-500 text-center">This item is currently out of stock</p>
            )}
          </div>

          {/* Product Features */}
          {product.featured && (
            <div className="bg-[#D5975B]/10 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-[#D5975B]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="font-medium text-[#D5975B]">Featured Product</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection productId={productId} />
    </div>
  );
}
