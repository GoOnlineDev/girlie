import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import { ProductGrid } from "./components/ProductGrid";
import { Cart } from "./components/Cart";
import { ProductUpload } from "./components/ProductUpload";
import { SearchBar } from "./components/SearchBar";
import { AdminDashboard } from "./components/AdminDashboard";
import { ProductDetails } from "./components/ProductDetails";
import { Footer } from "./components/Footer";
import { AboutUs } from "./components/AboutUs";
import { ContactUs } from "./components/ContactUs";
import { CategoryPage } from "./components/CategoryPage";
import { HomeContent } from "./components/HomeContent";
import { TypographyShowcase } from "./components/TypographyShowcase";
import { AllProductsScreen } from "./components/AllProductsScreen";
import { NewArrivalsScreen } from "./components/NewArrivalsScreen";
import { BottomNavigation } from "./components/BottomNavigation";

type CategoryType = "makeup" | "skincare" | "haircare" | "fragrance" | "accessories" | "bathandbody" | "nails" | "bags" | "shoes";

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "cart" | "upload" | "dashboard" | "product" | "about" | "contact" | "category" | "typography" | "allProducts" | "newArrivals">("home");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const isAdmin = useQuery(api.admin.isAdmin);
  const cartItems = useQuery(api.cart.list);

  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView("product");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedProductId(null);
    setSelectedCategory(null);
  };

  const handleFooterNavigate = (page: "about" | "contact") => {
    setCurrentView(page);
  };

  const handleCategoryClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setCurrentView("category");
  };

  const handleMobileNavClick = (view: "about" | "contact") => {
    setCurrentView(view);
    setShowMobileMenu(false);
  };

  const handleMobileMenuAction = (action: "cart" | "upload" | "dashboard" | "about" | "contact" | "typography") => {
    setCurrentView(action);
    setShowMobileMenu(false);
  };

  const handleBottomNavigation = (view: "home" | "allProducts" | "newArrivals" | "cart") => {
    setCurrentView(view);
    // Clear any selected states when switching views
    setSelectedProductId(null);
    setSelectedCategory(null);
  };

  const handleNavigateToProducts = () => {
    setCurrentView("allProducts");
  };

  return (
    <div className="min-h-screen bg-[#f4f1ed] flex flex-col w-full overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#f4f1ed]/80 backdrop-blur-lg border-b border-white/20 shadow-lg w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 w-full">
            {/* Logo and Brand - Compact Mobile */}
            <div className="flex items-center space-x-1 sm:space-x-4">
              <img src="/logo.png" alt="Girlie" className="w-6 h-6 sm:w-10 sm:h-10" />              
              <button
                onClick={() => setCurrentView("home")}
                className="font-brand text-2xl sm:text-3xl lg:text-4xl text-[#171717] hover:text-purple-600 transition-colors"
              >
                Girlie
              </button>
              <span className="hidden lg:block font-decorative text-base text-purple-600 font-medium italic">
                Let's shop it
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setCurrentView("about")}
                className="text-sm font-medium text-[#171717] hover:text-purple-600 transition-colors relative group"
              >
                About Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button
                onClick={() => setCurrentView("contact")}
                className="text-sm font-medium text-[#171717] hover:text-purple-600 transition-colors relative group"
              >
                Contact Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-4">
              <Authenticated>
                {/* Mobile: Show hamburger menu and cart only */}
                <div className="flex items-center space-x-1 md:hidden">
                  <button
                    onClick={() => setCurrentView("cart")}
                    className="relative p-2 group"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                      <svg className="w-5 h-5 text-gray-700 group-hover:text-purple-600 transition-colors duration-200 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z" />
                      </svg>
                      {cartItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium text-[10px] shadow-lg animate-pulse">
                          {cartItemCount > 9 ? '9+' : cartItemCount}
                        </span>
                      )}
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="p-1.5 text-[#171717] hover:text-purple-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                {/* Desktop: Show all buttons */}
                <div className="hidden md:flex items-center space-x-4">
                  <button
                    onClick={() => setCurrentView("cart")}
                    className="relative p-2 group"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                      <svg className="w-6 h-6 text-gray-700 group-hover:text-purple-600 transition-colors duration-200 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z" />
                      </svg>
                      {cartItemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium shadow-lg animate-pulse">
                          {cartItemCount > 9 ? '9+' : cartItemCount}
                        </span>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => setCurrentView("upload")}
                    className="p-2 text-[#171717] hover:text-purple-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  
                  {/* Desktop User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="p-2 text-[#171717] hover:text-purple-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 py-2 z-50 animate-fade-in-up">
                        {isAdmin && (
                          <button
                            onClick={() => {
                              setCurrentView("dashboard");
                              setShowUserMenu(false);
                            }}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50/80 hover:text-purple-600 transition-colors"
                          >
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              Admin Dashboard
                            </div>
                          </button>
                        )}
                        <div className="border-t border-gray-200/50 mt-2 pt-2">
                          <div className="px-4 py-2">
                            <SignOutButton />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Authenticated>
              
              <Unauthenticated>
                <SignOutButton />
              </Unauthenticated>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white/80 backdrop-blur-lg border-t border-white/20 shadow-lg">
            <div className="px-4 py-4 space-y-2 max-h-64 overflow-y-auto">
              <button
                onClick={() => handleMobileMenuAction("typography")}
                className="flex items-center w-full text-left px-4 py-3 text-sm font-medium text-purple-600 hover:bg-purple-50/80 rounded-xl transition-all duration-200"
              >
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10M12 21V3M5 7h14" />
                  </svg>
                </div>
                View New Fonts
              </button>
              
              <button
                onClick={() => handleMobileMenuAction("upload")}
                className="flex items-center w-full text-left px-4 py-3 text-sm font-medium text-[#171717] hover:bg-purple-50/80 hover:text-purple-600 rounded-xl transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                Add Product
              </button>
              
              <button
                onClick={() => handleMobileNavClick("about")}
                className="flex items-center w-full text-left px-4 py-3 text-sm font-medium text-[#171717] hover:bg-purple-50/80 hover:text-purple-600 rounded-xl transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                About Us
              </button>
              
              <button
                onClick={() => handleMobileNavClick("contact")}
                className="flex items-center w-full text-left px-4 py-3 text-sm font-medium text-[#171717] hover:bg-purple-50/80 hover:text-purple-600 rounded-xl transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                Contact Us
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleMobileMenuAction("dashboard")}
                  className="flex items-center w-full text-left px-4 py-3 text-sm font-medium text-purple-600 hover:bg-purple-50/80 rounded-xl transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  Admin Dashboard
                </button>
              )}

              <div className="border-t border-gray-200/50 pt-3 mt-3">
                <div className="px-4 py-2">
                  <SignOutButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showMobileMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false);
            setShowMobileMenu(false);
          }}
        />
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-8 overflow-x-hidden pt-20 sm:pt-24">
        <Authenticated>
          <Content 
            currentView={currentView}
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedProductId={selectedProductId}
            onProductClick={handleProductClick}
            onBackToHome={handleBackToHome}
            onCategoryClick={handleCategoryClick}
            onNavigateToProducts={handleNavigateToProducts}
          />
        </Authenticated>
        
        <Unauthenticated>
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="font-brand text-3xl sm:text-5xl text-[#171717] mb-3 sm:mb-4">
                Welcome to Girlie
              </h1>
              <p className="font-decorative text-lg sm:text-xl text-purple-600 mb-2 italic">Let's shop it</p>
              <p className="font-cute text-sm sm:text-base text-[#171717]/60">Sign in to explore our beautiful collection</p>
            </div>
            <SignInForm />
          </div>
        </Unauthenticated>
      </main>
      
      <Footer onNavigate={handleFooterNavigate} />
      
      {/* Bottom Navigation - Only for authenticated users */}
      <Authenticated>
        <BottomNavigation 
          currentView={currentView}
          onNavigate={handleBottomNavigation}
          cartItemCount={cartItemCount}
        />
      </Authenticated>
      
      <Toaster />
    </div>
  );
}

