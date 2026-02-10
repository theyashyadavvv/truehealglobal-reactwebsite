import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiBeaker } from 'react-icons/hi';
import GradientButton from '../GradientButton';
import './HeroSection.css';

export default function HeroSection() {
    return (
        <section className="hero">
            <div className="hero__bg">
                <img
                    src="/assets/image/molecular_hero.jpg"
                    alt=""
                    className="hero__bg-img"
                />
                <div className="hero__bg-overlay" />
                {/* Animated bubbles */}
                <div className="hero__bubbles">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="hero__bubble"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 8}s`,
                                animationDuration: `${6 + Math.random() * 6}s`,
                                width: `${8 + Math.random() * 20}px`,
                                height: `${8 + Math.random() * 20}px`,
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="hero__content container">
                <motion.div
                    className="hero__badge"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <HiBeaker size={14} />
                    <span>Science-Backed Hydration Technology</span>
                </motion.div>

                <motion.h1
                    className="hero__title"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                >
                    The Future of{' '}
                    <span className="hero__title-gradient">Hydration</span>
                    <br />Delivered to You
                </motion.h1>

                <motion.p
                    className="hero__subtitle"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                >
                    Discover premium hydrogen and alkaline water machines powered by
                    advanced PEM technology. Neutralize free radicals, boost energy,
                    and transform your health — one sip at a time.
                </motion.p>

                <motion.div
                    className="hero__actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                >
                    <Link to="/products">
                        <GradientButton size="lg">
                            Explore Machines <HiArrowRight />
                        </GradientButton>
                    </Link>
                    <Link to="/science">
                        <GradientButton size="lg" variant="accent">
                            Learn the Science
                        </GradientButton>
                    </Link>
                </motion.div>

                <motion.div
                    className="hero__stats"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                >
                    <div className="hero__stat">
                        <span className="hero__stat-value">1,000+</span>
                        <span className="hero__stat-label">Research Studies</span>
                    </div>
                    <div className="hero__stat-divider" />
                    <div className="hero__stat">
                        <span className="hero__stat-value">-800mV</span>
                        <span className="hero__stat-label">ORP Value</span>
                    </div>
                    <div className="hero__stat-divider" />
                    <div className="hero__stat">
                        <span className="hero__stat-value">1600ppb</span>
                        <span className="hero__stat-label">H₂ Concentration</span>
                    </div>
                </motion.div>
            </div>

            <div className="hero__scroll-indicator">
                <motion.div
                    className="hero__scroll-dot"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                />
            </div>
        </section>
    );
}
