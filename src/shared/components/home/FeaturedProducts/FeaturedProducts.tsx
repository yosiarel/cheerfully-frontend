'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { api } from '@/shared/lib/api';
import styles from './FeaturedProducts.module.css';

interface Product {
  id: string;
  slug: string;
  nameId: string;
  nameEn: string;
  price: string;
  comparePrice: string | null;
  images: string[];
  category: {
    nameId: string;
    nameEn: string;
  };
}

function formatPrice(price: string | number): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return `Rp ${num.toLocaleString('id-ID')}`;
}

function SkeletonCards() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonInfo}>
            <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
            <div className={styles.skeletonLine} />
            <div className={`${styles.skeletonLine} ${styles.skeletonLinePrice}`} />
          </div>
        </div>
      ))}
    </>
  );
}

export function FeaturedProducts() {
  const t = useTranslations('home.featured');
  const tShop = useTranslations('shop');
  const locale = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchFeatured() {
      try {
        const res = await api.get<Product[]>('/products?featured=true&limit=8');
        if (!cancelled && res.success) {
          setProducts(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('Failed to fetch featured products:', err);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchFeatured();
    return () => { cancelled = true; };
  }, []);

  // Hide section entirely if error or empty after loading
  if (!loading && (error || products.length === 0)) {
    return null;
  }

  const getName = (p: Product) => locale === 'id' ? p.nameId : p.nameEn;
  const getCategoryName = (p: Product) => locale === 'id' ? p.category?.nameId : p.category?.nameEn;

  return (
    <section className={styles.section} id="featured-products">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 className={styles.sectionTitle}>{t('title')}</h2>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </div>
          <Link href={`/${locale}/shop`} className={styles.viewAll}>
            {tShop('title')} &rarr;
          </Link>
        </div>

        <div className={styles.scrollTrack}>
          {loading ? (
            <SkeletonCards />
          ) : (
            products.map((product) => (
              <Link
                key={product.id}
                href={`/${locale}/shop/${product.slug}`}
                className={styles.productCard}
              >
                <div className={styles.productImageWrap}>
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={getName(product)}
                      className={styles.productImage}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.productPlaceholder}>
                      🎨
                    </div>
                  )}
                </div>

                <div className={styles.productInfo}>
                  {product.category && (
                    <span className={styles.categoryBadge}>
                      {getCategoryName(product)}
                    </span>
                  )}
                  <h3 className={styles.productName}>{getName(product)}</h3>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && (
                      <span className={styles.comparePrice}>
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
