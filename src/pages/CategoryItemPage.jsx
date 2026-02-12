import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { HiStar, HiShoppingCart, HiFilter } from 'react-icons/hi';
import { fetchSubCategories, fetchCategoryItems, fetchCategoryStores } from '../api/services/categories';
import './CategoryItemPage.css';

export default function CategoryItemPage() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('items');
    const [subCategories, setSubCategories] = useState([]);
    const [activeSubCat, setActiveSubCat] = useState('all');
    const [items, setItems] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [storesLoading, setStoresLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [categoryName, setCategoryName] = useState('');

    // Load subcategories + initial items
    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setItems([]);
        setStores([]);
        setPage(1);
        setActiveSubCat('all');

        Promise.all([
            fetchSubCategories(id).catch(() => []),
            fetchCategoryItems(id, { offset: 1, limit: 20 }).catch(() => ({ products: [] })),
        ]).then(([subData, itemData]) => {
            const subs = Array.isArray(subData) ? subData : subData?.data || [];
            setSubCategories(subs);
            const productList = itemData?.products || itemData?.items || itemData?.data || (Array.isArray(itemData) ? itemData : []);
            setItems(productList);
            setHasMore(productList.length >= 20);
            if (productList.length > 0 && productList[0]?.category_name) {
                setCategoryName(productList[0].category_name);
            }
        }).finally(() => setLoading(false));
    }, [id]);

    // Load stores when tab switches
    useEffect(() => {
        if (activeTab === 'stores' && stores.length === 0) {
            setStoresLoading(true);
            fetchCategoryStores(id, { offset: 1, limit: 20 })
                .then(data => {
                    setStores(data?.stores || data?.data || (Array.isArray(data) ? data : []));
                })
                .catch(() => {})
                .finally(() => setStoresLoading(false));
        }
    }, [activeTab, id]);

    // Load more items
    const loadMore = async () => {
        const nextPage = page + 1;
        try {
            const data = await fetchCategoryItems(id, { offset: nextPage, limit: 20 });
            const newItems = data?.products || data?.items || data?.data || [];
            setItems(prev => [...prev, ...newItems]);
            setHasMore(newItems.length >= 20);
            setPage(nextPage);
        } catch (e) { console.error(e); }
    };

    // Filter by subcategory
    const handleSubCatClick = async (subId) => {
        setActiveSubCat(subId);
        setLoading(true);
        setPage(1);
        try {
            const catId = subId === 'all' ? id : subId;
            const data = await fetchCategoryItems(catId, { offset: 1, limit: 20 });
            const productList = data?.products || data?.items || data?.data || (Array.isArray(data) ? data : []);
            setItems(productList);
            setHasMore(productList.length >= 20);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price || 0);

    return (
        <main className="catitem-page">
            <section className="catitem-page__hero">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="catitem-page__title">{categoryName || 'Category Products'}</h1>
                        <p className="catitem-page__subtitle">
                            {items.length} item{items.length !== 1 ? 's' : ''} available
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="catitem-page__content section">
                <div className="container">
                    {/* Subcategory pills */}
                    {subCategories.length > 0 && (
                        <div className="catitem-page__subcats">
                            <button
                                className={`catitem-page__subcats-btn ${activeSubCat === 'all' ? 'active' : ''}`}
                                onClick={() => handleSubCatClick('all')}
                            >
                                All
                            </button>
                            {subCategories.map(sub => (
                                <button
                                    key={sub.id}
                                    className={`catitem-page__subcats-btn ${activeSubCat === sub.id ? 'active' : ''}`}
                                    onClick={() => handleSubCatClick(sub.id)}
                                >
                                    {sub.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Tabs: Items / Stores */}
                    <div className="catitem-page__tabs">
                        <button
                            className={`catitem-page__tab ${activeTab === 'items' ? 'active' : ''}`}
                            onClick={() => setActiveTab('items')}
                        >
                            Products
                        </button>
                        <button
                            className={`catitem-page__tab ${activeTab === 'stores' ? 'active' : ''}`}
                            onClick={() => setActiveTab('stores')}
                        >
                            Stores
                        </button>
                    </div>

                    {/* Items Tab */}
                    {activeTab === 'items' && (
                        <>
                            {loading ? (
                                <div className="catitem-page__grid">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="catitem-skeleton" />
                                    ))}
                                </div>
                            ) : items.length === 0 ? (
                                <div className="catitem-page__empty">
                                    <div className="catitem-page__empty-icon">📦</div>
                                    <h3>No products found</h3>
                                    <p>This category doesn't have any products yet.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="catitem-page__grid">
                                        {items.map((product, i) => {
                                            const image = product.image_full_url || product.image || '/assets/image/placeholder.png';
                                            return (
                                                <ScrollReveal key={product.id} delay={i * 0.03}>
                                                    <Link to={`/products/${product.id}`} className="catitem-card hover-lift">
                                                        <div className="catitem-card__image hover-zoom">
                                                            {product.discount > 0 && (
                                                                <span className="catitem-card__badge">
                                                                    {product.discount_type === 'percent' ? `${product.discount}%` : `₹${product.discount}`} off
                                                                </span>
                                                            )}
                                                            <img src={image} alt={product.name} onError={e => e.target.src = '/assets/image/placeholder.png'} />
                                                        </div>
                                                        <div className="catitem-card__body">
                                                            <span className="catitem-card__store">{product.store_name || ''}</span>
                                                            <h3 className="catitem-card__name">{product.name}</h3>
                                                            <div className="catitem-card__rating">
                                                                <HiStar className="catitem-card__star" />
                                                                <span>{product.avg_rating?.toFixed(1) || '0.0'}</span>
                                                                <span className="catitem-card__reviews">({product.rating_count || 0})</span>
                                                            </div>
                                                            <div className="catitem-card__footer">
                                                                <span className="catitem-card__price">{formatPrice(product.price)}</span>
                                                                <motion.button
                                                                    className="catitem-card__cart-btn"
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={e => e.preventDefault()}
                                                                >
                                                                    <HiShoppingCart size={16} />
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </ScrollReveal>
                                            );
                                        })}
                                    </div>
                                    {hasMore && (
                                        <div className="catitem-page__loadmore">
                                            <button className="catitem-page__loadmore-btn" onClick={loadMore}>
                                                Load More Products
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {/* Stores Tab */}
                    {activeTab === 'stores' && (
                        <>
                            {storesLoading ? (
                                <div className="catitem-page__grid">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="catitem-skeleton" />
                                    ))}
                                </div>
                            ) : stores.length === 0 ? (
                                <div className="catitem-page__empty">
                                    <div className="catitem-page__empty-icon">🏪</div>
                                    <h3>No stores found</h3>
                                    <p>No stores in this category yet.</p>
                                </div>
                            ) : (
                                <div className="catitem-page__grid">
                                    {stores.map((store, i) => (
                                        <ScrollReveal key={store.id} delay={i * 0.03}>
                                            <Link to={`/stores/${store.id}`} className="catitem-card hover-lift">
                                                <div className="catitem-card__image hover-zoom">
                                                    <img
                                                        src={store.cover_photo_full_url || store.logo_full_url || store.logo || '/assets/image/placeholder.png'}
                                                        alt={store.name}
                                                        onError={e => e.target.src = '/assets/image/placeholder.png'}
                                                    />
                                                </div>
                                                <div className="catitem-card__body">
                                                    <h3 className="catitem-card__name">{store.name}</h3>
                                                    <div className="catitem-card__rating">
                                                        <HiStar className="catitem-card__star" />
                                                        <span>{store.avg_rating?.toFixed(1) || '0.0'}</span>
                                                        <span className="catitem-card__reviews">({store.rating_count || 0})</span>
                                                    </div>
                                                    {store.address && (
                                                        <p className="catitem-card__address">{store.address}</p>
                                                    )}
                                                </div>
                                            </Link>
                                        </ScrollReveal>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}
