import { SearchBar } from "./SearchBar";
import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ResponsiveImage } from "./ResponsiveImage";

type CategoryType = "makeup" | "skincare" | "haircare" | "fragrance" | "accessories" | "bathandbody" | "nails" | "bags" | "shoes";

const categories = [
  { id: "makeup", name: "Makeup", emoji: "💄", gradient: "from-pink-500 to-red-500", description: "Beauty essentials" },
  { id: "skincare", name: "Skincare", emoji: "🧴", gradient: "from-blue-500 to-teal-500", description: "Glow & care" },
  { id: "haircare", name: "Hair Care", emoji: "💇‍♀️", gradient: "from-purple-500 to-pink-500", description: "Hair magic" },
  { id: "fragrance", name: "Fragrance", emoji: "🌸", gradient: "from-rose-500 to-pink-500", description: "Divine scents" },
  { id: "accessories", name: "Accessories", emoji: "💍", gradient: "from-yellow-500 to-orange-500", description: "Sparkle & shine" },
  { id: "bathandbody", name: "Bath & Body", emoji: "🛁", gradient: "from-cyan-500 to-blue-500", description: "Pamper time" },
  { id: "nails", name: "Nails", emoji: "💅", gradient: "from-fuchsia-500 to-purple-500", description: "Nail art" },
  { id: "bags", name: "Bags", emoji: "👜", gradient: "from-amber-500 to-orange-500", description: "Style essentials" },
  { id: "shoes", name: "Shoes", emoji: "👠", gradient: "from-violet-500 to-purple-500", description: "Step in style" },
];

interface HomeContentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onCategoryClick: (category: CategoryType) => void;
  onNavigateToProducts: () => void;
  onProductClick: (productId: string) => void;
}

