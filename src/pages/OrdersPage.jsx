import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import GradientButton from '../components/GradientButton';
import {
    HiShoppingBag, HiClock, HiCheck, HiTruck, HiX,
    HiArrowRight, HiRefresh
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { fetchRunningOrders, fetchOrderHistory } from '../api/services/orders';
import './OrdersPage.css';

const statusConfig = {
    pending: { icon: HiClock, color: '#f59e0b', label: 'Pending' },
    confirmed: { icon: HiCheck, color: '#6366f1', label: 'Confirmed' },
    accepted: { icon: HiCheck, color: '#6366f1', label: 'Accepted' },
    processing: { icon: HiClock, color: '#f59e0b', label: 'Processing' },
    handover: { icon: HiTruck, color: '#3b82f6', label: 'Handover' },
    picked_up: { icon: HiTruck, color: '#3b82f6', label: 'Picked Up' },
    delivered: { icon: HiCheck, color: '#22c55e', label: 'Delivered' },
    canceled: { icon: HiX, color: '#ef4444', label: 'Cancelled' },
    failed: { icon: HiX, color: '#ef4444', label: 'Failed' },
    refunded: { icon: HiRefresh, color: '#8b5cf6', label: 'Refunded' },
    refund_requested: { icon: HiRefresh, color: '#8b5cf6', label: 'Refund Requested' },
};

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState('running');
    const [runningOrders, setRunningOrders] = useState([]);
    const [historyOrders, setHistoryOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [page, setPage] = useState(1);
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) { navigate('/login'); return; }
        loadRunningOrders();
    }, [isLoggedIn]);

    useEffect(() => {
        if (activeTab === 'history' && historyOrders.length === 0) {
            loadHistoryOrders();
        }
    }, [activeTab]);

    const loadRunningOrders = async () => {
        setLoading(true);
        try {
            const data = await fetchRunningOrders({ offset: 1, limit: 20 });
            setRunningOrders(data?.orders || data?.data || (Array.isArray(data) ? data : []));
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const loadHistoryOrders = async () => {
        setHistoryLoading(true);
        try {
            const data = await fetchOrderHistory({ offset: 1, limit: 50 });
            setHistoryOrders(data?.orders || data?.data || (Array.isArray(data) ? data : []));
        } catch (e) { console.error(e); }
        finally { setHistoryLoading(false); }
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price || 0);

    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

    const orders = activeTab === 'running' ? runningOrders : historyOrders;
    const isLoading = activeTab === 'running' ? loading : historyLoading;

    return (
        <main className="orders-page">
            <section className="orders-page__hero">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="orders-page__title">My Orders</h1>
                    </motion.div>
                </div>
            </section>

            <section className="orders-page__content section">
                <div className="container">
                    <div className="orders-page__tabs">
                        <button className={`orders-tab ${activeTab === 'running' ? 'active' : ''}`} onClick={() => setActiveTab('running')}>
                            Running Orders
                        </button>
                        <button className={`orders-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                            Order History
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="orders-loading">
                            {[1, 2, 3].map(i => <div key={i} className="order-skeleton" />)}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="orders-empty">
                            <div className="orders-empty__icon">📋</div>
                            <h3>{activeTab === 'running' ? 'No active orders' : 'No order history'}</h3>
                            <p>{activeTab === 'running' ? 'You don\'t have any running orders right now.' : 'You haven\'t placed any orders yet.'}</p>
                            <Link to="/products">
                                <GradientButton size="lg"><HiShoppingBag size={18} /> Shop Now</GradientButton>
                            </Link>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order, i) => {
                                const statusKey = (order.order_status || 'pending').toLowerCase().replace(/ /g, '_');
                                const status = statusConfig[statusKey] || statusConfig.pending;
                                const StatusIcon = status.icon;
                                return (
                                    <ScrollReveal key={order.id} delay={i * 0.05}>
                                        <div className="order-card-full">
                                            <div className="order-card-full__header">
                                                <div>
                                                    <h3 className="order-card-full__id">Order #{order.id}</h3>
                                                    <p className="order-card-full__date">{formatDate(order.created_at)}</p>
                                                </div>
                                                <span className="order-card-full__status" style={{ color: status.color, background: `${status.color}15` }}>
                                                    <StatusIcon size={14} /> {status.label}
                                                </span>
                                            </div>

                                            {order.details && order.details.length > 0 && (
                                                <div className="order-card-full__items">
                                                    {order.details.slice(0, 3).map((detail, idx) => (
                                                        <div key={idx} className="order-card-full__item">
                                                            <img
                                                                src={detail.item_details?.image_full_url || '/assets/image/placeholder.png'}
                                                                alt={detail.item_details?.name || 'Item'}
                                                                onError={e => e.target.src = '/assets/image/placeholder.png'}
                                                            />
                                                            <div>
                                                                <p className="item-name">{detail.item_details?.name || `Item #${detail.item_id}`}</p>
                                                                <p className="item-meta">{formatPrice(detail.price)} x {detail.quantity}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {order.details.length > 3 && (
                                                        <p className="order-card-full__more">+{order.details.length - 3} more items</p>
                                                    )}
                                                </div>
                                            )}

                                            <div className="order-card-full__footer">
                                                <div className="order-card-full__total">
                                                    <span>Total:</span>
                                                    <strong>{formatPrice(order.order_amount)}</strong>
                                                </div>
                                                <div className="order-card-full__actions">
                                                    {['pending', 'confirmed', 'accepted', 'processing', 'handover', 'picked_up'].includes(statusKey) && (
                                                        <Link to={`/order-tracking/${order.id}`}>
                                                            <GradientButton size="sm">Track Order</GradientButton>
                                                        </Link>
                                                    )}
                                                    <Link to={`/orders/${order.id}`}>
                                                        <GradientButton size="sm" variant="accent">Details <HiArrowRight size={14} /></GradientButton>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
