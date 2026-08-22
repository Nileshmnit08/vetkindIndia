'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';

export function CartSync() {
  const { data: session, status } = useSession();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const hasMerged = useRef(false);

  useEffect(() => {
    // Only attempt merge if authenticated, we have local items, and haven't merged yet this session
    if (status === 'authenticated' && items.length > 0 && !hasMerged.current) {
      const mergeCart = async () => {
        try {
          const res = await fetch('/api/v1/commerce/cart/merge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: items.map(i => ({ variant_id: i.variant_id, quantity: i.quantity })) })
          });

          if (res.ok) {
            hasMerged.current = true;
            clearCart();
            console.log('Guest cart successfully merged to authenticated account.');
          }
        } catch (error) {
          console.error('Failed to merge cart', error);
        }
      };

      mergeCart();
    }
  }, [status, items, clearCart]);

  return null;
}
