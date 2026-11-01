export const CATEGORIES = ['Electronics', 'Office', 'Furniture', 'Accessories'] as const;

export type Category = (typeof CATEGORIES)[number];
export type CategoryFilter = Category | 'All';

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: Category;
  price: number;
  stock: number;
}

export type ProductDraft = Omit<Product, 'id'>;
