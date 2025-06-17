interface AboutUsProps {
  onBack: () => void;
}

export function AboutUs({ onBack }: AboutUsProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="p-2 text-[#171717] hover:text-purple-600 transition-colors mr-4"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-3xl font-serif font-bold text-[#171717]">About Us</h1>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-8 text-center">
          <h2 className="text-4xl font-serif font-bold text-purple-900 mb-4">
            Welcome to Girlie
          </h2>
          <p className="text-xl text-purple-700 mb-6">
            Where beauty meets style, and every woman finds her perfect match
          </p>
          <div className="text-6xl mb-4">💜</div>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl font-serif font-bold text-purple-900 mb-6">Our Story</h3>
          <div className="prose prose-purple max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Founded in 2024, Girlie was born from a simple belief: every woman deserves to feel beautiful, 
              confident, and uniquely herself. Our journey began when our founder, passionate about empowering 
              women through fashion and beauty, noticed a gap in the market for a platform that truly understood 
              the diverse needs of modern women.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We started with a curated collection of cosmetics, handbags, and dresses, each piece carefully 
              selected to represent quality, style, and affordability. Our mission was clear: to create a 
              shopping experience that celebrates femininity in all its forms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, Girlie has grown into a trusted destination for women who appreciate both original luxury 
              pieces and accessible everyday essentials. We believe that beauty isn't one-size-fits-all, which 
              is why we offer both original and ordinary versions of our products, ensuring every budget can 
              access style.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">✨</div>
            <h4 className="text-lg font-semibold text-purple-900 mb-2">Quality First</h4>
            <p className="text-purple-700 text-sm">
              We carefully curate every product to ensure it meets our high standards for quality and style.
            </p>
          </div>
          <div className="bg-pink-50 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">💖</div>
            <h4 className="text-lg font-semibold text-purple-900 mb-2">Inclusive Beauty</h4>
            <p className="text-purple-700 text-sm">
              Beauty comes in all forms. We celebrate diversity and offer products for every woman.
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🌟</div>
            <h4 className="text-lg font-semibold text-purple-900 mb-2">Affordable Luxury</h4>
            <p className="text-purple-700 text-sm">
              Luxury shouldn't break the bank. We offer both premium and budget-friendly options.
            </p>
          </div>
        </div>

        {/* Our Promise */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-8">
          <h3 className="text-2xl font-serif font-bold text-purple-900 mb-6 text-center">Our Promise to You</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="text-purple-600 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h5 className="font-semibold text-purple-900">Authentic Products</h5>
                  <p className="text-purple-700 text-sm">Every item is genuine and sourced from trusted suppliers.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-purple-600 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h5 className="font-semibold text-purple-900">Fast Shipping</h5>
                  <p className="text-purple-700 text-sm">Quick and secure delivery to your doorstep.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-purple-600 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h5 className="font-semibold text-purple-900">Easy Returns</h5>
                  <p className="text-purple-700 text-sm">Not satisfied? Return within 30 days for a full refund.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="text-purple-600 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h5 className="font-semibold text-purple-900">24/7 Support</h5>
                  <p className="text-purple-700 text-sm">Our customer service team is always here to help.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-purple-600 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h5 className="font-semibold text-purple-900">Secure Shopping</h5>
                  <p className="text-purple-700 text-sm">Your personal and payment information is always protected.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-purple-600 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h5 className="font-semibold text-purple-900">Exclusive Deals</h5>
                  <p className="text-purple-700 text-sm">Members get access to special discounts and early sales.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl font-serif font-bold text-purple-900 mb-6 text-center">Meet Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">S</span>
              </div>
              <h4 className="font-semibold text-purple-900">Sarah Johnson</h4>
              <p className="text-purple-700 text-sm">Founder & CEO</p>
              <p className="text-gray-600 text-xs mt-2">Passionate about empowering women through fashion</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">M</span>
              </div>
              <h4 className="font-semibold text-purple-900">Maria Rodriguez</h4>
              <p className="text-purple-700 text-sm">Head of Curation</p>
              <p className="text-gray-600 text-xs mt-2">Expert in beauty trends and product selection</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">A</span>
              </div>
              <h4 className="font-semibold text-purple-900">Aisha Patel</h4>
              <p className="text-purple-700 text-sm">Customer Experience</p>
              <p className="text-gray-600 text-xs mt-2">Dedicated to making every customer feel special</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-serif font-bold mb-4">Join the Girlie Community</h3>
          <p className="mb-6">
            Become part of our growing family of confident, beautiful women who know their worth.
          </p>
          <button
            onClick={onBack}
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
