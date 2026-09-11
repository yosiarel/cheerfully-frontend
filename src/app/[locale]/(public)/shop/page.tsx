'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Filter, X } from 'lucide-react';
import {
  shopApi,
  Product,
  Category,
  ProductFilterParams,
  Pagination,
  ProductGrid,
  FilterSidebar,
  ProductSearch,
  QuickViewModal,
} from '@/domains/shop';
import styles from './ShopPage.module.css';

export default function ShopPage() {
  const t = useTranslations('shop');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });

  const [filters, setFilters] = useState<ProductFilterParams>({
    page: 1,
    limit: 12,
    sort: 'newest',
  });

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await shopApi.getProducts(filters);
      setProducts(res.data);
      setPagination(res.pagination);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const cats = await shopApi.getCategories();
      setCategories(cats);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (newFilters: Partial<ProductFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sort: 'newest',
    });
    setIsMobileFilterOpen(false);
  };

  const handleSearch = (query: string) => {
    handleFilterChange({ search: query || undefined, page: 1 });
  };

  const handlePageChange = (page: number) => {
    handleFilterChange({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>{t('searchPlaceholder')}</p>
        </div>

        <div className={styles.topBar}>
          <ProductSearch value={filters.search || ''} onSearch={handleSearch} />

          <button
            type="button"
            className={styles.mobileFilterBtn}
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <Filter size={18} />
            <span>{t('filter')}</span>
          </button>
        </div>

        <div className={styles.layout}>
          <div className={styles.sidebarWrapper}>
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </div>

          <main>
            <ProductGrid
              products={products}
              isLoading={isLoading}
              pagination={pagination}
              onPageChange={handlePageChange}
              onQuickView={(p) => setQuickViewProduct(p)}
              onResetFilters={handleResetFilters}
            />
          </main>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileFilterOpen && (
        <div className={styles.mobileDrawer} onClick={() => setIsMobileFilterOpen(false)}>
          <div
            className={styles.mobileDrawerContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFilterChange={(f) => {
                handleFilterChange(f);
                setIsMobileFilterOpen(false);
              }}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
