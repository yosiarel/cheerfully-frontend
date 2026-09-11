'use client';

import { useTranslations } from 'next-intl';
import { Hand, Gem, Sparkles } from 'lucide-react';
import styles from './WhyUsSection.module.css';

/**
 * Icon choices (R-04 compliance):
 * - Hand: literally represents "handmade"
 * - Gem: literally represents "quality beads/gems"
 * - Sparkles: represents "unique, one-of-a-kind" designs
 */
const USP_ITEMS = [
  { key: 'handmade', Icon: Hand,     iconClass: 'iconHandmade' },
  { key: 'quality',  Icon: Gem,      iconClass: 'iconQuality' },
  { key: 'unique',   Icon: Sparkles, iconClass: 'iconUnique' },
] as const;

export function WhyUsSection() {
  const t = useTranslations('home.whyUs');

  return (
    <section className={styles.section} id="why-cheerfully">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>{t('title')}</h2>

        <div className={styles.items}>
          {USP_ITEMS.map((usp) => (
            <div key={usp.key} className={styles.item}>
              <div className={`${styles.iconWrap} ${styles[usp.iconClass]}`}>
                <usp.Icon size={28} />
              </div>
              <div className={styles.textWrap}>
                <h3 className={styles.itemTitle}>{t(`${usp.key}.title`)}</h3>
                <p className={styles.itemDesc}>{t(`${usp.key}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
