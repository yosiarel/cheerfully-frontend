'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import {
  ShoppingCart,
  User,
  Globe,
  Menu,
  X,
  Home,
  ShoppingBag,
  BookOpen,
  HelpCircle,
  MessageCircle,
  Star,
  LayoutDashboard,
  LogOut,
  UserCircle,
  Package,
} from 'lucide-react';
import styles from './Header.module.css';

import { useCartStore } from '@/domains/shop/store/cartStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function Header() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navItems: NavItem[] = [
    { label: t('nav.home'), href: `/${locale}`, icon: <Home size={18} /> },
    { label: t('nav.shop'), href: `/${locale}/shop`, icon: <ShoppingBag size={18} /> },
    { label: t('nav.blog'), href: `/${locale}/blog`, icon: <BookOpen size={18} /> },
    { label: t('nav.testimonials'), href: `/${locale}/testimonials`, icon: <Star size={18} /> },
    { label: t('nav.faq'), href: `/${locale}/faq`, icon: <HelpCircle size={18} /> },
    { label: t('nav.contact'), href: `/${locale}/contact`, icon: <MessageCircle size={18} /> },
  ];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}`;
    return pathname.startsWith(href);
  };

  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    window.location.href = `/${newLocale}${pathWithoutLocale}`;
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href={`/${locale}`} className={styles.logo}>
          <span className={styles.logoIcon}>🎨</span>
          Cheerfully
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Language Switcher */}
          <div className={styles.langSwitcher} ref={langRef}>
            <button
              className={styles.langBtn}
              onClick={() => setIsLangOpen(!isLangOpen)}
              aria-label={t('language.switch')}
              aria-expanded={isLangOpen}
            >
              <Globe size={16} />
              {locale.toUpperCase()}
            </button>
            {isLangOpen && (
              <div className={styles.langDropdown}>
                <button
                  className={`${styles.langOption} ${locale === 'id' ? styles.activeLang : ''}`}
                  onClick={() => { switchLocale('id'); setIsLangOpen(false); }}
                >
                  🇮🇩 {t('language.id')}
                </button>
                <button
                  className={`${styles.langOption} ${locale === 'en' ? styles.activeLang : ''}`}
                  onClick={() => { switchLocale('en'); setIsLangOpen(false); }}
                >
                  🇬🇧 {t('language.en')}
                </button>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link href={`/${locale}/cart`} className={styles.iconBtn} aria-label={t('nav.cart')}>
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className={styles.cartBadge} aria-live="polite">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          {session ? (
            <div className={styles.userMenu} ref={userRef}>
              <button
                className={styles.iconBtn}
                onClick={() => setIsUserOpen(!isUserOpen)}
                aria-label={t('nav.profile')}
                aria-expanded={isUserOpen}
              >
                <User size={20} />
              </button>
              {isUserOpen && (
                <div className={styles.userDropdown}>
                  <Link
                    href={`/${locale}/profile`}
                    className={styles.userDropdownLink}
                    onClick={() => setIsUserOpen(false)}
                  >
                    <UserCircle size={16} />
                    {t('nav.profile')}
                  </Link>
                  <Link
                    href={`/${locale}/profile/orders`}
                    className={styles.userDropdownLink}
                    onClick={() => setIsUserOpen(false)}
                  >
                    <Package size={16} />
                    Pesanan
                  </Link>
                  {(session.user as any)?.role === 'ADMIN' && (
                    <Link
                      href={`/${locale}/admin`}
                      className={styles.userDropdownLink}
                      onClick={() => setIsUserOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      {t('nav.admin')}
                    </Link>
                  )}
                  <div className={styles.userDropdownDivider} />
                  <button
                    className={`${styles.userDropdownLink} ${styles.danger}`}
                    onClick={() => signOut()}
                  >
                    <LogOut size={16} />
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href={`/${locale}/auth/login`} className={styles.iconBtn} aria-label={t('nav.login')}>
              <User size={20} />
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className={styles.menuBtn}
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={isDrawerOpen}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <>
          <div className={styles.overlay} onClick={() => setIsDrawerOpen(false)} />
          <aside className={styles.drawer} role="dialog" aria-modal="true">
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Menu</span>
              <button
                className={styles.drawerClose}
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className={styles.drawerNav} aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.drawerLink} ${isActive(item.href) ? styles.active : ''}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
            {session && (
              <div className={styles.drawerFooter}>
                <button
                  className={`${styles.drawerLink} ${styles.danger}`}
                  onClick={() => signOut()}
                  style={{ width: '100%' }}
                >
                  <LogOut size={18} />
                  {t('nav.logout')}
                </button>
              </div>
            )}
          </aside>
        </>
      )}
    </header>
  );
}
