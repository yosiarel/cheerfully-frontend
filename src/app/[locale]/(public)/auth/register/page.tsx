'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { swal } from '@/shared/lib/sweetalert';
import { authApi, useAuthStore } from '@/domains/auth';
import styles from './RegisterPage.module.css';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
    email: z.string().email('Format email tidak valid'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('auth.register');
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await authApi.register({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password,
      });

      setAuth(res.user, res.accessToken);

      swal.success(
        locale === 'id' ? 'Pendaftaran Berhasil!' : 'Registration Successful!',
        locale === 'id' ? `Selamat datang di Cheerfully, ${res.user.name}!` : `Welcome to Cheerfully, ${res.user.name}!`
      );

      router.push(`/${locale}`);
    } catch (err: any) {
      swal.error('Gagal Mendaftar', err.message || 'Terjadi kesalahan saat pendaftaran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>{t('title')}</h1>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>{t('nameLabel')}</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Contoh: Budi Santoso"
                {...register('name')}
              />
              {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>{t('emailLabel')}</label>
              <input
                type="email"
                className={styles.input}
                placeholder="nama@email.com"
                {...register('email')}
              />
              {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Nomor Telepon / WA (Opsional)</label>
              <input
                type="text"
                className={styles.input}
                placeholder="081234567890"
                {...register('phone')}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>{t('passwordLabel')}</label>
              <input
                type="password"
                className={styles.input}
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>{t('confirmPasswordLabel')}</label>
              <input
                type="password"
                className={styles.input}
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <span className={styles.errorText}>{errors.confirmPassword.message}</span>
              )}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              <span>{isSubmitting ? 'Memproses...' : t('title')}</span>
            </button>
          </form>

          <div className={styles.footer}>
            <span>{t('hasAccount')} </span>
            <Link href={`/${locale}/auth/login`} className={styles.link}>
              {t('loginLink')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
