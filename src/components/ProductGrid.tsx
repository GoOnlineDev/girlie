import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ProductCard } from "./ProductCard";

type CategoryType = "makeup" | "skincare" | "haircare" | "fragrance" | "accessories" | "bathandbody" | "nails" | "bags" | "shoes";

interface ProductGridProps {
  category: CategoryType | null;
  searchTerm: string;
  onProductClick: (productId: string) => void;
}

export function ProductGrid({ category, searchTerm, onProductClick }: ProductGridProps) {
  const products = useQuery(
    searchTerm 
      ? api.products.search 
      : api.products.list,
    searchTerm 
      ? { searchTerm, category: category || undefined }
      : { category: category || undefined }
  );

  // Loading state with responsive skeleton
  if (products === undefined) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Loading header */}
        <div className="flex items-center justify-between">
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-32 sm:w-40 animate-pulse"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-24 animate-pulse"></div>
        </div>
        
        {/* Loading grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-3 sm:p-4 animate-pulse shadow-sm">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3 sm:mb-4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 mb-1 sm:mb-2"></div>
              <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state with better mobile design
  if (products.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="text-4xl sm:text-6xl mb-4">
          {searchTerm ? "🔍" : "🛍️"}
        </div>
        <h3 className="text-lg sm:text-xl font-serif font-medium text-[#171717] mb-2">
          {searchTerm ? "No products found" : "No products available"}
        </h3>
        <p className="text-sm sm:text-base text-[#171717]/60 max-w-md mx-auto leading-relaxed mb-4 sm:mb-6">
          {searchTerm 
            ? `We couldn't find any products matching "${searchTerm}". Try adjusting your search terms.`
            : "Check back later for new arrivals and exciting products!"
          }
        </p>
        
        {/* Search suggestions for mobile */}
        {searchTerm && (
          <div className="max-w-sm mx-auto">
            <p className="text-xs sm:text-sm text-[#171717]/50 mb-3">
              Popular searches:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["makeup", "skincare", "fragrance", "accessories"].map((term) => (
                <span 
                  key={term} 
                  className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium capitalize"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Products grid with responsive count display
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Results header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <p className="text-sm sm:text-base text-[#171717]/70 font-medium">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
          {searchTerm && (
            <span className="text-xs sm:text-sm text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              "{searchTerm}"
            </span>
          )}
        </div>
        
        {category && (
          <div className="text-xs sm:text-sm text-[#171717]/50 capitalize">
            {category}
          </div>
        )}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product} 
            onProductClick={onProductClick}
          />
        ))}
      </div>

      {/* Footer info for mobile */}
      {products.length > 0 && (
        <div className="text-center pt-4 sm:pt-6 border-t border-gray-100">
          <p className="text-xs sm:text-sm text-[#171717]/40">
            Showing all {products.length} available products
          </p>
        </div>
      )}
    </div>
  );
}
