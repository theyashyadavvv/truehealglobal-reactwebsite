import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { stores, featuredProducts } from '../data/mockData';
import ScrollReveal from '../components/ScrollReveal';
import { HiStar, HiLocationMarker, HiPhone, HiMail } from 'react-icons/hi';
import GradientButton from '../components/GradientButton';
import './StoreDetailPage.css';

export default function StoreDetailPage() {
    const { id } = useParams();
    const store = stores.find(s => s.id === parseInt(id)) || stores[0];

    return (
        <div className="store-detail-page">
            <div className="store-header">
                <div className="store-header__cover">
                    <img src={store.cover} alt="" />
                    <div className="store-header__overlay" />
                </div>
                <div className="container store-header__content">
                    <div className="store-header__info-box">
                        <div className="store-header__logo">
                            <img src={store.logo} alt={store.name} />
                        </div>
                        <div className="store-header__text">
                            <h1 className="store-header__name">{store.name}</h1>
                            <div className="store-header__meta">
                                <span className="rating"><HiStar /> {store.rating} (120 Reviews)</span>
                                <span className="location"><HiLocationMarker /> New York, USA</span>
                            </div>
                        </div>
                    </div>
                    <div className="store-header__actions">
                        <GradientButton>Contact Store</GradientButton>
                        <GradientButton variant="accent">Follow</GradientButton>
                    </div>
                </div>
            </div>

            <section className="store-products section">
                <div className="container">
                    <h2 className="section-title text-left">Products from {store.name}</h2>
                    <div className="products-grid">
                        {featuredProducts.map((product, i) => (
                            <ScrollReveal key={product.id} delay={i * 0.05}>
                                <Link to={`/products/${product.id}`} className="product-card">
                                    <div className="product-card__image">
                                        {product.badge && <span className="product-card__badge">{product.badge}</span>}
                                        <img src={product.image} alt={product.name} />
                                    </div>
                                    <div className="product-card__content">
                                        <div className="product-card__rating">
                                            <HiStar /> {product.rating}
                                        </div>
                                        <h3 className="product-card__title">{product.name}</h3>
                                        <div className="product-card__footer">
                                            <span className="product-card__price">{product.price}</span>
                                            <button className="product-card__btn">Add</button>
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
