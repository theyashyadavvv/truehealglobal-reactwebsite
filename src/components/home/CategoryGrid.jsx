import { Link } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';
import SpotlightCard from '../SpotlightCard';
import { categoryList } from '../../data/mockData';
import './CategoryGrid.css';

export default function CategoryGrid() {
    return (
        <section className="category-grid section">
            <div className="container">
                <ScrollReveal>
                    <div className="section-header">
                        <h2 className="section-title">Shop by Category</h2>
                        <p className="section-subtitle">Browse our wide range of premium water solutions</p>
                    </div>
                </ScrollReveal>

                <div className="category-grid__layout">
                    {categoryList.map((cat, i) => (
                        <ScrollReveal key={cat.id} delay={i * 0.05} className="category-grid__item-wrap">
                            <SpotlightCard glowColor="teal">
                                <Link to={`/categories/${cat.id}`} className="category-grid__card">
                                    <div className="category-grid__image">
                                        <img src={cat.image} alt={cat.name} />
                                    </div>
                                    <h3 className="category-grid__name">{cat.name}</h3>
                                    <span className="category-grid__count">{cat.count} Products</span>
                                </Link>
                            </SpotlightCard>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
