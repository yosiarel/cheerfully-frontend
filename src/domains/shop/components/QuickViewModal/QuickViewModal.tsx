'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatters';
import { swal } from '@/shared/lib/sweetalert';
import { Product } from '../../types';
import styles from './QuickViewModal.module.css';

import { useCartStore } from '../../store/cartStore';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  bracelets: '🌸',
  necklaces: '✨',
  earrings: '🎀',
  rings: '💍',
};

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const locale = useLocale();
  const t = useTranslations('shop');
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const name = locale === 'id' ? product.nameId : product.nameEn;
  const description = locale === 'id' ? product.descriptionId : product.descriptionEn;
  const categoryName = locale === 'id' ? product.category.nameId : product.category.nameEn;
  const fallbackEmoji = CATEGORY_EMOJIS[product.category.slug] || '✨';
  const hasValidImage = product.images && product.images.length > 0 && !imgError;

  const handleAddToCart = () => {
    useCartStore.getState().addItem(product, qty);
    swal.toast(
      locale === 'id'
        ? `${qty}x ${name} ditambahkan ke keranjang!`
        : `${qty}x ${name} added to cart!`,
      'success'
    );
    onClose();
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className={styles.imageCol}>
          {hasValidImage ? (
            <img
              src={product.images[0]}
              alt={name}
              className={styles.image}
              onError={() => setImgError(true)}
            />
          ) : (
            <span className={styles.placeholderEmoji} role="img" aria-label={name}>
              {fallbackEmoji}
            </span>
          )}
        </div>

        <div className={styles.detailsCol}>
          <span className={styles.categoryBadge}>{categoryName}</span>
          <h2 className={styles.title}>{name}</h2>

          <div className={styles.priceRow}>
            <span className={styles.price}>{formatCurrency(product.price)}</span>
            {product.comparePrice && Number(product.comparePrice) > Number(product.price) && (
              <span className={styles.comparePrice}>{formatCurrency(product.comparePrice)}</span>
            )}
          </div>

          <p className={styles.description}>{description}</p>

          <div className={styles.actions}>
            <div className={styles.qtyRow}>
              <span>{t('quantity')}:</span>
              <button
                type="button"
                className={styles.qtyBtn}
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={qty <= 1 || isOutOfStock}
              >
                -
              </button>
              <span className={styles.qtyValue}>{qty}</span>
              <button
                type="button"
                className={styles.qtyBtn}
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                disabled={qty >= product.stock || isOutOfStock}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className={styles.addCartBtn}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingBag size={18} />
              <span>{isOutOfStock ? t('outOfStock') : t('addToCart')}</span>
            </button>

            <Link
              href={`/${locale}/shop/${product.slug}`}
              className={styles.addCartBtn}
              style={{ background: 'var(--color-surface-alt)', color: 'var(--color-text-primary)' }}
              onClick={onClose}
            >
              <span>{t('viewFullDetail')}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
