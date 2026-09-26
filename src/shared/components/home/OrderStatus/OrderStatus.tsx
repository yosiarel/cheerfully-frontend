'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { api } from '@/shared/lib/api';
import styles from './OrderStatus.module.css';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { icon: typeof Package; color: string; label: string }> = {
  PENDING: { icon: Clock, color: '#FFD166', label: 'Menunggu Pembayaran' },
  PAID: { icon: CheckCircle2, color: '#99DBB4', label: 'Dibayar' },
  PROCESSING: { icon: Package, color: '#B8C0FF', label: 'Diproses' },
  SHIPPED: { icon: Truck, color: '#E8A0BF', label: 'Dikirim' },
  DELIVERED: { icon: CheckCircle2, color: '#99DBB4', label: 'Sampai' },
};

function formatPrice(price: string | number): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return `Rp ${num.toLocaleString('id-ID')}`;
}

export function OrderStatus() {
  const t = useTranslations('home.orderStatus');
  const locale = useLocale();
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchOrders() {
      try {
        const token = (session?.user as any)?.accessToken;
        if (!token) return;

        const res = await api.get<{ orders: Order[] }>('/orders?limit=3&status=PENDING,PAID,PROCESSING,SHIPPED', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!cancelled && res.success) {
          setOrders(res.data?.orders || []);
        }
      } catch (err) {
        console.warn('Failed to fetch orders:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchOrders();
    return () => { cancelled = true; };
  }, [session]);

  if (loading || orders.length === 0) return null;

  return (
    <section className={styles.section} id="order-status">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <Package size={20} className={styles.titleIcon} />
            {t.has('title') ? t('title') : 'Pesanan Aktif'}
          </h2>
          <Link href={`/${locale}/profile/orders`} className={styles.viewAll}>
            {t.has('viewAll') ? t('viewAll') : 'Semua Pesanan'}
          </Link>
        </div>

        <div className={styles.orderList}>
          {orders.map((order, index) => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
            const Icon = config.icon;

            return (
              <motion.div
                key={order.id}
                className={styles.orderCard}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Link
                  href={`/${locale}/profile/orders`}
                  className={styles.orderLink}
                >
                  <div
                    className={styles.statusIcon}
                    style={{ backgroundColor: `${config.color}22`, color: config.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderNumber}>#{order.orderNumber}</span>
                    <span
                      className={styles.statusLabel}
                      style={{ color: config.color }}
                    >
                      {config.label}
                    </span>
                  </div>
                  <span className={styles.orderAmount}>
                    {formatPrice(order.totalAmount)}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
