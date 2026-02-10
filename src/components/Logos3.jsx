
import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import './Logos3.css';

export default function Logos3({
    heading = "Trusted by these companies",
    logos = []
}) {
    // Embla carousel with AutoScroll plugin
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true },
        [AutoScroll({ playOnInit: true, speed: 1.5, stopOnInteraction: false })]
    );

    return (
        <section className="logos3-section">
            <div className="container logos3-container">
                {heading && (
                    <div className="logos3-header">
                        <p className="section-label">Trusted Partners</p>
                        <h2 className="section-title">{heading}</h2>
                    </div>
                )}

                <div className="logos3-carousel-wrapper">
                    <div className="logos3-carousel" ref={emblaRef}>
                        <div className="logos3-carousel-container">
                            {logos.map((logo, index) => (
                                <div className="logos3-slide" key={logo.id || index}>
                                    <div className="logos3-logo-wrap">
                                        <img
                                            src={logo.image || logo}
                                            alt={logo.description || `Brand ${index + 1}`}
                                            className="logos3-img"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gradient Fade Masks */}
                    <div className="logos3-fade-left"></div>
                    <div className="logos3-fade-right"></div>
                </div>
            </div>
        </section>
    );
}
