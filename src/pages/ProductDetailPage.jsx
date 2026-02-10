import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { HiStar, HiShoppingCart, HiHeart, HiShieldCheck, HiArrowLeft, HiCheck, HiTruck, HiRefresh } from 'react-icons/hi';
import { products, scienceData } from '../data/mockData';
import GradientButton from '../components/GradientButton';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id)) || products[0];
    const [activeTab, setActiveTab] = useState('description');
    const [quantity, setQuantity] = useState(1);

    const formatPrice = (price) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

    const discount = Math.round((1 - product.price / product.originalPrice) * 100);
    const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

    const tabs = [
        { id: 'description', label: 'Description' },
        { id: 'specs', label: 'Specifications' },
        { id: 'science', label: 'Science' },
        { id: 'reviews', label: `Reviews (${product.reviews})` },
    ];

    return (
        <main className="pdp">
            <section className="pdp__hero">
                <div className="container">
                    <Link to="/products" className="pdp__back">
                        <HiArrowLeft /> Back to Products
                    </Link>
                </div>
            </section>

            <section className="pdp__main section">
                <div className="container">
                    <div className="pdp__layout">
                        {/* Image */}
                        <ScrollReveal direction="right" className="pdp__gallery">
                            <div className="pdp__image-main">
                                <span className="pdp__badge">{product.badge}</span>
                                <img src={product.image} alt={product.name} />
                            </div>
                        </ScrollReveal>

                        {/* Info */}
                        <ScrollReveal direction="left" className="pdp__info">
                            <span className="pdp__category">
                                {product.category === 'hydrogen' ? 'Hydrogen Water Machine' : 'Alkaline Water Machine'}
                            </span>
                            <h1 className="pdp__name">{product.name}</h1>

                            <div className="pdp__rating">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <HiStar key={i} size={18} style={{ opacity: i < Math.floor(product.rating) ? 1 : 0.3 }} />
                                    ))}
                                </div>
                                <span>{product.rating} · {product.reviews} reviews</span>
                            </div>

                            <div className="pdp__pricing">
                                <span className="pdp__price">{formatPrice(product.price)}</span>
                                <span className="pdp__original">{formatPrice(product.originalPrice)}</span>
                                <span className="pdp__discount">{discount}% OFF</span>
                            </div>

                            <p className="pdp__desc">{product.description}</p>

                            {/* Features */}
                            <div className="pdp__features">
                                {product.features.map(f => (
                                    <div key={f} className="pdp__feature">
                                        <HiCheck size={16} />
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Quantity + Cart */}
                            <div className="pdp__actions">
                                <div className="pdp__quantity">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                </div>
                                <GradientButton size="lg" className="pdp__add-cart">
                                    <HiShoppingCart size={20} />
                                    Add to Cart — {formatPrice(product.price * quantity)}
                                </GradientButton>
                                <button className="pdp__wishlist">
                                    <HiHeart size={22} />
                                </button>
                            </div>

                            {/* Trust */}
                            <div className="pdp__trust-bar">
                                <div className="pdp__trust-item"><HiTruck size={18} /> Free Shipping</div>
                                <div className="pdp__trust-item"><HiRefresh size={18} /> 30-Day Returns</div>
                                <div className="pdp__trust-item"><HiShieldCheck size={18} /> {product.specs.Warranty || '2 Year'} Warranty</div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Tabs */}
                    <div className="pdp__tabs-section">
                        <div className="pdp__tabs">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`pdp__tab ${activeTab === tab.id ? 'pdp__tab--active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div className="pdp__tab-indicator" layoutId="tab-indicator" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="pdp__tab-content"
                            >
                                {activeTab === 'description' && (
                                    <div className="pdp__tab-desc">
                                        <p>{product.description}</p>
                                        <h3>Key Features</h3>
                                        <ul>
                                            {product.features.map(f => <li key={f}><HiCheck /> {f}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {activeTab === 'specs' && (
                                    <div className="pdp__tab-specs">
                                        <table>
                                            <tbody>
                                                {Object.entries(product.specs).map(([key, val]) => (
                                                    <tr key={key}>
                                                        <td className="pdp__spec-key">{key}</td>
                                                        <td className="pdp__spec-val">{val}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeTab === 'science' && (
                                    <div className="pdp__tab-science">
                                        <h3>How {product.category === 'hydrogen' ? 'Hydrogen' : 'Alkaline'} Water Benefits You</h3>
                                        <div className="pdp__comparison">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Feature</th>
                                                        <th>Regular Water</th>
                                                        <th>Alkaline Water</th>
                                                        <th className="pdp__comparison-highlight">Hydrogen Water</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {scienceData.comparison.map(row => (
                                                        <tr key={row.feature}>
                                                            <td>{row.feature}</td>
                                                            <td>{row.regular}</td>
                                                            <td>{row.alkaline}</td>
                                                            <td className="pdp__comparison-highlight">{row.hydrogen}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="pdp__tab-reviews">
                                        <div className="pdp__review-summary">
                                            <div className="pdp__review-score">
                                                <span className="pdp__review-big">{product.rating}</span>
                                                <div className="stars" style={{ fontSize: '1.25rem' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <HiStar key={i} style={{ opacity: i < Math.floor(product.rating) ? 1 : 0.3 }} />
                                                    ))}
                                                </div>
                                                <span>{product.reviews} reviews</span>
                                            </div>
                                            <div className="pdp__review-bars">
                                                {[5, 4, 3, 2, 1].map(stars => {
                                                    const pct = stars === 5 ? 72 : stars === 4 ? 18 : stars === 3 ? 6 : stars === 2 ? 3 : 1;
                                                    return (
                                                        <div key={stars} className="pdp__review-bar-row">
                                                            <span>{stars}★</span>
                                                            <div className="pdp__review-bar-bg">
                                                                <div className="pdp__review-bar-fill" style={{ width: `${pct}%` }} />
                                                            </div>
                                                            <span>{pct}%</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Related */}
                    {related.length > 0 && (
                        <div className="pdp__related">
                            <h2 className="section-title">You May Also Like</h2>
                            <div className="pdp__related-grid">
                                {related.map(p => (
                                    <Link key={p.id} to={`/products/${p.id}`} className="plp-card card" onClick={() => window.scrollTo(0, 0)}>
                                        <div className="plp-card__image">
                                            <img src={p.image} alt={p.name} />
                                        </div>
                                        <div className="plp-card__body">
                                            <h3 className="plp-card__name">{p.name}</h3>
                                            <div className="plp-card__pricing">
                                                <span className="plp-card__price">{formatPrice(p.price)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
