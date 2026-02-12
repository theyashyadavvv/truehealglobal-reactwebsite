import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCategories } from '../hooks/useDataHooks';
import ScrollReveal from '../components/ScrollReveal';
import './CategoriesPage.css';

export default function CategoriesPage() {
    const { data, loading, error } = useCategories();
    const categories = Array.isArray(data) ? data : [];

    return (
        <div className="categories-page">
            <section className="categories-hero">
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="categories-title"
                    >
                        Explore Categories
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="categories-subtitle"
                    >
                        Find the perfect product for your specific needs
                    </motion.p>
                </div>
            </section>

            <section className="categories-content section">
                <div className="container">
                    {loading ? (
                        <div className="categories-grid">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} style={{ height: 180, borderRadius: 16, background: 'var(--color-surface, #1a1a2e)', animation: 'pulse 1.5s infinite' }} />
                            ))}
                        </div>
                    ) : error ? (
                        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>{error}</p>
                    ) : (
                        <div className="categories-grid">
                            {categories.map((cat, i) => (
                                <ScrollReveal key={cat.id} delay={i * 0.05}>
                                    <Link to={`/categories/${cat.id}`} className="category-card-large">
                                        <div className="category-card-large__image">
                                            <img
                                                src={cat.image_full_url || cat.image || '/assets/image/placeholder.png'}
                                                alt={cat.name}
                                                onError={(e) => e.target.src = '/assets/image/placeholder.png'}
                                            />
                                        </div>
                                        <div className="category-card-large__info">
                                            <h3>{cat.name}</h3>
                                            <p>{cat.products_count || 0} Products</p>
                                        </div>
                                    </Link>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
