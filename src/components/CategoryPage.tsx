import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ProductCard } from "./ProductCard";

type CategoryType = "makeup" | "skincare" | "haircare" | "fragrance" | "accessories" | "bathandbody" | "nails" | "bags" | "shoes";

const categoryInfo = {
  makeup: { name: "Makeup", emoji: "💄", description: "Enhance your natural beauty with our premium makeup collection" },
  skincare: { name: "Skincare", emoji: "🧴", description: "Nourish and protect your skin with our carefully curated skincare products" },
  haircare: { name: "Hair Care", emoji: "💇‍♀️", description: "Keep your hair healthy and beautiful with our hair care essentials" },
  fragrance: { name: "Fragrance", emoji: "🌸", description: "Discover your signature scent from our exquisite fragrance collection" },
  accessories: { name: "Accessories", emoji: "💍", description: "Complete your look with our stunning accessories" },
  bathandbody: { name: "Bath & Body", emoji: "🛁", description: "Pamper yourself with our luxurious bath and body products" },
  nails: { name: "Nails", emoji: "💅", description: "Express yourself with our vibrant nail collection" },
  bags: { name: "Bags", emoji: "👜", description: "Carry your essentials in style with our fashionable bags" },
  shoes: { name: "Shoes", emoji: "👠", description: "Step out in confidence with our trendy shoe collection" },
};

interface CategoryPageProps {
  category: CategoryType;
  onBack: () => void;
  onProductClick: (productId: string) => void;
}

export function CategoryPage({ category, onBack, onProductClick }: CategoryPageProps) {
  const products = useQuery(api.products.list, { category });
  const info = categoryInfo[category];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Compact Mobile Header */}
      <div className="flex items-start sm:items-center mb-6 sm:mb-8">
        <button
          onClick={onBack}
          className="flex-shrink-0 p-2 sm:p-3 text-[#171717] hover:text-purple-600 transition-colors mr-3 sm:mr-4 -ml-2 sm:-ml-3 rounded-full hover:bg-purple-50"
          aria-label="Go back"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          {/* Mobile: Stacked Layout */}
          <div className="sm:hidden">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">{info.emoji}</span>
              <h1 className="text-xl font-serif font-bold text-[#171717] truncate">
                {info.name}
              </h1>
            </div>
            <p className="text-sm text-purple-600 leading-relaxed pr-4">{info.description}</p>
          </div>
          
          {/* Desktop: Horizontal Layout */}
          <div className="hidden sm:block">
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#171717] flex items-center mb-2">
              <span className="text-3xl lg:text-4xl mr-3">{info.emoji}</span>
              {info.name}
            </h1>
            <p className="text-purple-600 text-base lg:text-lg">{info.description}</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products === undefined ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-3 sm:p-4 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3 sm:mb-4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 mb-1 sm:mb-2"></div>
              <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 sm:py-12 px-4">
          <div className="text-4xl sm:text-6xl mb-4">{info.emoji}</div>
          <h3 className="text-lg sm:text-xl font-serif font-medium text-[#171717] mb-2">
            No {info.name.toLowerCase()} products yet
          </h3>
          <p className="text-sm sm:text-base text-[#171717]/60 max-w-md mx-auto leading-relaxed">
            We're working on adding amazing {info.name.toLowerCase()} products. Check back soon!
          </p>
          <button
            onClick={onBack}
            className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base font-medium"
          >
            Browse All Products
          </button>
        </div>
      ) : (
        <>
          {/* Products Count */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-[#171717]/70">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
            <div className="text-xs sm:text-sm text-[#171717]/50">
              {info.name} Collection
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onProductClick={onProductClick}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
