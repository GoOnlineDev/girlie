import { SearchBar } from "./SearchBar";
import { ProductGrid } from "./ProductGrid";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type CategoryType = "makeup" | "skincare" | "haircare" | "fragrance" | "accessories" | "bathandbody" | "nails" | "bags" | "shoes";

const categories = [
  { id: "makeup", name: "Makeup", emoji: "💄" },
  { id: "skincare", name: "Skincare", emoji: "🧴" },
  { id: "haircare", name: "Hair Care", emoji: "💇‍♀️" },
  { id: "fragrance", name: "Fragrance", emoji: "🌸" },
  { id: "accessories", name: "Accessories", emoji: "💍" },
  { id: "bathandbody", name: "Bath & Body", emoji: "🛁" },
  { id: "nails", name: "Nails", emoji: "💅" },
  { id: "bags", name: "Bags", emoji: "👜" },
  { id: "shoes", name: "Shoes", emoji: "👠" },
];

interface HomeContentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onProductClick: (productId: string) => void;
  onCategoryClick: (category: CategoryType) => void;
}

export function HomeContent({ searchTerm, setSearchTerm, onProductClick, onCategoryClick }: HomeContentProps) {
  const featuredProducts = useQuery(api.products.list, { featured: true });
  const newArrivals = useQuery(api.products.list, { newArrival: true });
  const comingSoon = useQuery(api.products.list, { comingSoon: true });

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#171717] mb-4">
          Girlie Collection
        </h1>
        <p className="text-xl text-purple-600 mb-8">Let's shop it</p>
      </div>

      {/* Search Bar */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Categories */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#171717] text-center">Shop by Category</h2>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 pb-4 min-w-max px-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.id as CategoryType)}
                className="flex-shrink-0 bg-white rounded-full px-6 py-3 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 border border-purple-100 hover:border-purple-300"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{category.emoji}</span>
                  <span className="font-medium text-[#171717] whitespace-nowrap">{category.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-[#171717]">New Arrivals</h2>
          <div className="flex items-center text-purple-600">
            <span className="text-sm font-medium mr-1">Fresh & Trending</span>
            <span className="text-lg">✨</span>
          </div>
        </div>
        {newArrivals && newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((product) => (
              <div key={product._id} className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
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
          <div className="text-center py-8 text-gray-500">
            <p>No new arrivals yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-[#171717]">Featured Products</h2>
          <div className="flex items-center text-purple-600">
            <span className="text-sm font-medium mr-1">Staff Picks</span>
            <span className="text-lg">⭐</span>
          </div>
        </div>
        {featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <div key={product._id} className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Featured
                  </span>
                </div>
                <div onClick={() => onProductClick(product._id)} className="cursor-pointer">
                  <ProductCard product={product} onProductClick={onProductClick} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No featured products yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Coming Soon */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-[#171717]">Coming Soon</h2>
          <div className="flex items-center text-purple-600">
            <span className="text-sm font-medium mr-1">Get Ready</span>
            <span className="text-lg">🔮</span>
          </div>
        </div>
        {comingSoon && comingSoon.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {comingSoon.slice(0, 4).map((product) => (
              <div key={product._id} className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Coming Soon
                  </span>
                </div>
                <div className="opacity-75 cursor-not-allowed">
                  <ProductCard product={product} onProductClick={() => {}} />
                </div>
                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                  <span className="bg-white/90 text-gray-800 px-4 py-2 rounded-lg font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No upcoming products yet. Stay tuned!</p>
          </div>
        )}
      </section>

      {/* All Products */}
      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-[#171717]">All Products</h2>
        <ProductGrid 
          category={null} 
          searchTerm={searchTerm} 
          onProductClick={onProductClick}
        />
      </section>
    </div>
  );
}

// Simple ProductCard component for the home page sections
function ProductCard({ product, onProductClick }: { product: any; onProductClick: (id: string) => void }) {
  const currentImage = product.originalImageUrl || product.ordinaryImageUrl;
  
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
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-serif font-medium text-[#171717] mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-[#171717]">
            ${product.originalPrice.toFixed(2)}
          </div>
          <span className="text-xs text-gray-500 capitalize">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
}
