import ScrollExpandHero from '../components/ScrollExpandHero';
import BannerCarousel from '../components/home/BannerCarousel';
import HeroScroll from '../components/home/HeroScroll';
import CategoryGrid from '../components/home/CategoryGrid';
import PopularStores from '../components/home/PopularStores';
import Logos3 from '../components/Logos3';
import FeaturedProducts from '../components/home/FeaturedProducts';
import { brands } from '../data/mockData';
import CategoryHighlights from '../components/home/CategoryHighlights';
import ScienceBenefits from '../components/home/ScienceBenefits';
import Testimonials from '../components/home/Testimonials';
import FAQPreview from '../components/home/FAQPreview';
import CTASection from '../components/home/CTASection';

export default function HomePage() {
    return (
        <main>
            <ScrollExpandHero
                mediaType="image"
                mediaSrc="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1400&h=800&fit=crop&q=80"
                bgImageSrc="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&h=1080&fit=crop&q=80"
                title="Pure Hydrogen Water"
                subtitle="Advanced Ionization Technology"
                scrollHint="Scroll to explore"
                textBlend
            />
            <BannerCarousel />
            <HeroScroll />
            <CategoryGrid />
            <PopularStores />

            <Logos3
                heading="Brands We Work With"
                logos={brands.map(b => ({
                    id: b.id,
                    image: b.logo,
                    description: b.name
                }))}
            />

            <FeaturedProducts />
            <CategoryHighlights />
            <ScienceBenefits />
            <Testimonials />
            <FAQPreview />
            <CTASection />
        </main>
    );
}
