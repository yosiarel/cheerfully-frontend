'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { formatDate } from '@/shared/lib/formatters';
import { blogApi, BlogPost } from '@/domains/blog';
import styles from './BlogPage.module.css';

const CATEGORIES = ['Semua', 'Tips & Tricks', 'Trend & Style', 'Behind The Scenes'];

export default function BlogListingPage() {
  const locale = useLocale();
  const t = useTranslations('home.blog');

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCat, setSelectedCat] = useState('Semua');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    blogApi
      .getPosts({
        category: selectedCat === 'Semua' ? undefined : selectedCat,
      })
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setIsLoading(false));
  }, [selectedCat]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>Inspirasi, kreasi, dan cerita di balik perhiasan manik-manik Cheerfully</p>
        </div>

        <div className={styles.topBar}>
          <div className={styles.categories}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.catBtn} ${selectedCat === cat ? styles.activeCat : ''}`}
                onClick={() => setSelectedCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p>Memuat artikel...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-clay)' }}>
            <span style={{ fontSize: '3rem' }}>📝</span>
            <h3 style={{ fontFamily: 'var(--font-heading)', margin: '12px 0 8px' }}>Belum Ada Artikel</h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>Artikel di kategori ini akan segera hadir!</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {posts.map((post) => {
              const title = locale === 'id' ? post.titleId : post.titleEn;
              return (
                <div key={post.id} className={styles.card}>
                  <Link href={`/${locale}/blog/${post.slug}`} className={styles.coverWrapper}>
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={title} className={styles.coverImg} />
                    ) : (
                      <span className={styles.placeholderEmoji}>📖</span>
                    )}
                    <span className={styles.badge}>{post.category}</span>
                  </Link>

                  <div className={styles.cardContent}>
                    <h2 className={styles.cardTitle}>
                      <Link href={`/${locale}/blog/${post.slug}`} className={styles.titleLink}>
                        {title}
                      </Link>
                    </h2>
                    {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}

                    <div className={styles.meta}>
                      <span>Oleh {post.author}</span>
                      <span>{formatDate(post.publishedAt || post.createdAt, locale)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