export function HomeContent({ searchTerm, setSearchTerm, onCategoryClick, onNavigateToProducts, onProductClick }: HomeContentProps) {
  const featuredProducts = useQuery(api.products.list, { featured: true });
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!featuredProducts || featuredProducts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [featuredProducts]);

  const nextSlide = () => {
    if (featuredProducts && featuredProducts.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }
  };

  const prevSlide = () => {
    if (featuredProducts && featuredProducts.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12 lg:space-y-16 pb-20">
      {/* Featured Products Carousel Hero */}
      <section className="relative overflow-hidden">
        {featuredProducts && featuredProducts.length > 0 ? (
          <div className="relative h-[400px] sm:h-[450px] lg:h-[500px] bg-gradient-to-br from-rose-100 via-orange-50 to-amber-50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
            {/* Carousel Container */}
            <div 
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {featuredProducts.map((product, index) => (
                <div key={product._id} className="min-w-full h-full relative">
                  {/* Desktop: Background Image */}
                  <div 
                    className="hidden lg:block absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${product.originalImageUrl || product.ordinaryImageUrl})`,
                    }}
                  >
                    {/* Overlay for better text readability on desktop */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent"></div>
                  </div>

                  {/* Product Slide - Mobile First Layout */}
                  <div className="relative z-10 flex flex-col h-full p-4 sm:p-6 lg:p-8">
                    {/* Mobile & Tablet: Stacked Layout */}
                    <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between h-full gap-6 lg:gap-8">
                      
                      {/* Content Section */}
                      <div className="flex-shrink-0 text-center lg:text-left space-y-3 sm:space-y-4 w-full lg:max-w-2xl lg:flex-1">
                        {/* Featured Badge */}
                        <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg">
                          <span className="text-white text-xs sm:text-sm font-bold mr-2">⭐</span>
                          <div className="text-white">
                            <span className="font-bold text-xs sm:text-sm">FEATURED</span>
                            <span className="text-white/90 text-[10px] sm:text-xs ml-1 sm:ml-2">Staff Pick</span>
                          </div>
                        </div>
                        
                        {/* Product Info */}
                        <div className="space-y-2 sm:space-y-3">
                          <h1 className="font-serif text-lg sm:text-2xl lg:text-4xl text-gray-800 leading-tight font-bold line-clamp-2">
                            {product.name}
                          </h1>
                          <p className="font-sans text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed line-clamp-2 lg:line-clamp-3">
                            {product.description}
                          </p>
                          <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            ${(product.originalPrice || product.ordinaryPrice || 0).toFixed(2)}
                          </div>
                        </div>
                        
                        {/* Action Buttons - Mobile Optimized */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 justify-center lg:justify-start">
                          <button
                            onClick={() => onProductClick(product._id)}
                            className="group relative px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            <span className="flex items-center justify-center">
                              <span className="text-sm sm:text-base">View Product</span>
                              <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </span>
                          </button>
                          
                          <button
                            onClick={onNavigateToProducts}
                            className="group px-4 py-2.5 sm:px-6 sm:py-3 bg-white/90 backdrop-blur-sm text-purple-600 font-medium rounded-xl border border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                          >
                            <span className="flex items-center justify-center">
                              <span className="text-sm sm:text-base">Shop All</span>
                              <svg className="w-4 h-4 ml-2 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Product Image - Mobile & Tablet Only */}
                      <div className="flex-shrink-0 w-full max-w-[200px] sm:max-w-[240px] lg:hidden">
                        <div className="relative">
                          <div className="aspect-square bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/30">
                            <ResponsiveImage
                              src={product.originalImageUrl || product.ordinaryImageUrl}
                              alt={product.name}
                              className="shadow-md hover:shadow-xl transition-shadow duration-300"
                              aspectRatio="square"
                              priority={index === 0}
                              hover={true}
                              overlayEffect="scale"
                              placeholder="blur"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows - Mobile Friendly */}
            {featuredProducts.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 flex items-center justify-center group touch-manipulation z-20"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 flex items-center justify-center group touch-manipulation z-20"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Slide Indicators - Mobile Optimized */}
            {featuredProducts.length > 1 && (
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 touch-manipulation ${
                      index === currentSlide 
                        ? "bg-purple-600 scale-125" 
                        : "bg-white/60 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // Fallback when no featured products - Mobile Optimized
          <div className="h-[400px] sm:h-[450px] lg:h-[500px] bg-gradient-to-br from-rose-100 via-orange-50 to-amber-50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl flex items-center justify-center">
            <div className="text-center space-y-3 sm:space-y-4 px-4">
              <div className="text-4xl sm:text-6xl mb-4 opacity-50">⭐</div>
              <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-gray-700">
                No Featured Products Yet
              </h2>
              <p className="font-sans text-sm sm:text-base lg:text-lg text-gray-500 max-w-md leading-relaxed">
                We're curating amazing products just for you. Check back soon!
              </p>
              <button
                onClick={onNavigateToProducts}
                className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Browse All Products
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto px-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Enhanced Categories Section */}
      <section className="space-y-6 sm:space-y-8" data-section="categories">
        <div className="text-center space-y-4">
          <h2 className="font-decorative text-3xl sm:text-4xl lg:text-5xl text-purple-600 italic">
            Shop by Category
          </h2>
          <p className="font-sans text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our carefully curated collections designed for every mood and moment
          </p>
        </div>
        
        {/* Categories Grid - No horizontal scroll issues */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.id as CategoryType)}
                className="group relative bg-white rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 hover:border-transparent overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10 text-center space-y-2 sm:space-y-3">
                  {/* Icon */}
                  <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {category.emoji}
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="font-serif font-semibold text-sm sm:text-base lg:text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                    {category.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="font-sans text-xs sm:text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                    {category.description}
                  </p>
                  
                  {/* Hover Arrow */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-1">
                    <svg className="w-4 h-4 mx-auto text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
                
                {/* Decorative Corner */}
                <div 
                  className={`absolute top-0 right-0 w-8 h-8 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
                ></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center py-8 sm:py-12">
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          <h2 className="font-decorative text-2xl sm:text-3xl text-purple-600 italic">
            Ready to explore more?
          </h2>
          <p className="font-sans text-base sm:text-lg text-gray-600">
            Check out our complete collection or discover what's new!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onNavigateToProducts}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              View All Products
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'newArrivals' }))}
              className="px-6 py-3 bg-white text-purple-600 font-medium rounded-xl border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              See New Arrivals
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 