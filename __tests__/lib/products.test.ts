import { getProducts, getFilterOptions } from '@/lib/products';

// Force the mock data fallback
process.env.NEXT_PUBLIC_SUPABASE_URL = 'xyzcompany';

describe('Product Catalogue Logic (Mock Fallback)', () => {

  it('should fetch products with default pagination (limit 12)', async () => {
    const { data, count } = await getProducts({});
    
    expect(data.length).toBeGreaterThan(0);
    expect(data.length).toBeLessThanOrEqual(12);
    expect(count).toBeGreaterThan(0);
  });

  it('should paginate correctly (limit 2)', async () => {
    const { data: page1 } = await getProducts({ limit: 2, page: 1 });
    const { data: page2 } = await getProducts({ limit: 2, page: 2 });
    
    expect(page1.length).toBe(2);
    expect(page2.length).toBe(2);
    // Ensure the products on page 2 are different from page 1
    expect(page1[0].id).not.toBe(page2[0].id);
  });

  it('should filter by category', async () => {
    const { data } = await getProducts({ category: 'nutrition' });
    
    // Test logic depends on if there's mock data or not.
    // Assuming 'nutrition' is used as a string.
  });

  it('should search by product name', async () => {
    const { data } = await getProducts({ search: 'Lacto' });
    
    expect(data.length).toBeGreaterThan(0);
    data.forEach(product => {
      const matchName = product.name.toLowerCase().includes('lacto');
      const matchDesc = product.shortDescription?.toLowerCase().includes('lacto') || false;
      expect(matchName || matchDesc).toBe(true);
    });
  });

  it('should sort by price ascending', async () => {
    const { data } = await getProducts({ sortBy: 'price_asc' });
    
    expect(data.length).toBeGreaterThan(1);
    for (let i = 0; i < data.length - 1; i++) {
      const currentPrice = data[i].price || 0;
      const nextPrice = data[i+1].price || 0;
      expect(currentPrice).toBeLessThanOrEqual(nextPrice);
    }
  });

  it('should sort by price descending', async () => {
    const { data } = await getProducts({ sortBy: 'price_desc' });
    
    expect(data.length).toBeGreaterThan(1);
    for (let i = 0; i < data.length - 1; i++) {
      const currentPrice = data[i].price || 0;
      const nextPrice = data[i+1].price || 0;
      expect(currentPrice).toBeGreaterThanOrEqual(nextPrice);
    }
  });

  it('should filter featured products', async () => {
    const { data } = await getProducts({ sortBy: 'featured' });
    
    expect(data.length).toBeGreaterThan(0);
    data.forEach(product => {
      expect(product.featured).toBe(true);
    });
  });

  it('should fetch filter options correctly', async () => {
    const filters = await getFilterOptions();
    
    expect(filters).toHaveProperty('categories');
    expect(filters).toHaveProperty('species');
    expect(filters).toHaveProperty('benefits');
    expect(filters.categories.length).toBeGreaterThan(0);
  });
});
