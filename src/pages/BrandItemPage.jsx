import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { fetchBrandItems } from '../api';
import './BrandsPage.css';

const BrandItemPage = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadBrandItems(1);
  }, [id]);

  const loadBrandItems = async (page) => {
    try {
      if (page === 1) setLoading(true);
      const res = await fetchBrandItems(id, { offset: page, limit: 10 });
      const list = res?.products || res?.items || (Array.isArray(res) ? res : []);
      if (res?.brand_name) setBrandName(res.brand_name);
      if (page === 1) {
        setItems(list);
      } else {
        setItems(prev => [...prev, ...list]);
      }
      setHasMore(list.length >= 10);
      setOffset(page);
    } catch (err) {
      console.error('Failed to load brand items', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brands-page">
      <section className="brands-page__hero">
        <div className="container">
          <Link to="/brands" className="brand-back-link"><FiArrowLeft /> All Brands</Link>
          <h1>{brandName || 'Brand Products'}</h1>
        </div>
      </section>

      <section className="container brands-page__body">
        {loading ? (
          <div className="brand-items-grid">
            {[...Array(8)].map((_, i) => <div key={i} className="brand-item-skeleton" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="brands-empty">
            <h3>No products found</h3>
            <p>This brand doesn't have any products yet</p>
          </div>
        ) : (
          <>
            <div className="brand-items-grid">
              {items.map(item => (
                <Link key={item.id} to={`/products/${item.id}`} className="brand-item-card">
                  <div className="brand-item-card__img-wrap">
                    <img
                      src={item.image_full_url || item.image}
                      alt={item.name}
                      className="brand-item-card__img"
                    />
                    {item.discount > 0 && (
                      <span className="brand-item-badge">
                        {item.discount_type === 'percent' ? `${item.discount}%` : `₹${item.discount}`} OFF
                      </span>
                    )}
                  </div>
                  <div className="brand-item-card__info">
                    <h4>{item.name}</h4>
                    <div className="brand-item-card__price">
                      <span className="price-current">₹{item.price}</span>
                      {item.discount > 0 && (
                        <span className="price-original">₹{item.price + item.discount}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {hasMore && (
              <button className="noti-load-more" onClick={() => loadBrandItems(offset + 1)}>
                Load More
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default BrandItemPage;
