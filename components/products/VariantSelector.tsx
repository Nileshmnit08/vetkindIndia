'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function VariantSelector({ product }: { product: any }) {
  // Sort variants by sort_order
  const variants = [...(product.variants || [])]
    .filter((v: any) => v.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  // If no variants exist yet (pre-migration fallback), use legacy product fields
  const displayPrice = selectedVariant 
    ? (selectedVariant.price / 100) 
    : product.price;

  const displayPackSize = selectedVariant 
    ? selectedVariant.variant_name 
    : product.packSize;
    
  // Availability logic: if migrated variant exists, use its flag. If legacy product, assume true.
  const isAvailable = selectedVariant ? selectedVariant.isAvailable : true;

  return (
    <div className="mb-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-end gap-4">
          <span className="text-4xl font-bold text-zinc-900 dark:text-white">
            {displayPrice != null ? formatPrice(displayPrice) : "Price Unavailable"}
          </span>
          <span className="text-sm font-medium text-zinc-500 mb-1">
            MRP (Inclusive of all taxes)
          </span>
        </div>
        
        {selectedVariant && (
          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${isAvailable ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}>
            {isAvailable ? 'In Stock' : 'Out of Stock'}
          </span>
        )}
      </div>

      {variants.length > 0 ? (
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Select Pack Size</h4>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant: any) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                className={`rounded-lg border px-4 py-2 font-medium shadow-sm transition-all ${
                  selectedVariant?.id === variant.id
                    ? 'border-green-600 bg-green-50 text-green-800 dark:border-green-500 dark:bg-green-900/30 dark:text-green-300'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900'
                }`}
              >
                {variant.variant_name}
              </button>
            ))}
          </div>
          {selectedVariant && (
            <div className="mt-4 text-sm text-zinc-500">
              SKU: <span className="font-mono">{selectedVariant.sku}</span>
            </div>
          )}
        </div>
      ) : displayPackSize ? (
        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Available Pack Size</h4>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-lg border border-zinc-200 bg-white px-4 py-2 font-medium text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
              {displayPackSize}
            </span>
          </div>
        </div>
      ) : null}

      <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <Button 
          disabled={!isAvailable}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-8 rounded-xl shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={async () => {
            if(selectedVariant) {
               try {
                 const res = await fetch('/api/v1/commerce/cart', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ variant_id: selectedVariant.id, quantity: 1 })
                 });
                 if (res.status === 401) {
                   // Guest user, use Zustand
                   const { useCartStore } = await import('@/store/cartStore');
                   useCartStore.getState().addItem({
                     variant_id: selectedVariant.id,
                     quantity: 1,
                     name: product.name + ' - ' + selectedVariant.variant_name,
                     price: selectedVariant.price,
                     pack_size: selectedVariant.variant_name,
                     image: product.image
                   });
                   alert(`Added ${selectedVariant.variant_name} to your cart!`);
                 } else if (res.ok) {
                   alert(`Added ${selectedVariant.variant_name} to your cart!`);
                 } else {
                   const err = await res.json();
                   alert(`Could not add to cart: ${err.error || 'Unknown error'}`);
                 }
               } catch (error) {
                 console.error(error);
                 alert('An error occurred while adding to cart.');
               }
            } else {
               alert(`This product hasn't been migrated to variants yet.`);
            }
          }}
        >
          {isAvailable ? 'Add to Cart' : 'Currently Unavailable'}
        </Button>
      </div>
    </div>
  );
}
