import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Existing pages
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SciencePage from './pages/SciencePage';
import FAQPage from './pages/FAQPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CategoriesPage from './pages/CategoriesPage';
import StoreListPage from './pages/StoreListPage';
import StoreDetailPage from './pages/StoreDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import AlertDemoPage from './pages/AlertDemoPage';
import SignInDemoPage from './pages/SignInDemoPage';
import CartPage from './pages/CartPage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';

// New pages — lazy loaded for reliability
const CategoryItemPage = lazy(() => import('./pages/CategoryItemPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderDetailsPage = lazy(() => import('./pages/OrderDetailsPage'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const AddressPage = lazy(() => import('./pages/AddressPage'));
const WalletPage = lazy(() => import('./pages/WalletPage'));
const CouponPage = lazy(() => import('./pages/CouponPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const BrandsPage = lazy(() => import('./pages/BrandsPage'));
const BrandItemPage = lazy(() => import('./pages/BrandItemPage'));
const FlashSalePage = lazy(() => import('./pages/FlashSalePage'));
const StaticPage = lazy(() => import('./pages/StaticPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }
};

import LoadingSpinner from './components/LoadingSpinner';

export default function App() {
    const location = useLocation();

    const LazyFallback = (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LoadingSpinner size="lg" />
        </div>
    );

    return (
        <>
            <ScrollToTop />
            <Navbar />
            <Suspense fallback={LazyFallback}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        variants={pageVariants}
                        initial={false}
                        animate="animate"
                        exit="exit"
                    >
                        <Routes location={location}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/products" element={<ProductListPage />} />
                            <Route path="/products/:id" element={<ProductDetailPage />} />
                            <Route path="/science" element={<SciencePage />} />
                            <Route path="/faq" element={<FAQPage />} />

                            {/* Auth */}
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                            {/* Categories & Stores */}
                            <Route path="/categories" element={<CategoriesPage />} />
                            <Route path="/categories/:id" element={<CategoryItemPage />} />
                            <Route path="/stores" element={<StoreListPage />} />
                            <Route path="/stores/:id" element={<StoreDetailPage />} />

                            {/* Cart & Checkout */}
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/order-success" element={<OrderSuccessPage />} />

                            {/* Orders */}
                            <Route path="/orders" element={<OrdersPage />} />
                            <Route path="/orders/:id" element={<OrderDetailsPage />} />
                            <Route path="/order-tracking/:id" element={<OrderTrackingPage />} />

                            {/* User Features */}
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/wishlist" element={<WishlistPage />} />
                            <Route path="/addresses" element={<AddressPage />} />
                            <Route path="/wallet" element={<WalletPage />} />
                            <Route path="/coupons" element={<CouponPage />} />
                            <Route path="/notifications" element={<NotificationsPage />} />

                            {/* Brands */}
                            <Route path="/brands" element={<BrandsPage />} />
                            <Route path="/brands/:id" element={<BrandItemPage />} />

                            {/* Flash Sales */}
                            <Route path="/flash-sales" element={<FlashSalePage />} />

                            {/* Static / Legal Pages */}
                            <Route path="/about" element={<StaticPage />} />
                            <Route path="/terms" element={<StaticPage />} />
                            <Route path="/privacy" element={<StaticPage />} />
                            <Route path="/cancellation-policy" element={<StaticPage />} />
                            <Route path="/shipping-policy" element={<StaticPage />} />
                            <Route path="/refund-policy" element={<StaticPage />} />
                            <Route path="/contact-us" element={<ContactPage />} />

                            {/* Demo / Legacy */}
                            <Route path="/alert-demo" element={<AlertDemoPage />} />
                            <Route path="/signin-demo" element={<SignInDemoPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </motion.div>
                </AnimatePresence>
            </Suspense>
            <Footer />
        </>
    );
}
