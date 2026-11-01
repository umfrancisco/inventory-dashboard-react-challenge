import { CATEGORIES } from '../../types';
import type { CategoryFilter } from '../../types';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  query: string;
  category: CategoryFilter;
  lowStockOnly: boolean;
  resultCount: number;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: CategoryFilter) => void;
  onLowStockChange: (value: boolean) => void;
}

export default function SearchBar({
  query,
  category,
  lowStockOnly,
  resultCount,
  onQueryChange,
  onCategoryChange,
  onLowStockChange,
}: SearchBarProps) {
  return (
    <div className={styles.bar}>
      <input
        type="search"
        className={styles.search}
        placeholder="Search by name or SKU..."
        aria-label="Search products"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />

      <select
        className={styles.select}
        aria-label="Filter by category"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as CategoryFilter)}
      >
        <option value="All">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label className={styles.toggle}>
        <input
          type="checkbox"
          checked={lowStockOnly}
          onChange={(e) => onLowStockChange(e.target.checked)}
        />
        Low stock only
      </label>

      <span className={styles.count}>{resultCount} result(s)</span>
    </div>
  );
}
