'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingBag, Eye } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatters';
import { swal } from '@/shared/lib/sweetalert';
import { Product } from '../../types';
import styles from './ProductCard.module.css';

import { useCartStore } from '../../store/cartStore';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  bracelets: '🌸',
  necklaces: '✨',
  earrings: '🎀',
  rings: '💍',
};

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations('shop');
  const [imgError, setImgError] = useState(false);

  const name = locale === 'id' ? product.nameId : product.nameEn;
  const categoryName = locale === 'id' ? product.category.nameId : product.category.nameEn;
  const fallbackEmoji = CATEGORY_EMOJIS[product.category.slug] || '✨';
  const hasValidImage = product.images && product.images.length > 0 && !imgError;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    useCartStore.getState().addItem(product, 1);

    swal.toast(
      locale === 'id'
        ? `${name} ditambahkan ke keranjang!`
        : `${name} added to cart!`,
      'success'
    );
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className={styles.card}>
      <Link href={`/${locale}/shop/${product.slug}`} className={styles.imageWrapper}>
        {hasValidImage ? (
          <img
            src={product.images[0]}
            alt={name}
            className={styles.image}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span className={styles.placeholderEmoji} role="img" aria-label={name}>
            {fallbackEmoji}
          </span>
        )}

        <span className={styles.categoryBadge}>{categoryName}</span>

        {onQuickView && (
          <button
            type="button"
            className={styles.quickViewBtn}
            onClick={handleQuickViewClick}
            aria-label={t('quickView')}
            title={t('quickView')}
          >
            <Eye size={18} />
          </button>
        )}
      </Link>

      <div className={styles.content}>
        <h3 className={styles.title}>
          <Link href={`/${locale}/shop/${product.slug}`} className={styles.titleLink}>
            {name}
          </Link>
        </h3>

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatCurrency(product.price)}</span>
          {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
            <span className={styles.comparePrice}>{formatCurrency(product.comparePrice)}</span>
          )}
        </div>

        <div className={styles.footer}>
          <span className={`${styles.stockBadge} ${isOutOfStock ? styles.outOfStock : styles.inStock}`}>
            {isOutOfStock ? t('outOfStock') : `${t('inStock')}: ${product.stock}`}
          </span>

          <button
            type="button"
            className={styles.addCartBtn}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={t('addToCart')}
          >
            <ShoppingBag size={16} />
            <span>{t('addToCart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
