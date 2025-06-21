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

  if (products === undefined) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-3 sm:p-4 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-3 sm:mb-4"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="text-4xl sm:text-6xl mb-4">🛍️</div>
        <h3 className="text-lg sm:text-xl font-serif font-medium text-[#171717] mb-2">
          No products found
        </h3>
        <p className="text-sm sm:text-base text-[#171717]/60">
          {searchTerm ? "Try a different search term" : "Check back later for new arrivals"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product._id} 
          product={product} 
          onProductClick={onProductClick}
        />
      ))}
    </div>
  );
}
