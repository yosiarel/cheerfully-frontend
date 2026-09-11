'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { User as UserIcon, Package, LogOut, ExternalLink } from 'lucide-react';
import { formatCurrency, formatDate } from '@/shared/lib/formatters';
import { api } from '@/shared/lib/api';
import { useAuthStore } from '@/domains/auth';
import styles from '../ProfilePage.module.css';

export default function OrderHistoryPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('profile');

  const { user, token, logout } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      api
        .get('/orders', { token })
        .then((res) => setOrders(res.data || []))
        .catch(() => setOrders([]))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.container} style={{ textAlign: 'center', padding: '64px 0' }}>
          <h2>Silakan Masuk Terlebih Dahulu</h2>
          <p style={{ margin: '16px 0 24px' }}>Anda perlu masuk untuk melihat riwayat pesanan.</p>
          <Link href={`/${locale}/auth/login`} className={styles.saveBtn} style={{ display: 'inline-block', textDecoration: 'none' }}>
            Masuk Akun
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('title')}</h1>

        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <Link href={`/${locale}/profile`} className={styles.sidebarLink}>
              <UserIcon size={18} />
              <span>Profil Saya</span>
            </Link>
            <Link href={`/${locale}/profile/orders`} className={`${styles.sidebarLink} ${styles.activeLink}`}>
              <Package size={18} />
              <span>{t('orders')}</span>
            </Link>
            <button
              type="button"
              className={styles.sidebarLink}
              onClick={() => logout()}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-destructive)' }}
            >
              <LogOut size={18} />
              <span>Keluar</span>
            </button>
          </aside>

          {/* Main Content */}
          <main>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>{t('orders')}</h2>

              {isLoading ? (
                <p>Memuat riwayat pesanan...</p>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <span style={{ fontSize: '3rem' }}>📦</span>
                  <h3 style={{ margin: '12px 0 8px', fontFamily: 'var(--font-heading)' }}>Belum Ada Pesanan</h3>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                    Anda belum pernah melakukan pemesanan di Cheerfully.
                  </p>
                  <Link href={`/${locale}/shop`} className={styles.saveBtn} style={{ display: 'inline-block', textDecoration: 'none' }}>
                    Mulai Belanja
                  </Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <div>
                        <span className={styles.orderNumber}>{order.orderNumber}</span>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                          {formatDate(order.createdAt, locale)}
                        </div>
                      </div>
                      <span className={`${styles.statusBadge} ${styles[`status${order.status}`]}`}>
                        {order.status}
                      </span>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      {order.items?.map((item: any) => {
                        const name = locale === 'id' ? item.product?.nameId : item.product?.nameEn;
                        return (
                          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                            <span>{item.quantity}x {name || 'Produk'}</span>
                            <span>{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed var(--color-border)' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Total Bayar: </span>
                        <strong style={{ color: 'var(--color-primary-dark)', fontSize: '1.05rem' }}>{formatCurrency(order.totalAmount)}</strong>
                      </div>

                      <Link
                        href={`/${locale}/checkout/success?orderNumber=${order.orderNumber}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--color-primary-dark)', fontWeight: 700, textDecoration: 'none' }}
                      >
                        <span>Rincian</span>
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
