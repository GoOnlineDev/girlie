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

type CategoryType = "makeup" | "skincare" | "haircare" | "fragrance" | "accessories" | "bathandbody" | "nails" | "bags" | "shoes";

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "cart" | "upload" | "dashboard" | "product" | "about" | "contact" | "category">("home");
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

  return (
    <div className="min-h-screen bg-[#FFF6E9] flex flex-col">
      <header className="sticky top-0 z-50 bg-[#FFF6E9]/95 backdrop-blur-sm border-b border-[#D5975B]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img src="/logo.png" alt="Girlie" className="w-8 h-8 sm:w-10 sm:h-10" />              
              <button
                onClick={() => setCurrentView("home")}
                className="text-xl sm:text-2xl font-serif font-bold text-[#171717] hover:text-purple-600 transition-colors"
              >
                Girlie
              </button>
              <span className="hidden sm:block text-sm text-[#171717]/70 font-medium">
                Let's shop it
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setCurrentView("about")}
                className="text-sm font-medium text-[#171717] hover:text-purple-600 transition-colors"
              >
                About Us
              </button>
              <button
                onClick={() => setCurrentView("contact")}
                className="text-sm font-medium text-[#171717] hover:text-purple-600 transition-colors"
              >
                Contact Us
              </button>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Authenticated>
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden p-2 text-[#171717] hover:text-purple-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <button
                  onClick={() => setCurrentView("cart")}
                  className="relative p-2 text-[#171717] hover:text-purple-600 transition-colors"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
                      {cartItemCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setCurrentView("upload")}
                  className="p-2 text-[#171717] hover:text-purple-600 transition-colors"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                
                {/* User Menu Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 text-[#171717] hover:text-purple-600 transition-colors"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setCurrentView("dashboard");
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Admin Dashboard
                        </button>
                      )}
                      <div className="px-4 py-2">
                        <SignOutButton />
                      </div>
                    </div>
                  )}
                </div>
              </Authenticated>
              
              <Unauthenticated>
                <SignOutButton />
              </Unauthenticated>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-2 space-y-1">
              <button
                onClick={() => handleMobileNavClick("about")}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-[#171717] hover:bg-gray-100 rounded-md"
              >
                About Us
              </button>
              <button
                onClick={() => handleMobileNavClick("contact")}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-[#171717] hover:bg-gray-100 rounded-md"
              >
                Contact Us
              </button>
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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
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
          />
        </Authenticated>
        
        <Unauthenticated>
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#171717] mb-4">
                Welcome to Girlie
              </h1>
              <p className="text-lg text-purple-600 mb-2">Let's shop it</p>
              <p className="text-[#171717]/60">Sign in to explore our collection</p>
            </div>
            <SignInForm />
          </div>
        </Unauthenticated>
      </main>
      
      <Footer onNavigate={handleFooterNavigate} />
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
  onCategoryClick
}: {
  currentView: "home" | "cart" | "upload" | "dashboard" | "product" | "about" | "contact" | "category";
  selectedCategory: CategoryType | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedProductId: string | null;
  onProductClick: (productId: string) => void;
  onBackToHome: () => void;
  onCategoryClick: (category: CategoryType) => void;
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

  return (
    <HomeContent 
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      onProductClick={onProductClick}
      onCategoryClick={onCategoryClick}
    />
  );
}
