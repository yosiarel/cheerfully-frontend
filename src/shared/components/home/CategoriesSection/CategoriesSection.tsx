'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import styles from './CategoriesSection.module.css';

const CATEGORIES = [
  { 
    key: 'bracelets', 
    slug: 'bracelets', 
    bgColor: '#FFF0F5', 
    accentColor: '#E8A0BF', 
    descKey: 'braceletsDesc',
    beadColors: ['#E8A0BF', '#F9F5E3', '#B8C0FF', '#E8A0BF']
  },
  { 
    key: 'necklaces', 
    slug: 'necklaces', 
    bgColor: '#F0F4FF', 
    accentColor: '#7BA0FF', 
    descKey: 'necklacesDesc',
    beadColors: ['#7BA0FF', '#E8A0BF', '#99DBB4', '#7BA0FF']
  },
  { 
    key: 'earrings',  
    slug: 'earrings',  
    bgColor: '#F0FAF5', 
    accentColor: '#52C498', 
    descKey: 'earringsDesc',
    beadColors: ['#52C498', '#FFD3B6', '#E8A0BF', '#52C498']
  },
  { 
    key: 'rings',     
    slug: 'rings',     
    bgColor: '#F8F0FF', 
    accentColor: '#B088E0', 
    descKey: 'ringsDesc',
    beadColors: ['#B088E0', '#F9F5E3', '#E8A0BF', '#B088E0']
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } 
  },
};

interface CategoriesSectionProps {
  variant?: 'default' | 'compact';
}

export function CategoriesSection({ variant = 'default' }: CategoriesSectionProps) {
  const t = useTranslations('home.categories');
  const locale = useLocale();

  const isCompact = variant === 'compact';

  return (
    <section className={`${styles.section} ${isCompact ? styles.sectionCompact : ''}`} id="categories">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2 className={styles.sectionTitle}>{t('title')}</h2>
            <p className={styles.sectionSubtitle}>{t('subtitle')}</p>
          </div>
          <Link href={`/${locale}/shop`} className={styles.viewAllBtn}>
            {t.has('viewAll') ? t('viewAll') : 'Lihat Semua Koleksi'} <ArrowUpRight size={18} />
          </Link>
        </div>

        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {CATEGORIES.map((cat) => (
            <motion.div key={cat.key} variants={itemVariants}>
              <Link
                href={`/${locale}/shop?category=${cat.slug}`}
                className={styles.card}
                style={{ '--card-bg': cat.bgColor, '--card-accent': cat.accentColor } as React.CSSProperties}
              >
                {/* Visual Placeholder Graphic Box */}
                <div className={styles.cardGraphic}>
                  <div className={styles.beadPattern}>
                    {cat.beadColors.map((color, i) => (
                      <span 
                        key={i} 
                        className={styles.patternBead} 
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                  <div className={styles.badgeArrow}>
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                {/* Content */}
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>
                    {t(cat.key)}
                  </h3>
                  <p className={styles.cardDesc}>
                    {t(cat.descKey)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
