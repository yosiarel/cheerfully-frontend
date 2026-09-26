'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Particles } from '@/shared/components/ui/Particles/Particles';
import styles from './HeroSection.module.css';

const BEAD_COLORS = ['#E8A0BF', '#B4D4EE', '#FFD966', '#B5EAD7', '#C3AED6'];

export function HeroSection() {
  const t = useTranslations('home.hero');
  const locale = useLocale();

  return (
    <section className={styles.hero} id="hero">
      
      <div className={styles.particlesContainer}>
        <Particles
          particleColors={BEAD_COLORS}
          particleCount={5000} /* SUPER crowded as requested */
          particleSpread={15}
          speed={0.15}
          particleBaseSize={80} /* Slightly smaller base size so 5000 particles don't completely blind the screen */
          moveParticlesOnHover={true}
          particleHoverFactor={2}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Floating Badges */}
      <motion.div
        className={`${styles.floatingBadge} ${styles.badgeTopLeft}`}
        animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        ✨ Handmade
      </motion.div>
      <motion.div
        className={`${styles.floatingBadge} ${styles.badgeTopRight}`}
        animate={{ y: [5, -5, 5], rotate: [2, -2, 2] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        🌸 Pastel Aesthetic
      </motion.div>
      <motion.div
        className={`${styles.floatingBadge} ${styles.badgeBottomLeft}`}
        animate={{ y: [-4, 4, -4], rotate: [1, -1, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        💖 Custom Size
      </motion.div>
      <motion.div
        className={`${styles.floatingBadge} ${styles.badgeBottomRight}`}
        animate={{ y: [4, -4, 4], rotate: [-1, 1, -1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        🎨 Claymorphism
      </motion.div>

      <div className={styles.heroInner}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles size={14} className={styles.badgeIcon} />
            <span>{t('badge')}</span>
          </motion.div>

          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleAccent}>Cheerfully</span>
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
      </div>
    </section>
  );
}
