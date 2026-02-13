import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import GradientButton from '../components/GradientButton';
import {
    HiLocationMarker, HiCreditCard, HiCash, HiClock,
    HiArrowLeft, HiPlus, HiCheck, HiShieldCheck, HiTag
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAppConfig } from '../context/AppConfigContext';
import { fetchAddresses } from '../api/services/address';
import { applyCoupon } from '../api/services/coupons';
import { placeOrder } from '../api/services/orders';
import { BASE_URL, getGuestId } from '../api/config';
import './CheckoutPage.css';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { user, isLoggedIn, token } = useAuth();
    const { items: cartItems, subtotal, clearCart } = useCart();
    const toast = useToast();
    const { toggles, config } = useAppConfig();

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [orderNote, setOrderNote] = useState('');
    const [dmTips, setDmTips] = useState('0');
    const [loading, setLoading] = useState(false);
    const [addressLoading, setAddressLoading] = useState(true);
    const [error, setError] = useState('');

    // Payment method options based on config toggles
    const paymentMethods = [];
    if (toggles?.cashOnDelivery !== false) {
        paymentMethods.push({ id: 'cash_on_delivery', label: 'Cash on Delivery', icon: HiCash });
    }
    if (toggles?.digitalPayment !== false) {
        paymentMethods.push({ id: 'digital_payment', label: 'Online Payment', icon: HiCreditCard });
    }
    if (toggles?.wallet !== false) {
        paymentMethods.push({ id: 'wallet', label: 'Wallet', icon: HiShieldCheck });
    }

    const tipOptions = ['0', '10', '20', '50', '100'];

    useEffect(() => {
        if (!isLoggedIn) { navigate('/login'); return; }
        if (cartItems.length === 0) { navigate('/cart'); return; }
        loadAddresses();
    }, [isLoggedIn, cartItems.length]);

    const loadAddresses = async () => {
        try {
            const data = await fetchAddresses();
            const list = data?.addresses || data?.data || (Array.isArray(data) ? data : []);
            setAddresses(list);
            if (list.length > 0) setSelectedAddress(list[0]);
        } catch (e) { console.error(e); }
        finally { setAddressLoading(false); }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponError('');
        try {
            const storeId = cartItems[0]?.item?.store_id || cartItems[0]?.store_id || '';
            const data = await applyCoupon(couponCode, storeId);
            if (data.discount) {
                setCouponDiscount(data.discount);
                setCouponApplied(true);
                toast.success(`Coupon applied! You save ₹${data.discount}`);
            } else {
                setCouponError(data.message || 'Invalid coupon');
            }
        } catch (err) {
            setCouponError(err.message || 'Coupon failed');
        }
    };

    const shipping = subtotal > 50000 ? 0 : 499;
    const tipAmount = parseFloat(dmTips) || 0;
    const total = subtotal - couponDiscount + shipping + tipAmount;

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            setError('Please select a delivery address');
            toast.warning('Please select a delivery address');
            return;
        }
        setError('');
        setLoading(true);
        try {
            // Build order body matching Flutter's PlaceOrderBodyModel.toJson()
            const orderBody = {
                cart: JSON.stringify(cartItems.map(item => ({
                    item_id: item.item_id || item.id,
                    cart_id: item.cart_id || item.id,
                    item_campaign_id: item.item_campaign_id || null,
                    price: String(item.price || 0),
                    variant: item.variant || '',
                    variation: item.variation || [],
                    quantity: item.quantity || 1,
                    add_on_ids: item.add_on_ids || [],
                    add_on_qtys: item.add_on_qtys || [],
                    model: 'Item',
                }))),
                order_amount: String(total),
                payment_method: paymentMethod,
                order_type: 'delivery',
                store_id: String(cartItems[0]?.item?.store_id || cartItems[0]?.store_id || ''),
                // For multi-store carts, include all store IDs
                store_ids: [...new Set(cartItems.map(i => i.item?.store_id || i.store_id).filter(Boolean))].map(String),
                coupon_code: couponApplied ? couponCode : '',
                coupon_discount_amount: String(couponDiscount),
                coupon_discount_title: couponApplied ? 'Coupon' : '',
                discount_amount: '0',
                tax_amount: '0',
                distance: '0',
                schedule_at: '',
                order_note: orderNote,
                dm_tips: dmTips,
                address: selectedAddress.address || '',
                latitude: String(selectedAddress.latitude || ''),
                longitude: String(selectedAddress.longitude || ''),
                contact_person_name: selectedAddress.contact_person_name || user?.f_name || '',
                contact_person_number: selectedAddress.contact_person_number || user?.phone || '',
                contact_person_email: user?.email || '',
                address_type: selectedAddress.address_type || 'other',
                road: selectedAddress.road || '',
                house: selectedAddress.house || '',
                floor: selectedAddress.floor || '',
                delivery_address_id: String(selectedAddress.id),
                partial_payment: '0',
                is_buy_now: '0',
                guest_id: getGuestId() || '',
            };

            const data = await placeOrder(orderBody);
            const orderId = data.order_id || data.id;

            if (orderId) {
                // Digital payment → redirect to payment gateway (matching Flutter web flow)
                if (paymentMethod === 'digital_payment') {
                    const userId = user?.id || getGuestId();
                    const callbackUrl = `${window.location.origin}/order-success?id=${orderId}&status=`;
                    const paymentUrl = `${BASE_URL}/payment-mobile?order_id=${orderId}&customer_id=${userId}&payment_method=stripe&payment_platform=web&callback=${encodeURIComponent(callbackUrl)}`;
                    toast.info('Redirecting to payment gateway...');
                    window.location.href = paymentUrl;
                    return;
                }

                // COD or Wallet → success
                await clearCart();
                toast.success('Order placed successfully!');
                navigate(`/order-success?id=${orderId}`);
            } else if (data.errors) {
                const msg = typeof data.errors === 'object'
                    ? Object.values(data.errors).flat().join('. ')
                    : String(data.errors);
                setError(msg);
                toast.error(msg);
            } else {
                setError(data.message || 'Order placement failed');
                toast.error(data.message || 'Order placement failed');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong');
            toast.error(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price || 0);

    return (
        <main className="checkout-page">
            <section className="checkout-page__hero">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="checkout-page__title">Checkout</h1>
                        <p className="checkout-page__subtitle">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in order</p>
                    </motion.div>
                </div>
            </section>

            <section className="checkout-page__content section">
                <div className="container">
                    <div className="checkout-layout">
                        <div className="checkout-main">
                            {/* Delivery Address */}
                            <ScrollReveal>
                                <div className="checkout-section">
                                    <h3 className="checkout-section__title"><HiLocationMarker /> Delivery Address</h3>
                                    {addressLoading ? (
                                        <div className="checkout-skeleton" />
                                    ) : addresses.length === 0 ? (
                                        <div className="checkout-empty-address">
                                            <p>No saved addresses found</p>
                                            <GradientButton size="sm" onClick={() => navigate('/addresses')}>
                                                <HiPlus size={16} /> Add Address
                                            </GradientButton>
                                        </div>
                                    ) : (
                                        <div className="checkout-addresses">
                                            {addresses.map(addr => (
                                                <div
                                                    key={addr.id}
                                                    className={`checkout-address-card ${selectedAddress?.id === addr.id ? 'selected' : ''}`}
                                                    onClick={() => setSelectedAddress(addr)}
                                                >
                                                    <div className="checkout-address-card__check">
                                                        {selectedAddress?.id === addr.id && <HiCheck size={16} />}
                                                    </div>
                                                    <div className="checkout-address-card__content">
                                                        <span className="checkout-address-card__type">{addr.address_type || 'Other'}</span>
                                                        <p className="checkout-address-card__text">{addr.address}</p>
                                                        <p className="checkout-address-card__contact">{addr.contact_person_name} - {addr.contact_person_number}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </ScrollReveal>

                            {/* Payment Method */}
                            <ScrollReveal delay={0.1}>
                                <div className="checkout-section">
                                    <h3 className="checkout-section__title"><HiCreditCard /> Payment Method</h3>
                                    <div className="checkout-payment-methods">
                                        {paymentMethods.map(pm => (
                                            <div
                                                key={pm.id}
                                                className={`checkout-payment-card ${paymentMethod === pm.id ? 'selected' : ''}`}
                                                onClick={() => setPaymentMethod(pm.id)}
                                            >
                                                <pm.icon size={22} />
                                                <span>{pm.label}</span>
                                                {paymentMethod === pm.id && <HiCheck size={16} />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* Delivery Tip */}
                            <ScrollReveal delay={0.12}>
                                <div className="checkout-section">
                                    <h3 className="checkout-section__title"><HiCash /> Delivery Tip</h3>
                                    <div className="checkout-tips">
                                        {tipOptions.map(tip => (
                                            <button
                                                key={tip}
                                                className={`checkout-tip-btn ${dmTips === tip ? 'selected' : ''}`}
                                                onClick={() => setDmTips(tip)}
                                            >
                                                {tip === '0' ? 'No Tip' : `₹${tip}`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* Coupon */}
                            <ScrollReveal delay={0.15}>
                                <div className="checkout-section">
                                    <h3 className="checkout-section__title"><HiTag /> Apply Coupon</h3>
                                    <div className="checkout-coupon">
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={e => setCouponCode(e.target.value)}
                                            disabled={couponApplied}
                                        />
                                        {couponApplied ? (
                                            <button className="coupon-remove-btn" onClick={() => { setCouponApplied(false); setCouponDiscount(0); setCouponCode(''); }}>Remove</button>
                                        ) : (
                                            <button className="coupon-apply-btn" onClick={handleApplyCoupon}>Apply</button>
                                        )}
                                    </div>
                                    {couponError && <p className="checkout-coupon-error">{couponError}</p>}
                                    {couponApplied && <p className="checkout-coupon-success">Coupon applied! You save {formatPrice(couponDiscount)}</p>}
                                </div>
                            </ScrollReveal>

                            {/* Order Note */}
                            <ScrollReveal delay={0.2}>
                                <div className="checkout-section">
                                    <h3 className="checkout-section__title"><HiClock /> Order Note</h3>
                                    <textarea
                                        className="checkout-note"
                                        rows={3}
                                        placeholder="Any special instructions..."
                                        value={orderNote}
                                        onChange={e => setOrderNote(e.target.value)}
                                    />
                                </div>
                            </ScrollReveal>
                        </div>

                        {/* Order Summary Sidebar */}
                        <ScrollReveal direction="left">
                            <div className="checkout-summary">
                                <h3 className="checkout-summary__title">Order Summary</h3>

                                <div className="checkout-summary__items">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="checkout-summary__item">
                                            <img
                                                src={item.image_full_url || item.image || '/assets/image/placeholder.jpg'}
                                                alt={item.name}
                                                onError={e => {
                                                    console.log('Image failed:', e.target.src);
                                                    e.target.onerror = null;
                                                    e.target.src = '/assets/image/placeholder.jpg';
                                                }}
                                            />
                                            <div>
                                                <p className="item-name">{item.name}</p>
                                                <p className="item-qty">x{item.quantity || 1}</p>
                                            </div>
                                            <span>{formatPrice((item.price || 0) * (item.quantity || 1))}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="checkout-summary__divider" />

                                <div className="checkout-summary__row">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="checkout-summary__row checkout-summary__row--discount">
                                        <span>Coupon Discount</span>
                                        <span>-{formatPrice(couponDiscount)}</span>
                                    </div>
                                )}
                                <div className="checkout-summary__row">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                                </div>
                                {tipAmount > 0 && (
                                    <div className="checkout-summary__row">
                                        <span>Delivery Tip</span>
                                        <span>{formatPrice(tipAmount)}</span>
                                    </div>
                                )}

                                <div className="checkout-summary__divider" />

                                <div className="checkout-summary__row checkout-summary__row--total">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>

                                {error && <div className="checkout-error">{error}</div>}

                                <GradientButton size="lg" block onClick={handlePlaceOrder} disabled={loading}>
                                    {loading ? 'Placing Order...' : `Place Order - ${formatPrice(total)}`}
                                </GradientButton>

                                <button className="checkout-back-btn" onClick={() => navigate('/cart')}>
                                    <HiArrowLeft size={16} /> Back to Cart
                                </button>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>
        </main>
    );
}
