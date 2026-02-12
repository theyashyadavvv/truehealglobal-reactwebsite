import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import GradientButton from '../components/GradientButton';
import {
    HiArrowLeft, HiCheck, HiClock, HiTruck, HiLocationMarker,
    HiCreditCard, HiX, HiRefresh, HiPhone
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { fetchOrderDetails, cancelOrder, fetchCancellationReasons } from '../api/services/orders';
import './OrderDetailsPage.css';

const statusSteps = ['pending', 'confirmed', 'processing', 'handover', 'picked_up', 'delivered'];
const statusLabels = { pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing', handover: 'Handover', picked_up: 'Picked Up', delivered: 'Delivered' };

export default function OrderDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const toast = useToast();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelModal, setCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancellationReasons, setCancellationReasons] = useState([]);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) { navigate('/login'); return; }
        loadOrder();
    }, [id, isLoggedIn]);

    const loadOrder = async () => {
        setLoading(true);
        try {
            const data = await fetchOrderDetails(id);
            setOrder(data?.order || data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const openCancelModal = async () => {
        setCancelModal(true);
        try {
            const data = await fetchCancellationReasons();
            setCancellationReasons(data || []);
        } catch (e) { console.error(e); }
    };

    const handleCancel = async () => {
        setCancelling(true);
        try {
            await cancelOrder({ order_id: id, reason: cancelReason });
            toast.success('Order cancelled successfully');
            await loadOrder();
            setCancelModal(false);
        } catch (e) { toast.error(e.message || 'Failed to cancel order'); }
        finally { setCancelling(false); }
    };

    const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p || 0);
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

    if (loading) {
        return (
            <main className="orderdet-page">
                <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
                    <div className="order-skeleton" style={{ height: 400, borderRadius: 16 }} />
                </div>
            </main>
        );
    }

    if (!order) {
        return (
            <main className="orderdet-page">
                <div className="container" style={{ paddingTop: '8rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    <h2>Order not found</h2>
                    <Link to="/orders"><GradientButton>Back to Orders</GradientButton></Link>
                </div>
            </main>
        );
    }

    const currentStatus = (order.order_status || 'pending').toLowerCase().replace(/ /g, '_');
    const isCancelled = ['canceled', 'cancelled', 'failed', 'refunded', 'refund_requested'].includes(currentStatus);
    const currentStep = statusSteps.indexOf(currentStatus);
    const canCancel = ['pending', 'confirmed'].includes(currentStatus);

    return (
        <main className="orderdet-page">
            <section className="orderdet-page__hero">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <button className="orderdet-back" onClick={() => navigate('/orders')}><HiArrowLeft size={20} /> Back to Orders</button>
                        <h1 className="orderdet-page__title">Order #{order.id}</h1>
                        <p className="orderdet-page__date">{formatDate(order.created_at)}</p>
                    </motion.div>
                </div>
            </section>

            <section className="orderdet-page__content section">
                <div className="container">
                    <div className="orderdet-layout">
                        <div className="orderdet-main">
                            {/* Status Timeline */}
                            {!isCancelled && (
                                <ScrollReveal>
                                    <div className="orderdet-section">
                                        <h3 className="orderdet-section__title">Order Progress</h3>
                                        <div className="orderdet-timeline">
                                            {statusSteps.map((step, i) => {
                                                const done = i <= currentStep;
                                                const active = i === currentStep;
                                                return (
                                                    <div key={step} className={`timeline-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                                                        <div className="timeline-dot">
                                                            {done ? <HiCheck size={14} /> : <span>{i + 1}</span>}
                                                        </div>
                                                        <span className="timeline-label">{statusLabels[step]}</span>
                                                        {i < statusSteps.length - 1 && <div className={`timeline-line ${i < currentStep ? 'done' : ''}`} />}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </ScrollReveal>
                            )}

                            {isCancelled && (
                                <div className="orderdet-section orderdet-cancelled">
                                    <HiX size={24} />
                                    <span>This order has been {currentStatus.replace(/_/g, ' ')}</span>
                                </div>
                            )}

                            {/* Items */}
                            <ScrollReveal delay={0.1}>
                                <div className="orderdet-section">
                                    <h3 className="orderdet-section__title">Order Items</h3>
                                    <div className="orderdet-items">
                                        {(order.details || []).map((detail, idx) => (
                                            <div key={idx} className="orderdet-item">
                                                <img
                                                    src={detail.item_details?.image_full_url || '/assets/image/placeholder.png'}
                                                    alt={detail.item_details?.name || 'Item'}
                                                    onError={e => e.target.src = '/assets/image/placeholder.png'}
                                                />
                                                <div className="orderdet-item__info">
                                                    <p className="orderdet-item__name">{detail.item_details?.name || `Item #${detail.item_id}`}</p>
                                                    <p className="orderdet-item__meta">Qty: {detail.quantity} x {formatPrice(detail.price)}</p>
                                                </div>
                                                <span className="orderdet-item__total">{formatPrice(detail.price * detail.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* Delivery Address */}
                            {order.delivery_address && (
                                <ScrollReveal delay={0.15}>
                                    <div className="orderdet-section">
                                        <h3 className="orderdet-section__title"><HiLocationMarker /> Delivery Address</h3>
                                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                                            {order.delivery_address.contact_person_name && <strong>{order.delivery_address.contact_person_name}<br /></strong>}
                                            {order.delivery_address.address}
                                            {order.delivery_address.contact_person_number && <><br /><HiPhone size={14} style={{ verticalAlign: 'middle' }} /> {order.delivery_address.contact_person_number}</>}
                                        </p>
                                    </div>
                                </ScrollReveal>
                            )}
                        </div>

                        {/* Sidebar */}
                        <ScrollReveal direction="left">
                            <div className="orderdet-summary">
                                <h3 className="orderdet-summary__title">Payment Summary</h3>
                                <div className="orderdet-summary__row"><span>Subtotal</span><span>{formatPrice(order.order_amount - (order.total_tax_amount || 0) - (order.delivery_charge || 0) + (order.coupon_discount_amount || 0))}</span></div>
                                {order.coupon_discount_amount > 0 && (
                                    <div className="orderdet-summary__row discount"><span>Coupon Discount</span><span>-{formatPrice(order.coupon_discount_amount)}</span></div>
                                )}
                                {order.total_tax_amount > 0 && (
                                    <div className="orderdet-summary__row"><span>Tax</span><span>{formatPrice(order.total_tax_amount)}</span></div>
                                )}
                                <div className="orderdet-summary__row"><span>Delivery</span><span>{order.delivery_charge > 0 ? formatPrice(order.delivery_charge) : 'Free'}</span></div>
                                {order.dm_tips > 0 && (
                                    <div className="orderdet-summary__row"><span>Tip</span><span>{formatPrice(order.dm_tips)}</span></div>
                                )}
                                <div className="orderdet-summary__divider" />
                                <div className="orderdet-summary__row total"><span>Total</span><span>{formatPrice(order.order_amount)}</span></div>

                                <div className="orderdet-summary__payment">
                                    <HiCreditCard size={16} />
                                    <span>{(order.payment_method || 'N/A').replace(/_/g, ' ')}</span>
                                </div>

                                {['pending', 'confirmed', 'accepted', 'processing', 'handover', 'picked_up'].includes(currentStatus) && (
                                    <Link to={`/order-tracking/${order.id}`}>
                                        <GradientButton size="lg" block><HiTruck size={18} /> Track Order</GradientButton>
                                    </Link>
                                )}

                                {canCancel && (
                                    <button className="orderdet-cancel-btn" onClick={openCancelModal}>Cancel Order</button>
                                )}
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Cancel Modal */}
            {cancelModal && (
                <div className="orderdet-modal-overlay" onClick={() => setCancelModal(false)}>
                    <div className="orderdet-modal" onClick={e => e.stopPropagation()}>
                        <h3>Cancel Order</h3>
                        <p>Why do you want to cancel this order?</p>
                        {cancellationReasons.length > 0 ? (
                            <div className="cancel-reasons">
                                {cancellationReasons.map((r, i) => (
                                    <label key={i} className="cancel-reason">
                                        <input type="radio" name="reason" value={r.reason || r} onChange={e => setCancelReason(e.target.value)} />
                                        <span>{r.reason || r}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <textarea placeholder="Please provide a reason..." value={cancelReason} onChange={e => setCancelReason(e.target.value)} rows={3} className="cancel-textarea" />
                        )}
                        <div className="cancel-actions">
                            <button className="cancel-actions__close" onClick={() => setCancelModal(false)}>Keep Order</button>
                            <GradientButton onClick={handleCancel} disabled={cancelling || !cancelReason}>
                                {cancelling ? 'Cancelling...' : 'Cancel Order'}
                            </GradientButton>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
