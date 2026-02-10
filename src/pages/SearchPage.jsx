import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { HiSearch, HiStar, HiShoppingCart, HiX } from 'react-icons/hi';
import { products } from '../data/mockData';
import './SearchPage.css';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [priceRange, setPriceRange] = useState('all');
    const [category, setCategory] = useState('all');

    const results = useMemo(() => {
        let filtered = [...products];

        if (query.trim()) {
            const q = query.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
        }

        if (category !== 'all') {
            filtered = filtered.filter(p => p.category === category);
        }

        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number);
            filtered = filtered.filter(p => p.price >= min && (!max || p.price <= max));
        }

        return filtered;
    }, [query, category, priceRange]);

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

    return (
        <main className="search-page">
            <section className="search-page__hero">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="search-page__hero-content"
                    >
                        <h1 className="search-page__title">Search Products</h1>
                        <div className="search-page__input-wrap">
                            <HiSearch size={22} className="search-page__input-icon" />
                            <input
                                type="text"
                                className="search-page__input"
                                placeholder="Search for hydrogen machines, alkaline filters..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                autoFocus
                            />
                            {query && (
                                <button className="search-page__clear" onClick={() => setQuery('')}>
                                    <HiX size={18} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="search-page__content section">
                <div className="container">
                    {/* Filters */}
                    <motion.div
                        className="search-page__filters"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="search-page__filter-group">
                            <span>Category:</span>
                            {['all', 'hydrogen', 'alkaline'].map(cat => (
                                <button
                                    key={cat}
                                    className={`search-page__filter-btn ${category === cat ? 'search-page__filter-btn--active' : ''}`}
                                    onClick={() => setCategory(cat)}
                                >
                                    {cat === 'all' ? 'All' : cat === 'hydrogen' ? 'Hydrogen' : 'Alkaline'}
                                </button>
                            ))}
                        </div>
                        <div className="search-page__filter-group">
                            <span>Price:</span>
                            {[
                                { label: 'All', value: 'all' },
                                { label: 'Under ₹30K', value: '0-30000' },
                                { label: '₹30K-₹50K', value: '30000-50000' },
                                { label: '₹50K+', value: '50000-999999' },
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    className={`search-page__filter-btn ${priceRange === opt.value ? 'search-page__filter-btn--active' : ''}`}
                                    onClick={() => setPriceRange(opt.value)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Results count */}
                    <p className="search-page__count">
                        {results.length} product{results.length !== 1 ? 's' : ''} found
                        {query && <> for "<strong>{query}</strong>"</>}
                    </p>

                    {/* Results grid */}
                    {results.length > 0 ? (
                        <div className="search-page__grid">
                            {results.map((product, i) => (
                                <ScrollReveal key={product.id} delay={i * 0.05}>
                                    <Link to={`/products/${product.id}`} className="search-card hover-lift">
                                        <div className="search-card__image hover-zoom">
                                            {product.badge && <span className="search-card__badge">{product.badge}</span>}
                                            <img src={product.image} alt={product.name} />
                                        </div>
                                        <div className="search-card__body">
                                            <span className="search-card__category">
                                                {product.category === 'hydrogen' ? 'Hydrogen' : 'Alkaline'}
                                            </span>
                                            <h3 className="search-card__name">{product.name}</h3>
                                            <div className="search-card__rating">
                                                <div className="stars">
                                                    {[...Array(5)].map((_, j) => (
                                                        <HiStar key={j} style={{ opacity: j < Math.floor(product.rating) ? 1 : 0.3 }} />
                                                    ))}
                                                </div>
                                                <span>({product.reviews})</span>
                                            </div>
                                            <div className="search-card__footer">
                                                <div>
                                                    <span className="search-card__price">{formatPrice(product.price)}</span>
                                                    <span className="search-card__original">{formatPrice(product.originalPrice)}</span>
                                                </div>
                                                <motion.button
                                                    className="search-card__cart"
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
                    ) : (
                        <motion.div
                            className="search-empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="search-empty__icon">🔍</div>
                            <h3>No products found</h3>
                            <p>Try adjusting your search or filter criteria.</p>
                        </motion.div>
                    )}
                </div>
            </section>
        </main>
    );
}
