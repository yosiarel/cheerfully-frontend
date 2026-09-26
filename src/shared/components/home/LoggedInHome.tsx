'use client';

import { useSession } from 'next-auth/react';
import { HomeHero } from '@/shared/components/home/HomeHero/HomeHero';
import { CategoriesSection } from '@/shared/components/home/CategoriesSection/CategoriesSection';
import { FeaturedProducts } from '@/shared/components/home/FeaturedProducts/FeaturedProducts';
import { NewArrivals } from '@/shared/components/home/NewArrivals/NewArrivals';
import { OrderStatus } from '@/shared/components/home/OrderStatus/OrderStatus';
import { BlogPreview } from '@/shared/components/home/BlogPreview/BlogPreview';
import { CtaSection } from '@/shared/components/home/CtaSection/CtaSection';

export function LoggedInHome() {
  const { data: session } = useSession();
  const userName = session?.user?.name || '';

  return (
    <>
      <HomeHero userName={userName} />
      <CategoriesSection variant="compact" />
      <FeaturedProducts />
      <NewArrivals />
      <OrderStatus />
      <BlogPreview />
      <CtaSection variant="personal" />
    </>
  );
}
