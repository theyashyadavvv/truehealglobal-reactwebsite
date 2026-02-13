import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import GradientButton from '../components/GradientButton';
import { HiHeart, HiStar, HiShoppingCart, HiTrash } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { fetchWishlist, removeFromWishlist } from '../api/services/wishlist';
import './WishlistPage.css';

export default function WishlistPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isLoggedIn } = useAuth();
    const { addItem } = useCart();
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) { navigate('/login'); return; }
        loadWishlist();
    }, [isLoggedIn]);

    const loadWishlist = async () => {
        try {
            const data = await fetchWishlist();
            setItems(data?.items || data?.products || data?.item || (Array.isArray(data) ? data : []));
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleRemove = async (item) => {
        try {
            await removeFromWishlist(item.id, false);
            setItems(prev => prev.filter(i => i.id !== item.id));
            toast.success('Removed from wishlist');
        } catch (e) { toast.error(e.message || 'Failed to remove'); }
    };

    const handleAddToCart = async (item, e) => {
        e.preventDefault();
        try {
            await addItem({
                item_id: item.id,
                price: String(item.price || 0),
                quantity: 1,
                variation: [],
                add_on_ids: [],
                add_on_qtys: [],
                model: 'Item',
            });
            toast.success(`${item.name} added to cart!`);
        } catch (e) { toast.error(e.message || 'Failed to add to cart'); }
    };

    const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p || 0);

    return (
        <main className="wishlist-page">
            <section className="wishlist-page__hero">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="wishlist-page__title">My Wishlist</h1>
                        <p className="wishlist-page__subtitle">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
                    </motion.div>
                </div>
            </section>

            <section className="wishlist-page__content section">
                <div className="container">
                    {loading ? (
                        <div className="wishlist-grid">
                            {[1, 2, 3, 4].map(i => <div key={i} className="wishlist-skeleton" />)}
                        </div>
                    ) : items.length === 0 ? (
                        <div className="wishlist-empty">
                            <div className="wishlist-empty__icon">❤️</div>
                            <h3>Your wishlist is empty</h3>
                            <p>Start adding items you love!</p>
                            <Link to="/products"><GradientButton size="lg">Browse Products</GradientButton></Link>
                        </div>
                    ) : (
                        <div className="wishlist-grid">
                            <AnimatePresence>
                                {items.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: i * 0.03 }}
                                    >
                                        <Link to={`/products/${item.id}`} className="wl-card hover-lift">
                                            <div className="wl-card__image hover-zoom">
                                                <img src={item.image_full_url || item.image || '/assets/image/placeholder.png'} alt={item.name} onError={e => e.target.src = '/assets/image/placeholder.png'} />
                                                <button className="wl-card__remove" onClick={e => { e.preventDefault(); handleRemove(item); }}>
                                                    <HiTrash size={16} />
                                                </button>
                                            </div>
                                            <div className="wl-card__body">
                                                <span className="wl-card__store">{item.store_name || ''}</span>
                                                <h3 className="wl-card__name">{item.name}</h3>
                                                <div className="wl-card__rating">
                                                    <HiStar style={{ color: '#f59e0b' }} />
                                                    <span>{item.avg_rating?.toFixed(1) || '0.0'} ({item.rating_count || 0})</span>
                                                </div>
                                                <div className="wl-card__footer">
                                                    <span className="wl-card__price">{formatPrice(item.price)}</span>
                                                    <motion.button className="wl-card__cart" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={e => handleAddToCart(item, e)}>
                                                        <HiShoppingCart size={16} /> Add
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
