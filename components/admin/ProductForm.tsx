"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/app/actions/admin";

type Product = {
  id?: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string | null;
  description: string | null;
  price: number | null;
  image: string | null;
  featured: boolean;
  bestseller: boolean;
  published: boolean;
  speciesId?: string | null;
  benefits?: string | null;
  productType?: string | null;
  badges?: string | null;
};

interface ProductFormProps {
  initialData?: Product;
  speciesOptions: { id: string; name: string }[];
}

export function ProductForm({ initialData, speciesOptions }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Default values
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "",
    speciesId: initialData?.speciesId || "",
    benefits: initialData?.benefits || "",
    productType: initialData?.productType || "",
    badges: initialData?.badges || "",
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    image: initialData?.image || "",
    featured: initialData?.featured || false,
    bestseller: initialData?.bestseller || false,
    published: initialData?.published ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Auto-generate slug from name if slug is empty or we are typing the name and creating a new product
      if (name === "name" && !initialData) {
        setFormData(prev => ({ 
          ...prev, 
          slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") 
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value.toString());
    });

    try {
      let result;
      if (initialData?.id) {
        result = await updateProduct(initialData.id, formDataObj);
      } else {
        result = await createProduct(formDataObj);
      }

      if (result.success) {
        router.push("/admin/products");
      } else {
        setError(result.error || "Something went wrong.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Product Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="slug" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">URL Slug *</label>
          <input
            type="text"
            id="slug"
            name="slug"
            required
            value={formData.slug}
            onChange={handleChange}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="speciesId" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Species</label>
          <select
            id="speciesId"
            name="speciesId"
            value={formData.speciesId}
            onChange={handleChange}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          >
            <option value="">Select Species...</option>
            {speciesOptions.map(spec => (
              <option key={spec.id} value={spec.id}>{spec.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Subcategory</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Nutrition, Supplements"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="benefits" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Benefits / Use cases (comma separated)</label>
          <input
            type="text"
            id="benefits"
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
            placeholder="e.g. Immunity, Gut Health"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="productType" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Product Type</label>
          <input
            type="text"
            id="productType"
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            placeholder="e.g. Powder, Liquid"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="badges" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Badges (comma separated)</label>
          <input
            type="text"
            id="badges"
            name="badges"
            value={formData.badges}
            onChange={handleChange}
            placeholder="e.g. New, Bestseller"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="price" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Price (₹)</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="image" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Image URL</label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="shortDescription" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Short Description</label>
        <input
          type="text"
          id="shortDescription"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Description</label>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="h-4 w-4 rounded border-zinc-300 text-green-600 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <label htmlFor="published" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Published</label>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4 w-4 rounded border-zinc-300 text-green-600 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <label htmlFor="featured" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Featured</label>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="bestseller"
            name="bestseller"
            checked={formData.bestseller}
            onChange={handleChange}
            className="h-4 w-4 rounded border-zinc-300 text-green-600 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <label htmlFor="bestseller" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Bestseller</label>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
