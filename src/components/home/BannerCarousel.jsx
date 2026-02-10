import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { banners } from '../../data/mockData';
import GradientButton from '../GradientButton';
import './BannerCarousel.css';

export default function BannerCarousel() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrent(prev => (prev + 1) % banners.length);
    }, []);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrent(prev => (prev - 1 + banners.length) % banners.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const banner = banners[current];

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
                            src={banner.image}
                            alt=""
                            initial={{ scale: 1 }}
                            animate={{ scale: 1.08 }}
                            transition={{ duration: 6, ease: 'linear' }}
                        />
                        <div className="banner-carousel__overlay" />
                    </div>

                    <div className="banner-carousel__content container">
                        <motion.h2
                            className="banner-carousel__title"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            {banner.title}
                        </motion.h2>
                        <motion.p
                            className="banner-carousel__subtitle"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                        >
                            {banner.subtitle}
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                        >
                            <Link to={banner.link}>
                                <GradientButton>{banner.buttonText}</GradientButton>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
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

            {/* Progress dots */}
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

            {/* Progress bar */}
            <div className="banner-carousel__progress">
                <motion.div
                    className="banner-carousel__progress-bar"
                    key={current}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 6, ease: 'linear' }}
                />
            </div>
        </section>
    );
}
