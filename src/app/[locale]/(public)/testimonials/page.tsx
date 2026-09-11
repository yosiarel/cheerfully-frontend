'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Star, MessageSquarePlus } from 'lucide-react';
import { swal } from '@/shared/lib/sweetalert';
import { api } from '@/shared/lib/api';
import styles from './TestimonialsPage.module.css';

interface TestimonialItem {
  id: string;
  name: string;
  content: string;
  rating: number;
  avatar?: string | null;
  createdAt: string;
}

export default function TestimonialsPage() {
  const locale = useLocale();
  const t = useTranslations('testimonials');

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api
      .get<TestimonialItem[]>('/testimonials')
      .then((res) => setTestimonials(res.data || []))
      .catch(() => setTestimonials([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handleWriteTestimonial = () => {
    swal
      .confirm('Tulis Testimoni', 'Silakan hubungi kami untuk membagikan ulasan Anda!')
      .then(() => {
        // Simple prompt or info
      });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        <div className={styles.topBar}>
          <button type="button" className={styles.writeBtn} onClick={handleWriteTestimonial}>
            <MessageSquarePlus size={18} style={{ display: 'inline', marginRight: '6px' }} />
            {t('writeReview')}
          </button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p>Memuat testimoni...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-clay)' }}>
            <p>Belum ada testimoni.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {testimonials.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.ratingRow}>
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                <p className={styles.content}>"{item.content}"</p>

                <div className={styles.authorRow}>
                  <div className={styles.avatar}>
                    {item.name ? item.name[0].toUpperCase() : 'C'}
                  </div>
                  <span className={styles.authorName}>{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
