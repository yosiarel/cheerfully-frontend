'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { HeroParallax, Product as ParallaxProduct } from '@/shared/components/ui/HeroParallax/HeroParallax';
import { api } from '@/shared/lib/api';

export function ParallaxGallerySection() {
  const locale = useLocale();
  const t = useTranslations('home.featured');
  const [parallaxProducts, setParallaxProducts] = useState<ParallaxProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchGallery() {
      try {
        // Fetch more products for the parallax effect (it looks best with 10-15)
        const res = await api.get<any[]>('/products?limit=15');
        if (!cancelled && res.success) {
          const formatted: ParallaxProduct[] = res.data.map(p => ({
            title: locale === 'id' ? p.nameId : p.nameEn,
            link: `/${locale}/shop/${p.slug}`,
            thumbnail: p.images?.[0] || 'https://via.placeholder.com/600',
          }));
          
          // If we don't have enough products, duplicate them to fill the rows
          let finalProducts = [...formatted];
          while (finalProducts.length > 0 && finalProducts.length < 10) {
            finalProducts = [...finalProducts, ...formatted];
          }
          
          setParallaxProducts(finalProducts.slice(0, 15));
        }
      } catch (err) {
        console.warn('Failed to fetch gallery products:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchGallery();
    return () => { cancelled = true; };
  }, [locale]);

  if (loading || parallaxProducts.length === 0) {
    return null; // Or a skeleton if needed
  }

  return (
    <section id="gallery">
      <HeroParallax 
        products={parallaxProducts}
        headerTitle={t.has('title') ? t('title') : 'Karya Unggulan Kami'}
        headerSubtitle={t.has('subtitle') ? t('subtitle') : 'Setiap gelang adalah cerita. Temukan inspirasi dari koleksi manik-manik pastel terbaik kami yang dirangkai khusus untuk memancarkan kebahagiaan.'}
      />
    </section>
  );
}
