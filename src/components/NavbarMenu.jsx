import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi';
import './NavbarMenu.css';

const spring = {
    type: 'spring',
    mass: 0.5,
    damping: 11.5,
    stiffness: 100,
    restDelta: 0.001,
    restSpeed: 0.001,
};

/**
 * MenuItem — a nav link that shows a dropdown panel on hover.
 */
export function MenuItem({ setActive, active, item, to, children }) {
    const isOpen = active === item;

    return (
        <div
            className={`nav-menu-item ${isOpen ? 'nav-menu-item--active' : ''}`}
            onMouseEnter={() => setActive(item)}
        >
            {to ? (
                <Link to={to} className="nav-menu-item__label">
                    {item}
                    {children && <HiChevronDown className="nav-menu-item__chevron" />}
                </Link>
            ) : (
                <button className="nav-menu-item__label" type="button">
                    {item}
                    {children && <HiChevronDown className="nav-menu-item__chevron" />}
                </button>
            )}

            <AnimatePresence>
                {isOpen && children && (
                    <motion.div
                        className="nav-menu-dropdown"
                        initial={{ opacity: 0, scale: 0.85, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 8 }}
                        transition={spring}
                    >
                        <motion.div
                            className="nav-menu-dropdown__inner"
                            layoutId="navbar-active-dropdown"
                            transition={spring}
                        >
                            {children}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/**
 * ProductItem — image + title + description card inside a dropdown.
 */
export function ProductItem({ title, description, href, src }) {
    return (
        <Link to={href} className="nav-product-item">
            <div className="nav-product-item__img">
                <img src={src} alt={title} />
            </div>
            <div className="nav-product-item__text">
                <h4 className="nav-product-item__title">{title}</h4>
                <p className="nav-product-item__desc">{description}</p>
            </div>
        </Link>
    );
}

/**
 * HoveredLink — a simple styled link for dropdown menus.
 */
export function HoveredLink({ to, icon: Icon, children }) {
    return (
        <Link to={to} className="nav-hovered-link">
            {Icon && (
                <span className="nav-hovered-link__icon">
                    <Icon size={16} />
                </span>
            )}
            {children}
        </Link>
    );
}
