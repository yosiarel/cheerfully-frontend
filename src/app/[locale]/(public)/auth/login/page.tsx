'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn } from 'lucide-react';
import { swal } from '@/shared/lib/sweetalert';
import { authApi, useAuthStore } from '@/domains/auth';
import styles from './LoginPage.module.css';

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('auth.login');
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await authApi.login(values);
      
      // Authenticate with NextAuth to set the session cookie for middleware
      const nextAuthRes = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (nextAuthRes?.error) {
        throw new Error('Autentikasi sesi gagal.');
      }

      setAuth(res.user, res.accessToken);

      swal.toast(
        locale === 'id' ? `Selamat datang kembali, ${res.user.name}!` : `Welcome back, ${res.user.name}!`,
        'success'
      );

      if (res.user.role === 'ADMIN') {
        router.push(`/${locale}/admin`);
      } else {
        router.push(`/${locale}`);
      }
    } catch (err: any) {
      swal.error('Gagal Masuk', err.message || 'Email atau password salah.');
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
              <label className={styles.label}>{t('passwordLabel')}</label>
              <input
                type="password"
                className={styles.input}
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              <span>{isSubmitting ? 'Memproses...' : t('title')}</span>
            </button>
          </form>

          <div className={styles.footer}>
            <span>{t('noAccount')} </span>
            <Link href={`/${locale}/auth/register`} className={styles.link}>
              {t('registerLink')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
