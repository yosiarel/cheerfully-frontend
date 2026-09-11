import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/shared/components/home/HeroSection/HeroSection";
import { CategoriesSection } from "@/shared/components/home/CategoriesSection/CategoriesSection";
import { WhyUsSection } from "@/shared/components/home/WhyUsSection/WhyUsSection";
import { FeaturedProducts } from "@/shared/components/home/FeaturedProducts/FeaturedProducts";
import { TestimonialsSection } from "@/shared/components/home/TestimonialsSection/TestimonialsSection";
import { BlogPreview } from "@/shared/components/home/BlogPreview/BlogPreview";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <WhyUsSection />
      <FeaturedProducts />
      <TestimonialsSection />
      <BlogPreview />
    </>
  );
}
