import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignOutButton } from "../SignOutButton";
import { SignInButton } from "../SignInButton";

interface NavigationProps {
  currentView: "home" | "cart" | "upload" | "dashboard" | "product" | "about" | "contact" | "category" | "typography" | "allProducts" | "newArrivals";
  setCurrentView: (view: "home" | "cart" | "upload" | "dashboard" | "product" | "about" | "contact" | "category" | "typography" | "allProducts" | "newArrivals") => void;
  showUserMenu: boolean;
  setShowUserMenu: (show: boolean) => void;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  cartItemCount: number;
  onMobileMenuAction: (action: "cart" | "upload" | "dashboard" | "about" | "contact" | "typography") => void;
  onMobileNavClick: (view: "about" | "contact") => void;
}

export function Navigation({
  currentView,
  setCurrentView,
  showUserMenu,
  setShowUserMenu,
  showMobileMenu,
  setShowMobileMenu,
  cartItemCount,
  onMobileMenuAction,
  onMobileNavClick
}: NavigationProps) {
  const isAdmin = useQuery(api.admin.isAdmin);

  return (
    <>
      {/* Main Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#f4f1ed]/90 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img src="/logo.png" alt="Girlie" className="w-8 h-8 sm:w-10 sm:h-10" />
              <button
                onClick={() => setCurrentView("home")}
                className="font-brand text-2xl sm:text-3xl text-[#171717] hover:text-purple-600 transition-colors"
              >
                Girlie
              </button>
              <span className="hidden lg:block font-decorative text-sm text-purple-600 italic">
                Let's shop it
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setCurrentView("about")}
                className="text-sm font-medium text-[#171717] hover:text-purple-600 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => setCurrentView("contact")}
                className="text-sm font-medium text-[#171717] hover:text-purple-600 transition-colors"
              >
                Contact
              </button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              
              <Authenticated>
                {/* Cart Button */}
                <button
                  onClick={() => setCurrentView("cart")}
                  className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                </button>

                {/* Desktop Only Buttons */}
                <div className="hidden md:flex items-center space-x-2">
                  {/* Add Product Button - Admin Only */}
                  {isAdmin && (
                    <button
                      onClick={() => setCurrentView("upload")}
                      className="p-2 text-gray-700 hover:text-purple-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  )}

                  {/* User Menu Button */}
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  {showMobileMenu ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </Authenticated>

              <Unauthenticated>
                <SignInButton />
              </Unauthenticated>

            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="absolute top-16 left-0 right-0 bg-white shadow-xl border-b">
            <div className="p-4 space-y-1">
              
              {/* Add Product Button - Admin Only */}
              {isAdmin && (
                <button
                  onClick={() => onMobileMenuAction("upload")}
                  className="flex items-center w-full p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Product
                </button>
              )}

              <button
                onClick={() => onMobileNavClick("about")}
                className="flex items-center w-full p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About Us
              </button>

              <button
                onClick={() => onMobileNavClick("contact")}
                className="flex items-center w-full p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Us
              </button>



              {isAdmin && (
                <button
                  onClick={() => onMobileMenuAction("dashboard")}
                  className="flex items-center w-full p-3 text-left text-purple-600 hover:bg-purple-50 rounded-lg"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Admin Dashboard
                </button>
              )}

              <div className="border-t pt-3 mt-3">
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop User Menu Dropdown */}
      {showUserMenu && (
        <div className="fixed inset-0 z-50 hidden md:block">
          <div 
            className="absolute inset-0"
            onClick={() => setShowUserMenu(false)}
          />
          <div className="absolute top-16 right-4 sm:right-6 lg:right-8 w-48 bg-white rounded-lg shadow-xl border py-2">
            
            {isAdmin && (
              <button
                onClick={() => {
                  setCurrentView("dashboard");
                  setShowUserMenu(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Admin Dashboard
              </button>
            )}

            <div className="border-t mt-2 pt-2">
              <div className="px-4 py-2">
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 