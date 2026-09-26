'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingBag, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './CtaSection.module.css';

interface CtaSectionProps {
  variant?: 'default' | 'personal';
}

export function CtaSection({ variant = 'default' }: CtaSectionProps) {
  const t = useTranslations('home.cta');
  const locale = useLocale();

  const isPersonal = variant === 'personal';
  const titleText = isPersonal
    ? (t.has('personalTitle') ? t('personalTitle') : 'Ajak Temanmu ke Cheerfully!')
    : t('title');
  const subtitleText = isPersonal
    ? (t.has('personalSubtitle') ? t('personalSubtitle') : 'Setiap gelang punya cerita. Bagikan kebahagiaan handmade ini.')
    : t('subtitle');
  const buttonText = isPersonal
    ? (t.has('personalButton') ? t('personalButton') : 'Bagikan Cheerfully')
    : t('button');

  return (
    <section className={styles.section} id="cta">
      <div className={styles.container}>
        <motion.div 
          className={styles.card}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        >
          {/* Decorative floating bead accents inside CTA card */}
          <div className={`${styles.beadDecor} ${styles.d1}`} style={{ background: '#E8A0BF' }} />
          <div className={`${styles.beadDecor} ${styles.d2}`} style={{ background: '#99DBB4' }} />
          <div className={`${styles.beadDecor} ${styles.d3}`} style={{ background: '#B8C0FF' }} />
          <div className={`${styles.beadDecor} ${styles.d4}`} style={{ background: '#FFD3B6' }} />

          <div className={styles.cardContent}>
            <div className={styles.textContent}>
              <div className={styles.iconBadge}>
                <Heart size={20} className={styles.heartIcon} />
              </div>
              <h2 className={styles.title}>{titleText}</h2>
              <p className={styles.subtitle}>{subtitleText}</p>
            </div>

            <Link href={`/${locale}/shop`} className={styles.ctaButton}>
              <ShoppingBag size={20} />
              <span>{buttonText}</span>
              <Sparkles size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
