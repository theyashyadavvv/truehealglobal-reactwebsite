import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { motion, useReducedMotion } from 'framer-motion';
import './Footer.css';
import { useToast } from '../context/ToastContext';
import { subscribeNewsletter } from '../api/services/newsletterService';

function AnimatedBlock({ children, delay = 0.1, className = '' }) {
    const shouldReduce = useReducedMotion();
    if (shouldReduce) return <div className={className}>{children}</div>;
    return (
        <motion.div
            initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

const footerSections = [
    {
        label: 'Quick Links',
        links: [
            { title: 'Home', to: '/' },
            { title: 'All Products', to: '/products' },
            { title: 'Categories', to: '/categories' },
            { title: 'Stores', to: '/stores' },
            { title: 'FAQs', to: '/faq' },
        ],
    },
    {
        label: 'Policies',
        links: [
            { title: 'Privacy Policy', to: '/privacy' },
            { title: 'Terms & Conditions', to: '/terms' },
            { title: 'Refund Policy', to: '/refund-policy' },
            { title: 'Shipping Policy', to: '/shipping-policy' },
            { title: 'About Us', to: '/about' },
        ],
    },
    {
        label: 'Connect',
        links: [
            { title: 'Facebook', href: 'https://www.facebook.com/people/Truehealglobal/61576012675998/', icon: FaFacebookF },
            { title: 'Instagram', href: 'https://www.instagram.com/truehealglobal/', icon: FaInstagram },
            { title: 'LinkedIn', href: '#', icon: FaLinkedinIn },
            { title: 'YouTube', href: '#', icon: FaYoutube },
        ],
    },
];

export default function Footer() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        try {
            await subscribeNewsletter(email);
            toast.success('Subscribed successfully!');
            setEmail('');
        } catch (error) {
            toast.error(error.message || 'Failed to subscribe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="footer">
            <div className="footer__glow" />
            <div className="footer__inner">
                {/* Left — Brand */}
                <AnimatedBlock className="footer__brand" delay={0.1}>
                    <div className="footer__brand-logo">
                        <img src="/assets/image/thg-logo.png" alt="THG" className="footer__logo-img" />
                        <span className="footer__brand-name">True Heal Global</span>
                    </div>
                    <p className="footer__brand-desc">
                        Premium hydrogen & alkaline water technology. Backed by science, trusted by thousands.
                    </p>
                    {/* Newsletter inline */}
                    <form className="footer__newsletter-form" onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            placeholder="Your email"
                            className="footer__newsletter-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="footer__newsletter-btn" disabled={loading}>
                            {loading ? '...' : <HiOutlineMail size={16} />}
                        </button>
                    </form>
                </AnimatedBlock>

                {/* Right — Link columns */}
                <div className="footer__columns">
                    {footerSections.map((section, idx) => (
                        <AnimatedBlock key={section.label} delay={0.15 + idx * 0.1}>
                            <h4 className="footer__heading">{section.label}</h4>
                            <ul className="footer__list">
                                {section.links.map((link) => (
                                    <li key={link.title}>
                                        {link.to ? (
                                            <Link to={link.to}>{link.title}</Link>
                                        ) : (
                                            <a href={link.href} target="_blank" rel="noreferrer">
                                                {link.icon && <link.icon size={13} style={{ marginRight: 6 }} />}
                                                {link.title}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </AnimatedBlock>
                    ))}
                </div>
            </div>

            {/* Bottom */}
            <div className="footer__bottom">
                <p>© {new Date().getFullYear()} True Heal Global. All rights reserved.</p>
            </div>
        </footer>
    );
}
