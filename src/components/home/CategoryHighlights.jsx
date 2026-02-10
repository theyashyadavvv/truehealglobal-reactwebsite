import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../ScrollReveal';
import { HiArrowRight } from 'react-icons/hi';
import { categories } from '../../data/mockData';
import './CategoryHighlights.css';

export default function CategoryHighlights() {
    return (
        <section className="categories section">
            <div className="container">
                <ScrollReveal>
                    <div className="section-header">
                        <p className="section-label">Our Collections</p>
                        <h2 className="section-title">Tailored Hydration Starts Here</h2>
                        <p className="section-subtitle">
                            Choose your path to optimal wellness with our two flagship product lines
                        </p>
                    </div>
                </ScrollReveal>

                <div className="categories__grid">
                    {categories.map((cat, i) => (
                        <ScrollReveal key={cat.id} delay={i * 0.15} direction="up">
                            <Link to={`/products?category=${cat.id}`} className="categories__card">
                                <div className="categories__card-image">
                                    <img src={cat.image} alt={cat.name} />
                                    <div className="categories__card-overlay" />
                                </div>
                                <div className="categories__card-content">
                                    <div className="categories__card-icon">
                                        {cat.id === 'hydrogen' ? 'H₂' : 'pH'}
                                    </div>
                                    <h3 className="categories__card-title">{cat.name}</h3>
                                    <p className="categories__card-desc">{cat.description}</p>
                                    <motion.span
                                        className="categories__card-link"
                                        whileHover={{ x: 8 }}
                                    >
                                        Explore Collection <HiArrowRight />
                                    </motion.span>
                                </div>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
