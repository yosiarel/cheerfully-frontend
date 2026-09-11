'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { User as UserIcon, Package, LogOut } from 'lucide-react';
import { swal } from '@/shared/lib/sweetalert';
import { authApi, useAuthStore } from '@/domains/auth';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('profile');

  const { user, token, updateUser, logout } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.container} style={{ textAlign: 'center', padding: '64px 0' }}>
          <h2>Silakan Masuk Terlebih Dahulu</h2>
          <p style={{ margin: '16px 0 24px' }}>Anda perlu masuk untuk mengakses halaman profil.</p>
          <Link href={`/${locale}/auth/login`} className={styles.saveBtn} style={{ display: 'inline-block', textDecoration: 'none' }}>
            Masuk Akun
          </Link>
        </div>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updated = await authApi.updateMe({ name, phone }, token || undefined);
      updateUser(updated);
      swal.toast('Profil berhasil diperbarui!', 'success');
    } catch (err: any) {
      swal.error('Gagal memperbarui profil', err.message || 'Terjadi kesalahan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    swal.confirm('Keluar Akun?', 'Apakah Anda yakin ingin keluar dari akun ini?').then((res) => {
      if (res.isConfirmed) {
        logout();
        swal.toast('Berhasil keluar', 'info');
        router.push(`/${locale}`);
      }
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('title')}</h1>

        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <Link href={`/${locale}/profile`} className={`${styles.sidebarLink} ${styles.activeLink}`}>
              <UserIcon size={18} />
              <span>Profil Saya</span>
            </Link>
            <Link href={`/${locale}/profile/orders`} className={styles.sidebarLink}>
              <Package size={18} />
              <span>{t('orders')}</span>
            </Link>
            <button
              type="button"
              className={styles.sidebarLink}
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-destructive)' }}
            >
              <LogOut size={18} />
              <span>Keluar</span>
            </button>
          </aside>

          {/* Main Content */}
          <main>
            <div className={styles.card}>
              <div className={styles.userHeader}>
                <div className={styles.avatar}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-text-primary)' }}>
                    {user.name}
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{user.email}</p>
                  <span className={styles.roleBadge}>{user.role}</span>
                </div>
              </div>

              <h3 className={styles.cardTitle}>Edit Informasi Pribadi</h3>

              <form onSubmit={handleUpdate} className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nama Lengkap</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email (Tetap)</label>
                  <input type="email" className={styles.input} value={user.email} disabled style={{ opacity: 0.7 }} />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nomor Telepon / WA</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <button type="submit" className={styles.saveBtn} disabled={isSubmitting}>
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
