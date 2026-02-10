import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../ScrollReveal';
import GradientButton from '../GradientButton';
import { HiArrowRight } from 'react-icons/hi';
import './CTASection.css';

export default function CTASection() {
    return (
        <section className="cta-section">
            <div className="cta-section__bg">
                <img src="/assets/image/water_wave_bg.png" alt="" className="cta-section__bg-img" />
                <div className="cta-section__overlay" />
            </div>
            <div className="container cta-section__content">
                <ScrollReveal>
                    <h2 className="cta-section__title">
                        Transform Your Water.<br />
                        <span className="cta-section__title-accent">Transform Your Health.</span>
                    </h2>
                    <p className="cta-section__text">
                        Join thousands of health-conscious families choosing True Heal Global
                        for science-backed hydration technology.
                    </p>
                    <div className="cta-section__actions">
                        <Link to="/products">
                            <GradientButton>
                                Shop Now <HiArrowRight style={{ marginLeft: '0.5rem' }} />
                            </GradientButton>
                        </Link>
                        <Link to="/science">
                            <GradientButton variant="accent">
                                Explore the Science
                            </GradientButton>
                        </Link>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
