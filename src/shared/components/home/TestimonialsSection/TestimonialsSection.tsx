'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Star, MessageCircle, Move } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/shared/lib/api';
import styles from './TestimonialsSection.module.css';

interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  avatar: string | null;
}

const PASTEL_BUBBLE_THEMES = [
  { bg: '#FFF0F5', border: '#E8A0BF', avatarBg: '#E8A0BF', avatarColor: '#FFF' },
  { bg: '#F0F4FF', border: '#7BA0FF', avatarBg: '#7BA0FF', avatarColor: '#FFF' },
  { bg: '#F0FAF5', border: '#52C498', avatarBg: '#52C498', avatarColor: '#FFF' },
  { bg: '#FFF9E6', border: '#FFD166', avatarBg: '#FFD166', avatarColor: '#5C4300' },
  { bg: '#F8F0FF', border: '#B088E0', avatarBg: '#B088E0', avatarColor: '#FFF' },
  { bg: '#FFF0EA', border: '#FF9F1C', avatarBg: '#FF9F1C', avatarColor: '#FFF' },
  { bg: '#F0F8FF', border: '#4EA8DE', avatarBg: '#4EA8DE', avatarColor: '#FFF' },
];

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

import { ScrollFloat } from '@/shared/components/ui/ScrollFloat/ScrollFloat';

export function TestimonialsSection() {
  const t = useTranslations('home.testimonials');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [highestZIndex, setHighestZIndex] = useState(10);
  const [zIndexes, setZIndexes] = useState<Record<string, number>>({});
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchTestimonials() {
      try {
        const res = await api.get<Testimonial[]>('/testimonials');
        if (!cancelled && res.success) {
          setTestimonials(res.data);
        }
      } catch (err) {
        console.warn('Failed to fetch testimonials:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTestimonials();
    return () => { cancelled = true; };
  }, []);

  const handleCardClick = (id: string) => {
    setHighestZIndex((prev) => prev + 1);
    setZIndexes((prev) => ({ ...prev, [id]: highestZIndex + 1 }));
  };

  if (!loading && testimonials.length === 0) {
    return null;
  }

  // Pre-calculated scattered positions based on index (simulating random but fixed for SSR matching)
  const getBubblePosition = (index: number) => {
    if (windowWidth < 768) {
      // Mobile: Cluster at the top and bottom to leave the center text clear
      const mobilePositions = [
        { top: '5%', left: '5%' },
        { top: '15%', right: '5%' },
        { top: '25%', left: '10%' },
        { bottom: '25%', right: '5%' },
        { bottom: '15%', left: '5%' },
        { bottom: '5%', right: '10%' },
      ];
      return mobilePositions[index % mobilePositions.length];
    }
    
    // Desktop: Scattered around the center
    const positions = [
      { top: '15%', left: '10%' },
      { top: '20%', right: '15%' },
      { bottom: '25%', left: '15%' },
      { bottom: '20%', right: '10%' },
      { top: '40%', left: '5%' },
      { top: '45%', right: '5%' },
    ];
    return positions[index % positions.length];
  };

  return (
    <section className={styles.section} id="testimonials">
      <div className={styles.header}>
        <ScrollFloat
          animationDuration={1}
          ease="back.out(1.5)"
          scrollStart="top center+=20%"
          scrollEnd="bottom center-=20%"
          stagger={0.04}
        >
          {t.has('title') ? t('title') : 'Cerita Pelanggan'}
        </ScrollFloat>
        
        <motion.div 
          className={styles.dragHint}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Move size={14} className={styles.dragHintIcon} />
          <span>{t.has('dragHint') ? t('dragHint') : 'Geser chat ini'}</span>
        </motion.div>
      </div>

      <div className={styles.container}>
        <div className={styles.playgroundCanvas} ref={containerRef}>
          {!loading && testimonials.map((item, index) => {
            const theme = PASTEL_BUBBLE_THEMES[index % PASTEL_BUBBLE_THEMES.length];
            const pos = getBubblePosition(index);
            
            return (
              <motion.div
                key={item.id}
                className={styles.chatBubble}
                drag
                dragConstraints={containerRef}
                dragElastic={0.15}
                dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 1.06, cursor: 'grabbing' }}
                onPointerDown={() => handleCardClick(item.id)}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, margin: '-50px' }}
                transition={{ 
                  delay: index * 0.15 + 0.2, 
                  duration: 0.6,
                  ease: [0.34, 1.56, 0.64, 1] as const 
                }}
                style={{
                  backgroundColor: theme.bg,
                  borderColor: theme.border,
                  zIndex: zIndexes[item.id] || index,
                  ...pos
                }}
              >
                <div className={styles.bubbleHeader}>
                  <div 
                    className={styles.avatar} 
                    style={{ backgroundColor: theme.avatarBg, color: theme.avatarColor }}
                  >
                    {getInitial(item.name)}
                  </div>
                  
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName}>{item.name}</span>
                    <div className={styles.stars}>
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <Star key={i} size={13} fill="#FFD166" stroke="none" />
                      ))}
                    </div>
                  </div>

                  <MessageCircle size={16} className={styles.chatIcon} style={{ color: theme.border }} />
                </div>

                <p className={styles.bubbleText}>
                  &ldquo;{item.content}&rdquo;
                </p>

                <div 
                  className={styles.bubbleTail} 
                  style={{ borderTopColor: theme.bg, borderLeftColor: 'transparent' }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
