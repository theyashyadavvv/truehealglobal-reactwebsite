import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchStoreDetails } from '../api/services/stores';
import { fetchStoreItems } from '../api/services/items';
import ScrollReveal from '../components/ScrollReveal';
import { HiStar, HiLocationMarker, HiPhone, HiMail } from 'react-icons/hi';
import GradientButton from '../components/GradientButton';
import './StoreDetailPage.css';

export default function StoreDetailPage() {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadStoreData() {
            try {
                setLoading(true);
                // Fetch store details first, items separately so store still shows if items fail
                const storeData = await fetchStoreDetails(id);
                setStore(storeData);
                // Fetch store items — won't block store display if it fails
                try {
                    const itemsData = await fetchStoreItems(id);
                    setProducts(itemsData.products || itemsData.items || []);
                } catch (itemErr) {
                    console.warn('Failed to load store items:', itemErr);
                    setProducts([]);
                }
                setLoading(false);
            } catch (err) {
                console.error('Failed to load store:', err);
                setError('Failed to load store details.');
                setLoading(false);
            }
        }
        if (id) {
            loadStoreData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="store-detail-page" style={{ paddingTop: '120px', minHeight: '60vh', display: 'flex', justifyContent: 'center' }}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error || !store) {
        return (
            <div className="store-detail-page" style={{ paddingTop: '120px', textAlign: 'center' }}>
                <h2>{error || 'Store not found'}</h2>
                <Link to="/stores"><GradientButton>Browse Stores</GradientButton></Link>
            </div>
        );
    }

    return (
        <div className="store-detail-page">
            <div className="store-header">
                <div className="store-header__cover">
                    <img src={store.cover_photo_full_url || store.cover_photo || '/assets/image/placeholder_store.png'} alt="" />
                    <div className="store-header__overlay" />
                </div>
                <div className="container store-header__content">
                    <div className="store-header__info-box">
                        <div className="store-header__logo">
                            <img src={store.logo_full_url || store.logo || '/assets/image/placeholder.png'} alt={store.name} />
                        </div>
                        <div className="store-header__text">
                            <h1 className="store-header__name">{store.name}</h1>
                            <div className="store-header__meta">
                                <span className="rating">
                                    <HiStar /> {store.avg_rating ? store.avg_rating.toFixed(1) : 'New'} ({store.rating_count || 0} Reviews)
                                </span>
                                <span className="location">
                                    <HiLocationMarker /> {store.address || 'Location Unavailable'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="store-header__actions">
                        <GradientButton>Contact Store</GradientButton>
                        <GradientButton variant="accent">Follow</GradientButton>
                    </div>
                </div>
            </div>

            <section className="store-products section">
                <div className="container">
                    <h2 className="section-title text-left">Products from {store.name}</h2>
                    {products.length === 0 ? (
                        <p className="text-gray-400">No products available in this store yet.</p>
                    ) : (
                        <div className="products-grid">
                            {products.map((product, i) => (
                                <ScrollReveal key={product.id} delay={i * 0.05}>
                                    <Link to={`/products/${product.id}`} className="product-card">
                                        <div className="product-card__image">
                                            {product.discount > 0 && <span className="product-card__badge">-{product.discount}%</span>}
                                            <img src={product.image_full_url || product.image || '/assets/image/placeholder.png'} alt={product.name} />
                                        </div>
                                        <div className="product-card__content">
                                            <div className="product-card__rating">
                                                <HiStar /> {product.avg_rating ? product.avg_rating.toFixed(1) : 4.5}
                                            </div>
                                            <h3 className="product-card__title">{product.name}</h3>
                                            <div className="product-card__footer">
                                                <span className="product-card__price">₹{product.price}</span>
                                                <button className="product-card__btn">Add</button>
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
