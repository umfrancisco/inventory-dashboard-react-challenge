import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { CATEGORIES } from '../../types';
import type { Product, ProductDraft } from '../../types';
import styles from './ProductForm.module.css';

interface ProductFormProps {
  initial?: Product;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
}

const emptyDraft: ProductDraft = {
  name: '',
  sku: '',
  category: 'Electronics',
  price: 0,
  stock: 0,
};

function toDraft(product: Product): ProductDraft {
  const { name, sku, category, price, stock } = product;
  return { name, sku, category, price, stock };
}

export default function ProductForm({ initial, onSave, onCancel }: ProductFormProps) {
  const [draft, setDraft] = useState<ProductDraft>(() =>
    initial ? toDraft(initial) : emptyDraft
  );

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSave({ ...draft, name: draft.name.trim(), sku: draft.sku.trim() });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>{initial ? 'Edit product' : 'New product'}</h2>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="pf-name">Name</label>
        <input
          id="pf-name"
          name="name"
          type="text"
          required
          value={draft.name}
          onChange={handleChange}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="pf-sku">SKU</label>
        <input
          id="pf-sku"
          name="sku"
          type="text"
          required
          value={draft.sku}
          onChange={handleChange}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="pf-category">Category</label>
        <select
          id="pf-category"
          name="category"
          value={draft.category}
          onChange={handleChange}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="pf-price">Price (BRL)</label>
          <input
            id="pf-price"
            name="price"
            type="number"
            min={0}
            step="0.01"
            required
            value={draft.price}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="pf-stock">Stock</label>
          <input
            id="pf-stock"
            name="stock"
            type="number"
            min={0}
            step={1}
            required
            value={draft.stock}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancel} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.save}>
          Save
        </button>
      </div>
    </form>
  );
}
