import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ProductCard } from "./ProductCard";

type CategoryType = "makeup" | "skincare" | "haircare" | "fragrance" | "accessories" | "bathandbody" | "nails" | "bags" | "shoes";

const categoryInfo = {
  makeup: { name: "Makeup", emoji: "💄", description: "Enhance your natural beauty with our premium makeup collection" },
  skincare: { name: "Skincare", emoji: "🧴", description: "Nourish and protect your skin with our carefully curated skincare products" },
  haircare: { name: "Hair Care", emoji: "💇‍♀️", description: "Keep your hair healthy and beautiful with our hair care essentials" },
  fragrance: { name: "Fragrance", emoji: "🌸", description: "Discover your signature scent from our exquisite fragrance collection" },
  accessories: { name: "Accessories", emoji: "💍", description: "Complete your look with our stunning accessories" },
  bathandbody: { name: "Bath & Body", emoji: "🛁", description: "Pamper yourself with our luxurious bath and body products" },
  nails: { name: "Nails", emoji: "💅", description: "Express yourself with our vibrant nail collection" },
  bags: { name: "Bags", emoji: "👜", description: "Carry your essentials in style with our fashionable bags" },
  shoes: { name: "Shoes", emoji: "👠", description: "Step out in confidence with our trendy shoe collection" },
};

interface CategoryPageProps {
  category: CategoryType;
  onBack: () => void;
  onProductClick: (productId: string) => void;
}

export function CategoryPage({ category, onBack, onProductClick }: CategoryPageProps) {
  const products = useQuery(api.products.list, { category });
  const info = categoryInfo[category];

  return (
    <div className="space-y-8">
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
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#171717] flex items-center">
            <span className="text-4xl mr-3">{info.emoji}</span>
            {info.name}
          </h1>
          <p className="text-purple-600 mt-1">{info.description}</p>
        </div>
      </div>

      {/* Products Grid */}
      {products === undefined ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">{info.emoji}</div>
          <h3 className="text-xl font-serif font-medium text-[#171717] mb-2">
            No {info.name.toLowerCase()} products yet
          </h3>
          <p className="text-[#171717]/60">
            We're working on adding amazing {info.name.toLowerCase()} products. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onProductClick={onProductClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
