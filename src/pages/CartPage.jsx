import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import GradientButton from '../components/GradientButton';
import { HiTrash, HiShoppingCart, HiArrowRight, HiArrowLeft, HiShieldCheck, HiTruck, HiRefresh } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './CartPage.css';

export default function CartPage() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const { items: cartItems, loading, updateItem, removeItem: ctxRemoveItem, clearCart, refreshCart, subtotal: cartSubtotal } = useCart();
    const toast = useToast();

    const handleCheckout = () => {
        if (!isLoggedIn) {
            toast.info('Please sign in to complete your order');
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }
        navigate('/checkout');
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

    const updateQuantity = async (id, delta) => {
        const item = cartItems.find(i => i.id === id);
        if (!item) return;
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        try {
            // Match Flutter OnlineCart.toJson() — include all fields for cart update
            await updateItem({
                cart_id: id,
                price: String(item.price || 0),
                quantity: newQty,
                variant: item.variant || '',
                variation: item.variation || [],
                add_on_ids: item.add_on_ids || [],
                add_on_qtys: item.add_on_qtys || [],
                item_id: item.item_id || item.id,
                model: item.model || 'Item',
            });
        } catch (e) { toast.error(e.message || 'Failed to update quantity'); }
    };

    const removeItem = async (id) => {
        try {
            await ctxRemoveItem(id);
            toast.success('Item removed from cart');
        } catch (e) { toast.error(e.message || 'Failed to remove item'); }
    };

    const subtotal = cartSubtotal || cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    const shipping = subtotal > 50000 ? 0 : 499;
    const discount = Math.round(subtotal * 0.05);
    const total = subtotal - discount + shipping;

    if (cartItems.length === 0) {
        return (
            <main className="cart-page">
                <div className="container">
                    <motion.div
                        className="cart-empty"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="cart-empty__icon">🛒</div>
                        <h2 className="cart-empty__title">Your Cart is Empty</h2>
                        <p className="cart-empty__text">Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/products">
                            <GradientButton size="lg">
                                <HiShoppingCart size={20} /> Browse Products
                            </GradientButton>
                        </Link>
                    </motion.div>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page">
            <section className="cart-page__hero">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="cart-page__title">Shopping Cart</h1>
                        <p className="cart-page__subtitle">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
                    </motion.div>
                </div>
            </section>

            <section className="cart-page__content section">
                <div className="container">
                    <div className="cart-layout">
                        {/* Cart items */}
                        <div className="cart-items">
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>Loading cart...</div>
                            ) : (
                                <AnimatePresence>
                                    {cartItems.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            className="cart-item"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20, height: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                        >
                                            <div className="cart-item__image">
                                                <img
                                                    src={item.image_full_url || item.image || '/assets/image/placeholder.jpg'}
                                                    alt={item.name}
                                                    className="cart-item-image"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = '/assets/image/placeholder.jpg'; }}
                                                />
                                            </div>
                                            <div className="cart-item__details">
                                                <span className="cart-item__category">
                                                    {item.store_name || item.module_name || 'Product'}
                                                </span>
                                                <h3 className="cart-item__name">{item.name}</h3>
                                                <div className="cart-item__pricing">
                                                    <span className="cart-item__price">{formatPrice(item.price)}</span>
                                                </div>
                                            </div>
                                            <div className="cart-item__actions">
                                                <div className="cart-item__quantity">
                                                    <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                                                    <span>{item.quantity || 1}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                                </div>
                                                <span className="cart-item__subtotal">{formatPrice((item.price || 0) * (item.quantity || 1))}</span>
                                                <button className="cart-item__remove" onClick={() => removeItem(item.id)}>
                                                    <HiTrash size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}

                            <div className="cart-continue">
                                <Link to="/products">
                                    <GradientButton variant="accent">
                                        <HiArrowLeft size={18} /> Continue Shopping
                                    </GradientButton>
                                </Link>
                            </div>
                        </div>

                        {/* Order summary */}
                        <ScrollReveal direction="left">
                            <div className="cart-summary">
                                <h3 className="cart-summary__title">Order Summary</h3>

                                <div className="cart-summary__row">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="cart-summary__row cart-summary__row--discount">
                                    <span>Discount (5%)</span>
                                    <span>-{formatPrice(discount)}</span>
                                </div>
                                <div className="cart-summary__row">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                                </div>

                                <div className="cart-summary__divider" />

                                <div className="cart-summary__row cart-summary__row--total">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>

                                {shipping > 0 && (
                                    <p className="cart-summary__free-shipping">
                                        Add {formatPrice(50000 - subtotal)} more for free shipping!
                                    </p>
                                )}

                                <GradientButton size="lg" block onClick={handleCheckout}>
                                    Proceed to Checkout <HiArrowRight size={18} />
                                </GradientButton>

                                <div className="cart-summary__trust">
                                    <div><HiShieldCheck size={16} /> Secure Checkout</div>
                                    <div><HiTruck size={16} /> Fast Delivery</div>
                                    <div><HiRefresh size={16} /> Easy Returns</div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>
        </main>
    );
}
