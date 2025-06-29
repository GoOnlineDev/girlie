import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ResponsiveImage } from "./ResponsiveImage";

interface HeroProps {
  onNavigateToProducts: () => void;
  onProductClick: (productId: string) => void;
}

export function Hero({ onNavigateToProducts, onProductClick }: HeroProps) {
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
                {/* Background Image - All Screen Sizes */}
                {(product.originalImageUrl || product.ordinaryImageUrl) ? (
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${product.originalImageUrl || product.ordinaryImageUrl})`,
                    }}
                  >
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200">
                  </div>
                )}

                {/* Product Slide - Background Image Layout */}
                <div className="relative z-10 flex flex-col h-full p-4 sm:p-6 lg:p-8">
                  {/* Content Centered */}
                  <div className="flex items-center justify-center h-full">
                    
                    {/* Content Section */}
                    <div className="text-center lg:text-left space-y-3 sm:space-y-4 w-full max-w-2xl">
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
                          {new Intl.NumberFormat('en-UG', {
                            style: 'currency',
                            currency: 'UGX',
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0
                          }).format(product.originalPrice || product.ordinaryPrice || 0)}
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
  );
} 