import { Header } from '@/shared/components/layout/Header';
import { Footer } from '@/shared/components/layout/Footer';
import { FloatingWhatsApp } from '@/shared/components/ui/FloatingWhatsApp/FloatingWhatsApp';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <FloatingWhatsApp />
      <Footer />
    </>
  );
}
