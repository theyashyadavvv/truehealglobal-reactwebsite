import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './ScrollExpandHero.css';

/**
 * ScrollExpandHero — Refactored for mid-page placement.
 * Uses CSS sticky positioning + Framer Motion useScroll.
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
    const sectionRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    // Mobile detection
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Track scroll progress of this specific section
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    // --- Animations mapped to scroll progress (0 to 1) ---

    // 1. Media Expansion
    // Start small (300px width) -> End full width + extra (140vw to ensure coverage)
    const mediaWidth = useTransform(scrollYProgress, [0, 1], [300, isMobile ? window.innerWidth : window.innerWidth]);
    const mediaHeight = useTransform(scrollYProgress, [0, 1], [400, window.innerHeight]);

    // Border radius: 20px -> 0px
    const borderRadius = useTransform(scrollYProgress, [0.8, 1], [20, 0]);

    // Text splitting (Moving apart)
    const textTranslateX = useTransform(scrollYProgress, [0, 0.6], [0, isMobile ? 200 : 400]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    // Background Image Opacity (Fading in)
    // It should start invisible and fade in as we expand? 
    // Or in the original: "opacity: 1 - scrollProgress" (fading OUT background?)
    // Let's stick to the original feel: The 'bgImageSrc' was the background behind the card.
    // As card expands, it covers the background.
    const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Dimming overlay on the media itself
    const mediaDimOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 0]);

    // Reveal Content (children)
    const contentOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
    const contentY = useTransform(scrollYProgress, [0.9, 1], [50, 0]);

    const firstWord = title.split(' ')[0] || '';
    const restOfTitle = title.split(' ').slice(1).join(' ') || '';

    return (
        <div ref={sectionRef} className="scroll-expand-hero">
            <div className="scroll-expand-hero__sticky">
                <section className="scroll-expand-hero__section">
                    <div className="scroll-expand-hero__viewport">

                        {/* Background Layer */}
                        <motion.div
                            className="scroll-expand-hero__bg"
                            style={{ opacity: bgOpacity }}
                        >
                            <img src={bgImageSrc} alt="Background" className="scroll-expand-hero__bg-img" />
                            <div className="scroll-expand-hero__bg-overlay" />
                        </motion.div>

                        {/* Center Expanding Card */}
                        <div className="scroll-expand-hero__center">
                            <div className="scroll-expand-hero__center-inner">
                                <motion.div
                                    className="scroll-expand-hero__media-card"
                                    style={{
                                        width: mediaWidth,
                                        height: mediaHeight,
                                        borderRadius: borderRadius,
                                        boxShadow: '0 0 50px rgba(0,0,0,0.3)',
                                    }}
                                >
                                    <div className="scroll-expand-hero__media-wrap">
                                        {mediaType === 'video' ? (
                                            <video
                                                src={mediaSrc}
                                                poster={posterSrc}
                                                autoPlay muted loop playsInline
                                                className="scroll-expand-hero__media"
                                            />
                                        ) : (
                                            <img
                                                src={mediaSrc}
                                                alt={title}
                                                className="scroll-expand-hero__media"
                                            />
                                        )}
                                        {/* Dim Overlay */}
                                        <motion.div
                                            className="scroll-expand-hero__media-dim"
                                            style={{ opacity: mediaDimOpacity }}
                                        />
                                    </div>

                                    {/* Meta Text (Subtitle / Hint) inside the card? No, usually outside or on top. 
                                        In original it was absolute centered. We keep it similar. */}
                                    <motion.div
                                        className="scroll-expand-hero__meta"
                                        style={{ opacity: textOpacity }}
                                    >
                                        <motion.p
                                            className="scroll-expand-hero__date"
                                            style={{ x: useTransform(textTranslateX, v => -v) }}
                                        >
                                            {subtitle}
                                        </motion.p>
                                        <motion.p
                                            className="scroll-expand-hero__hint"
                                            style={{ x: textTranslateX }}
                                        >
                                            {scrollHint}
                                        </motion.p>
                                    </motion.div>
                                </motion.div>

                                {/* Split Title */}
                                <div className={`scroll-expand-hero__title-wrap ${textBlend ? 'scroll-expand-hero__title-wrap--blend' : ''}`}>
                                    <motion.h2
                                        className="scroll-expand-hero__title-line"
                                        style={{
                                            x: useTransform(textTranslateX, v => -v),
                                            opacity: textOpacity
                                        }}
                                    >
                                        {firstWord}
                                    </motion.h2>
                                    <motion.h2
                                        className="scroll-expand-hero__title-line"
                                        style={{
                                            x: textTranslateX,
                                            opacity: textOpacity
                                        }}
                                    >
                                        {restOfTitle}
                                    </motion.h2>
                                </div>
                            </div>

                            {/* Revealed Content */}
                            <motion.section
                                className="scroll-expand-hero__content"
                                style={{ opacity: contentOpacity, y: contentY }}
                            >
                                {children}
                            </motion.section>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
