import { SearchBar } from "./SearchBar";
import { Hero } from "./Hero";

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
  return (
    <div className="space-y-8 sm:space-y-12 lg:space-y-16 pb-20">
      {/* Hero Section */}
      <Hero 
        onNavigateToProducts={onNavigateToProducts}
        onProductClick={onProductClick}
      />

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