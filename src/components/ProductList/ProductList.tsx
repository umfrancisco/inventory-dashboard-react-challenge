import type { Product } from '../../types';
import { formatCurrency, isLowStock } from '../../utils';
import styles from './ProductList.module.css';

interface ProductListProps {
  products: Product[];
  selectedId: number | null;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ProductList({
  products,
  selectedId,
  onEdit,
  onDelete,
}: ProductListProps) {
  if (products.length === 0) {
    return <div className={styles.empty}>No products match your filters.</div>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Category</th>
            <th scope="col" className={styles.numeric}>Price</th>
            <th scope="col" className={styles.numeric}>Stock</th>
            <th scope="col" className={styles.actions}>
              <span aria-hidden="true">&nbsp;</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr
              key={p.id}
              className={p.id === selectedId ? `${styles.row} ${styles.selected}` : styles.row}
              onClick={() => onEdit(p.id)}
            >
              <td>
                <div className={styles.name}>{p.name}</div>
                <div className={styles.sku}>{p.sku}</div>
              </td>
              <td>{p.category}</td>
              <td className={styles.numeric}>{formatCurrency(p.price)}</td>
              <td className={styles.numeric}>
                <span
                  className={
                    isLowStock(p)
                      ? `${styles.badge} ${styles.low}`
                      : `${styles.badge} ${styles.ok}`
                  }
                >
                  {p.stock}
                </span>
              </td>
              <td className={styles.actions}>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => onDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
