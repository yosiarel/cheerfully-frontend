'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Check, Truck, CreditCard, Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '@/shared/lib/formatters';
import { swal } from '@/shared/lib/sweetalert';
import { adminApi } from '@/domains/admin';
import { useAuthStore } from '@/domains/auth';
import styles from './AdminOrdersPage.module.css';

export default function AdminOrdersPage() {
  const locale = useLocale();
  const token = useAuthStore((state) => state.token);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = () => {
    setIsLoading(true);
    adminApi
      .getAllOrders({}, token || undefined)
      .then((res: any) => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    adminApi
      .updateOrderStatus(id, newStatus, token || undefined)
      .then(() => {
        swal.toast(`Status pesanan diperbarui ke ${newStatus}`, 'success');
        fetchOrders();
      })
      .catch((err) => {
        swal.error('Gagal memperbarui status', err.message || 'Terjadi kesalahan.');
      });
  };

  const handleUpdatePayment = (id: string, newPaymentStatus: string) => {
    adminApi
      .updatePaymentStatus(id, newPaymentStatus, token || undefined)
      .then(() => {
        swal.toast(`Status pembayaran diperbarui ke ${newPaymentStatus}`, 'success');
        fetchOrders();
      })
      .catch((err) => {
        swal.error('Gagal memperbarui pembayaran', err.message || 'Terjadi kesalahan.');
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Manajemen Pesanan</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Konfirmasi pembayaran & pembaruan status pengiriman pesanan pelanggan
          </p>
        </div>
      </div>

      <div className={styles.card}>
        {isLoading ? (
          <p>Memuat daftar pesanan...</p>
        ) : orders.length === 0 ? (
          <p>Belum ada pesanan terdaftar di sistem.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No. Order</th>
                <th>Pelanggan</th>
                <th>Total</th>
                <th>Pembayaran</th>
                <th>Status Pesanan</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong style={{ color: 'var(--color-primary-dark)' }}>{order.orderNumber}</strong>
                  </td>
                  <td>
                    <div>{order.user?.name || order.shippingAddress?.fullName || 'Guest'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      {order.user?.email || order.shippingAddress?.email}
                    </div>
                  </td>
                  <td>
                    <strong>{formatCurrency(order.totalAmount)}</strong>
                  </td>
                  <td>
                    <select
                      className={styles.select}
                      value={order.paymentStatus}
                      onChange={(e) => handleUpdatePayment(order.id, e.target.value)}
                    >
                      <option value="UNPAID">UNPAID (Belum Bayar)</option>
                      <option value="AWAITING_CONFIRMATION">AWAITING (Perlu Dikonfirmasi)</option>
                      <option value="PAID">PAID (Lunas)</option>
                      <option value="REFUNDED">REFUNDED (Dikembalikan)</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className={styles.select}
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED (Dikirim)</option>
                      <option value="DELIVERED">DELIVERED (Selesai)</option>
                      <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
                    </select>
                  </td>
                  <td>{formatDate(order.createdAt, locale)}</td>
                  <td>
                    <Link
                      href={`/${locale}/checkout/success?orderNumber=${order.orderNumber}`}
                      style={{ color: 'var(--color-primary-dark)', fontWeight: 700, textDecoration: 'none', fontSize: '0.85rem' }}
                    >
                      Rincian
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
