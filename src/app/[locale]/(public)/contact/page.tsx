'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatters';
import { swal } from '@/shared/lib/sweetalert';
import { api } from '@/shared/lib/api';
import styles from './ContactPage.module.css';

const contactSchema = z.object({
  name: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  subject: z.string().min(3, 'Subjek minimal 3 karakter'),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const locale = useLocale();
  const t = useTranslations('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await api.post('/contact', values);
      swal.success(
        locale === 'id' ? 'Pesan Terkirim!' : 'Message Sent!',
        t('success')
      );
      reset();
    } catch (err: any) {
      swal.error('Gagal Mengirim Pesan', err.message || 'Terjadi kesalahan pada server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>

        <div className={styles.layout}>
          {/* Store Info */}
          <aside className={styles.infoCard}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <MapPin size={22} />
              </div>
              <div>
                <h2 className={styles.infoTitle}>Alamat Galeri</h2>
                <p className={styles.infoText}>
                  Jl. Manik Pastel No. 88, Kota Bandung, Jawa Barat 40123
                </p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <Phone size={22} />
              </div>
              <div>
                <h2 className={styles.infoTitle}>WhatsApp / Telepon</h2>
                <p className={styles.infoText}>+62 812-3456-7890</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <Mail size={22} />
              </div>
              <div>
                <h2 className={styles.infoTitle}>Email Pertanyaan</h2>
                <p className={styles.infoText}>hello@cheerfully.store</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <Clock size={22} />
              </div>
              <div>
                <h2 className={styles.infoTitle}>Jam Operasional</h2>
                <p className={styles.infoText}>
                  Senin - Sabtu: 09:00 - 17:00 WIB<br />
                  Minggu & Hari Libur: Tutup
                </p>
              </div>
            </div>
          </aside>

          {/* Form */}
          <main className={styles.formCard}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>{t('form.name')} *</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Contoh: Budi Santoso"
                  {...register('name')}
                />
                {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>{t('form.email')} *</label>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="budi@email.com"
                  {...register('email')}
                />
                {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>{t('form.subject')} *</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Tanya Ukuran / Custom Order / Pengiriman"
                  {...register('subject')}
                />
                {errors.subject && <span className={styles.errorText}>{errors.subject.message}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>{t('form.message')} *</label>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Tuliskan pertanyaan atau kendala kamu di sini..."
                  {...register('message')}
                />
                {errors.message && <span className={styles.errorText}>{errors.message.message}</span>}
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                <Send size={18} />
                <span>{isSubmitting ? 'Mengirim...' : t('form.send')}</span>
              </button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
