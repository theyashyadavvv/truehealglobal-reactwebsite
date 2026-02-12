import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../ScrollReveal';
import { HiArrowRight, HiStar, HiShoppingCart } from 'react-icons/hi';
import { usePopularItems } from '../../hooks/useDataHooks';
import GradientButton from '../GradientButton';
import SpotlightCard from '../SpotlightCard';
import './FeaturedProducts.css';

export default function FeaturedProducts() {
    const scrollRef = useRef(null);
    const { data, loading, error } = usePopularItems({ limit: 10 });
    const items = data?.products || data?.items || [];

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction * 340,
                behavior: 'smooth'
            });
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <section className="featured section" style={{ background: 'var(--color-off-white)' }}>
            <div className="container">
                <ScrollReveal>
                    <div className="featured__header">
                        <div>
                            <p className="section-label">Best Sellers</p>
                            <h2 className="section-title">Most Popular Products</h2>
                        </div>
                        <div className="featured__nav">
                            <button className="featured__nav-btn" onClick={() => scroll(-1)} aria-label="Previous">←</button>
                            <button className="featured__nav-btn" onClick={() => scroll(1)} aria-label="Next">→</button>
                            <Link to="/products">
                                <GradientButton size="sm" variant="accent" className="hide-mobile">
                                    View All <HiArrowRight />
                                </GradientButton>
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>

                {loading ? (
                    <div className="featured__carousel">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{ minWidth: 300, height: 380, borderRadius: 16, background: 'var(--color-surface, #1a1a2e)', animation: 'pulse 1.5s infinite' }} />
                        ))}
                    </div>
                ) : error || items.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>
                        {error || 'No products available.'}
                    </p>
                ) : (
                    <div className="featured__carousel" ref={scrollRef}>
                        {items.slice(0, 10).map((product, i) => {
                            const discount = product.discount || 0;
                            const image = product.image_full_url || product.image || '/assets/image/placeholder.png';
                            const originalPrice = discount > 0
                                ? (product.discount_type === 'percent'
                                    ? product.price / (1 - discount / 100)
                                    : product.price + discount)
                                : product.price;

                            return (
                                <ScrollReveal key={product.id} delay={i * 0.1} className="featured__card-wrapper">
                                    <SpotlightCard glowColor="teal">
                                        <Link to={`/products/${product.id}`} className="featured__card card">
                                            {discount > 0 && (
                                                <span className="featured__badge">
                                                    {product.discount_type === 'percent' ? `${discount}% off` : `₹${discount} off`}
                                                </span>
                                            )}
                                            <div className="featured__card-image">
                                                <img src={image} alt={product.name} onError={(e) => e.target.src = '/assets/image/placeholder.png'} />
                                            </div>
                                            <div className="featured__card-body">
                                                <span className="featured__card-category">
                                                    {product.store_name || product.module_type || 'Product'}
                                                </span>
                                                <h3 className="featured__card-name">{product.name}</h3>
                                                <div className="featured__card-rating">
                                                    <div className="stars">
                                                        {[...Array(5)].map((_, j) => (
                                                            <HiStar key={j} style={{ opacity: j < Math.floor(product.avg_rating || 0) ? 1 : 0.3 }} />
                                                        ))}
                                                    </div>
                                                    <span className="featured__card-reviews">({product.rating_count || 0})</span>
                                                </div>
                                                <div className="featured__card-pricing">
                                                    <span className="featured__card-price">{formatPrice(product.price)}</span>
                                                    {discount > 0 && (
                                                        <>
                                                            <span className="featured__card-original">{formatPrice(originalPrice)}</span>
                                                            <span className="featured__card-discount">
                                                                {product.discount_type === 'percent' ? `${discount}%` : `₹${discount}`} off
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                <GradientButton
                                                    size="sm"
                                                    className="featured__card-cart"
                                                    onClick={(e) => e.preventDefault()}
                                                >
                                                    <HiShoppingCart size={16} />
                                                    Add to Cart
                                                </GradientButton>
                                            </div>
                                        </Link>
                                    </SpotlightCard>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                )}

                <div className="featured__mobile-cta hide-desktop">
                    <Link to="/products">
                        <GradientButton block>
                            View All Products <HiArrowRight />
                        </GradientButton>
                    </Link>
                </div>
            </div>
        </section>
    );
}
