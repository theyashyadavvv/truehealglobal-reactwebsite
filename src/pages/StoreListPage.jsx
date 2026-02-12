import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { fetchStores, fetchPopularStores, fetchLatestStores } from '../api/services/stores';
import { HiStar, HiShoppingBag, HiSearch, HiFilter, HiEmojiSad } from 'react-icons/hi';
import './StoreListPage.css';

export default function StoreListPage() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all'); // all, veg, non_veg

    useEffect(() => {
        loadStores();
    }, [filter]); // Reload when filter changes

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) {
                performSearch();
            } else {
                loadStores();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    async function loadStores() {
        setLoading(true);
        try {
            // Fetch popular + latest stores and merge for a complete listing
            const [popData, latData] = await Promise.all([
                fetchPopularStores({ limit: 50 }).catch(() => ({ stores: [] })),
                fetchLatestStores({ limit: 50 }).catch(() => ({ stores: [] })),
            ]);
            const popStores = popData.stores || [];
            const latStores = latData.stores || [];
            // Merge & deduplicate
            const merged = [...popStores];
            const seen = new Set(popStores.map(s => s.id));
            latStores.forEach(s => { if (!seen.has(s.id)) { merged.push(s); seen.add(s.id); } });
            setStores(merged);
            setError(null);
        } catch (err) {
            console.error('Failed to load stores:', err);
            setError('Failed to load stores.');
        } finally {
            setLoading(false);
        }
    }

    async function performSearch() {
        setLoading(true);
        try {
            // Filter from already loaded stores client-side
            const query = searchQuery.toLowerCase();
            const [popData, latData] = await Promise.all([
                fetchPopularStores({ limit: 50 }).catch(() => ({ stores: [] })),
                fetchLatestStores({ limit: 50 }).catch(() => ({ stores: [] })),
            ]);
            const all = [...(popData.stores || []), ...(latData.stores || [])];
            const seen = new Set();
            const unique = all.filter(s => { if (seen.has(s.id)) return false; seen.add(s.id); return true; });
            setStores(unique.filter(s => s.name?.toLowerCase().includes(query) || s.address?.toLowerCase().includes(query)));
            setError(null);
        } catch (err) {
            console.error('Search failed:', err);
            setError('Search failed.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="store-list-page">
            <section className="store-list__hero">
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="store-list__title"
                    >
                        Our Partner Stores
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="store-list__subtitle"
                    >
                        Discover verified vendors offering premium water solutions near you.
                    </motion.p>
                </div>
            </section>

            <section className="store-list__content section">
                <div className="container">
                    <div className="store-list__controls">
                        <div className="search-bar">
                            <HiSearch />
                            <input
                                type="text"
                                placeholder="Search stores..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {/* Simple Filter Implementation */}
                        <div className="filter-group">
                            <button
                                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                All
                            </button>
                            {/* Add more filters if API supports them reliably, e.g. veg/non-veg if relevant, or categories */}
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-spinner-container">
                            <div className="loading-spinner"></div>
                        </div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : stores.length === 0 ? (
                        <div className="empty-state">
                            <HiEmojiSad size={48} />
                            <p>No stores found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="store-list__grid">
                            {stores.map((store, i) => (
                                <ScrollReveal key={store.id} delay={i * 0.05}>
                                    <Link to={`/stores/${store.id}`} className="store-card store-card--large">
                                        <div className="store-card__cover">
                                            <img
                                                src={store.cover_photo_full_url || store.cover_photo || '/assets/image/placeholder_store.png'}
                                                alt=""
                                                onError={(e) => e.target.src = '/assets/image/placeholder_store.png'}
                                            />
                                            {store.discount && (
                                                <span className="store-card__discount">
                                                    {store.discount.discount}{store.discount.discount_type === 'percent' ? '%' : ' OFF'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="store-card__info">
                                            <div className="store-card__logo">
                                                <img
                                                    src={store.logo_full_url || store.logo || '/assets/image/placeholder.png'}
                                                    alt={store.name}
                                                    onError={(e) => e.target.src = '/assets/image/placeholder.png'}
                                                />
                                            </div>
                                            <div className="store-card__details">
                                                <h3 className="store-card__name">{store.name}</h3>
                                                <div className="store-card__meta">
                                                    <span className="store-card__rating">
                                                        <HiStar /> {store.avg_rating ? store.avg_rating.toFixed(1) : 'New'}
                                                    </span>
                                                    <span className="store-card__dot">•</span>
                                                    <span className="store-card__delivery">
                                                        {store.delivery_time || '30-45 min'}
                                                    </span>
                                                </div>
                                            </div>
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
