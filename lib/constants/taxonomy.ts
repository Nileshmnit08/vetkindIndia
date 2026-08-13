import { Beef, Bird, Dog, Fish, Leaf, Activity, type LucideIcon } from "lucide-react";

export type SpeciesTaxonomyMeta = {
  icon: LucideIcon;
  color: string;
  bg: string;
};

export const getSpeciesTaxonomyMeta = (slug: string): SpeciesTaxonomyMeta => {
  switch (slug) {
    case 'dairy':
      return { icon: Beef, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" };
    case 'poultry':
      return { icon: Bird, color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" };
    case 'pet-care':
      return { icon: Dog, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" };
    case 'aquaculture':
      return { icon: Fish, color: "text-cyan-600", bg: "bg-cyan-100 dark:bg-cyan-900/30" };
    case 'swine':
      return { icon: Leaf, color: "text-pink-600", bg: "bg-pink-100 dark:bg-pink-900/30" }; 
    case 'equine':
      return { icon: Activity, color: "text-stone-600", bg: "bg-stone-100 dark:bg-stone-900/30" };
    default:
      return { icon: Activity, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" };
  }
};
