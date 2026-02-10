import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiMenuAlt3, HiOutlineSearch, HiOutlineBell, HiOutlineShoppingCart, HiOutlineLockClosed } from 'react-icons/hi';
import { HiOutlineBeaker, HiOutlineCube, HiOutlineDesktopComputer, HiOutlineChip, HiOutlineSparkles, HiOutlineStar } from 'react-icons/hi';
import { MenuItem, ProductItem, HoveredLink } from './NavbarMenu';
import MenuDrawer from './MenuDrawer';
import { products, stores, categoryList } from '../data/mockData';
import './Navbar.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setMenuOpen(false);
        setActiveMenu(null);
    }, [location]);

    const featured = products.slice(0, 4);

    // Icons for categories
    const catIcons = [HiOutlineBeaker, HiOutlineDesktopComputer, HiOutlineCube, HiOutlineBeaker, HiOutlineChip, HiOutlineSparkles];

    return (
        <>
            <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
                <div className="container navbar__container">
                    <Link to="/" className="navbar__logo">
                        <img src="/assets/image/thg-logo.png" alt="THG" />
                    </Link>

                    <div className="navbar__links" onMouseLeave={() => setActiveMenu(null)}>
                        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>

                        <MenuItem setActive={setActiveMenu} active={activeMenu} item="Categories" to="/categories">
                            <div className="nav-menu-links-col">
                                {categoryList.map((cat, i) => {
                                    const Icon = catIcons[i % catIcons.length];
                                    return (
                                        <HoveredLink key={cat.id} to={`/categories/${cat.id}`} icon={Icon}>
                                            {cat.name}
                                        </HoveredLink>
                                    );
                                })}
                            </div>
                        </MenuItem>

                        <MenuItem setActive={setActiveMenu} active={activeMenu} item="Products" to="/products">
                            <div className="nav-menu-products-grid">
                                {featured.map(p => (
                                    <ProductItem
                                        key={p.id}
                                        title={p.name}
                                        description={p.badge ? `${p.badge} • ★ ${p.rating}` : `★ ${p.rating} (${p.reviews})`}
                                        href={`/products/${p.id}`}
                                        src={p.image}
                                    />
                                ))}
                            </div>
                        </MenuItem>

                        <MenuItem setActive={setActiveMenu} active={activeMenu} item="Stores" to="/stores">
                            <div className="nav-menu-products-grid">
                                {stores.map(s => (
                                    <ProductItem
                                        key={s.id}
                                        title={s.name}
                                        description={`★ ${s.rating} • ${s.products} Products`}
                                        href={`/stores/${s.id}`}
                                        src={s.cover}
                                    />
                                ))}
                            </div>
                        </MenuItem>
                        <MenuItem setActive={setActiveMenu} active={activeMenu} item="Science" to="/science" />
                        <MenuItem setActive={setActiveMenu} active={activeMenu} item="FAQ" to="/faq" />
                    </div>

                    <div className="navbar__actions">
                        <button className="navbar__action-btn" aria-label="Search" onClick={() => navigate('/search')}>
                            <HiOutlineSearch size={22} />
                        </button>

                        <button className="navbar__action-btn" aria-label="Notifications">
                            <HiOutlineBell size={22} />
                            <span className="navbar__dot"></span>
                        </button>

                        <Link to="/cart" className="navbar__action-btn" aria-label="Cart">
                            <HiOutlineShoppingCart size={22} />
                            <span className="navbar__badge">2</span>
                        </Link>

                        <Link to="/login" className="navbar__auth-btn">
                            <HiOutlineLockClosed size={18} />
                            <span>Sign In</span>
                        </Link>

                        <button
                            className="navbar__menu-btn"
                            onClick={() => setMenuOpen(true)}
                            aria-label="Menu"
                        >
                            <HiMenuAlt3 size={24} />
                        </button>
                    </div>
                </div>
            </nav>

            <MenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    );
}
