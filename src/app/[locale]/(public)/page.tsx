import { setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div style={{ minHeight: '60vh', padding: 'var(--space-16) var(--space-8)', textAlign: 'center' }}>
      <h1>🎨 Cheerfully</h1>
      <p>Kerajinan Manik-Manik Handmade</p>
    </div>
  );
}
