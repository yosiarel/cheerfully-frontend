'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingBag, Package, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './HomeHero.module.css';

interface HomeHeroProps {
  userName: string;
}

export function HomeHero({ userName }: HomeHeroProps) {
  const t = useTranslations('home.loggedIn');
  const locale = useLocale();

  const firstName = userName.split(' ')[0] || '';

  const quickActions = [
    {
      icon: ShoppingBag,
      label: t.has('actions.shop') ? t('actions.shop') : 'Belanja',
      href: `/${locale}/shop`,
      color: '#E8A0BF',
    },
    {
      icon: Package,
      label: t.has('actions.orders') ? t('actions.orders') : 'Pesanan Saya',
      href: `/${locale}/profile/orders`,
      color: '#99DBB4',
    },
    {
      icon: Heart,
      label: t.has('actions.wishlist') ? t('actions.wishlist') : 'Wishlist',
      href: `/${locale}/shop`,
      color: '#B8C0FF',
    },
  ];

  return (
    <section className={styles.section} id="home-hero">
      <div className={styles.container}>
        <motion.div
          className={styles.greetingBlock}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.wave}>🌸</span>
          <h1 className={styles.greeting}>
            {t.has('greeting') ? t('greeting', { name: firstName }) : `Hai, ${firstName}!`}
          </h1>
          <p className={styles.subtitle}>
            {t.has('subtitle') ? t('subtitle') : 'Mau cari apa hari ini?'}
          </p>
        </motion.div>

        <motion.div
          className={styles.quickActions}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {quickActions.map((action) => (
            <Link
              key={action.href + action.label}
              href={action.href}
              className={styles.actionCard}
            >
              <div
                className={styles.actionIcon}
                style={{ backgroundColor: `${action.color}22`, color: action.color }}
              >
                <action.icon size={22} />
              </div>
              <span className={styles.actionLabel}>{action.label}</span>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
