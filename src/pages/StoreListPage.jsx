import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import { stores } from '../data/mockData';
import { HiStar, HiShoppingBag, HiSearch, HiFilter } from 'react-icons/hi';
import './StoreListPage.css';

export default function StoreListPage() {
    return (
        <div className="store-list-page">
            <section className="store-list__hero">
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="store-list__title"
                    >
                        Our Partner Stores
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="store-list__subtitle"
                    >
                        Discover verified vendors offering premium water solutions near you.
                    </motion.p>
                </div>
            </section>

            <section className="store-list__content section">
                <div className="container">
                    <div className="store-list__controls">
                        <div className="search-bar">
                            <HiSearch />
                            <input type="text" placeholder="Search stores..." />
                        </div>
                        <button className="filter-btn">
                            <HiFilter /> Filter
                        </button>
                    </div>

                    <div className="store-list__grid">
                        {stores.map((store, i) => (
                            <ScrollReveal key={store.id} delay={i * 0.05}>
                                <Link to={`/stores/${store.id}`} className="store-card store-card--large">
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
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
