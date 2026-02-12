import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__wave">
                <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
                    <path d="M0,60 C240,100 480,0 720,50 C960,100 1200,20 1440,60 L1440,100 L0,100 Z" fill="currentColor" />
                </svg>
            </div>

            <div className="footer__main">
                <div className="container">
                    <div className="footer__grid">
                        {/* Brand Column */}
                        <div className="footer__brand">
                            <div className="footer__brand-logo">
                                <img src="/assets/image/thg-logo.png" alt="THG" className="footer__logo-img" />
                                <div>
                                    <h3 className="footer__brand-name">True Heal Global</h3>
                                    <p className="footer__brand-tagline">Premium Water Technology</p>
                                </div>
                            </div>
                            <p className="footer__brand-desc">
                                Transforming hydration with advanced hydrogen and alkaline water machines.
                                Backed by science, trusted by thousands across India.
                            </p>
                            <div className="footer__socials">
                                <a href="#" className="footer__social-link" aria-label="Facebook"><FaFacebookF /></a>
                                <a href="#" className="footer__social-link" aria-label="Instagram"><FaInstagram /></a>
                                <a href="#" className="footer__social-link" aria-label="LinkedIn"><FaLinkedinIn /></a>
                                <a href="#" className="footer__social-link" aria-label="YouTube"><FaYoutube /></a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer__column">
                            <h4 className="footer__heading">Quick Links</h4>
                            <ul className="footer__list">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/products">All Products</Link></li>
                                <li><Link to="/categories">Categories</Link></li>
                                <li><Link to="/stores">Stores</Link></li>
                                <li><Link to="/brands">Brands</Link></li>
                                <li><Link to="/flash-sales">Flash Sales</Link></li>
                                <li><Link to="/faq">FAQs</Link></li>
                            </ul>
                        </div>

                        {/* Policies */}
                        <div className="footer__column">
                            <h4 className="footer__heading">Policies</h4>
                            <ul className="footer__list">
                                <li><Link to="/privacy">Privacy Policy</Link></li>
                                <li><Link to="/terms">Terms & Conditions</Link></li>
                                <li><Link to="/cancellation-policy">Cancellation Policy</Link></li>
                                <li><Link to="/refund-policy">Refund Policy</Link></li>
                                <li><Link to="/shipping-policy">Shipping Policy</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="footer__column">
                            <h4 className="footer__heading">Contact Us</h4>
                            <ul className="footer__contact-list">
                                <li>
                                    <HiOutlinePhone size={18} />
                                    <span>+91 98765 43210</span>
                                </li>
                                <li>
                                    <HiOutlineMail size={18} />
                                    <span>support@truehealglobal.com</span>
                                </li>
                                <li>
                                    <HiOutlineLocationMarker size={18} />
                                    <span>Mumbai, Maharashtra, India</span>
                                </li>
                            </ul>

                            <div className="footer__newsletter">
                                <h5 className="footer__newsletter-title">Stay Updated</h5>
                                <div className="footer__newsletter-form">
                                    <input
                                        type="email"
                                        placeholder="Your email"
                                        className="footer__newsletter-input"
                                    />
                                    <button className="footer__newsletter-btn">
                                        <HiOutlineMail size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Bar */}
            <div className="footer__trust">
                <div className="container">
                    <div className="footer__trust-items">
                        {['FDA Approved', 'CE Certified', 'ROHS Compliant', 'GMP Certified', 'ISO 9001'].map(cert => (
                            <div key={cert} className="footer__trust-item">
                                <div className="footer__trust-icon">✓</div>
                                <span>{cert}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer__bottom">
                <div className="container">
                    <p>© 2026 True Heal Global. All rights reserved. Crafted with care for your wellness.</p>
                </div>
            </div>
        </footer>
    );
}
