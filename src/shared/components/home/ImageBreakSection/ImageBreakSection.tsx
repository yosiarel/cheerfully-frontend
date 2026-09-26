'use client';

import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { BlurText } from '@/shared/components/ui/BlurText/BlurText';
import styles from './ImageBreakSection.module.css';

export function ImageBreakSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Top Right Text (BE BOLD) moves up 
  const textTopY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  
  // Hand moves slowly
  const handY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Bottom Left Text (BE CHEERFULLY) moves up faster for parallax depth
  const textBottomY = useTransform(scrollYProgress, [0, 1], [250, -250]);

  return (
    <section className={styles.section} ref={containerRef}>
      
      {/* 1. LAYER BACKGROUND: BE BOLD (Top Right) */}
      <motion.div className={styles.boldTextWrap} style={{ y: textTopY }}>
        <h2 className={styles.typography}>
          <BlurText
            text="Be Bold."
            delay={100}
            animateBy="letters"
            direction="bottom"
            className={styles.boldText}
          />
        </h2>
      </motion.div>

      {/* 2. LAYER TENGAH: LENGAN & GELANG */}
      <motion.div className={styles.handWrap} style={{ y: handY }}>
        <img 
          src="https://res.cloudinary.com/dznn7frej/image/upload/v1790430438/hands_bgspmb.png" 
          alt="Hand wearing Cheerfully bracelets" 
          className={styles.handImage}
        />
      </motion.div>

      {/* 3. LAYER DEPAN: BE CHEERFULLY (Bottom Left, Menutupi lengan dengan outline) */}
      <motion.div className={styles.brandTextWrap} style={{ y: textBottomY }}>
        <h2 className={styles.typography}>
          <BlurText
            text="Be Cheerfully."
            delay={120}
            animateBy="letters"
            direction="bottom"
            className={styles.brandText}
          />
        </h2>
      </motion.div>

    </section>
  );
}
