import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ResponsiveImage } from "./ResponsiveImage";

interface NewArrivalsScreenProps {
  onProductClick: (productId: string) => void;
}

export function NewArrivalsScreen({ onProductClick }: NewArrivalsScreenProps) {
  const newArrivals = useQuery(api.products.list, { newArrival: true });

  return (
    <div className="min-h-screen bg-[#f4f1ed] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171717]">
              New Arrivals
            </h1>
            <div className="flex items-center text-purple-600">
              <span className="text-sm sm:text-base font-medium mr-2">Fresh & Trending</span>
              <span className="text-lg sm:text-xl">✨</span>
            </div>
          </div>
          <p className="font-sans text-base sm:text-lg text-gray-600">
            Be the first to discover our latest beauty finds
          </p>
        </div>

        {/* New Arrivals Grid */}
        {newArrivals && newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {newArrivals.map((product) => (
              <div key={product._id} className="relative">
                <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10">
                  <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium">
                    New
                  </span>
                </div>
                <div onClick={() => onProductClick(product._id)} className="cursor-pointer">
                  <ProductCard product={product} onProductClick={onProductClick} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="text-6xl sm:text-8xl mb-4 opacity-50">✨</div>
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
              No New Arrivals Yet
            </h3>
            <p className="font-sans text-base sm:text-lg text-gray-500 text-center max-w-md">
              We're constantly adding amazing new products. Check back soon for the latest beauty treasures!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Product Card component for New Arrivals
function ProductCard({ product, onProductClick }: { product: any; onProductClick: (id: string) => void }) {
  const currentImage = product.originalImageUrl || product.ordinaryImageUrl;
  
  return (
    <div 
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-purple-200 transform hover:scale-[1.02]"
      onClick={() => onProductClick(product._id)}
    >
      <div className="relative">
        <ResponsiveImage
          src={currentImage}
          alt={product.name}
          className="shadow-md group-hover:shadow-xl"
          aspectRatio="square"
          priority={false}
          hover={true}
          overlayEffect="scale"
          placeholder="blur"
        />
        
        {/* Enhanced Stock Indicator */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-lg border border-red-400/20">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Out of Stock</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <h3 className="font-serif font-semibold text-[#171717] line-clamp-2 text-sm sm:text-base lg:text-lg leading-tight group-hover:text-purple-700 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-xs sm:text-sm text-[#171717]/60 line-clamp-2 leading-relaxed hidden sm:block">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-lg sm:text-xl font-bold text-[#171717] bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ${(product.originalPrice || product.ordinaryPrice || 0).toFixed(2)}
          </div>
          
          {product.inStock ? (
            <span className="inline-flex items-center text-xs sm:text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center text-xs sm:text-sm text-red-500 font-medium bg-red-50 px-2 py-1 rounded-full">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 