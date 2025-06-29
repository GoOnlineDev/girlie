import { Authenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
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
import { Navigation } from "./components/Navigation";

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
      <Navigation
        currentView={currentView}
        setCurrentView={setCurrentView}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        cartItemCount={cartItemCount}
        onMobileMenuAction={handleMobileMenuAction}
        onMobileNavClick={handleMobileNavClick}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-8 overflow-x-hidden pt-20 sm:pt-24">
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
