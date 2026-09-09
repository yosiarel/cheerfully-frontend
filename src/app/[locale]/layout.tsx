import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/config";
import { AuthProvider } from "@/shared/components/providers/AuthProvider";
import "@/shared/styles/globals.css";

export const metadata: Metadata = {
  title: "Cheerfully — Kerajinan Manik-Manik Handmade",
  description:
    "Temukan keindahan kerajinan manik-manik handmade yang unik dan penuh warna. Gelang, kalung, anting, dan cincin dari Cheerfully.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <AuthProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
