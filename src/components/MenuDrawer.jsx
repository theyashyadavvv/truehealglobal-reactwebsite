import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
    HiOutlineUser,
    HiOutlineShoppingBag,
    HiOutlineLocationMarker,
    HiOutlineTicket,
    HiOutlineQuestionMarkCircle,
    HiOutlineChat,
    HiOutlineOfficeBuilding,
    HiOutlineLogin,
    HiOutlineX,
    HiChevronRight
} from 'react-icons/hi';
import './MenuDrawer.css';

export default function MenuDrawer({ isOpen, onClose }) {
    const navigate = useNavigate();

    const menuItems = [
        { icon: HiOutlineUser, label: 'Profile', path: '/profile' },
        { icon: HiOutlineShoppingBag, label: 'My Orders', path: '/orders' },
        { icon: HiOutlineLocationMarker, label: 'My Address', path: '/address' },
        { icon: HiOutlineTicket, label: 'Coupon', path: '/coupons' },
        { icon: HiOutlineQuestionMarkCircle, label: 'Help & Support', path: '/help' },
    ];

    const handleNavigation = (path) => {
        onClose();
        navigate(path);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="menu-drawer__overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="menu-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className="menu-drawer__header">
                            <div className="menu-drawer__title">
                                <div className="menu-drawer__icon-box">
                                    <span className="menu-bar"></span>
                                    <span className="menu-bar"></span>
                                    <span className="menu-bar"></span>
                                </div>
                                <h2>Menu</h2>
                            </div>
                            <button className="menu-drawer__close" onClick={onClose}>
                                <HiOutlineX size={24} />
                            </button>
                        </div>

                        <div className="menu-drawer__content">
                            {menuItems.map((item, index) => (
                                <button
                                    key={index}
                                    className="menu-drawer__item"
                                    onClick={() => handleNavigation(item.path)}
                                >
                                    <div className="menu-drawer__item-left">
                                        <div className="menu-drawer__item-icon">
                                            <item.icon size={22} />
                                        </div>
                                        <span>{item.label}</span>
                                    </div>
                                    <HiChevronRight className="menu-drawer__chevron" />
                                </button>
                            ))}

                            <a
                                href="https://wa.me/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="menu-drawer__item"
                                onClick={onClose}
                            >
                                <div className="menu-drawer__item-left">
                                    <div className="menu-drawer__item-icon" style={{ color: '#25D366', background: 'rgba(37, 211, 102, 0.1)' }}>
                                        <HiOutlineChat size={22} />
                                    </div>
                                    <span>Whatsapp Chat</span>
                                </div>
                                <HiChevronRight className="menu-drawer__chevron" />
                            </a>

                            <button
                                className="menu-drawer__item"
                                onClick={() => handleNavigation('/join-store')}
                            >
                                <div className="menu-drawer__item-left">
                                    <div className="menu-drawer__item-icon">
                                        <HiOutlineOfficeBuilding size={22} />
                                    </div>
                                    <span>Join as a Store</span>
                                </div>
                                <HiChevronRight className="menu-drawer__chevron" />
                            </button>

                            <div className="menu-drawer__divider" />

                            <button
                                className="menu-drawer__item menu-drawer__item--highlight"
                                onClick={() => handleNavigation('/login')}
                            >
                                <div className="menu-drawer__item-left">
                                    <div className="menu-drawer__item-icon menu-drawer__item-icon--highlight">
                                        <HiOutlineLogin size={22} />
                                    </div>
                                    <span>Sign In</span>
                                </div>
                                <HiChevronRight className="menu-drawer__chevron" />
                            </button>
                        </div>

                        <div className="menu-drawer__footer">
                            <p>True Heal Global v1.0.0</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
