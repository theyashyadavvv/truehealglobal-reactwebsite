import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../ScrollReveal';
import { HiArrowRight, HiStar, HiShoppingCart } from 'react-icons/hi';
import { products } from '../../data/mockData';
import GradientButton from '../GradientButton';
import SpotlightCard from '../SpotlightCard';
import './FeaturedProducts.css';

export default function FeaturedProducts() {
    const scrollRef = useRef(null);

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

    const featured = products.slice(0, 6);

    return (
        <section className="featured section" style={{ background: 'var(--color-off-white)' }}>
            <div className="container">
                <ScrollReveal>
                    <div className="featured__header">
                        <div>
                            <p className="section-label">Best Sellers</p>
                            <h2 className="section-title">Most Loved Machines</h2>
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

                <div className="featured__carousel" ref={scrollRef}>
                    {featured.map((product, i) => (
                        <ScrollReveal key={product.id} delay={i * 0.1} className="featured__card-wrapper">
                            <SpotlightCard glowColor="teal">
                                <Link to={`/products/${product.id}`} className="featured__card card">
                                    {product.badge && (
                                        <span className="featured__badge">{product.badge}</span>
                                    )}
                                    <div className="featured__card-image">
                                        <img src={product.image} alt={product.name} />
                                    </div>
                                    <div className="featured__card-body">
                                        <span className="featured__card-category">
                                            {product.category === 'hydrogen' ? 'Hydrogen' : 'Alkaline'}
                                        </span>
                                        <h3 className="featured__card-name">{product.name}</h3>
                                        <div className="featured__card-rating">
                                            <div className="stars">
                                                {[...Array(5)].map((_, j) => (
                                                    <HiStar key={j} style={{ opacity: j < Math.floor(product.rating) ? 1 : 0.3 }} />
                                                ))}
                                            </div>
                                            <span className="featured__card-reviews">({product.reviews})</span>
                                        </div>
                                        <div className="featured__card-pricing">
                                            <span className="featured__card-price">{formatPrice(product.price)}</span>
                                            <span className="featured__card-original">{formatPrice(product.originalPrice)}</span>
                                            <span className="featured__card-discount">
                                                {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                                            </span>
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
                    ))}
                </div>

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
