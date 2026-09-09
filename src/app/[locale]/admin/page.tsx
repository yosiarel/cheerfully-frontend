import { setRequestLocale } from "next-intl/server";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Selamat datang di admin panel Cheerfully.</p>
    </div>
  );
}
