import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function ProductUpload() {
  const [formData, setFormData] = useState({
    name: "",
    category: "makeup" as "makeup" | "skincare" | "haircare" | "fragrance" | "accessories" | "bathandbody" | "nails" | "bags" | "shoes",
    description: "",
    originalPrice: "",
    ordinaryPrice: "",
    featured: false,
    newArrival: false,
    comingSoon: false,
  });
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [ordinaryImage, setOrdinaryImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const originalImageRef = useRef<HTMLInputElement>(null);
  const ordinaryImageRef = useRef<HTMLInputElement>(null);
  
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);
  const createProduct = useMutation(api.products.create);

  const uploadImage = async (file: File) => {
    const uploadUrl = await generateUploadUrl();
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const json = await result.json();
    if (!result.ok) {
      throw new Error(`Upload failed: ${JSON.stringify(json)}`);
    }
    return json.storageId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let originalImageId = undefined;
      let ordinaryImageId = undefined;

      if (originalImage) {
        originalImageId = await uploadImage(originalImage);
      }
      if (ordinaryImage) {
        ordinaryImageId = await uploadImage(ordinaryImage);
      }

      await createProduct({
        name: formData.name,
        category: formData.category,
        description: formData.description,
        originalPrice: parseFloat(formData.originalPrice),
        ordinaryPrice: parseFloat(formData.ordinaryPrice),
        originalImageId,
        ordinaryImageId,
        featured: formData.featured,
        newArrival: formData.newArrival,
        comingSoon: formData.comingSoon,
      });

      toast.success("Product created successfully!");
      
      // Reset form
      setFormData({
        name: "",
        category: "makeup",
        description: "",
        originalPrice: "",
        ordinaryPrice: "",
        featured: false,
        newArrival: false,
        comingSoon: false,
      });
      setOriginalImage(null);
      setOrdinaryImage(null);
      if (originalImageRef.current) originalImageRef.current.value = "";
      if (ordinaryImageRef.current) ordinaryImageRef.current.value = "";
    } catch (error) {
      toast.error("Failed to create product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-serif font-bold text-[#171717] mb-8">Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#171717] mb-2">
            Product Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#171717] mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          >
            <option value="makeup">Makeup</option>
            <option value="skincare">Skincare</option>
            <option value="haircare">Hair Care</option>
            <option value="fragrance">Fragrance</option>
            <option value="accessories">Accessories</option>
            <option value="bathandbody">Bath & Body</option>
            <option value="nails">Nails</option>
            <option value="bags">Bags</option>
            <option value="shoes">Shoes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#171717] mb-2">
            Description
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            placeholder="Describe the product"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#171717] mb-2">
              Original Price (UGX)
            </label>
            <input
              type="number"
              step="1"
              required
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#171717] mb-2">
              Ordinary Price (UGX)
            </label>
            <input
              type="number"
              step="1"
              required
              value={formData.ordinaryPrice}
              onChange={(e) => setFormData({ ...formData, ordinaryPrice: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#171717] mb-2">
              Original Version Image
            </label>
            <input
              type="file"
              accept="image/*"
              ref={originalImageRef}
              onChange={(e) => setOriginalImage(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#171717] mb-2">
              Ordinary Version Image
            </label>
            <input
              type="file"
              accept="image/*"
              ref={ordinaryImageRef}
              onChange={(e) => setOrdinaryImage(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-[#171717]">
              Featured product
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="newArrival"
              checked={formData.newArrival}
              onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="newArrival" className="ml-2 text-sm text-[#171717]">
              New arrival
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="comingSoon"
              checked={formData.comingSoon}
              onChange={(e) => setFormData({ ...formData, comingSoon: e.target.checked })}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="comingSoon" className="ml-2 text-sm text-[#171717]">
              Coming soon
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Product..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
