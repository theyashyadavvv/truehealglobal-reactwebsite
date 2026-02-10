import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { HiStar, HiShoppingCart, HiFilter, HiViewGrid, HiViewList, HiChevronDown } from 'react-icons/hi';
import { products } from '../data/mockData';
import './ProductListPage.css';

export default function ProductListPage() {
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('popular');
    const [showFilters, setShowFilters] = useState(false);

    const filtered = useMemo(() => {
        let result = [...products];
        if (categoryFilter !== 'all') {
            result = result.filter(p => p.category === categoryFilter);
        }
        switch (sortBy) {
            case 'price-low': result.sort((a, b) => a.price - b.price); break;
            case 'price-high': result.sort((a, b) => b.price - a.price); break;
            case 'rating': result.sort((a, b) => b.rating - a.rating); break;
            default: break;
        }
        return result;
    }, [categoryFilter, sortBy]);

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

    return (
        <main className="product-list">
            {/* Page Header */}
            <section className="product-list__hero">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="section-label" style={{ color: 'var(--color-primary-light)' }}>Our Collection</p>
                        <h1 className="product-list__title">Premium Water Machines</h1>
                        <p className="product-list__subtitle">
                            Discover our range of hydrogen and alkaline water machines — scientifically engineered for optimal hydration
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="product-list__main section">
                <div className="container">
                    {/* Toolbar */}
                    <div className="product-list__toolbar">
                        <div className="product-list__categories">
                            {['all', 'hydrogen', 'alkaline'].map(cat => (
                                <button
                                    key={cat}
                                    className={`product-list__cat-btn ${categoryFilter === cat ? 'product-list__cat-btn--active' : ''}`}
                                    onClick={() => setCategoryFilter(cat)}
                                >
                                    {cat === 'all' ? 'All Machines' : cat === 'hydrogen' ? 'Hydrogen' : 'Alkaline'}
                                </button>
                            ))}
                        </div>
                        <div className="product-list__controls">
                            <div className="product-list__sort">
                                <span>Sort:</span>
                                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                    <option value="popular">Most Popular</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                            <span className="product-list__count">{filtered.length} products</span>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="product-list__grid">
                        {filtered.map((product, i) => (
                            <ScrollReveal key={product.id} delay={i * 0.08}>
                                <Link to={`/products/${product.id}`} className="plp-card card">
                                    {product.badge && <span className="plp-card__badge">{product.badge}</span>}
                                    <div className="plp-card__image">
                                        <img src={product.image} alt={product.name} />
                                    </div>
                                    <div className="plp-card__body">
                                        <span className="plp-card__category">
                                            {product.category === 'hydrogen' ? 'Hydrogen Water' : 'Alkaline Water'}
                                        </span>
                                        <h3 className="plp-card__name">{product.name}</h3>
                                        <p className="plp-card__desc">{product.description.slice(0, 80)}...</p>
                                        <div className="plp-card__rating">
                                            <div className="stars">
                                                {[...Array(5)].map((_, j) => (
                                                    <HiStar key={j} style={{ opacity: j < Math.floor(product.rating) ? 1 : 0.3 }} />
                                                ))}
                                            </div>
                                            <span>{product.rating} ({product.reviews})</span>
                                        </div>
                                        <div className="plp-card__footer">
                                            <div className="plp-card__pricing">
                                                <span className="plp-card__price">{formatPrice(product.price)}</span>
                                                <span className="plp-card__original">{formatPrice(product.originalPrice)}</span>
                                            </div>
                                            <motion.button
                                                className="plp-card__cart-btn"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={e => e.preventDefault()}
                                            >
                                                <HiShoppingCart size={18} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
