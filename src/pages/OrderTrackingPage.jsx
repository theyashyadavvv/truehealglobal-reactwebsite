import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GradientButton from '../components/GradientButton';
import { HiArrowLeft, HiCheck, HiClock, HiTruck, HiLocationMarker, HiPhone, HiRefresh } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { trackOrder, fetchOrderDetails } from '../api/services/orders';
import { getDeliveryManLocation } from '../api/services/delivery';
import './OrderTrackingPage.css';

const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: HiClock },
    { key: 'confirmed', label: 'Confirmed', icon: HiCheck },
    { key: 'processing', label: 'Preparing', icon: HiClock },
    { key: 'handover', label: 'Ready', icon: HiCheck },
    { key: 'picked_up', label: 'On the Way', icon: HiTruck },
    { key: 'delivered', label: 'Delivered', icon: HiCheck },
];

export default function OrderTrackingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [trackData, setTrackData] = useState(null);
    const [order, setOrder] = useState(null);
    const [dmLocation, setDmLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) { navigate('/login'); return; }
        loadTracking();
        const interval = setInterval(loadTracking, 30000); // refresh every 30s
        return () => clearInterval(interval);
    }, [id, isLoggedIn]);

    const loadTracking = async () => {
        try {
            const [track, details, dmLoc] = await Promise.allSettled([
                trackOrder(id),
                fetchOrderDetails(id),
                getDeliveryManLocation(id),
            ]);
            if (track.status === 'fulfilled') setTrackData(track.value);
            if (details.status === 'fulfilled') setOrder(details.value?.order || details.value);
            if (dmLoc.status === 'fulfilled') setDmLocation(dmLoc.value);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p || 0);
    const formatDate = (d) => d ? new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '';

    const currentStatus = (trackData?.order_status || order?.order_status || 'pending').toLowerCase().replace(/ /g, '_');
    const currentStepIdx = statusSteps.findIndex(s => s.key === currentStatus);

    if (loading) {
        return (
            <main className="tracking-page">
                <div className="container" style={{ paddingTop: '8rem' }}>
                    <div style={{ height: 400, borderRadius: 16, background: 'var(--color-surface)', animation: 'pulse 1.5s infinite' }} />
                </div>
            </main>
        );
    }

    return (
        <main className="tracking-page">
            <section className="tracking-page__hero">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <button className="tracking-back" onClick={() => navigate('/orders')}><HiArrowLeft size={20} /> Back to Orders</button>
                        <h1 className="tracking-page__title">Tracking Order #{id}</h1>
                        <p className="tracking-page__subtitle">
                            {currentStatus === 'delivered' ? 'Your order has been delivered!' : 'Your order is on its way'}
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="tracking-page__content section">
                <div className="container">
                    <div className="tracking-layout">
                        {/* Timeline */}
                        <div className="tracking-timeline-card">
                            <h3>Order Status</h3>
                            <div className="tracking-vertical-timeline">
                                {statusSteps.map((step, i) => {
                                    const done = i <= currentStepIdx;
                                    const active = i === currentStepIdx;
                                    const StepIcon = step.icon;
                                    return (
                                        <div key={step.key} className={`vt-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                                            <div className="vt-dot"><StepIcon size={16} /></div>
                                            {i < statusSteps.length - 1 && <div className={`vt-line ${i < currentStepIdx ? 'done' : ''}`} />}
                                            <div className="vt-content">
                                                <span className="vt-label">{step.label}</span>
                                                {active && <span className="vt-time">Current</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <button className="tracking-refresh" onClick={loadTracking}>
                                <HiRefresh size={16} /> Refresh Status
                            </button>
                        </div>

                        {/* Info sidebar */}
                        <div className="tracking-info">
                            {/* Delivery Man */}
                            {(trackData?.delivery_man || order?.delivery_man) && (
                                <div className="tracking-dm-card">
                                    <h4>Delivery Partner</h4>
                                    <div className="tracking-dm">
                                        <div className="tracking-dm__avatar">
                                            <img
                                                src={(trackData?.delivery_man || order?.delivery_man)?.image_full_url || '/assets/image/placeholder.png'}
                                                alt="DM"
                                                onError={e => e.target.src = '/assets/image/placeholder.png'}
                                            />
                                        </div>
                                        <div>
                                            <p className="tracking-dm__name">
                                                {(trackData?.delivery_man || order?.delivery_man)?.f_name} {(trackData?.delivery_man || order?.delivery_man)?.l_name}
                                            </p>
                                            {(trackData?.delivery_man || order?.delivery_man)?.phone && (
                                                <a href={`tel:${(trackData?.delivery_man || order?.delivery_man)?.phone}`} className="tracking-dm__phone">
                                                    <HiPhone size={14} /> Call
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Delivery Address */}
                            {order?.delivery_address && (
                                <div className="tracking-addr-card">
                                    <h4><HiLocationMarker size={16} /> Delivery Address</h4>
                                    <p>{order.delivery_address.address}</p>
                                    {order.delivery_address.contact_person_number && (
                                        <p className="tracking-addr__phone">{order.delivery_address.contact_person_number}</p>
                                    )}
                                </div>
                            )}

                            {/* Order summary */}
                            <div className="tracking-order-card">
                                <h4>Order Summary</h4>
                                <div className="tracking-order-row"><span>Items</span><span>{order?.details?.length || 0}</span></div>
                                <div className="tracking-order-row"><span>Payment</span><span style={{ textTransform: 'capitalize' }}>{(order?.payment_method || '').replace(/_/g, ' ')}</span></div>
                                <div className="tracking-order-row total"><span>Total</span><span>{formatPrice(order?.order_amount)}</span></div>

                                <Link to={`/orders/${id}`}>
                                    <GradientButton size="sm" block variant="accent">View Full Details</GradientButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
