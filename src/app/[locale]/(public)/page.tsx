import { setRequestLocale } from "next-intl/server";
import { HomeSwitch } from "@/shared/components/home/HomeSwitch";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeSwitch />;
}
