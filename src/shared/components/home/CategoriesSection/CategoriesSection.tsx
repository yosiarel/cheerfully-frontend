'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import styles from './CategoriesSection.module.css';

const CATEGORIES = [
  { key: 'bracelets', emoji: '📿', slug: 'bracelets', cardClass: 'cardBracelets' },
  { key: 'necklaces', emoji: '💎', slug: 'necklaces', cardClass: 'cardNecklaces' },
  { key: 'earrings',  emoji: '✨', slug: 'earrings',  cardClass: 'cardEarrings' },
  { key: 'rings',     emoji: '💍', slug: 'rings',     cardClass: 'cardRings' },
] as const;

export function CategoriesSection() {
  const t = useTranslations('home.categories');
  const locale = useLocale();

  return (
    <section className={styles.section} id="categories">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>{t('title')}</h2>

        <div className={styles.grid}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={`/${locale}/shop?category=${cat.slug}`}
              className={`${styles.card} ${styles[cat.cardClass]}`}
            >
              <span className={styles.cardEmoji} role="img" aria-hidden="true">
                {cat.emoji}
              </span>
              <span className={styles.cardLabel}>
                {t(cat.key)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
