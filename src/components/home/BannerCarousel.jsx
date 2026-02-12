import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { fetchBanners } from '../../api/services/bannerService';
import GradientButton from '../GradientButton';
import './BannerCarousel.css';

export default function BannerCarousel() {
    const [banners, setBanners] = useState([]);
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch banners from API on mount
    useEffect(() => {
        let cancelled = false;
        async function loadBanners() {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchBanners();
                if (!cancelled) {
                    setBanners(data);
                    setLoading(false);
                }
            } catch (err) {
                console.error('Failed to fetch banners:', err);
                if (!cancelled) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        }
        loadBanners();
        return () => { cancelled = true; };
    }, []);

    const nextSlide = useCallback(() => {
        if (banners.length === 0) return;
        setDirection(1);
        setCurrent(prev => (prev + 1) % banners.length);
    }, [banners.length]);

    const prevSlide = useCallback(() => {
        if (banners.length === 0) return;
        setDirection(-1);
        setCurrent(prev => (prev - 1 + banners.length) % banners.length);
    }, [banners.length]);

    // Auto-advance slides
    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide, banners.length]);

    // --- Loading skeleton ---
    if (loading) {
        return (
            <section className="banner-carousel">
                <div className="banner-carousel__slide">
                    <div className="banner-carousel__skeleton">
                        <div className="banner-carousel__skeleton-shimmer" />
                    </div>
                </div>
            </section>
        );
    }

    // --- Error / empty state ---
    if (error || banners.length === 0) {
        return (
            <section className="banner-carousel">
                <div className="banner-carousel__slide">
                    <div className="banner-carousel__empty">
                        <p>{error ? 'Unable to load banners.' : 'No banners available.'}</p>
                    </div>
                </div>
            </section>
        );
    }

    const banner = banners[current];

    // Build the image URL from the API field
    const imageUrl = banner.image_full_url || banner.image || '';

    // Determine link based on banner type and data
    let bannerLink = '#';
    let isExternal = false;

    if (banner.type === 'store_wise' && banner.store) {
        bannerLink = `/stores/${banner.store.id}`;
    } else if (banner.type === 'item_wise' && banner.item) {
        bannerLink = `/products/${banner.item.id}`;
    } else if (banner.type === 'default' && banner.link) {
        bannerLink = banner.link;
        isExternal = true; // Flag for external links if needed, though usually we keep internal
    } else {
        // Fallback for older data or missing types
        if (banner.store && banner.store.id) bannerLink = `/stores/${banner.store.id}`;
        else if (banner.item && banner.item.id) bannerLink = `/products/${banner.item.id}`;
        else if (banner.link) bannerLink = banner.link;
    }

    const slideVariants = {
        enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
    };

    return (
        <section className="banner-carousel">
            <AnimatePresence custom={direction} mode="wait">
                <motion.div
                    key={current}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                    className="banner-carousel__slide"
                >
                    <div className="banner-carousel__bg">
                        <motion.img
                            src={imageUrl}
                            alt={banner.title || 'Banner'}
                            initial={{ scale: 1 }}
                            animate={{ scale: 1.08 }}
                            transition={{ duration: 6, ease: 'linear' }}
                        />
                        <div className="banner-carousel__overlay" />
                    </div>

                    <div className="banner-carousel__content container">
                        {banner.title && (
                            <motion.h2
                                className="banner-carousel__title"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            >
                                {banner.title}
                            </motion.h2>
                        )}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                        >
                            {isExternal && (bannerLink.startsWith('http') || bannerLink.startsWith('www')) ? (
                                <a href={bannerLink} target="_blank" rel="noopener noreferrer">
                                    <GradientButton>Explore Now</GradientButton>
                                </a>
                            ) : (
                                <Link to={bannerLink}>
                                    <GradientButton>Shop Now</GradientButton>
                                </Link>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation arrows — only show when > 1 banner */}
            {banners.length > 1 && (
                <>
                    <button
                        className="banner-carousel__nav banner-carousel__nav--prev"
                        onClick={prevSlide}
                        aria-label="Previous slide"
                    >
                        <HiChevronLeft size={24} />
                    </button>
                    <button
                        className="banner-carousel__nav banner-carousel__nav--next"
                        onClick={nextSlide}
                        aria-label="Next slide"
                    >
                        <HiChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Progress dots */}
            {banners.length > 1 && (
                <div className="banner-carousel__dots">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            className={`banner-carousel__dot ${i === current ? 'banner-carousel__dot--active' : ''}`}
                            onClick={() => {
                                setDirection(i > current ? 1 : -1);
                                setCurrent(i);
                            }}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Progress bar */}
            {banners.length > 1 && (
                <div className="banner-carousel__progress">
                    <motion.div
                        className="banner-carousel__progress-bar"
                        key={current}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 6, ease: 'linear' }}
                    />
                </div>
            )}
        </section>
    );
}
