import { Link } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';
import SpotlightCard from '../SpotlightCard';
import { useCategories } from '../../hooks/useDataHooks';
import './CategoryGrid.css';

export default function CategoryGrid() {
    const { data, loading, error } = useCategories();
    const categories = Array.isArray(data) ? data : [];

    return (
        <section className="category-grid section">
            <div className="container">
                <ScrollReveal>
                    <div className="section-header">
                        <h2 className="section-title">Shop by Category</h2>
                        <p className="section-subtitle">Browse our wide range of premium products</p>
                    </div>
                </ScrollReveal>

                {loading ? (
                    <div className="category-grid__layout">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} style={{ height: 140, borderRadius: 16, background: 'var(--color-surface, #1a1a2e)', animation: 'pulse 1.5s infinite' }} />
                        ))}
                    </div>
                ) : error || categories.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>
                        {error || 'No categories available.'}
                    </p>
                ) : (
                    <div className="category-grid__layout">
                        {categories.map((cat, i) => (
                            <ScrollReveal key={cat.id} delay={i * 0.05} className="category-grid__item-wrap">
                                <SpotlightCard glowColor="teal">
                                    <Link to={`/categories/${cat.id}`} className="category-grid__card">
                                        <div className="category-grid__image">
                                            <img
                                                src={cat.image_full_url || cat.image || '/assets/image/placeholder.png'}
                                                alt={cat.name}
                                                onError={(e) => e.target.src = '/assets/image/placeholder.png'}
                                            />
                                        </div>
                                        <h3 className="category-grid__name">{cat.name}</h3>
                                        <span className="category-grid__count">{cat.products_count || 0} Products</span>
                                    </Link>
                                </SpotlightCard>
                            </ScrollReveal>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
