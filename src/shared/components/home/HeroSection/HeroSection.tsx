'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { FloatingBeads } from './FloatingBeads';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const t = useTranslations('home.hero');
  const locale = useLocale();

  return (
    <section className={styles.hero} id="hero">
      <FloatingBeads />

      <div className={styles.heroInner}>
        {/* Text column with Framer Motion entrance */}
        <motion.div
          className={styles.heroText}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Sparkles size={14} className={styles.badgeIcon} />
            <span>{t('badge')}</span>
          </motion.div>

          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleAccent}>Cheerfully</span>
            <br />
            {t('title')}
          </h1>

          <p className={styles.heroSubtitle}>
            {t('subtitle')}
          </p>

          <div className={styles.heroActions}>
            <Link href={`/${locale}/shop`} className={styles.heroCta}>
              <ShoppingBag size={20} />
              {t('cta')}
            </Link>

            <a href="#story" className={styles.heroSecondaryCta}>
              <span>Kisah Kami</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </motion.div>

        {/* Visual column: Aesthetic Handmade Bead Composition */}
        <motion.div
          className={styles.heroVisual}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className={styles.compositionCard}>
            <div className={styles.compositionBackdrop} />

            {/* Claymorphic Bracelet Visual Container */}
            <div className={styles.braceletDisplay}>
              <div className={styles.beadRing}>
                {/* 12 decorative clay beads positioned around a circle */}
                <div className={`${styles.ringBead} ${styles.b1}`} style={{ background: '#E8A0BF' }} />
                <div className={`${styles.ringBead} ${styles.b2}`} style={{ background: '#F9F5E3' }} />
                <div className={`${styles.ringBead} ${styles.b3}`} style={{ background: '#99DBB4' }} />
                <div className={`${styles.ringBead} ${styles.b4}`} style={{ background: '#B8C0FF' }} />
                <div className={`${styles.ringBead} ${styles.b5}`} style={{ background: '#FFD3B6' }} />
                <div className={`${styles.ringBead} ${styles.b6}`} style={{ background: '#E8A0BF' }} />
                <div className={`${styles.ringBead} ${styles.b7}`} style={{ background: '#F9F5E3' }} />
                <div className={`${styles.ringBead} ${styles.b8}`} style={{ background: '#99DBB4' }} />
                <div className={`${styles.ringBead} ${styles.b9}`} style={{ background: '#B8C0FF' }} />
                <div className={`${styles.ringBead} ${styles.b10}`} style={{ background: '#FFD3B6' }} />
                <div className={`${styles.ringBead} ${styles.b11}`} style={{ background: '#E8A0BF' }} />
                <div className={`${styles.ringBead} ${styles.b12}`} style={{ background: '#F9F5E3' }} />

                {/* Center charm icon / badge */}
                <div className={styles.centerCharm}>
                  <span className={styles.charmEmoji}>🌸</span>
                </div>
              </div>

              {/* Floating aesthetic tags */}
              <motion.div
                className={styles.floatingTagTop}
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span>100% Pastel Handmade</span>
              </motion.div>

              <motion.div
                className={styles.floatingTagBottom}
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span>✨ Custom Fit Size</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
