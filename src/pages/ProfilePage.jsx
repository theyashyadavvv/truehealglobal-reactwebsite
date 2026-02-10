import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import {
    HiUser, HiShoppingBag, HiLocationMarker, HiHeart,
    HiCog, HiLogout, HiChevronRight, HiStar, HiTruck,
    HiCheck, HiClock
} from 'react-icons/hi';
import { products } from '../data/mockData';
import GradientButton from '../components/GradientButton';
import './ProfilePage.css';

const mockOrders = [
    {
        id: 'THG-20240215',
        date: '15 Feb 2024',
        total: 45999,
        status: 'delivered',
        items: [products[0]],
    },
    {
        id: 'THG-20240128',
        date: '28 Jan 2024',
        total: 34999,
        status: 'shipped',
        items: [products[1]],
    },
    {
        id: 'THG-20240110',
        date: '10 Jan 2024',
        total: 22999,
        status: 'processing',
        items: [products[2]],
    },
];

const mockAddresses = [
    {
        id: 1,
        label: 'Home',
        name: 'John Doe',
        address: '42, Sunrise Apartments, MG Road',
        city: 'Mumbai, Maharashtra - 400001',
        phone: '+91 98765 43210',
        isDefault: true,
    },
    {
        id: 2,
        label: 'Office',
        name: 'John Doe',
        address: '15th Floor, Tech Park, Whitefield',
        city: 'Bangalore, Karnataka - 560066',
        phone: '+91 98765 43210',
        isDefault: false,
    },
];

const tabs = [
    { id: 'orders', label: 'Orders', icon: HiShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: HiLocationMarker },
    { id: 'wishlist', label: 'Wishlist', icon: HiHeart },
    { id: 'settings', label: 'Settings', icon: HiCog },
];

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('orders');

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

    const statusConfig = {
        delivered: { icon: HiCheck, color: 'var(--color-success)', label: 'Delivered' },
        shipped: { icon: HiTruck, color: 'var(--color-primary)', label: 'Shipped' },
        processing: { icon: HiClock, color: 'var(--color-warning)', label: 'Processing' },
    };

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
                            <HiUser size={32} />
                        </div>
                        <div className="profile-header__info">
                            <h1 className="profile-header__name">John Doe</h1>
                            <p className="profile-header__email">john.doe@example.com</p>
                            <p className="profile-header__member">Member since January 2024</p>
                        </div>
                        <div className="profile-header__stats">
                            <div className="profile-stat">
                                <span className="profile-stat__value">{mockOrders.length}</span>
                                <span className="profile-stat__label">Orders</span>
                            </div>
                            <div className="profile-stat">
                                <span className="profile-stat__value">3</span>
                                <span className="profile-stat__label">Wishlist</span>
                            </div>
                            <div className="profile-stat">
                                <span className="profile-stat__value">2</span>
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
                            <button className="profile-sidebar__btn profile-sidebar__btn--logout">
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
                                    <div className="orders-list">
                                        {mockOrders.map(order => {
                                            const status = statusConfig[order.status];
                                            const StatusIcon = status.icon;
                                            return (
                                                <div key={order.id} className="order-card">
                                                    <div className="order-card__header">
                                                        <div>
                                                            <span className="order-card__id">{order.id}</span>
                                                            <span className="order-card__date">{order.date}</span>
                                                        </div>
                                                        <span className="order-card__status" style={{ color: status.color, background: `${status.color}15` }}>
                                                            <StatusIcon size={14} /> {status.label}
                                                        </span>
                                                    </div>
                                                    <div className="order-card__items">
                                                        {order.items.map(item => (
                                                            <div key={item.id} className="order-card__item">
                                                                <div className="order-card__item-image">
                                                                    <img src={item.image} alt={item.name} />
                                                                </div>
                                                                <div>
                                                                    <p className="order-card__item-name">{item.name}</p>
                                                                    <p className="order-card__item-price">{formatPrice(item.price)}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="order-card__footer">
                                                        <span className="order-card__total">Total: <strong>{formatPrice(order.total)}</strong></span>
                                                        <GradientButton size="sm" variant="accent">View Details</GradientButton>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </ScrollReveal>
                            )}

                            {/* Addresses */}
                            {activeTab === 'addresses' && (
                                <ScrollReveal>
                                    <h2 className="profile-main__title">Saved Addresses</h2>
                                    <div className="addresses-grid">
                                        {mockAddresses.map(addr => (
                                            <div key={addr.id} className={`address-card ${addr.isDefault ? 'address-card--default' : ''}`}>
                                                <div className="address-card__header">
                                                    <span className="address-card__label">{addr.label}</span>
                                                    {addr.isDefault && <span className="address-card__badge">Default</span>}
                                                </div>
                                                <h4 className="address-card__name">{addr.name}</h4>
                                                <p className="address-card__text">{addr.address}</p>
                                                <p className="address-card__text">{addr.city}</p>
                                                <p className="address-card__phone">{addr.phone}</p>
                                                <div className="address-card__actions">
                                                    <GradientButton size="sm" variant="accent">Edit</GradientButton>
                                                    {!addr.isDefault && <GradientButton size="sm" variant="accent" style={{ opacity: 0.6 }}>Delete</GradientButton>}
                                                </div>
                                            </div>
                                        ))}
                                        <button className="address-card address-card--add">
                                            <span>+</span>
                                            Add New Address
                                        </button>
                                    </div>
                                </ScrollReveal>
                            )}

                            {/* Wishlist */}
                            {activeTab === 'wishlist' && (
                                <ScrollReveal>
                                    <h2 className="profile-main__title">My Wishlist</h2>
                                    <div className="wishlist-grid">
                                        {products.slice(0, 3).map(product => (
                                            <Link key={product.id} to={`/products/${product.id}`} className="wishlist-card hover-lift">
                                                <div className="wishlist-card__image hover-zoom">
                                                    <img src={product.image} alt={product.name} />
                                                </div>
                                                <div className="wishlist-card__body">
                                                    <h3>{product.name}</h3>
                                                    <div className="wishlist-card__footer">
                                                        <span className="wishlist-card__price">{formatPrice(product.price)}</span>
                                                        <GradientButton
                                                            size="sm"
                                                            onClick={e => e.preventDefault()}
                                                        >
                                                            Add to Cart
                                                        </GradientButton>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </ScrollReveal>
                            )}

                            {/* Settings */}
                            {activeTab === 'settings' && (
                                <ScrollReveal>
                                    <h2 className="profile-main__title">Account Settings</h2>
                                    <div className="settings-form">
                                        <div className="settings-group">
                                            <label>Full Name</label>
                                            <input type="text" defaultValue="John Doe" />
                                        </div>
                                        <div className="settings-group">
                                            <label>Email</label>
                                            <input type="email" defaultValue="john.doe@example.com" />
                                        </div>
                                        <div className="settings-group">
                                            <label>Phone</label>
                                            <input type="tel" defaultValue="+91 98765 43210" />
                                        </div>
                                        <div className="settings-group">
                                            <label>Password</label>
                                            <input type="password" defaultValue="••••••••" />
                                        </div>
                                        <GradientButton>
                                            Save Changes
                                        </GradientButton>
                                    </div>
                                </ScrollReveal>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
