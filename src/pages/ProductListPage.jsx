import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { HiStar, HiShoppingCart, HiFilter, HiViewGrid, HiViewList, HiChevronDown } from 'react-icons/hi';
import { fetchPopularItems, fetchDiscountedItems } from '../api/services/items';
import { useCategories } from '../hooks/useDataHooks';
import './ProductListPage.css';

export default function ProductListPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('popular');
    const [offset, setOffset] = useState(1);
    const [totalSize, setTotalSize] = useState(0);
    const limit = 20;

    const { data: categoriesData } = useCategories();
    const categories = Array.isArray(categoriesData) ? categoriesData : [];

    useEffect(() => {
        loadItems();
    }, [offset]);

    async function loadItems() {
        try {
            setLoading(true);
            if (offset === 1) {
                // First load: combine popular + discounted for richer listing
                const [popData, discData] = await Promise.all([
                    fetchPopularItems({ offset: 1, limit: 50 }),
                    fetchDiscountedItems({ offset: 1, limit: 50 }),
                ]);
                const popItems = popData.products || popData.items || [];
                const discItems = discData.products || discData.items || [];
                // Merge and deduplicate by id
                const merged = [...popItems];
                const seen = new Set(popItems.map(i => i.id));
                discItems.forEach(i => { if (!seen.has(i.id)) { merged.push(i); seen.add(i.id); } });
                setItems(merged);
                setTotalSize(merged.length);
            } else {
                // Subsequent pages — keep existing items
                const data = await fetchPopularItems({ offset, limit });
                const newItems = data.products || data.items || [];
                setItems(prev => {
                    const seen = new Set(prev.map(i => i.id));
                    const unique = newItems.filter(i => !seen.has(i.id));
                    return [...prev, ...unique];
                });
                setTotalSize(data.total_size || 0);
            }
            setError(null);
        } catch (err) {
            console.error('Failed to load products:', err);
            setError('Failed to load products.');
        } finally {
            setLoading(false);
        }
    }

    const sorted = useMemo(() => {
        let result = [...items];
        switch (sortBy) {
            case 'price-low': result.sort((a, b) => a.price - b.price); break;
            case 'price-high': result.sort((a, b) => b.price - a.price); break;
            case 'rating': result.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0)); break;
            default: break;
        }
        return result;
    }, [items, sortBy]);

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

    return (
        <main className="product-list">
            <section className="product-list__hero">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="section-label" style={{ color: 'var(--color-primary-light)' }}>Our Collection</p>
                        <h1 className="product-list__title">All Products</h1>
                        <p className="product-list__subtitle">
                            Discover our complete range of wellness and health products
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="product-list__main section">
                <div className="container">
                    <div className="product-list__toolbar">
                        <div className="product-list__controls">
                            <div className="product-list__sort">
                                <span>Sort:</span>
                                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                                    <option value="popular">Latest</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                            <span className="product-list__count">{totalSize || sorted.length} products</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="product-list__grid">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} style={{ height: 360, borderRadius: 16, background: 'var(--color-surface, #1a1a2e)', animation: 'pulse 1.5s infinite' }} />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="error-message" style={{ textAlign: 'center', padding: '3rem' }}>{error}</div>
                    ) : sorted.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
                            <p>No products found.</p>
                        </div>
                    ) : (
                        <>
                            <div className="product-list__grid">
                                {sorted.map((product, i) => {
                                    const image = product.image_full_url || product.image || '/assets/image/placeholder.png';
                                    const discount = product.discount || 0;

                                    return (
                                        <ScrollReveal key={product.id} delay={i * 0.08}>
                                            <Link to={`/products/${product.id}`} className="plp-card card">
                                                {discount > 0 && (
                                                    <span className="plp-card__badge">
                                                        {product.discount_type === 'percent' ? `${discount}% off` : `₹${discount} off`}
                                                    </span>
                                                )}
                                                <div className="plp-card__image">
                                                    <img src={image} alt={product.name} onError={(e) => e.target.src = '/assets/image/placeholder.png'} />
                                                </div>
                                                <div className="plp-card__body">
                                                    <span className="plp-card__category">
                                                        {product.store_name || 'Product'}
                                                    </span>
                                                    <h3 className="plp-card__name">{product.name}</h3>
                                                    <p className="plp-card__desc">{(product.description || '').slice(0, 80)}...</p>
                                                    <div className="plp-card__rating">
                                                        <div className="stars">
                                                            {[...Array(5)].map((_, j) => (
                                                                <HiStar key={j} style={{ opacity: j < Math.floor(product.avg_rating || 0) ? 1 : 0.3 }} />
                                                            ))}
                                                        </div>
                                                        <span>{product.avg_rating ? product.avg_rating.toFixed(1) : 'New'} ({product.rating_count || 0})</span>
                                                    </div>
                                                    <div className="plp-card__footer">
                                                        <div className="plp-card__pricing">
                                                            <span className="plp-card__price">{formatPrice(product.price)}</span>
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
                                    );
                                })}
                            </div>

                            {totalSize > items.length && (
                                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                    <button
                                        className="product-list__cat-btn product-list__cat-btn--active"
                                        onClick={() => setOffset(prev => prev + 1)}
                                    >
                                        Load More
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}
