'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  ShoppingBag,
  BookOpen,
  HelpCircle,
  MessageCircle,
  Star,
  Shield,
  Truck,
  CreditCard,
} from 'lucide-react';
import styles from './Footer.module.css';

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TwitterIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

export function Footer() {
  const t = useTranslations('common');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href={`/${locale}`} className={styles.brandLogo}>
              <span className={styles.brandLogoIcon}>🎨</span>
              Cheerfully
            </Link>
            <p className={styles.brandDesc}>
              {t('footer.aboutDescription')}
            </p>
            <div className={styles.socialLinks}>
              <Link
                href={`/${locale}/under-development?feature=instagram`}
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </Link>
              <Link
                href={`/${locale}/under-development?feature=twitter`}
                className={styles.socialLink}
                aria-label="Twitter"
              >
                <TwitterIcon size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{t('footer.quickLinks')}</h3>
            <Link href={`/${locale}/shop`} className={styles.columnLink}>
              <ShoppingBag size={14} />
              {t('nav.shop')}
            </Link>
            <Link href={`/${locale}/blog`} className={styles.columnLink}>
              <BookOpen size={14} />
              {t('nav.blog')}
            </Link>
            <Link href={`/${locale}/testimonials`} className={styles.columnLink}>
              <Star size={14} />
              {t('nav.testimonials')}
            </Link>
            <Link href={`/${locale}/faq`} className={styles.columnLink}>
              <HelpCircle size={14} />
              {t('nav.faq')}
            </Link>
          </div>

          {/* Customer Service */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{t('footer.customerService')}</h3>
            <Link href={`/${locale}/contact`} className={styles.columnLink}>
              <MessageCircle size={14} />
              {t('nav.contact')}
            </Link>
            <Link href={`/${locale}/under-development?feature=shipping`} className={styles.columnLink}>
              <Truck size={14} />
              {t('footer.shipping')}
            </Link>
            <Link href={`/${locale}/under-development?feature=payment`} className={styles.columnLink}>
              <CreditCard size={14} />
              {t('footer.payment')}
            </Link>
            <Link href={`/${locale}/under-development?feature=privacy`} className={styles.columnLink}>
              <Shield size={14} />
              {t('footer.privacy')}
            </Link>
          </div>

          {/* Follow Us */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{t('footer.followUs')}</h3>
            <Link
              href={`/${locale}/under-development?feature=instagram`}
              className={styles.columnLink}
            >
              <InstagramIcon size={14} />
              Instagram
            </Link>
            <Link
              href={`/${locale}/under-development?feature=twitter`}
              className={styles.columnLink}
            >
              <TwitterIcon size={14} />
              Twitter / X
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            {t('footer.copyright', { year: currentYear })}
          </p>
          <p className={styles.tagline}>{t('footer.tagline')}</p>
        </div>
      </div>
    </footer>
  );
}
