
import React, { useState, useEffect, useRef } from 'react';
import './CircularGallery.css';

const CircularGallery = React.forwardRef(({
    items,
    className = "",
    radius = 600,
    autoRotateSpeed = 0.02,
    ...props
}, ref) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef(null);
    const animationFrameRef = useRef(null);
    const galleryParams = useRef({ rotation: 0 }); // Use ref for smooth animation loop

    // Initialize rotation from state
    useEffect(() => {
        galleryParams.current.rotation = rotation;
    }, [rotation]);


    // Effect to handle scroll-based rotation
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolling(true);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Calculate rotation based on scroll position relative to document height
            // Adjust factor (e.g., * 0.1 or * 0.5) to control sensitivity
            const scrollFactor = 0.2;
            const newRotation = window.scrollY * scrollFactor;

            setRotation(newRotation);
            galleryParams.current.rotation = newRotation;

            scrollTimeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
            }, 150);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    // Effect for auto-rotation when not scrolling
    useEffect(() => {
        const autoRotate = () => {
            // Only auto-rotate if NOT scrolling
            if (!isScrolling) {
                setRotation(prev => {
                    const next = prev + autoRotateSpeed;
                    galleryParams.current.rotation = next;
                    return next;
                });
            }
            animationFrameRef.current = requestAnimationFrame(autoRotate);
        };

        animationFrameRef.current = requestAnimationFrame(autoRotate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isScrolling, autoRotateSpeed]);

    const anglePerItem = 360 / (items?.length || 1);

    // If no items, return null or empty div
    if (!items || items.length === 0) return null;

    return (
        <div
            ref={ref}
            className={`circular-gallery-container ${className}`}
            style={{ perspective: '2000px' }}
            {...props}
        >
            <div
                className="circular-gallery-rotator"
                style={{
                    transform: `rotateY(${rotation}deg)`,
                    transformStyle: 'preserve-3d',
                }}
            >
                {items.map((item, i) => {
                    const itemAngle = i * anglePerItem;
                    // Calculate opacity based on visibility/angle relative to front view
                    // This is a simplified version; simpler CSS transition might be better for performance
                    const totalRotation = rotation % 360;
                    const relativeAngle = (itemAngle + totalRotation + 360) % 360;
                    const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
                    // Opacity falls off as items rotate to the back
                    const opacity = Math.max(0.3, 1 - (normalizedAngle / 180));

                    return (
                        <div
                            key={i}
                            className="circular-gallery-item"
                            style={{
                                transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                                opacity: opacity,
                            }}
                        >
                            <div className="circular-gallery-card">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="circular-gallery-img"
                                />
                                <div className="circular-gallery-overlay">
                                    <h2 className="circular-gallery-title">{item.title}</h2>
                                    <em className="circular-gallery-subtitle">{item.subtitle}</em>
                                    {item.description && (
                                        <p className="circular-gallery-desc">{item.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

CircularGallery.displayName = 'CircularGallery';

export default CircularGallery;
