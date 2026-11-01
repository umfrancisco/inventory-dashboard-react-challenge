import type { Product } from './types';

export const LOW_STOCK_THRESHOLD = 5;

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrency(value: number): string {
  return currency.format(value);
}

export function isLowStock(product: Product): boolean {
  return product.stock <= LOW_STOCK_THRESHOLD;
}
