'use client';

import { HeroSection } from '@/shared/components/home/HeroSection/HeroSection';
import { CategoriesSection } from '@/shared/components/home/CategoriesSection/CategoriesSection';
import { StorySection } from '@/shared/components/home/StorySection/StorySection';
import { TestimonialsSection } from '@/shared/components/home/TestimonialsSection/TestimonialsSection';
import { BlogPreview } from '@/shared/components/home/BlogPreview/BlogPreview';
import { CtaSection } from '@/shared/components/home/CtaSection/CtaSection';
import { ParallaxGallerySection } from '@/shared/components/home/ParallaxGallerySection/ParallaxGallerySection';
import { ImageBreakSection } from '@/shared/components/home/ImageBreakSection/ImageBreakSection';

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <CategoriesSection />
      <ParallaxGallerySection />
      <ImageBreakSection />
      <TestimonialsSection />
      <BlogPreview />
      <CtaSection />
    </>
  );
}
