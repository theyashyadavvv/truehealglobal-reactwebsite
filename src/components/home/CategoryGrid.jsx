import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useDataHooks';
import './CategoryGrid.css';

export default function CategoryGrid() {
    const { data, loading, error } = useCategories();
    const categories = Array.isArray(data) ? data : [];

    if (loading) {
        return (
            <section className="category-section">
                <div className="category-section__inner">
                    <h2 className="category-section__heading">Shop by Category</h2>
                    <div className="category-section__grid">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="category-card">
                                <div className="category-card__img category-card__img--skeleton" />
                                <div className="category-card__text-skeleton" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error || categories.length === 0) return null;

    return (
        <section className="category-section">
            <div className="category-section__inner">
                <h2 className="category-section__heading">Shop by Category</h2>
                <div className="category-section__grid">
                    {categories.map((cat) => (
                        <Link
                            to={`/categories/${cat.id}`}
                            key={cat.id}
                            className="category-card"
                        >
                            <div className="category-card__img">
                                <img
                                    src={cat.image_full_url || cat.image || '/assets/image/placeholder.png'}
                                    alt={cat.name}
                                    onError={(e) => { e.target.src = '/assets/image/placeholder.png'; }}
                                />
                            </div>
                            <h3 className="category-card__name">{cat.name}</h3>
                            {(cat.products_count || cat.items_count) > 0 && (
                                <span className="category-card__count">
                                    {cat.products_count || cat.items_count} Products
                                </span>
                            )}
                            <span className="category-card__cta">Explore &rarr;</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
