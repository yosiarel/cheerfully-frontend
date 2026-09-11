'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingBag } from 'lucide-react';
import { LottieAnimation } from '@/shared/components/ui/LottieAnimation/LottieAnimation';
import { FloatingBeads } from './FloatingBeads';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const t = useTranslations('home.hero');
  const locale = useLocale();

  return (
    <section className={styles.hero} id="hero">
      <FloatingBeads />

      <div className={styles.heroInner}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleAccent}>Cheerfully</span>
            <br />
            {t('title')}
          </h1>

          <p className={styles.heroSubtitle}>
            {t('subtitle')}
          </p>

          <Link href={`/${locale}/shop`} className={styles.heroCta}>
            <ShoppingBag size={20} />
            {t('cta')}
          </Link>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.lottieWrap}>
            <LottieAnimation type="LOADER" />
          </div>
        </div>
      </div>
    </section>
  );
}
