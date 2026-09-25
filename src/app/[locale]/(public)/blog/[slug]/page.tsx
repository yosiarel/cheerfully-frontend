'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/shared/lib/formatters';
import { blogApi, BlogPost } from '@/domains/blog';
import styles from './BlogDetailPage.module.css';

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = use(params);
  const locale = useLocale();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('blog');

  useEffect(() => {
    setIsLoading(true);
    blogApi
      .getPostBySlug(slug)
      .then((res) => setPost(res))
      .catch(() => setPost(null))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.container} style={{ textAlign: 'center', padding: '64px 0' }}>
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.page}>
        <div className={styles.container} style={{ textAlign: 'center', padding: '64px 0' }}>
          <h2>{t('notFoundTitle')}</h2>
          <p style={{ margin: '16px 0 24px' }}>{t('notFoundDesc')}</p>
          <Link href={`/${locale}/blog`} style={{ background: 'var(--color-primary)', color: 'white', padding: '12px 24px', borderRadius: 'var(--radius-full)', textDecoration: 'none', fontWeight: 700 }}>
            {t('backToBlog')}
          </Link>
        </div>
      </div>
    );
  }

  const title = locale === 'id' ? post.titleId : post.titleEn;
  const content = locale === 'id' ? post.contentId : post.contentEn;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href={`/${locale}`} className={styles.breadcrumbLink}>
            {t('home')}
          </Link>
          <ChevronRight size={14} />
          <Link href={`/${locale}/blog`} className={styles.breadcrumbLink}>
            {t('blog')}
          </Link>
          <ChevronRight size={14} />
          <span>{title}</span>
        </nav>

        <article className={styles.articleCard}>
          <span className={styles.categoryBadge}>{post.category}</span>
          <h1 className={styles.title}>{title}</h1>

          <div className={styles.metaRow}>
            <span>{t('by')} <strong>{post.author}</strong></span>
            <span>•</span>
            <span>{formatDate(post.publishedAt || post.createdAt, locale)}</span>
          </div>

          <div className={styles.coverWrapper}>
            {post.coverImage ? (
              <img src={post.coverImage} alt={title} className={styles.coverImg} />
            ) : (
              <span style={{ fontSize: '5rem' }}>📖</span>
            )}
          </div>

          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className={styles.tagsRow}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '2px dashed var(--color-border)' }}>
            <Link
              href={`/${locale}/blog`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary-dark)', fontWeight: 700, textDecoration: 'none' }}
            >
              <ArrowLeft size={18} />
              <span>{t('backToBlog')}</span>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
