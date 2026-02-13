import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../ScrollReveal';
import SpotlightCard from '../SpotlightCard';
import { usePopularStores } from '../../hooks/useDataHooks';
import { HiStar, HiShoppingBag, HiArrowRight } from 'react-icons/hi';
import GradientButton from '../GradientButton';
import './PopularStores.css';

export default function PopularStores() {
    const { data, loading, error } = usePopularStores();
    const stores = Array.isArray(data) ? data : data?.stores || [];

    return (
        <section className="popular-stores section" style={{ background: 'var(--color-off-white)' }}>
            <div className="container">
                <ScrollReveal>
                    <div className="section-header-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <div>
                                <h2 className="section-title" style={{ marginBottom: '0.5rem', textAlign: 'left' }}>Popular Stores</h2>
                                <p className="section-subtitle" style={{ margin: 0, textAlign: 'left' }}>Top rated vendors on True Heal Global</p>
                            </div>
                            <motion.img
                                src="/assets/image/popular_stores_decoration_v2.png"
                                alt="Featured"
                                initial={{ opacity: 0, x: 200, scale: 0.8 }}
                                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
                                viewport={{ once: true }}
                                style={{ height: '200px', width: 'auto' }}
                            />
                        </div>
                        <Link to="/stores">
                            <GradientButton variant="accent">
                                View All Stores <HiArrowRight />
                            </GradientButton>
                        </Link>
                    </div>
                </ScrollReveal>

                {loading ? (
                    <div className="popular-stores__grid">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="store-card-skeleton" style={{ height: 240, borderRadius: 16, background: 'var(--color-surface, #1a1a2e)', animation: 'pulse 1.5s infinite' }} />
                        ))}
                    </div>
                ) : error || stores.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>
                        {error || 'No stores available right now.'}
                    </p>
                ) : (
                    <div className="popular-stores__grid">
                        {stores.slice(0, 8).map((store, i) => (
                            <ScrollReveal key={store.id} delay={i * 0.1}>
                                <SpotlightCard glowColor="teal" className="store-card-spotlight">
                                    <Link to={`/stores/${store.id}`} className="store-card">
                                        <div className="store-card__cover">
                                            <img
                                                src={store.cover_photo_full_url || store.cover_photo || '/assets/image/placeholder_store.png'}
                                                alt=""
                                                onError={(e) => e.target.src = '/assets/image/placeholder_store.png'}
                                            />
                                        </div>
                                        <div className="store-card__info">
                                            <div className="store-card__logo">
                                                <img
                                                    src={store.logo_full_url || store.logo || '/assets/image/placeholder.png'}
                                                    alt={store.name}
                                                    onError={(e) => e.target.src = '/assets/image/placeholder.png'}
                                                />
                                            </div>
                                            <div className="store-card__details">
                                                <h3 className="store-card__name">{store.name}</h3>
                                                <div className="store-card__meta">
                                                    <span className="store-card__rating">
                                                        <HiStar /> {store.avg_rating ? store.avg_rating.toFixed(1) : 'New'}
                                                    </span>
                                                    <span className="store-card__dot">•</span>
                                                    <span className="store-card__products">
                                                        <HiShoppingBag size={14} /> {store.items_count || 0} Products
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="store-card__action">
                                            <span>Visit Store</span>
                                        </div>
                                    </Link>
                                </SpotlightCard>
                            </ScrollReveal>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
