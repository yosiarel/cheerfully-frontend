'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { CheckCircle2, ShoppingBag, Home } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatters';
import { api } from '@/shared/lib/api';
import styles from './SuccessPage.module.css';

function OrderSuccessContent() {
  const locale = useLocale();
  const t = useTranslations('checkout');
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(Boolean(orderNumber));

  useEffect(() => {
    if (orderNumber) {
      api
        .get(`/orders/number/${orderNumber}`)
        .then((res) => setOrder(res.data))
        .catch(() => setOrder(null))
        .finally(() => setIsLoading(false));
    }
  }, [orderNumber]);

  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <CheckCircle2 size={48} />
      </div>

      <h1 className={styles.title}>{t('success.title')}</h1>
      <p className={styles.subtitle}>{t('success.message')}</p>

      {orderNumber && (
        <div className={styles.orderBadge}>
          {t('success.orderNumber', { number: orderNumber })}
        </div>
      )}

      {order && (
        <div className={styles.infoBox}>
          <div className={styles.infoRow}>
            <span>Status Pembayaran:</span>
            <span style={{ fontWeight: 700, color: 'var(--color-warning)' }}>
              {order.paymentStatus === 'PAID'
                ? 'Lunas'
                : order.paymentStatus === 'AWAITING_CONFIRMATION'
                ? 'Menunggu Konfirmasi Admin'
                : 'Belum Dibayar'}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span>Status Pesanan:</span>
            <span style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              {order.status}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span>Total Bayar:</span>
            <span style={{ fontWeight: 700 }}>{formatCurrency(order.totalAmount)}</span>
          </div>
          <div className={styles.infoRow}>
            <span>Penerima:</span>
            <span>{order.shippingAddress?.fullName} ({order.shippingAddress?.phone})</span>
          </div>
        </div>
      )}

      <div className={styles.btnGroup}>
        <Link href={`/${locale}`} className={styles.homeBtn}>
          <Home size={18} style={{ display: 'inline', marginRight: '6px' }} />
          Kembali ke Beranda
        </Link>
        <Link href={`/${locale}/shop`} className={styles.shopBtn}>
          <ShoppingBag size={18} style={{ display: 'inline', marginRight: '6px' }} />
          Belanja Lagi
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Suspense fallback={<div className={styles.card}>Memuat pesanan...</div>}>
          <OrderSuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
