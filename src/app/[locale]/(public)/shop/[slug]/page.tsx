'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingBag, CreditCard, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatters';
import { swal } from '@/shared/lib/sweetalert';
import {
  shopApi,
  Product,
  ProductCard,
  useCartStore,
} from '@/domains/shop';
import styles from './ProductDetailPage.module.css';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  bracelets: '🌸',
  necklaces: '✨',
  earrings: '🎀',
  rings: '💍',
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('shop');

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await shopApi.getProductBySlug(slug);
        setProduct(data);
        const related = await shopApi.getRelatedProducts(slug);
        setRelatedProducts(related);
      } catch {
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.page}>
        <div className={styles.container} style={{ textAlign: 'center', padding: '64px 0' }}>
          <h2>Product Not Found</h2>
          <p style={{ margin: '16px 0 24px' }}>The product you are looking for does not exist or has been removed.</p>
          <Link href={`/${locale}/shop`} className={styles.addCartBtn} style={{ display: 'inline-flex' }}>
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const name = locale === 'id' ? product.nameId : product.nameEn;
  const description = locale === 'id' ? product.descriptionId : product.descriptionEn;
  const categoryName = locale === 'id' ? product.category.nameId : product.category.nameEn;
  const fallbackEmoji = CATEGORY_EMOJIS[product.category.slug] || '✨';
  const hasValidImages = product.images && product.images.length > 0 && !imgError;

  const discountPercent =
    product.comparePrice && Number(product.comparePrice) > Number(product.price)
      ? Math.round(
          ((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100
        )
      : 0;

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    useCartStore.getState().addItem(product, qty);
    swal.toast(
      locale === 'id'
        ? `${qty}x ${name} ditambahkan ke keranjang!`
        : `${qty}x ${name} added to cart!`,
      'success'
    );
  };

  const handleBuyNow = () => {
    useCartStore.getState().addItem(product, qty);
    router.push(`/${locale}/cart`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href={`/${locale}`} className={styles.breadcrumbLink}>
            Beranda
          </Link>
          <ChevronRight size={14} />
          <Link href={`/${locale}/shop`} className={styles.breadcrumbLink}>
            {t('title')}
          </Link>
          <ChevronRight size={14} />
          <span>{name}</span>
        </nav>

        <div className={styles.productGrid}>
          {/* Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImageWrapper}>
              {hasValidImages ? (
                <img
                  src={product.images[activeImageIdx] || product.images[0]}
                  alt={name}
                  className={styles.mainImage}
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className={styles.placeholderEmoji} role="img" aria-label={name}>
                  {fallbackEmoji}
                </span>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className={styles.thumbnails}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.thumbBtn} ${idx === activeImageIdx ? styles.activeThumb : ''}`}
                    onClick={() => setActiveImageIdx(idx)}
                  >
                    <img src={img} alt={`${name} ${idx + 1}`} className={styles.thumbImg} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className={styles.details}>
            <span className={styles.categoryBadge}>{categoryName}</span>
            <h1 className={styles.title}>{name}</h1>

            <div className={styles.priceRow}>
              <span className={styles.price}>{formatCurrency(product.price)}</span>
              {discountPercent > 0 && (
                <>
                  <span className={styles.comparePrice}>{formatCurrency(product.comparePrice!)}</span>
                  <span className={styles.discountBadge}>-{discountPercent}%</span>
                </>
              )}
            </div>

            <div className={styles.metaRow}>
              {product.sku && <span>{t('sku')}: {product.sku}</span>}
              <span>{t('inStock')}: {product.stock}</span>
              {product.weight && <span>{t('weight')}: {product.weight}g</span>}
            </div>

            <div className={styles.description}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                {t('productDescription')}
              </h3>
              <p>{description}</p>
            </div>

            <div className={styles.actions}>
              <div className={styles.qtyRow}>
                <span className={styles.qtyLabel}>{t('quantity')}:</span>
                <div className={styles.qtyControls}>
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
              </div>

              <div className={styles.btnGroup}>
                <button
                  type="button"
                  className={styles.addCartBtn}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  <ShoppingBag size={20} />
                  <span>{isOutOfStock ? t('outOfStock') : t('addToCart')}</span>
                </button>

                <button
                  type="button"
                  className={styles.buyNowBtn}
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                >
                  <CreditCard size={20} />
                  <span>Beli Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.sectionTitle}>{t('relatedProducts')}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
