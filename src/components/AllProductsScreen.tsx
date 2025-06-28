import { ProductGrid } from "./ProductGrid";

interface AllProductsScreenProps {
  searchTerm: string;
  onProductClick: (productId: string) => void;
}

export function AllProductsScreen({ searchTerm, onProductClick }: AllProductsScreenProps) {
  return (
    <div className="min-h-screen bg-[#f4f1ed] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171717] mb-2">
            All Products
          </h1>
          <p className="font-sans text-base sm:text-lg text-gray-600">
            Discover our complete collection of beauty essentials
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid 
          category={null} 
          searchTerm={searchTerm} 
          onProductClick={onProductClick}
        />
      </div>
    </div>
  );
} 