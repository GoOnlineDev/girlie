export function TypographyShowcase() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12 bg-white rounded-2xl shadow-lg">
      <div className="text-center">
        <h1 className="font-brand text-5xl text-purple-600 mb-4">
          Girlie Typography Showcase
        </h1>
        <p className="font-decorative text-xl text-pink-500 italic">
          Beautiful fonts for a beautiful brand
        </p>
      </div>

      <div className="space-y-8">
        {/* Brand Font - Great Vibes */}
        <div className="text-center p-6 bg-purple-50 rounded-2xl">
          <h2 className="font-decorative text-2xl text-purple-600 mb-4">Brand Font - Great Vibes</h2>
          <div className="space-y-2">
            <p className="font-brand text-2xl text-gray-700">Girlie - Small</p>
            <p className="font-brand text-3xl text-gray-700">Girlie - Medium</p>
            <p className="font-brand text-4xl text-gray-700">Girlie - Large</p>
            <p className="font-brand text-5xl text-purple-600">Girlie - Extra Large</p>
          </div>
        </div>

        {/* Decorative Font - Dancing Script */}
        <div className="text-center p-6 bg-pink-50 rounded-2xl">
          <h2 className="font-decorative text-2xl text-pink-500 mb-4">Decorative Font - Dancing Script</h2>
          <div className="space-y-2">
            <p className="font-decorative text-lg text-gray-700">"Let's shop it" - Tagline</p>
            <p className="font-decorative text-xl text-purple-600 italic">Section Headers</p>
            <p className="font-decorative text-2xl text-pink-500">Category Titles</p>
            <p className="font-decorative text-3xl bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Special Announcements
            </p>
          </div>
        </div>

        {/* Elegant Font - Cormorant Garamond */}
        <div className="text-center p-6 bg-gray-50 rounded-2xl">
          <h2 className="font-decorative text-2xl text-purple-600 mb-4">Elegant Font - Cormorant Garamond</h2>
          <div className="space-y-3">
            <h1 className="font-serif text-4xl text-gray-800 font-semibold">Main Headlines</h1>
            <h2 className="font-serif text-3xl text-gray-700 font-medium">Sub Headlines</h2>
            <h3 className="font-serif text-2xl text-gray-700">Section Titles</h3>
            <p className="font-serif text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Perfect for product descriptions and important content that needs to feel premium and sophisticated.
              This font adds elegance and readability to your beauty and fashion content.
            </p>
          </div>
        </div>

        {/* Cute Font - Poppins */}
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
          <h2 className="font-decorative text-2xl text-purple-600 mb-4">Body Font - Poppins</h2>
          <div className="space-y-3 text-left max-w-2xl mx-auto">
            <p className="font-sans text-base text-gray-700 leading-relaxed">
              <strong className="font-sans font-semibold text-purple-600">Perfect for body text:</strong> 
              This is how your product descriptions, navigation items, and general content will look. 
              Poppins is clean, modern, and very readable on all devices.
            </p>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">
              Small text like product details, fine print, and secondary information looks great too.
              The font maintains its cuteness while being highly legible.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-sans text-xs font-semibold uppercase tracking-wide">
                New Arrival
              </span>
              <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full font-sans text-sm">
                Best Seller
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full font-sans text-sm">
                Limited Edition
              </span>
            </div>
          </div>
        </div>

        {/* Example Usage */}
        <div className="p-6 bg-white border border-purple-200 rounded-2xl shadow-md">
          <h2 className="font-decorative text-3xl text-center text-purple-600 mb-8 relative">
            How It All Works Together
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-white to-purple-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300">
              <h3 className="font-brand text-3xl text-purple-600 mb-2">Girlie</h3>
              <h4 className="font-decorative text-xl text-purple-600 mb-3">Makeup Collection</h4>
              <p className="font-sans text-gray-700 leading-relaxed mb-4">
                Discover our premium makeup collection featuring the latest trends in beauty. 
                From bold lipsticks to subtle eyeshadows, find everything you need to express your unique style.
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:scale-105 transition-transform duration-200 font-sans font-medium">
                Shop Now
              </button>
            </div>
            <div className="p-6 bg-gradient-to-br from-white to-pink-50 rounded-2xl border border-pink-100 hover:shadow-lg transition-all duration-300">
              <h3 className="font-decorative text-2xl text-pink-500 mb-2 italic">Special Offer</h3>
              <h4 className="font-serif text-xl text-gray-800 font-medium mb-3">20% Off Skincare</h4>
              <p className="font-sans text-gray-700 leading-relaxed mb-4">
                Treat your skin to the care it deserves with our premium skincare line. 
                Natural ingredients, proven results, and luxurious feel.
              </p>
              <button className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:scale-105 transition-transform duration-200 font-sans font-medium">
                Get Discount
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="font-decorative text-lg text-purple-600 italic">
          Beautiful, feminine typography that speaks to your audience 💕
        </p>
      </div>
    </div>
  );
} 