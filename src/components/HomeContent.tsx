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
    <div className="space-y-6 sm:space-y-8 lg:space-y-12">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 opacity-70"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full blur-xl opacity-30"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-gradient-to-r from-pink-300 to-orange-300 rounded-full blur-xl opacity-30"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left space-y-4 sm:space-y-6">
              {/* Discount Badge */}
              <div className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
                <span className="text-white text-xs sm:text-sm font-medium">✨ 20% OFF</span>
                <span className="text-white/90 text-xs sm:text-sm ml-2">New Customer Special</span>
              </div>
              
              {/* Main Heading */}
              <div className="space-y-2 sm:space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-[#171717] leading-tight">
                  The Next{" "}
                  <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                    Generation
                  </span>
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-[#171717] leading-tight">
                  Beauty Collection
                </h2>
              </div>
              
              {/* Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-[#171717]/70 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Discover premium beauty products curated by experts. From skincare to makeup, find everything you need to enhance your natural beauty.
              </p>
              
              {/* CTA Button */}
              <div className="pt-2 sm:pt-4">
                <button
                  onClick={() => {
                    const allProductsSection = document.querySelector('[data-section="all-products"]');
                    allProductsSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="text-sm sm:text-base">Shop Collection</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Right Content - Hero Image */}
            <div className="flex-1 relative max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg">
              <div className="relative">
                {/* Main Hero Image Container */}
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                  <div className="w-full h-full flex items-center justify-center text-purple-300">
                    <svg className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg sm:text-xl">✨</span>
                </div>
                <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm sm:text-base">💄</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Categories */}
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-[#171717] text-center">Shop by Category</h2>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-3 sm:space-x-4 pb-4 min-w-max px-4 sm:px-0">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.id as CategoryType)}
                className="flex-shrink-0 bg-white rounded-full px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-3 shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 border border-purple-100 hover:border-purple-300"
              >
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="text-base sm:text-lg lg:text-xl">{category.emoji}</span>
                  <span className="font-medium text-[#171717] whitespace-nowrap text-xs sm:text-sm lg:text-base">{category.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-[#171717]">New Arrivals</h2>
          <div className="flex items-center text-purple-600 justify-center sm:justify-start">
            <span className="text-xs sm:text-sm font-medium mr-1">Fresh & Trending</span>
            <span className="text-sm sm:text-base">✨</span>
          </div>
        </div>
        {newArrivals && newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {newArrivals.slice(0, 4).map((product) => (
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
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <p className="text-sm sm:text-base">No new arrivals yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-[#171717]">Featured Products</h2>
          <div className="flex items-center text-purple-600 justify-center sm:justify-start">
            <span className="text-xs sm:text-sm font-medium mr-1">Staff Picks</span>
            <span className="text-sm sm:text-base">⭐</span>
          </div>
        </div>
        {featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <div key={product._id} className="relative">
                <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10">
                  <span className="bg-purple-600 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium">
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
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <p className="text-sm sm:text-base">No featured products yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Coming Soon */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-[#171717]">Coming Soon</h2>
          <div className="flex items-center text-purple-600 justify-center sm:justify-start">
            <span className="text-xs sm:text-sm font-medium mr-1">Get Ready</span>
            <span className="text-sm sm:text-base">🔮</span>
          </div>
        </div>
        {comingSoon && comingSoon.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {comingSoon.slice(0, 4).map((product) => (
              <div key={product._id} className="relative">
                <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-10">
                  <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium">
                    Coming Soon
                  </span>
                </div>
                <div className="opacity-75 cursor-not-allowed">
                  <ProductCard product={product} onProductClick={() => {}} />
                </div>
                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                  <span className="bg-white/90 text-gray-800 px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2 rounded-lg font-medium text-xs sm:text-sm lg:text-base">
                    Coming Soon
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <p className="text-sm sm:text-base">No upcoming products yet. Stay tuned!</p>
          </div>
        )}
      </section>

      {/* All Products */}
      <section className="space-y-4 sm:space-y-6" data-section="all-products">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-[#171717]">All Products</h2>
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
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 lg:w-16 lg:h-16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-2 sm:p-3 lg:p-4">
        <h3 className="font-serif font-medium text-[#171717] mb-1 sm:mb-2 line-clamp-2 text-xs sm:text-sm lg:text-base">
          {product.name}
        </h3>
        
        <p className="text-xs sm:text-xs lg:text-sm text-[#171717]/60 mb-2 sm:mb-3 line-clamp-2 hidden sm:block">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-sm sm:text-base lg:text-lg font-bold text-[#171717]">
            ${(product.originalPrice || product.ordinaryPrice || 0).toFixed(2)}
          </div>
          
          {product.inStock ? (
            <span className="text-xs lg:text-sm text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-xs lg:text-sm text-red-500 font-medium">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
