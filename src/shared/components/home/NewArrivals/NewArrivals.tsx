'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import { api } from '@/shared/lib/api';
import styles from './NewArrivals.module.css';

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

export function NewArrivals() {
  const t = useTranslations('home.newArrivals');
  const locale = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchNew() {
      try {
        const res = await api.get<Product[]>('/products?sort=newest&limit=6');
        if (!cancelled && res.success) {
          setProducts(res.data);
        }
      } catch (err) {
        console.warn('Failed to fetch new arrivals:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNew();
    return () => { cancelled = true; };
  }, []);

  if (!loading && products.length === 0) return null;

  const getName = (p: Product) => locale === 'id' ? p.nameId : p.nameEn;

  return (
    <section className={styles.section} id="new-arrivals">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <Sparkles size={20} className={styles.titleIcon} />
            <h2 className={styles.title}>
              {t.has('title') ? t('title') : 'Baru Datang'}
            </h2>
          </div>
          <Link href={`/${locale}/shop?sort=newest`} className={styles.viewAll}>
            {t.has('viewAll') ? t('viewAll') : 'Lihat Semua'}
          </Link>
        </div>

        <div className={styles.grid}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeleton} />
              ))
            : products.map((product) => (
                <Link
                  key={product.id}
                  href={`/${locale}/shop/${product.slug}`}
                  className={styles.card}
                >
                  <div className={styles.imageWrap}>
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={getName(product)}
                        className={styles.image}
                        loading="lazy"
                      />
                    ) : (
                      <div className={styles.placeholder}>📿</div>
                    )}
                    <span className={styles.newBadge}>
                      {t.has('badge') ? t('badge') : 'Baru'}
                    </span>
                  </div>
                  <div className={styles.info}>
                    <h3 className={styles.name}>{getName(product)}</h3>
                    <span className={styles.price}>
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
