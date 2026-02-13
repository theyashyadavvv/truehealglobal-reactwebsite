import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import GradientButton from '../components/GradientButton';
import { HiCheck, HiShoppingBag, HiTruck, HiXCircle, HiExclamation } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import './OrderSuccessPage.css';

export default function OrderSuccessPage() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('id');
    const status = searchParams.get('status'); // from payment callback: success, fail, cancel
    const { clearCart } = useCart();

    // Clear cart on successful payment callback
    useEffect(() => {
        if (status === 'success' || !status) {
            // If coming from digital payment with success, clear cart
            clearCart().catch(err => console.warn('Cart clear after order:', err.message));
        }
    }, []);

    const isFailed = status === 'fail';
    const isCancelled = status === 'cancel';
    const isSuccess = !isFailed && !isCancelled;

    return (
        <main className="order-success-page">
            <div className="container">
                <motion.div
                    className="order-success-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <motion.div
                        className={`order-success-icon ${isFailed ? 'order-success-icon--error' : isCancelled ? 'order-success-icon--warning' : ''}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    >
                        {isFailed ? <HiXCircle size={48} /> : isCancelled ? <HiExclamation size={48} /> : <HiCheck size={48} />}
                    </motion.div>

                    <h1 className="order-success-title">
                        {isFailed ? 'Payment Failed' : isCancelled ? 'Payment Cancelled' : 'Order Placed Successfully!'}
                    </h1>
                    {orderId && <p className="order-success-id">Order ID: #{orderId}</p>}
                    <p className="order-success-text">
                        {isFailed
                            ? 'Your payment could not be processed. Please try again or choose a different payment method.'
                            : isCancelled
                                ? 'You cancelled the payment. Your order is saved — you can retry payment from your orders.'
                                : 'Thank you for your order. You will receive a confirmation soon.'
                        }
                    </p>

                    <div className="order-success-actions">
                        {isSuccess && orderId && (
                            <Link to={`/order-tracking/${orderId}`}>
                                <GradientButton size="lg"><HiTruck size={18} /> Track Order</GradientButton>
                            </Link>
                        )}
                        {(isFailed || isCancelled) && orderId && (
                            <Link to={`/orders/${orderId}`}>
                                <GradientButton size="lg">View Order &amp; Retry Payment</GradientButton>
                            </Link>
                        )}
                        <Link to="/orders">
                            <GradientButton size="lg" variant="accent"><HiShoppingBag size={18} /> My Orders</GradientButton>
                        </Link>
                        <Link to="/products">
                            <GradientButton size="lg" variant="accent">Continue Shopping</GradientButton>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
