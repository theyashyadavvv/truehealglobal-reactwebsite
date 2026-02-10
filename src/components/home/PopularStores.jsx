import { Link } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';
import SpotlightCard from '../SpotlightCard';
import { stores } from '../../data/mockData';
import { HiStar, HiShoppingBag, HiArrowRight } from 'react-icons/hi';
import GradientButton from '../GradientButton';
import './PopularStores.css';

export default function PopularStores() {
    return (
        <section className="popular-stores section" style={{ background: 'var(--color-off-white)' }}>
            <div className="container">
                <ScrollReveal>
                    <div className="section-header-row">
                        <div>
                            <h2 className="section-title" style={{ marginBottom: '0.5rem', textAlign: 'left' }}>Popular Stores</h2>
                            <p className="section-subtitle" style={{ margin: 0, textAlign: 'left' }}>Top rated vendors on True Heal Global</p>
                        </div>
                        <Link to="/stores">
                            <GradientButton variant="accent">
                                View All Stores <HiArrowRight />
                            </GradientButton>
                        </Link>
                    </div>
                </ScrollReveal>

                <div className="popular-stores__grid">
                    {stores.map((store, i) => (
                        <ScrollReveal key={store.id} delay={i * 0.1}>
                            <SpotlightCard glowColor="teal" className="store-card-spotlight">
                                <Link to={`/stores/${store.id}`} className="store-card">
                                    <div className="store-card__cover">
                                        <img src={store.cover} alt="" />
                                    </div>
                                    <div className="store-card__info">
                                        <div className="store-card__logo">
                                            <img src={store.logo} alt={store.name} />
                                        </div>
                                        <div className="store-card__details">
                                            <h3 className="store-card__name">{store.name}</h3>
                                            <div className="store-card__meta">
                                                <span className="store-card__rating">
                                                    <HiStar /> {store.rating}
                                                </span>
                                                <span className="store-card__dot">•</span>
                                                <span className="store-card__products">
                                                    <HiShoppingBag size={14} /> {store.products} Products
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
            </div>
        </section>
    );
}
