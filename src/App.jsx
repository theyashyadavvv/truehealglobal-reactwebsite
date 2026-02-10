import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }
};

export default function App() {
    const location = useLocation();

    return (
        <>
            <ScrollToTop />
            <Navbar />
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <Routes location={location}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductListPage />} />
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                        <Route path="/science" element={<SciencePage />} />
                        <Route path="/faq" element={<FAQPage />} />

                        {/* New Routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/stores" element={<StoreListPage />} />
                        <Route path="/stores/:id" element={<StoreDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/alert-demo" element={<AlertDemoPage />} />
                        <Route path="/signin-demo" element={<SignInDemoPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </motion.div>
            </AnimatePresence>
            <Footer />
        </>
    );
}
