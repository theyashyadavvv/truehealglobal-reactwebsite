import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoryList } from '../data/mockData';
import ScrollReveal from '../components/ScrollReveal';
import './CategoriesPage.css';

export default function CategoriesPage() {
    return (
        <div className="categories-page">
            <section className="categories-hero">
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="categories-title"
                    >
                        Explore Categories
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="categories-subtitle"
                    >
                        Find the perfect water solution for your specific needs
                    </motion.p>
                </div>
            </section>

            <section className="categories-content section">
                <div className="container">
                    <div className="categories-grid">
                        {categoryList.map((cat, i) => (
                            <ScrollReveal key={cat.id} delay={i * 0.05}>
                                <Link to={`/categories/${cat.id}`} className="category-card-large">
                                    <div className="category-card-large__image">
                                        <img src={cat.image} alt={cat.name} />
                                    </div>
                                    <div className="category-card-large__info">
                                        <h3>{cat.name}</h3>
                                        <p>{cat.count} Products</p>
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
