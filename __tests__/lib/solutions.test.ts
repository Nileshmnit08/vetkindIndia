import { getSolutions, getSolutionBySlug } from '@/lib/solutions';

// Use mock data since tests run against the dummy client or we mock it
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(),
    })),
  },
}));

describe('Solutions Data Library', () => {
  beforeEach(() => {
    // We force the mock by setting process.env
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://xyzcompany.supabase.co';
  });

  describe('getSolutions', () => {
    it('returns all mock solutions when using dummy supabase', async () => {
      const solutions = await getSolutions();
      expect(solutions).toBeDefined();
      expect(solutions.length).toBeGreaterThan(0);
      expect(solutions.length).toBe(8); // Ensure all 8 are there
      
      const heatStress = solutions.find((s) => s.slug === 'heat-stress');
      expect(heatStress).toBeDefined();
      expect(heatStress?.name).toBe('Heat Stress');
    });
  });

  describe('getSolutionBySlug', () => {
    it('returns a specific solution by slug', async () => {
      const solution = await getSolutionBySlug('milk-production');
      expect(solution).toBeDefined();
      expect(solution?.name).toBe('Milk Production');
    });

    it('returns null for an invalid slug', async () => {
      const solution = await getSolutionBySlug('invalid-slug-123');
      expect(solution).toBeNull();
    });
  });
});
