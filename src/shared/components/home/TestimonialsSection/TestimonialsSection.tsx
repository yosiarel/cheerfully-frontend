'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { api } from '@/shared/lib/api';
import styles from './TestimonialsSection.module.css';

interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  avatar: string | null;
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

export function TestimonialsSection() {
  const t = useTranslations('home.testimonials');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

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

  // R-18: No testimonials section if no real data
  if (!loading && testimonials.length === 0) {
    return null;
  }

  const testimonial = testimonials[current];
  const hasPrev = current > 0;
  const hasNext = current < testimonials.length - 1;

  return (
    <section className={styles.section} id="testimonials">
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>{t('title')}</h2>

        {loading ? (
          <div className={styles.skeletonCard}>
            <div className={`${styles.skeletonLine} ${styles.skeletonLineFull}`} />
            <div className={`${styles.skeletonLine} ${styles.skeletonLineFull}`} />
            <div className={`${styles.skeletonLine} ${styles.skeletonLineMed}`} />
            <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
          </div>
        ) : testimonial ? (
          <>
            <div className={styles.spotlightCard}>
              <span className={styles.quoteIcon} aria-hidden="true">&ldquo;</span>

              <p className={styles.testimonialText}>
                {testimonial.content}
              </p>

              <div className={styles.stars} aria-label={`${testimonial.rating} stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < testimonial.rating ? 'currentColor' : 'none'}
                    strokeWidth={i < testimonial.rating ? 0 : 1.5}
                  />
                ))}
              </div>

              <div className={styles.avatar}>
                {getInitial(testimonial.name)}
              </div>

              <p className={styles.authorName}>{testimonial.name}</p>
            </div>

            {testimonials.length > 1 && (
              <div className={styles.navRow}>
                <button
                  className={styles.navBtn}
                  onClick={() => setCurrent((c) => c - 1)}
                  disabled={!hasPrev}
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className={styles.dots}>
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                      onClick={() => setCurrent(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  className={styles.navBtn}
                  onClick={() => setCurrent((c) => c + 1)}
                  disabled={!hasNext}
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
}
