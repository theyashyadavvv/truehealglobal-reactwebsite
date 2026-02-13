import { Suspense, lazy } from 'react';
import ScrollExpandHero from '../components/ScrollExpandHero';
import BannerCarousel from '../components/home/BannerCarousel';
import HeroScroll from '../components/home/HeroScroll';
import CategoryGrid from '../components/home/CategoryGrid';
import PopularStores from '../components/home/PopularStores';
import Logos3 from '../components/Logos3';
import { useBrands } from '../hooks/useDataHooks';
import LoadingSpinner from '../components/LoadingSpinner'; // Assuming this exists or use fallback

// Lazy load below-the-fold components
// const FeaturedProducts = lazy(() => import('../components/home/FeaturedProducts'));
const CategoryHighlights = lazy(() => import('../components/home/CategoryHighlights'));
const ScienceBenefits = lazy(() => import('../components/home/ScienceBenefits'));
const Testimonials = lazy(() => import('../components/home/Testimonials'));
const FAQPreview = lazy(() => import('../components/home/FAQPreview'));
const CTASection = lazy(() => import('../components/home/CTASection'));

export default function HomePage() {
    const { data: brandsData } = useBrands();
    const brandsList = (brandsData?.brands || brandsData || []);

    return (
        <main>
            <BannerCarousel />
            <HeroScroll />
            <CategoryGrid />
            <PopularStores />

            {brandsList.length > 0 && (
                <Logos3
                    heading="Brands We Work With"
                    logos={brandsList.map(b => ({
                        id: b.id,
                        image: b.image_full_url || b.logo || b.image,
                        description: b.name
                    }))}
                />
            )}

            <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
                {/* Replaced FeaturedProducts with ScrollExpandHero */}
                <ScrollExpandHero
                    mediaType="image"
                    mediaSrc="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1400&h=800&fit=crop&q=80"
                    bgImageSrc="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&h=1080&fit=crop&q=80"
                    title="Pure Hydrogen Water"
                    subtitle="Advanced Ionization Technology"
                    scrollHint="Scroll to explore"
                    textBlend
                />
                <CategoryHighlights />
                <ScienceBenefits />
                <Testimonials />
                <FAQPreview />
                <CTASection />
            </Suspense>
        </main>
    );
}
