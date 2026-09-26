'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import styles from './CraftSection.module.css';

const CRAFT_STEPS = [
  {
    step: 1,
    emoji: '🎨',
    colorFill: '#E8A0BF',
  },
  {
    step: 2,
    emoji: '📿',
    colorFill: '#99DBB4',
  },
  {
    step: 3,
    emoji: '✨',
    colorFill: '#B8C0FF',
  },
  {
    step: 4,
    emoji: '🎁',
    colorFill: '#FFD3B6',
  },
];

export function CraftSection() {
  const t = useTranslations('home.craft');

  const steps = CRAFT_STEPS.map((s, i) => ({
    ...s,
    title: t.has(`steps.${i}.title`) ? t(`steps.${i}.title`) : ['Pilih Manik', 'Rangkai', 'Finishing', 'Siap Pakai'][i],
    desc: t.has(`steps.${i}.desc`) ? t(`steps.${i}.desc`) : [
      'Pilih warna dan bentuk manik-manik favoritmu dari koleksi kami',
      'Tiap manik dirangkai satu per satu dengan penuh ketelitian',
      'Kunci, poles, dan pastikan setiap detail sempurna',
      'Gelangmu siap menemani hari-harimu!',
    ][i],
  }));

  return (
    <section className={styles.section} id="craft">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {t.has('title') ? t('title') : 'Dibuat dengan Cinta'}
          </h2>
          <p className={styles.subtitle}>
            {t.has('subtitle') ? t('subtitle') : 'Setiap gelang Cheerfully dibuat tangan, satu per satu. Begini prosesnya.'}
          </p>
        </div>

        <div className={styles.timeline}>
          {/* Thread line connecting steps */}
          <div className={styles.threadLine} />

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              className={styles.stepCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                delay: index * 0.12,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Bead node on the thread */}
              <div
                className={styles.beadNode}
                style={{ backgroundColor: step.colorFill }}
              >
                <span className={styles.beadEmoji}>{step.emoji}</span>
              </div>

              {/* Illustration placeholder */}
              <div
                className={styles.illustration}
                style={{ backgroundColor: `${step.colorFill}22` }}
              >
                <div
                  className={styles.illustrationInner}
                  style={{ backgroundColor: `${step.colorFill}33` }}
                >
                  <span className={styles.illustrationEmoji}>{step.emoji}</span>
                </div>
              </div>

              {/* Text content */}
              <div className={styles.stepContent}>
                <span
                  className={styles.stepNumber}
                  style={{ color: step.colorFill }}
                >
                  0{step.step}
                </span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
