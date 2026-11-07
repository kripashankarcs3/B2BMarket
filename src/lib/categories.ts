import {
  Apple, Armchair, Building2, Car, Container, Cpu, Dumbbell, Factory, FlaskConical,
  Gem, Lamp, Package, PenLine, Scissors, Shirt, Sparkles, Stethoscope, Wheat,
  type LucideIcon,
} from 'lucide-react';
import type { Category, CategoryNode } from '@/types';

const ICONS: Record<string, LucideIcon> = {
  agriculture: Wheat,
  apparel: Shirt,
  automotive: Car,
  'beauty-personal-care': Sparkles,
  construction: Building2,
  chemicals: FlaskConical,
  electronics: Cpu,
  'food-beverages': Apple,
  furniture: Armchair,
  jewelry: Gem,
  'home-kitchen': Lamp,
  'industrial-machinery': Factory,
  'leather-textiles': Scissors,
  'medical-healthcare': Stethoscope,
  packaging: Package,
  'rubber-plastics': Container,
  'sports-fitness': Dumbbell,
  stationery: PenLine,
};

export function categoryIcon(slug: string): LucideIcon {
  return ICONS[slug] ?? Package;
}

/** Groups the flat category list into top-level categories with their subcategories. */
export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const roots = categories.filter((c) => !c.parentId);
  return roots
    .map((root) => {
      const children = categories
        .filter((c) => c.parentId === root.id)
        .sort((a, b) => b.productCount - a.productCount);
      const totalProducts = root.productCount + children.reduce((sum, c) => sum + c.productCount, 0);
      return { ...root, children, totalProducts };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
