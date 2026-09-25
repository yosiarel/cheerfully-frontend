'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { api } from '@/shared/lib/api';
import styles from './FaqPage.module.css';

interface FAQItem {
  id: string;
  questionId: string;
  questionEn: string;
  answerId: string;
  answerEn: string;
  order: number;
}

export default function FAQPage() {
  const locale = useLocale();
  const t = useTranslations('faq');

  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api
      .get<FAQItem[]>('/faq')
      .then((res) => {
        const list = res.data || [];
        setFaqs(list);
        if (list.length > 0) {
          setOpenId(list[0].id);
        }
      })
      .catch(() => setFaqs([]))
      .finally(() => setIsLoading(false));
  }, []);

  const toggleOpen = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p>{t('loading')}</p>
          </div>
        ) : faqs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-clay)' }}>
            <p>{t('empty')}</p>
          </div>
        ) : (
          <div className={styles.accordionList}>
            {faqs.map((faq) => {
              const question = locale === 'id' ? faq.questionId : faq.questionEn;
              const answer = locale === 'id' ? faq.answerId : faq.answerEn;
              const isOpen = openId === faq.id;

              return (
                <div key={faq.id} className={styles.accordionCard}>
                  <button
                    type="button"
                    className={styles.accordionHeader}
                    onClick={() => toggleOpen(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span>{question}</span>
                    <ChevronDown
                      size={20}
                      className={`${styles.accordionIcon} ${isOpen ? styles.openIcon : ''}`}
                    />
                  </button>

                  {isOpen && <div className={styles.accordionContent}>{answer}</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
