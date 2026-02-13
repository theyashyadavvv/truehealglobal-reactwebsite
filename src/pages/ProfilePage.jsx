import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import {
    HiUser, HiShoppingBag, HiLocationMarker, HiHeart,
    HiCog, HiLogout, HiChevronRight, HiStar, HiTruck,
    HiCheck, HiClock
} from 'react-icons/hi';
import GradientButton from '../components/GradientButton';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { fetchOrderHistory } from '../api/services/orders';
import { fetchAddresses, deleteAddress as deleteAddressApi } from '../api/services/address';
import { fetchWishlist, removeFromWishlist } from '../api/services/wishlist';
import { updateProfile } from '../api/services/customer';
import './ProfilePage.css';

const tabs = [
    { id: 'orders', label: 'Orders', icon: HiShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: HiLocationMarker },
    { id: 'wishlist', label: 'Wishlist', icon: HiHeart },
    { id: 'settings', label: 'Settings', icon: HiCog },
];

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('orders');
    const { user, isLoggedIn, logout, refreshUser } = useAuth();
    const { addItem } = useCart();
    const navigate = useNavigate();

    // Orders
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    // Addresses
    const [addresses, setAddresses] = useState([]);
    const [addressesLoading, setAddressesLoading] = useState(false);

    // Wishlist
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    // Settings
    const [settingsForm, setSettingsForm] = useState({ f_name: '', l_name: '', email: '', phone: '' });
    const [settingsSaving, setSettingsSaving] = useState(false);
    const [settingsMsg, setSettingsMsg] = useState('');

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoggedIn) navigate('/login');
    }, [isLoggedIn, navigate]);

    // Populate settings from user
    useEffect(() => {
        if (user) {
            setSettingsForm({
                f_name: user.f_name || '',
                l_name: user.l_name || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    // Load tab data
    useEffect(() => {
        if (activeTab === 'orders' && orders.length === 0) loadOrders();
        if (activeTab === 'addresses' && addresses.length === 0) loadAddresses();
        if (activeTab === 'wishlist' && wishlistItems.length === 0) loadWishlist();
    }, [activeTab]);

    const loadOrders = async () => {
        setOrdersLoading(true);
        try {
            const data = await fetchOrderHistory({ offset: 1, limit: 20 });
            setOrders(data.orders || data.data || data || []);
        } catch (e) { console.error(e); }
        finally { setOrdersLoading(false); }
    };

    const loadAddresses = async () => {
        setAddressesLoading(true);
        try {
            const data = await fetchAddresses();
            setAddresses(data.addresses || data.data || data || []);
        } catch (e) { console.error(e); }
        finally { setAddressesLoading(false); }
    };

    const loadWishlist = async () => {
        setWishlistLoading(true);
        try {
            const data = await fetchWishlist();
            setWishlistItems(data.items || data.products || data || []);
        } catch (e) { console.error(e); }
        finally { setWishlistLoading(false); }
    };

    const handleDeleteAddress = async (id) => {
        try {
            await deleteAddressApi(id);
            setAddresses(prev => prev.filter(a => a.id !== id));
        } catch (e) { console.error(e); }
    };

    const handleRemoveWishlist = async (item) => {
        try {
            await removeFromWishlist(item.id, !!item.store_id);
            setWishlistItems(prev => prev.filter(w => w.id !== item.id));
        } catch (e) { console.error(e); }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSettingsSaving(true);
        setSettingsMsg('');
        try {
            await updateProfile(settingsForm);
            await refreshUser();
            setSettingsMsg('Profile updated successfully!');
        } catch (err) {
            setSettingsMsg(err.message || 'Update failed');
        } finally { setSettingsSaving(false); }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price || 0);

    const statusConfig = {
        delivered: { icon: HiCheck, color: 'var(--color-success, #22c55e)', label: 'Delivered' },
        shipped: { icon: HiTruck, color: 'var(--color-primary, #6366f1)', label: 'Shipped' },
        processing: { icon: HiClock, color: 'var(--color-warning, #f59e0b)', label: 'Processing' },
        pending: { icon: HiClock, color: 'var(--color-warning, #f59e0b)', label: 'Pending' },
        confirmed: { icon: HiCheck, color: 'var(--color-primary, #6366f1)', label: 'Confirmed' },
        canceled: { icon: HiClock, color: '#ef4444', label: 'Cancelled' },
        failed: { icon: HiClock, color: '#ef4444', label: 'Failed' },
        refunded: { icon: HiClock, color: '#8b5cf6', label: 'Refunded' },
    };

    const userName = user ? `${user.f_name || ''} ${user.l_name || ''}`.trim() : 'User';
    const userEmail = user?.email || '';

    return (
        <main className="profile-page">
            {/* Profile Header */}
            <section className="profile-header">
                <div className="container">
                    <motion.div
                        className="profile-header__content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="profile-header__avatar">
                            {user?.image_full_url ? (
                                <img src={user.image_full_url} alt={userName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                <HiUser size={32} />
                            )}
                        </div>
                        <div className="profile-header__info">
                            <h1 className="profile-header__name">{userName}</h1>
                            <p className="profile-header__email">{userEmail}</p>
                            {user?.phone && <p className="profile-header__member">{user.phone}</p>}
                        </div>
                        <div className="profile-header__stats">
                            <div className="profile-stat">
                                <span className="profile-stat__value">{user?.order_count || orders.length}</span>
                                <span className="profile-stat__label">Orders</span>
                            </div>
                            <div className="profile-stat">
                                <span className="profile-stat__value">{user?.wishlist_count || wishlistItems.length}</span>
                                <span className="profile-stat__label">Wishlist</span>
                            </div>
                            <div className="profile-stat">
                                <span className="profile-stat__value">{addresses.length}</span>
                                <span className="profile-stat__label">Addresses</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Tabs + Content */}
            <section className="profile-content section">
                <div className="container">
                    <div className="profile-layout">
                        {/* Sidebar */}
                        <nav className="profile-sidebar">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`profile-sidebar__btn ${activeTab === tab.id ? 'profile-sidebar__btn--active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <tab.icon size={18} />
                                    <span>{tab.label}</span>
                                    <HiChevronRight size={16} className="profile-sidebar__arrow" />
                                </button>
                            ))}
                            <button className="profile-sidebar__btn profile-sidebar__btn--logout" onClick={handleLogout}>
                                <HiLogout size={18} />
                                <span>Logout</span>
                            </button>
                        </nav>

                        {/* Main Content */}
                        <div className="profile-main">
                            {/* Orders */}
                            {activeTab === 'orders' && (
                                <ScrollReveal>
                                    <h2 className="profile-main__title">Order History</h2>
                                    {ordersLoading ? (
                                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>Loading orders...</div>
                                    ) : orders.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>No orders yet.</div>
                                    ) : (
                                    <div className="orders-list">
                                        {orders.map(order => {
                                            const statusKey = (order.order_status || 'pending').toLowerCase();
                                            const status = statusConfig[statusKey] || statusConfig.pending;
                                            const StatusIcon = status.icon;
                                            return (
                                                <div key={order.id} className="order-card">
                                                    <div className="order-card__header">
                                                        <div>
                                                            <span className="order-card__id">#{order.id}</span>
                                                            <span className="order-card__date">{order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</span>
                                                        </div>
                                                        <span className="order-card__status" style={{ color: status.color, background: `${status.color}15` }}>
                                                            <StatusIcon size={14} /> {status.label}
                                                        </span>
                                                    </div>
                                                    {order.details && order.details.length > 0 && (
                                                    <div className="order-card__items">
                                                        {order.details.slice(0, 3).map((detail, idx) => (
                                                            <div key={idx} className="order-card__item">
                                                                <div className="order-card__item-image">
                                                                    <img src={detail.item_details?.image_full_url || '/assets/image/placeholder.png'} alt={detail.item_details?.name || 'Item'} onError={e => e.target.src = '/assets/image/placeholder.png'} />
                                                                </div>
                                                                <div>
                                                                    <p className="order-card__item-name">{detail.item_details?.name || `Item x${detail.quantity}`}</p>
                                                                    <p className="order-card__item-price">{formatPrice(detail.price)} x {detail.quantity}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    )}
                                                    <div className="order-card__footer">
                                                        <span className="order-card__total">Total: <strong>{formatPrice(order.order_amount)}</strong></span>
                                                        <GradientButton size="sm" variant="accent">View Details</GradientButton>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    )}
                                </ScrollReveal>
                            )}

                            {/* Addresses */}
                            {activeTab === 'addresses' && (
                                <ScrollReveal>
                                    <h2 className="profile-main__title">Saved Addresses</h2>
                                    {addressesLoading ? (
                                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>Loading addresses...</div>
                                    ) : (
                                    <div className="addresses-grid">
                                        {addresses.map(addr => (
                                            <div key={addr.id} className={`address-card ${addr.address_type === 'home' ? 'address-card--default' : ''}`}>
                                                <div className="address-card__header">
                                                    <span className="address-card__label">{addr.address_type || 'Other'}</span>
                                                </div>
                                                <h4 className="address-card__name">{addr.contact_person_name || userName}</h4>
                                                <p className="address-card__text">{addr.address}</p>
                                                {addr.city && <p className="address-card__text">{addr.city}</p>}
                                                <p className="address-card__phone">{addr.contact_person_number || ''}</p>
                                                <div className="address-card__actions">
                                                    <GradientButton size="sm" variant="accent" onClick={() => handleDeleteAddress(addr.id)}>Delete</GradientButton>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="address-card address-card--add">
                                            <span>+</span>
                                            Add New Address
                                        </button>
                                    </div>
                                    )}
                                </ScrollReveal>
                            )}

                            {/* Wishlist */}
                            {activeTab === 'wishlist' && (
                                <ScrollReveal>
                                    <h2 className="profile-main__title">My Wishlist</h2>
                                    {wishlistLoading ? (
                                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>Loading wishlist...</div>
                                    ) : wishlistItems.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>Your wishlist is empty.</div>
                                    ) : (
                                    <div className="wishlist-grid">
                                        {wishlistItems.map(product => (
                                            <Link key={product.id} to={`/products/${product.id}`} className="wishlist-card hover-lift">
                                                <div className="wishlist-card__image hover-zoom">
                                                    <img src={product.image_full_url || product.image || '/assets/image/placeholder.png'} alt={product.name} onError={e => e.target.src = '/assets/image/placeholder.png'} />
                                                </div>
                                                <div className="wishlist-card__body">
                                                    <h3>{product.name}</h3>
                                                    <div className="wishlist-card__footer">
                                                        <span className="wishlist-card__price">{formatPrice(product.price)}</span>
                                                        <GradientButton
                                                            size="sm"
                                                            onClick={e => { e.preventDefault(); handleRemoveWishlist(product); }}
                                                        >
                                                            Remove
                                                        </GradientButton>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    )}
                                </ScrollReveal>
                            )}

                            {/* Settings */}
                            {activeTab === 'settings' && (
                                <ScrollReveal>
                                    <h2 className="profile-main__title">Account Settings</h2>
                                    <form className="settings-form" onSubmit={handleSaveSettings}>
                                        {settingsMsg && (
                                            <div style={{ padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.9rem',
                                                color: settingsMsg.includes('success') ? '#22c55e' : '#ef4444',
                                                background: settingsMsg.includes('success') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
                                                {settingsMsg}
                                            </div>
                                        )}
                                        <div className="settings-group">
                                            <label>First Name</label>
                                            <input type="text" value={settingsForm.f_name} onChange={e => setSettingsForm(prev => ({ ...prev, f_name: e.target.value }))} />
                                        </div>
                                        <div className="settings-group">
                                            <label>Last Name</label>
                                            <input type="text" value={settingsForm.l_name} onChange={e => setSettingsForm(prev => ({ ...prev, l_name: e.target.value }))} />
                                        </div>
                                        <div className="settings-group">
                                            <label>Email</label>
                                            <input type="email" value={settingsForm.email} onChange={e => setSettingsForm(prev => ({ ...prev, email: e.target.value }))} />
                                        </div>
                                        <div className="settings-group">
                                            <label>Phone</label>
                                            <input type="tel" value={settingsForm.phone} onChange={e => setSettingsForm(prev => ({ ...prev, phone: e.target.value }))} />
                                        </div>
                                        <GradientButton type="submit" disabled={settingsSaving}>
                                            {settingsSaving ? 'Saving...' : 'Save Changes'}
                                        </GradientButton>
                                    </form>
                                </ScrollReveal>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
