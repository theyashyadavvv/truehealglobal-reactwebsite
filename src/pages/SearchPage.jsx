import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { HiSearch, HiStar, HiShoppingCart, HiX } from 'react-icons/hi';
import { searchItemsAndStores } from '../api/services/items';
import './SearchPage.css';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [storeResults, setStoreResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Debounced search using live API
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setStoreResults([]);
            setSearched(false);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                setLoading(true);
                const data = await searchItemsAndStores(query);
                setResults(data.items || data.products || []);
                setStoreResults(data.stores || []);
                setSearched(true);
            } catch (err) {
                console.error('Search failed:', err);
            } finally {
                setLoading(false);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

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
                        <h1 className="search-page__title">Search Products & Stores</h1>
                        <div className="search-page__input-wrap">
                            <HiSearch size={22} className="search-page__input-icon" />
                            <input
                                type="text"
                                className="search-page__input"
                                placeholder="Search for products, stores..."
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
                    {loading ? (
                        <div className="search-page__grid">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{ height: 280, borderRadius: 16, background: 'var(--color-surface, #1a1a2e)', animation: 'pulse 1.5s infinite' }} />
                            ))}
                        </div>
                    ) : searched ? (
                        <>
                            <p className="search-page__count">
                                {results.length} product{results.length !== 1 ? 's' : ''} 
                                {storeResults.length > 0 && ` and ${storeResults.length} store${storeResults.length !== 1 ? 's' : ''}`} found
                                {query && <> for "<strong>{query}</strong>"</>}
                            </p>

                            {/* Store results */}
                            {storeResults.length > 0 && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>Stores</h3>
                                    <div className="search-page__grid">
                                        {storeResults.map((store, i) => (
                                            <ScrollReveal key={store.id} delay={i * 0.05}>
                                                <Link to={`/stores/${store.id}`} className="search-card hover-lift">
                                                    <div className="search-card__image hover-zoom">
                                                        <img
                                                            src={store.logo_full_url || store.logo || '/assets/image/placeholder.png'}
                                                            alt={store.name}
                                                            onError={(e) => e.target.src = '/assets/image/placeholder.png'}
                                                        />
                                                    </div>
                                                    <div className="search-card__body">
                                                        <h3 className="search-card__name">{store.name}</h3>
                                                        <div className="search-card__rating">
                                                            <div className="stars">
                                                                {[...Array(5)].map((_, j) => (
                                                                    <HiStar key={j} style={{ opacity: j < Math.floor(store.avg_rating || 0) ? 1 : 0.3 }} />
                                                                ))}
                                                            </div>
                                                            <span>({store.rating_count || 0})</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </ScrollReveal>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Product results */}
                            {results.length > 0 ? (
                                <>
                                    {storeResults.length > 0 && <h3 style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>Products</h3>}
                                    <div className="search-page__grid">
                                        {results.map((product, i) => {
                                            const image = product.image_full_url || product.image || '/assets/image/placeholder.png';
                                            return (
                                                <ScrollReveal key={product.id} delay={i * 0.05}>
                                                    <Link to={`/products/${product.id}`} className="search-card hover-lift">
                                                        <div className="search-card__image hover-zoom">
                                                            {product.discount > 0 && (
                                                                <span className="search-card__badge">
                                                                    {product.discount_type === 'percent' ? `${product.discount}%` : `₹${product.discount}`} off
                                                                </span>
                                                            )}
                                                            <img src={image} alt={product.name} onError={(e) => e.target.src = '/assets/image/placeholder.png'} />
                                                        </div>
                                                        <div className="search-card__body">
                                                            <span className="search-card__category">
                                                                {product.store_name || 'Product'}
                                                            </span>
                                                            <h3 className="search-card__name">{product.name}</h3>
                                                            <div className="search-card__rating">
                                                                <div className="stars">
                                                                    {[...Array(5)].map((_, j) => (
                                                                        <HiStar key={j} style={{ opacity: j < Math.floor(product.avg_rating || 0) ? 1 : 0.3 }} />
                                                                    ))}
                                                                </div>
                                                                <span>({product.rating_count || 0})</span>
                                                            </div>
                                                            <div className="search-card__footer">
                                                                <div>
                                                                    <span className="search-card__price">{formatPrice(product.price)}</span>
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
                                            );
                                        })}
                                    </div>
                                </>
                            ) : results.length === 0 && storeResults.length === 0 ? (
                                <motion.div
                                    className="search-empty"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="search-empty__icon">🔍</div>
                                    <h3>No results found</h3>
                                    <p>Try adjusting your search terms.</p>
                                </motion.div>
                            ) : null}
                        </>
                    ) : (
                        <motion.div
                            className="search-empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="search-empty__icon">🔍</div>
                            <h3>Start typing to search</h3>
                            <p>Search across all products and stores.</p>
                        </motion.div>
                    )}
                </div>
            </section>
        </main>
    );
}
