export interface Product {
  id: string;
  name: string;
  category: string;
  shortBenefit: string;
  packSize: string;
  rating: number;
  image: string;
}

export const bestSellingProducts: Product[] = [
  {
    id: "p1",
    name: "LactoBoost Pro",
    category: "Cattle",
    shortBenefit: "Improves milk yield and fat percentage",
    packSize: "5 kg",
    rating: 4.8,
    image: "/product-mockup.png",
  },
  {
    id: "p2",
    name: "FertilMax Plus",
    category: "Buffalo",
    shortBenefit: "Enhances conception rates and reproductive health",
    packSize: "1 kg",
    rating: 4.9,
    image: "/product-mockup.png",
  },
  {
    id: "p3",
    name: "PoultryVital",
    category: "Poultry",
    shortBenefit: "Boosts immunity and growth rate in broilers",
    packSize: "10 kg",
    rating: 4.7,
    image: "/product-mockup.png",
  },
  {
    id: "p4",
    name: "MastitisGuard",
    category: "Cattle",
    shortBenefit: "Prevents udder infections and reduces SCC",
    packSize: "500 g",
    rating: 4.9,
    image: "/product-mockup.png",
  },
];

export const featuredProducts: Product[] = [
  {
    id: "f1",
    name: "RumenHealth Forte",
    category: "Cattle",
    shortBenefit: "Optimizes digestion and feed efficiency",
    packSize: "2.5 kg",
    rating: 4.8,
    image: "/product-mockup.png",
  },
  {
    id: "f2",
    name: "CoolStress Guard",
    category: "Poultry & Cattle",
    shortBenefit: "Alleviates heat stress symptoms rapidly",
    packSize: "1 kg",
    rating: 4.6,
    image: "/product-mockup.png",
  },
  {
    id: "f3",
    name: "Min-Vit Complete",
    category: "Feed & Nutrition",
    shortBenefit: "Essential trace minerals for overall herd health",
    packSize: "25 kg",
    rating: 4.9,
    image: "/product-mockup.png",
  },
];

export const articles = [
  {
    id: "a1",
    title: "Optimizing Dairy Nutrition for High Yielders",
    slug: "managing-heat-stress-dairy-cows",
    category: "Dairy nutrition",
    date: "Aug 10, 2026",
    readTime: "5 min read",
  },
  {
    id: "a2",
    title: "Understanding Mastitis Prevention Protocols",
    slug: "understanding-subclinical-mastitis",
    category: "Animal health",
    date: "Jul 28, 2026",
    readTime: "7 min read",
  },
  {
    id: "a3",
    title: "The Role of Phytogenics in Feed Technology",
    slug: "role-of-phytogenics-veterinary-nutrition",
    category: "Feed technology",
    date: "Jul 15, 2026",
    readTime: "6 min read",
  },
];
