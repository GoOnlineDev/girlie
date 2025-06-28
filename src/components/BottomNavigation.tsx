interface BottomNavigationProps {
  currentView: string;
  onNavigate: (view: "home" | "allProducts" | "newArrivals" | "cart") => void;
  cartItemCount: number;
}

export function BottomNavigation({ currentView, onNavigate, cartItemCount }: BottomNavigationProps) {
  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: "allProducts",
      label: "All Products",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: "newArrivals",
      label: "New Arrivals",
      icon: (
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      )
    },
    {
      id: "cart",
      label: "Cart",
      icon: (
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7a2 2 0 01-2 2H8a2 2 0 01-2-2L5 9z" />
          </svg>
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium text-[10px] shadow-lg animate-pulse">
              {cartItemCount > 9 ? '9+' : cartItemCount}
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as "home" | "allProducts" | "newArrivals" | "cart")}
            className={`flex flex-col items-center justify-center p-2 min-w-[60px] transition-all duration-200 ${
              currentView === item.id
                ? "text-purple-600 scale-110"
                : "text-gray-500 hover:text-purple-500"
            }`}
          >
            <div className={`mb-1 transition-transform duration-200 ${
              currentView === item.id ? "transform scale-110" : ""
            }`}>
              {item.icon}
            </div>
            <span className={`text-xs font-medium transition-all duration-200 ${
              currentView === item.id 
                ? "text-purple-600 font-semibold" 
                : "text-gray-500"
            }`}>
              {item.label}
            </span>
            {currentView === item.id && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
} 