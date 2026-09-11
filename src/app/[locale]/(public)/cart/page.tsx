'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatters';
import { swal } from '@/shared/lib/sweetalert';
import { useCartStore } from '@/domains/shop/store/cartStore';
import styles from './CartPage.module.css';

const CATEGORY_EMOJIS: Record<string, string> = {
  bracelets: '🌸',
  necklaces: '✨',
  earrings: '🎀',
  rings: '💍',
};

export default function CartPage() {
  const locale = useLocale();
  const t = useTranslations('cart');

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const subtotal = getSubtotal();
  const shipping = subtotal > 0 ? 0 : 0; // Free shipping promo
  const total = subtotal + shipping;

  const handleRemove = (productId: string, productName: string) => {
    swal
      .confirm(
        locale === 'id' ? `Hapus ${productName}?` : `Remove ${productName}?`,
        locale === 'id'
          ? 'Item ini akan dihapus dari keranjang belanja kamu.'
          : 'This item will be removed from your cart.'
      )
      .then((res) => {
        if (res.isConfirmed) {
          removeItem(productId);
          swal.toast(
            locale === 'id' ? 'Item berhasil dihapus' : 'Item removed',
            'success'
          );
        }
      });
  };

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon} role="img" aria-label="Empty Cart">
              🛒
            </span>
            <h1 className={styles.emptyTitle}>{t('empty.title')}</h1>
            <p className={styles.emptyDesc}>{t('empty.subtitle')}</p>
            <Link href={`/${locale}/shop`} className={styles.shopBtn}>
              {t('empty.cta')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('title')}</h1>

        <div className={styles.layout}>
          {/* Item List */}
          <div className={styles.itemList}>
            {items.map(({ product, quantity }) => {
              const name = locale === 'id' ? product.nameId : product.nameEn;
              const categoryName = locale === 'id' ? product.category.nameId : product.category.nameEn;
              const fallbackEmoji = CATEGORY_EMOJIS[product.category.slug] || '✨';
              const hasValidImage = product.images && product.images.length > 0;
              const itemPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

              return (
                <div key={product.id} className={styles.itemCard}>
                  <div className={styles.itemImageWrapper}>
                    {hasValidImage ? (
                      <img src={product.images[0]} alt={name} className={styles.itemImage} />
                    ) : (
                      <span className={styles.placeholderEmoji}>{fallbackEmoji}</span>
                    )}
                  </div>

                  <div className={styles.itemInfo}>
                    <Link href={`/${locale}/shop/${product.slug}`} className={styles.itemName}>
                      {name}
                    </Link>
                    <span className={styles.itemCategory}>{categoryName}</span>
                    <span className={styles.itemPrice}>{formatCurrency(itemPrice)}</span>
                  </div>

                  <div className={styles.qtyRow}>
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className={styles.qtyValue}>{quantity}</span>
                    <button
                      type="button"
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => handleRemove(product.id, name)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Summary Sidebar */}
          <aside className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Ringkasan Pesanan</h2>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Ongkos Kirim</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>GRATIS</span>
            </div>

            <div className={styles.summaryTotalRow}>
              <span>Total</span>
              <span style={{ color: 'var(--color-primary-dark)' }}>{formatCurrency(total)}</span>
            </div>

            <Link href={`/${locale}/checkout`} className={styles.checkoutBtn}>
              <span>Lanjut ke Checkout</span>
              <ArrowRight size={18} />
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
