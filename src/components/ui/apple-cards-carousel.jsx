import React, { useEffect, useRef, useState, createContext, useContext, useCallback } from 'react';
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import './apple-cards-carousel.css';

// ── Context ──
export const CarouselContext = createContext({
    onCardClose: () => {},
    currentIndex: 0,
});

// ── Carousel ──
export const Carousel = ({ items, initialScroll = 0 }) => {
    const carouselRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollLeft = initialScroll;
            checkScrollability();
        }
    }, [initialScroll]);

    const checkScrollability = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
        }
    };

    const scrollLeftFn = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRightFn = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const handleCardClose = useCallback((index) => {
        if (carouselRef.current) {
            const cardWidth = window.innerWidth < 768 ? 232 : 384;
            const gap = window.innerWidth < 768 ? 12 : 20;
            const scrollPosition = (cardWidth + gap) * (index + 1);
            carouselRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
            setCurrentIndex(index);
        }
    }, []);

    return (
        <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
            <div style={{ position: 'relative', width: '100%' }}>
                <div
                    className="apple-carousel__scroll"
                    ref={carouselRef}
                    onScroll={checkScrollability}
                >
                    <div className="apple-carousel__track">
                        {items.map((item, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: { duration: 0.5, delay: 0.15 * index, ease: 'easeOut' },
                                }}
                                key={'card-' + index}
                                className="apple-carousel__card-wrapper"
                            >
                                {item}
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="apple-carousel__arrows">
                    <button className="apple-carousel__arrow-btn" onClick={scrollLeftFn} disabled={!canScrollLeft}>
                        <IconArrowNarrowLeft />
                    </button>
                    <button className="apple-carousel__arrow-btn" onClick={scrollRightFn} disabled={!canScrollRight}>
                        <IconArrowNarrowRight />
                    </button>
                </div>
            </div>
        </CarouselContext.Provider>
    );
};

// ── Card ──
export const Card = ({ card, index, layout = false }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const { onCardClose } = useContext(CarouselContext);

    useEffect(() => {
        function onKeyDown(event) {
            if (event.key === 'Escape') handleClose();
        }
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open]);

    useOutsideClick(containerRef, () => handleClose());

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        onCardClose(index);
    };

    return (
        <>
            <AnimatePresence>
                {open && (
                    <div className="apple-card__modal-backdrop">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="apple-card__overlay"
                        />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            ref={containerRef}
                            className="apple-card__modal"
                        >
                            <button className="apple-card__close-btn" onClick={handleClose}>
                                <IconX />
                            </button>
                            <p className="apple-card__modal-category">{card.category}</p>
                            <p className="apple-card__modal-title">{card.title}</p>
                            <div className="apple-card__modal-body">{card.content}</div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <motion.button onClick={handleOpen} className="apple-card__button">
                <div className="apple-card__gradient-overlay" />
                <div className="apple-card__text-content">
                    <p className="apple-card__category">{card.category}</p>
                    <p className="apple-card__title">{card.title}</p>
                </div>
                <BlurImage src={card.src} alt={card.title} />
            </motion.button>
        </>
    );
};

// ── BlurImage ──
export const BlurImage = ({ src, alt, className = '', ...rest }) => {
    const [isLoading, setLoading] = useState(true);
    return (
        <img
            className={`apple-card__image ${isLoading ? 'apple-card__image--loading' : ''} ${className}`}
            onLoad={() => setLoading(false)}
            src={src}
            loading="lazy"
            decoding="async"
            alt={alt || 'Background image'}
            {...rest}
        />
    );
};
