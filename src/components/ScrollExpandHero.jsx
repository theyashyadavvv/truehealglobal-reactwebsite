import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './ScrollExpandHero.css';

/**
 * ScrollExpandHero — adapted from Aceternity's scroll-expansion-hero.
 * As the user scrolls, a media element (image or video) expands from a centered
 * card to fill the viewport, with split-text title animation that slides apart.
 * Once fully expanded, normal page scroll resumes.
 */
export default function ScrollExpandHero({
    mediaType = 'image',
    mediaSrc,
    posterSrc,
    bgImageSrc,
    title = '',
    subtitle = '',
    scrollHint = 'Scroll to explore',
    textBlend = false,
    children,
}) {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showContent, setShowContent] = useState(false);
    const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
    const [touchStartY, setTouchStartY] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const sectionRef = useRef(null);

    // Reset on media type change
    useEffect(() => {
        setScrollProgress(0);
        setShowContent(false);
        setMediaFullyExpanded(false);
    }, [mediaType]);

    // Mobile detection
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Scroll hijack logic
    useEffect(() => {
        const handleWheel = (e) => {
            if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
                setMediaFullyExpanded(false);
                e.preventDefault();
            } else if (!mediaFullyExpanded) {
                e.preventDefault();
                const delta = e.deltaY * 0.0009;
                const next = Math.min(Math.max(scrollProgress + delta, 0), 1);
                setScrollProgress(next);

                if (next >= 1) {
                    setMediaFullyExpanded(true);
                    setShowContent(true);
                } else if (next < 0.75) {
                    setShowContent(false);
                }
            }
        };

        const handleTouchStart = (e) => {
            setTouchStartY(e.touches[0].clientY);
        };

        const handleTouchMove = (e) => {
            if (!touchStartY) return;
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;

            if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
                setMediaFullyExpanded(false);
                e.preventDefault();
            } else if (!mediaFullyExpanded) {
                e.preventDefault();
                const factor = deltaY < 0 ? 0.008 : 0.005;
                const next = Math.min(Math.max(scrollProgress + deltaY * factor, 0), 1);
                setScrollProgress(next);

                if (next >= 1) {
                    setMediaFullyExpanded(true);
                    setShowContent(true);
                } else if (next < 0.75) {
                    setShowContent(false);
                }
                setTouchStartY(touchY);
            }
        };

        const handleTouchEnd = () => setTouchStartY(0);

        const handleScroll = () => {
            if (!mediaFullyExpanded) window.scrollTo(0, 0);
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [scrollProgress, mediaFullyExpanded, touchStartY]);

    // Computed dimensions
    const mediaWidth = 300 + scrollProgress * (isMobile ? 650 : 1250);
    const mediaHeight = 400 + scrollProgress * (isMobile ? 200 : 400);
    const textTranslateX = scrollProgress * (isMobile ? 180 : 150);

    const firstWord = title.split(' ')[0] || '';
    const restOfTitle = title.split(' ').slice(1).join(' ') || '';

    return (
        <div ref={sectionRef} className="scroll-expand-hero">
            <section className="scroll-expand-hero__section">
                <div className="scroll-expand-hero__viewport">

                    {/* Background image fading out */}
                    <motion.div
                        className="scroll-expand-hero__bg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 - scrollProgress }}
                        transition={{ duration: 0.1 }}
                    >
                        <img
                            src={bgImageSrc}
                            alt="Background"
                            className="scroll-expand-hero__bg-img"
                        />
                        <div className="scroll-expand-hero__bg-overlay" />
                    </motion.div>

                    {/* Center content */}
                    <div className="scroll-expand-hero__center">
                        <div className="scroll-expand-hero__center-inner">

                            {/* Expanding media card */}
                            <div
                                className="scroll-expand-hero__media-card"
                                style={{
                                    width: `${mediaWidth}px`,
                                    height: `${mediaHeight}px`,
                                    maxWidth: '95vw',
                                    maxHeight: '85vh',
                                    boxShadow: '0 0 50px rgba(0,0,0,0.3)',
                                }}
                            >
                                {mediaType === 'video' ? (
                                    <div className="scroll-expand-hero__media-wrap">
                                        <video
                                            src={mediaSrc}
                                            poster={posterSrc}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            preload="auto"
                                            className="scroll-expand-hero__media"
                                            controls={false}
                                        />
                                        <motion.div
                                            className="scroll-expand-hero__media-dim"
                                            initial={{ opacity: 0.7 }}
                                            animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </div>
                                ) : (
                                    <div className="scroll-expand-hero__media-wrap">
                                        <img
                                            src={mediaSrc}
                                            alt={title || 'Media content'}
                                            className="scroll-expand-hero__media"
                                        />
                                        <motion.div
                                            className="scroll-expand-hero__media-dim"
                                            initial={{ opacity: 0.7 }}
                                            animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </div>
                                )}

                                {/* Subtitle + scroll hint sliding apart */}
                                <div className="scroll-expand-hero__meta">
                                    {subtitle && (
                                        <p
                                            className="scroll-expand-hero__date"
                                            style={{ transform: `translateX(-${textTranslateX}vw)` }}
                                        >
                                            {subtitle}
                                        </p>
                                    )}
                                    {scrollHint && (
                                        <p
                                            className="scroll-expand-hero__hint"
                                            style={{ transform: `translateX(${textTranslateX}vw)` }}
                                        >
                                            {scrollHint}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Split title text */}
                            <div className={`scroll-expand-hero__title-wrap ${textBlend ? 'scroll-expand-hero__title-wrap--blend' : ''}`}>
                                <motion.h2
                                    className="scroll-expand-hero__title-line"
                                    style={{ transform: `translateX(-${textTranslateX}vw)` }}
                                >
                                    {firstWord}
                                </motion.h2>
                                <motion.h2
                                    className="scroll-expand-hero__title-line"
                                    style={{ transform: `translateX(${textTranslateX}vw)` }}
                                >
                                    {restOfTitle}
                                </motion.h2>
                            </div>
                        </div>

                        {/* Revealed content after expansion */}
                        <motion.section
                            className="scroll-expand-hero__content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: showContent ? 1 : 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            {children}
                        </motion.section>
                    </div>
                </div>
            </section>
        </div>
    );
}
