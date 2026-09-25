'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Plus, Trash2, Eye } from 'lucide-react';
import { formatDate } from '@/shared/lib/formatters';
import { swal } from '@/shared/lib/sweetalert';
import { blogApi, BlogPost } from '@/domains/blog';
import { adminApi } from '@/domains/admin';
import { useAuthStore } from '@/domains/auth';
import styles from './AdminBlogPage.module.css';

export default function AdminBlogPage() {
  const locale = useLocale();
  const token = useAuthStore((state) => state.token);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = () => {
    setIsLoading(true);
    blogApi
      .getPosts({ limit: 50 })
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = (id: string, title: string) => {
    swal.delete(title).then((res) => {
      if (res.isConfirmed) {
        adminApi
          .deleteBlogPost(id, token || undefined)
          .then(() => {
            swal.toast('Artikel berhasil dihapus', 'success');
            fetchPosts();
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
          <h1 className={styles.title}>Blog CMS</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Kelola publikasi artikel & tips perhiasan manik-manik Cheerfully
          </p>
        </div>

        <button
          type="button"
          className={styles.addBtn}
          onClick={() => {
            swal.toast('Blog CMS Editor tersedia via API', 'info');
          }}
        >
          <Plus size={18} />
          <span>Buat Artikel Baru</span>
        </button>
      </div>

      <div className={styles.card}>
        {isLoading ? (
          <p>Memuat daftar artikel...</p>
        ) : posts.length === 0 ? (
          <p>Belum ada artikel di dalam blog.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Artikel</th>
                <th>Kategori</th>
                <th>Penulis</th>
                <th>Status</th>
                <th>Tanggal Publikasi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
                const title = locale === 'id' ? post.titleId : post.titleEn;
                return (
                  <tr key={post.id}>
                    <td>
                      <strong style={{ fontSize: '0.95rem' }}>{title}</strong>
                    </td>
                    <td>{post.category}</td>
                    <td>{post.author}</td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: post.isPublished ? '#E8F5E9' : '#FFF9C4',
                          color: post.isPublished ? '#2E7D32' : '#F57F17',
                        }}
                      >
                        {post.isPublished ? 'Dipublikasikan' : 'Draft'}
                      </span>
                    </td>
                    <td>{formatDate(post.publishedAt || post.createdAt, locale)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link href={`/${locale}/blog/${post.slug}`} style={{ color: 'var(--color-text-secondary)' }} title="Lihat Artikel">
                          <Eye size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.id, title)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-destructive)' }}
                          title="Hapus Artikel"
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
