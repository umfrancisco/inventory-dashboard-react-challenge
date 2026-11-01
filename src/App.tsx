import { useEffect, useMemo, useState } from 'react';
import ProductForm from './components/ProductForm/ProductForm';
import ProductList from './components/ProductList/ProductList';
import SearchBar from './components/SearchBar/SearchBar';
import { seedProducts } from './data/seed';
import { useDebounce } from './hooks/useDebounce';
import type { CategoryFilter, Product, ProductDraft } from './types';
import { formatCurrency, isLowStock } from './utils';
import styles from './App.module.css';

const STORAGE_KEY = 'inventory.products';

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : seedProducts;
  } catch {
    return seedProducts;
  }
}

function nextId(products: Product[]): number {
  return products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products.length]);

  const visibleProducts = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchesCategory = category === 'All' || p.category === category;
      const matchesStock = !lowStockOnly || isLowStock(p);
      return matchesQuery && matchesCategory && matchesStock;
    });
  }, [products, debouncedQuery, category, lowStockOnly]);

  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStockCount = products.filter(isLowStock).length;

  const editing = products.find((p) => p.id === editingId);

  const openCreate = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) {
      closeForm();
    }
  };

  const handleSave = (draft: ProductDraft) => {
    if (editingId !== null) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...draft } : p))
      );
    } else {
      setProducts((prev) => [...prev, { ...draft, id: nextId(prev) }]);
    }
    closeForm();
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Inventory Dashboard</h1>
          <p className={styles.subtitle}>Manage products, stock levels and pricing</p>
        </div>
        <button type="button" className={styles.primaryButton} onClick={openCreate}>
          + New product
        </button>
      </header>

      <section className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Products</span>
          <strong className={styles.statValue}>{products.length}</strong>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total units</span>
          <strong className={styles.statValue}>{totalUnits}</strong>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Inventory value</span>
          <strong className={styles.statValue}>{formatCurrency(inventoryValue)}</strong>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Low stock</span>
          <strong className={styles.statValue}>{lowStockCount}</strong>
        </div>
      </section>

      <SearchBar
        query={query}
        category={category}
        lowStockOnly={lowStockOnly}
        resultCount={visibleProducts.length}
        onQueryChange={setQuery}
        onCategoryChange={setCategory}
        onLowStockChange={setLowStockOnly}
      />

      <div className={showForm ? `${styles.layout} ${styles.withForm}` : styles.layout}>
        <ProductList
          products={visibleProducts}
          selectedId={showForm ? editingId : null}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {showForm && (
          <aside className={styles.panel}>
            <ProductForm
              key={editingId ?? 'new'}
              initial={editing}
              onSave={handleSave}
              onCancel={closeForm}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
