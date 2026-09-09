'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  BookOpen,
  Users,
  Star,
  HelpCircle,
  Inbox,
  Settings,
  Menu,
  X,
  LogOut,
  Home,
  Upload,
} from 'lucide-react';
import styles from './AdminSidebar.module.css';

interface AdminMenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface AdminMenuSection {
  title: string;
  items: AdminMenuItem[];
}

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const prefix = `/${locale}/admin`;

  const menuSections: AdminMenuSection[] = [
    {
      title: 'Menu Utama',
      items: [
        { label: 'Dashboard', href: prefix, icon: <LayoutDashboard size={18} /> },
        { label: 'Produk', href: `${prefix}/products`, icon: <ShoppingBag size={18} /> },
        { label: 'Pesanan', href: `${prefix}/orders`, icon: <Package size={18} /> },
        { label: 'Blog', href: `${prefix}/blog`, icon: <BookOpen size={18} /> },
      ],
    },
    {
      title: 'Manajemen',
      items: [
        { label: 'Pengguna', href: `${prefix}/users`, icon: <Users size={18} /> },
        { label: 'Testimoni', href: `${prefix}/testimonials`, icon: <Star size={18} /> },
        { label: 'FAQ', href: `${prefix}/faq`, icon: <HelpCircle size={18} /> },
        { label: 'Pesan', href: `${prefix}/messages`, icon: <Inbox size={18} /> },
      ],
    },
    {
      title: 'Sistem',
      items: [
        { label: 'Pengaturan', href: `${prefix}/settings`, icon: <Settings size={18} /> },
        { label: 'Upload', href: `${prefix}/upload`, icon: <Upload size={18} /> },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === prefix) return pathname === prefix;
    return pathname.startsWith(href);
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  const userName = session?.user?.name || 'Admin';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href={`/${locale}`} className={styles.sidebarLogo}>
            <span className={styles.sidebarLogoIcon}>🎨</span>
            Cheerfully
          </Link>
          <button
            className={styles.sidebarClose}
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className={styles.sidebarNav} aria-label="Admin navigation">
          {menuSections.map((section) => (
            <div key={section.title} className={styles.sidebarSection}>
              <p className={styles.sidebarSectionTitle}>{section.title}</p>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.sidebarLink} ${isActive(item.href) ? styles.active : ''}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.sidebarUser}>
            <div className={styles.sidebarAvatar}>{userInitial}</div>
            <div className={styles.sidebarUserInfo}>
              <p className={styles.sidebarUserName}>{userName}</p>
              <p className={styles.sidebarUserRole}>Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button
              className={styles.menuToggle}
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
          </div>
          <div className={styles.topBarRight}>
            <Link
              href={`/${locale}`}
              className={styles.menuToggle}
              aria-label="Back to site"
              style={{ display: 'flex' }}
            >
              <Home size={20} />
            </Link>
            <button
              className={styles.menuToggle}
              onClick={() => signOut()}
              aria-label="Sign out"
              style={{ display: 'flex' }}
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
