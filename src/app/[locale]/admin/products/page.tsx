'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatters';
import { swal } from '@/shared/lib/sweetalert';
import { shopApi, Product } from '@/domains/shop';
import { adminApi } from '@/domains/admin';
import { useAuthStore } from '@/domains/auth';
import styles from './AdminProductsPage.module.css';

export default function AdminProductsPage() {
  const locale = useLocale();
  const token = useAuthStore((state) => state.token);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = () => {
    setIsLoading(true);
    shopApi
      .getProducts({ limit: 50 })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id: string, name: string) => {
    swal.delete(name).then((res) => {
      if (res.isConfirmed) {
        adminApi
          .deleteProduct(id, token || undefined)
          .then(() => {
            swal.toast('Produk berhasil dihapus', 'success');
            fetchProducts();
          })
          .catch((err) => {
            swal.error('Gagal Menghapus', err.message || 'Terjadi kesalahan.');
          });
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Manajemen Produk</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Kelola seluruh katalog perhiasan manik-manik Cheerfully
          </p>
        </div>

        <button
          type="button"
          className={styles.addBtn}
          onClick={() => {
            swal.toast('Form Tambah Produk tersedia via API', 'info');
          }}
        >
          <Plus size={18} />
          <span>Tambah Produk</span>
        </button>
      </div>

      <div className={styles.card}>
        {isLoading ? (
          <p>Memuat daftar produk...</p>
        ) : products.length === 0 ? (
          <p>Belum ada produk di dalam katalog.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => {
                const name = locale === 'id' ? prod.nameId : prod.nameEn;
                const catName = locale === 'id' ? prod.category.nameId : prod.category.nameEn;
                return (
                  <tr key={prod.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--color-background)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                          }}
                        >
                          {prod.images && prod.images.length > 0 ? (
                            <img src={prod.images[0]} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span>✨</span>
                          )}
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.95rem' }}>{name}</strong>
                          {prod.sku && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>SKU: {prod.sku}</div>}
                        </div>
                      </div>
                    </td>
                    <td>{catName}</td>
                    <td>
                      <strong style={{ color: 'var(--color-primary-dark)' }}>{formatCurrency(prod.price)}</strong>
                    </td>
                    <td>
                      <span style={{ color: prod.stock <= 5 ? 'var(--color-destructive)' : 'inherit', fontWeight: prod.stock <= 5 ? 700 : 400 }}>
                        {prod.stock}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: prod.isActive ? '#E8F5E9' : '#FFEBEE',
                          color: prod.isActive ? '#2E7D32' : '#C62828',
                        }}
                      >
                        {prod.isActive ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionGroup}>
                        <Link href={`/${locale}/shop/${prod.slug}`} className={styles.actionBtn} title="Lihat di Toko">
                          <Eye size={16} />
                        </Link>
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDelete(prod.id, name)}
                          title="Hapus Produk"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
