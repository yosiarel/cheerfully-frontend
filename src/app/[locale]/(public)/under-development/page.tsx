'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, Sparkles, Wrench } from 'lucide-react';
import { LottieAnimation } from '@/shared/components/ui/LottieAnimation/LottieAnimation';
import styles from './under-development.module.css';

export default function UnderDevelopmentPage() {
  const t = useTranslations('underDevelopment');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const featureParam = searchParams.get('feature');

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.badge}>
          <Wrench size={14} className={styles.badgeIcon} />
          <span>{t('badge')}</span>
        </div>

        <div className={styles.lottieContainer}>
          <LottieAnimation type="LOADER" width="100%" height="100%" />
        </div>

        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>

        {featureParam && (
          <div className={styles.featureBox}>
            {t('description', { feature: featureParam })}
          </div>
        )}

        <Link href={`/${locale}`} className={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>{t('backHome')}</span>
        </Link>
      </div>
    </div>
  );
}
