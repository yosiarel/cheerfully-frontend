'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { api } from '@/shared/lib/api';
import styles from './BlogPreview.module.css';

interface BlogPost {
  id: string;
  slug: string;
  titleId: string;
  titleEn: string;
  excerptId: string | null;
  excerptEn: string | null;
  coverImage: string | null;
  category: string;
  publishedAt: string | null;
  createdAt: string;
}

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function BlogPreview() {
  const t = useTranslations('home.blog');
  const tNav = useTranslations('common.nav');
  const locale = useLocale();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      try {
        const res = await api.get<BlogPost[]>('/blog?limit=3');
        if (!cancelled && res.success) {
          setPosts(res.data);
        }
      } catch (err) {
        console.warn('Failed to fetch blog posts:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPosts();
    return () => { cancelled = true; };
  }, []);

  // R-38: no fabricated content, hide if empty
  if (!loading && posts.length === 0) {
    return null;
  }

  const getTitle = (p: BlogPost) => locale === 'id' ? p.titleId : p.titleEn;

  return (
    <section className={styles.section} id="blog-preview">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>{t('title')}</h2>
          <Link href={`/${locale}/blog`} className={styles.viewAll}>
            {tNav('blog')} &rarr;
          </Link>
        </div>

        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`${styles.skeletonCard} ${i === 0 ? styles.blogCardLarge : ''}`}
              >
                <div className={styles.skeletonImage} />
                <div className={styles.skeletonInfo}>
                  <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
                  <div className={styles.skeletonLine} />
                  <div className={`${styles.skeletonLine} ${styles.skeletonLineMed}`} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            {posts.map((post, i) => (
              <Link
                key={post.id}
                href={`/${locale}/blog/${post.slug}`}
                className={i === 0 ? styles.blogCardLarge : styles.blogCard}
              >
                <div className={styles.blogImageWrap}>
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={getTitle(post)}
                      className={styles.blogImage}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.blogPlaceholder}>📝</div>
                  )}
                </div>

                <div className={styles.blogInfo}>
                  <span className={styles.blogCategory}>{post.category}</span>
                  <h3 className={styles.blogTitle}>{getTitle(post)}</h3>
                  {(locale === 'id' ? post.excerptId : post.excerptEn) && (
                    <p className={styles.blogExcerpt}>{locale === 'id' ? post.excerptId : post.excerptEn}</p>
                  )}
                  <span className={styles.blogDate}>
                    {formatDate(post.publishedAt || post.createdAt, locale)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
