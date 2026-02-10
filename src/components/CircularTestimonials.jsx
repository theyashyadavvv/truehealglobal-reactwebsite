import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import './CircularTestimonials.css';

/**
 * CircularTestimonials — adapted from 21st.dev's circular-testimonials.
 * 3D perspective image carousel with word-blur animated quotes.
 *
 * Props:
 *  - testimonials: [{ quote, name, designation, src }]
 *  - autoplay: boolean
 *  - colors: { name, designation, testimony, arrowBackground, arrowForeground, arrowHoverBackground }
 *  - fontSizes: { name, designation, quote }
 */

function calculateGap(width) {
    const minWidth = 1024;
    const maxWidth = 1456;
    const minGap = 60;
    const maxGap = 86;
    if (width <= minWidth) return minGap;
    if (width >= maxWidth) return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
    return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export default function CircularTestimonials({
    testimonials,
    autoplay = true,
    colors = {},
    fontSizes = {},
}) {
    const colorName = colors.name ?? 'var(--color-white)';
    const colorDesignation = colors.designation ?? 'var(--color-gray-300)';
    const colorTestimony = colors.testimony ?? 'var(--color-gray-100)';
    const colorArrowBg = colors.arrowBackground ?? 'var(--color-primary)';
    const colorArrowFg = colors.arrowForeground ?? '#fff';
    const colorArrowHoverBg = colors.arrowHoverBackground ?? 'var(--color-accent)';
    const fontSizeName = fontSizes.name ?? '1.5rem';
    const fontSizeDesignation = fontSizes.designation ?? '0.925rem';
    const fontSizeQuote = fontSizes.quote ?? '1.125rem';

    const [activeIndex, setActiveIndex] = useState(0);
    const [hoverPrev, setHoverPrev] = useState(false);
    const [hoverNext, setHoverNext] = useState(false);
    const [containerWidth, setContainerWidth] = useState(1200);

    const imageContainerRef = useRef(null);
    const autoplayRef = useRef(null);

    const len = useMemo(() => testimonials.length, [testimonials]);
    const active = useMemo(() => testimonials[activeIndex], [activeIndex, testimonials]);

    // Responsive container width
    useEffect(() => {
        function handleResize() {
            if (imageContainerRef.current) setContainerWidth(imageContainerRef.current.offsetWidth);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Autoplay
    useEffect(() => {
        if (autoplay) {
            autoplayRef.current = setInterval(() => {
                setActiveIndex((prev) => (prev + 1) % len);
            }, 5000);
        }
        return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
    }, [autoplay, len]);

    // Keyboard nav
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [activeIndex, len]);

    const handleNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % len);
        if (autoplayRef.current) clearInterval(autoplayRef.current);
    }, [len]);

    const handlePrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + len) % len);
        if (autoplayRef.current) clearInterval(autoplayRef.current);
    }, [len]);

    function getImageStyle(index) {
        const gap = calculateGap(containerWidth);
        const maxStickUp = gap * 0.8;
        const isActive = index === activeIndex;
        const isLeft = (activeIndex - 1 + len) % len === index;
        const isRight = (activeIndex + 1) % len === index;

        if (isActive) return {
            zIndex: 3, opacity: 1, pointerEvents: 'auto',
            transform: 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)',
            transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
        };
        if (isLeft) return {
            zIndex: 2, opacity: 1, pointerEvents: 'auto',
            transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
            transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
        };
        if (isRight) return {
            zIndex: 2, opacity: 1, pointerEvents: 'auto',
            transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
            transition: 'all 0.8s cubic-bezier(.4,2,.3,1)',
        };
        return { zIndex: 1, opacity: 0, pointerEvents: 'none', transition: 'all 0.8s cubic-bezier(.4,2,.3,1)' };
    }

    const quoteVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    return (
        <div className="circ-test">
            <div className="circ-test__grid">
                {/* 3D Image carousel */}
                <div className="circ-test__images" ref={imageContainerRef}>
                    {testimonials.map((t, i) => (
                        <img
                            key={t.src}
                            src={t.src}
                            alt={t.name}
                            className="circ-test__img"
                            style={getImageStyle(i)}
                        />
                    ))}
                </div>

                {/* Text content */}
                <div className="circ-test__content">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            variants={quoteVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            <h3 className="circ-test__name" style={{ color: colorName, fontSize: fontSizeName }}>
                                {active.name}
                            </h3>
                            <p className="circ-test__designation" style={{ color: colorDesignation, fontSize: fontSizeDesignation }}>
                                {active.designation}
                            </p>
                            <motion.p className="circ-test__quote" style={{ color: colorTestimony, fontSize: fontSizeQuote }}>
                                {active.quote.split(' ').map((word, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ filter: 'blur(10px)', opacity: 0, y: 5 }}
                                        animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                                        transition={{ duration: 0.22, ease: 'easeInOut', delay: 0.025 * i }}
                                        style={{ display: 'inline-block' }}
                                    >
                                        {word}&nbsp;
                                    </motion.span>
                                ))}
                            </motion.p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Arrow navigation */}
                    <div className="circ-test__arrows">
                        <button
                            className="circ-test__arrow"
                            onClick={handlePrev}
                            style={{ backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg }}
                            onMouseEnter={() => setHoverPrev(true)}
                            onMouseLeave={() => setHoverPrev(false)}
                            aria-label="Previous testimonial"
                        >
                            <HiArrowLeft size={22} color={colorArrowFg} />
                        </button>
                        <button
                            className="circ-test__arrow"
                            onClick={handleNext}
                            style={{ backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg }}
                            onMouseEnter={() => setHoverNext(true)}
                            onMouseLeave={() => setHoverNext(false)}
                            aria-label="Next testimonial"
                        >
                            <HiArrowRight size={22} color={colorArrowFg} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
