import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../ScrollReveal';
import { HiArrowRight } from 'react-icons/hi';
import { useCategories } from '../../hooks/useDataHooks';
import './CategoryHighlights.css';

export default function CategoryHighlights() {
    const { data: categories, loading } = useCategories();
    const catList = (categories || []).slice(0, 6);

    if (loading && catList.length === 0) return null;

    return (
        <section className="categories section">
            <div className="container">
                <ScrollReveal>
                    <div className="section-header">
                        <p className="section-label">Our Collections</p>
                        <h2 className="section-title">Tailored Hydration Starts Here</h2>
                        <p className="section-subtitle">
                            Choose your path to optimal wellness with our product collections
                        </p>
                    </div>
                </ScrollReveal>

                <div className="categories__grid">
                    {catList.map((cat, i) => (
                        <ScrollReveal key={cat.id} delay={i * 0.15} direction="up">
                            <Link to={`/categories/${cat.id}`} className="categories__card">
                                <div className="categories__card-image">
                                    <img
                                        src={cat.image_full_url || cat.image}
                                        alt={cat.name}
                                    />
                                    <div className="categories__card-overlay" />
                                </div>
                                <div className="categories__card-content">
                                    <div className="categories__card-icon">
                                        {(cat.name || '')[0]?.toUpperCase() || '?'}
                                    </div>
                                    <h3 className="categories__card-title">{cat.name}</h3>
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
