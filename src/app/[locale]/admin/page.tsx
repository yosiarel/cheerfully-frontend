'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { DollarSign, ShoppingBag, Package, Users, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/shared/lib/formatters';
import { adminApi, DashboardStats } from '@/domains/admin';
import { useAuthStore } from '@/domains/auth';
import styles from './AdminDashboard.module.css';

export default function AdminDashboardPage() {
  const locale = useLocale();
  const token = useAuthStore((state) => state.token);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    adminApi
      .getStats(token || undefined)
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setIsLoading(false));
  }, [token]);

  if (isLoading) {
    return (
      <div style={{ padding: '32px 0' }}>
        <p>Memuat data dashboard admin...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: '32px 0' }}>
        <h2>Akses Dibatasi</h2>
        <p>Gagal memuat statistik admin. Pastikan Anda masuk sebagai ADMIN.</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Ringkasan Dashboard</h1>
        <p className={styles.subtitle}>Selamat datang di panel kontrol toko Cheerfully</p>
      </div>

      {/* 4 Stat Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconRevenue}`}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Pendapatan</span>
            <span className={styles.statValue}>{formatCurrency(stats.totalRevenue)}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconOrders}`}>
            <Package size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Pesanan</span>
            <span className={styles.statValue}>{stats.totalOrders}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconProducts}`}>
            <ShoppingBag size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Produk Aktif</span>
            <span className={styles.statValue}>{stats.totalProducts}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} ${styles.iconUsers}`}>
            <Users size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Pelanggan</span>
            <span className={styles.statValue}>{stats.totalUsers}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.sectionGrid}>
        {/* Recent Orders */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Pesanan Terbaru</h2>
          {stats.recentOrders.length === 0 ? (
            <p>Belum ada pesanan terbaru.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No. Order</th>
                  <th>Pelanggan</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link href={`/${locale}/admin/orders`} style={{ fontWeight: 700, color: 'var(--color-primary-dark)', textDecoration: 'none' }}>
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td>{order.user?.name || 'Guest'}</td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                    <td>
                      <span className={styles.badge} style={{ background: '#FFF9C4', color: '#F57F17' }}>
                        {order.status}
                      </span>
                    </td>
                    <td>{formatDate(order.createdAt, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle} style={{ color: '#E65100', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} />
            <span>Peringatan Stok Rendah</span>
          </h2>

          {stats.lowStockProducts.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Semua produk memiliki stok yang cukup.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.lowStockProducts.map((prod) => (
                <div
                  key={prod.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: 'var(--color-background)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{prod.nameId}</strong>
                    {prod.sku && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>SKU: {prod.sku}</div>}
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--color-destructive)', fontSize: '0.9rem' }}>
                    Sisa: {prod.stock}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
