'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Category, ProductFilterParams } from '../../types';
import styles from './FilterSidebar.module.css';

interface FilterSidebarProps {
  categories: Category[];
  filters: ProductFilterParams;
  onFilterChange: (newFilters: Partial<ProductFilterParams>) => void;
  onResetFilters: () => void;
}

export function FilterSidebar({
  categories,
  filters,
  onFilterChange,
  onResetFilters,
}: FilterSidebarProps) {
  const locale = useLocale();
  const t = useTranslations('shop');

  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice ? String(filters.minPrice) : '');
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice ? String(filters.maxPrice) : '');

  const handleCategorySelect = (slug?: string) => {
    onFilterChange({ category: slug || undefined, page: 1 });
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      minPrice: minPriceInput ? Number(minPriceInput) : undefined,
      maxPrice: maxPriceInput ? Number(maxPriceInput) : undefined,
      page: 1,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ sort: e.target.value, page: 1 });
  };

  const hasActiveFilters = Boolean(
    filters.category || filters.minPrice || filters.maxPrice || filters.search || (filters.sort && filters.sort !== 'newest')
  );

  return (
    <aside className={styles.container}>
      <div className={styles.titleRow}>
        <h2 className={styles.title}>
          <SlidersHorizontal size={20} />
          <span>{t('filter')}</span>
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            className={styles.resetBtn}
            onClick={() => {
              setMinPriceInput('');
              setMaxPriceInput('');
              onResetFilters();
            }}
          >
            {t('reset')}
          </button>
        )}
      </div>

      {/* Categories */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('category')}</h3>
        <ul className={styles.categoryList}>
          <li className={styles.categoryItem}>
            <button
              type="button"
              className={`${styles.categoryBtn} ${!filters.category ? styles.activeCategory : ''}`}
              onClick={() => handleCategorySelect(undefined)}
            >
              <span>{t('allProducts')}</span>
            </button>
          </li>
          {categories.map((cat) => {
            const isSelected = filters.category === cat.slug;
            const name = locale === 'id' ? cat.nameId : cat.nameEn;
            return (
              <li key={cat.id} className={styles.categoryItem}>
                <button
                  type="button"
                  className={`${styles.categoryBtn} ${isSelected ? styles.activeCategory : ''}`}
                  onClick={() => handleCategorySelect(cat.slug)}
                >
                  <span>{name}</span>
                  {cat._count?.products !== undefined && (
                    <span className={styles.countBadge}>{cat._count.products}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sort By */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('sort')}</h3>
        <select
          className={styles.select}
          value={filters.sort || 'newest'}
          onChange={handleSortChange}
        >
          <option value="newest">{t('sortNewest')}</option>
          <option value="price_asc">{t('sortPriceLowHigh')}</option>
          <option value="price_desc">{t('sortPriceHighLow')}</option>
        </select>
      </div>

      {/* Price Range */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('priceRange')}</h3>
        <form onSubmit={handlePriceApply}>
          <div className={styles.priceInputs}>
            <input
              type="number"
              placeholder="Min"
              className={styles.priceInput}
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              min={0}
            />
            <span className={styles.priceSeparator}>-</span>
            <input
              type="number"
              placeholder="Max"
              className={styles.priceInput}
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              min={0}
            />
          </div>
          <button type="submit" className={styles.applyPriceBtn}>
            {t('apply')}
          </button>
        </form>
      </div>
    </aside>
  );
}
