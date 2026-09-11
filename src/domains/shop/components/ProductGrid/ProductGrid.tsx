'use client';

import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '../ProductCard/ProductCard';
import { Product, Pagination } from '../../types';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  onQuickView?: (product: Product) => void;
  onResetFilters?: () => void;
}

export function ProductGrid({
  products,
  isLoading,
  pagination,
  onPageChange,
  onQuickView,
  onResetFilters,
}: ProductGridProps) {
  const t = useTranslations('shop');

  if (isLoading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.skeletonCard}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonLine} />
            <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon} role="img" aria-label="No products">
          🔍
        </span>
        <h3 className={styles.emptyTitle}>{t('noProductsFound')}</h3>
        <p className={styles.emptyDesc}>{t('noProductsDesc')}</p>
        {onResetFilters && (
          <button type="button" className={styles.resetBtn} onClick={onResetFilters}>
            {t('resetFilters')}
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => onPageChange?.(pagination.page - 1)}
            disabled={pagination.page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: pagination.totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === pagination.page;
            return (
              <button
                key={pageNum}
                type="button"
                className={`${styles.pageBtn} ${isActive ? styles.activePage : ''}`}
                onClick={() => onPageChange?.(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => onPageChange?.(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