function Content({ 
  currentView, 
  selectedCategory, 
  searchTerm, 
  setSearchTerm,
  selectedProductId,
  onProductClick,
  onBackToHome,
  onCategoryClick,
  onNavigateToProducts
}: {
  currentView: "home" | "cart" | "upload" | "dashboard" | "product" | "about" | "contact" | "category" | "typography" | "allProducts" | "newArrivals";
  selectedCategory: CategoryType | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedProductId: string | null;
  onProductClick: (productId: string) => void;
  onBackToHome: () => void;
  onCategoryClick: (category: CategoryType) => void;
  onNavigateToProducts: () => void;
}) {
  if (currentView === "cart") {
    return <Cart />;
  }
  
  if (currentView === "upload") {
    return <ProductUpload />;
  }

  if (currentView === "dashboard") {
    return <AdminDashboard />;
  }

  if (currentView === "about") {
    return <AboutUs onBack={onBackToHome} />;
  }

  if (currentView === "contact") {
    return <ContactUs onBack={onBackToHome} />;
  }

  if (currentView === "typography") {
    return (
      <div>
        <div className="flex items-center mb-6">
          <button
            onClick={onBackToHome}
            className="flex-shrink-0 p-2 text-[#171717] hover:text-purple-600 transition-colors mr-3 rounded-full hover:bg-purple-50"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="font-decorative text-2xl text-purple-600">Font Preview</h1>
        </div>
        <TypographyShowcase />
      </div>
    );
  }

  if (currentView === "category" && selectedCategory) {
    return (
      <CategoryPage 
        category={selectedCategory}
        onBack={onBackToHome}
        onProductClick={onProductClick}
      />
    );
  }

  if (currentView === "product" && selectedProductId) {
    return (
      <ProductDetails 
        productId={selectedProductId} 
        onBack={onBackToHome}
      />
    );
  }

  if (currentView === "allProducts") {
    return (
      <AllProductsScreen 
        searchTerm={searchTerm}
        onProductClick={onProductClick}
      />
    );
  }

  if (currentView === "newArrivals") {
    return (
      <NewArrivalsScreen 
        onProductClick={onProductClick}
      />
    );
  }

  return (
    <HomeContent 
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onCategoryClick={onCategoryClick}
      onNavigateToProducts={onNavigateToProducts}
      onProductClick={onProductClick}
    />
  );
}
