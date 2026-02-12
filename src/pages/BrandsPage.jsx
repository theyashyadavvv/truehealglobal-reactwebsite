import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { fetchBrands } from '../api';
import './BrandsPage.css';

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const res = await fetchBrands();
      setBrands(res?.data || res || []);
    } catch (err) {
      console.error('Failed to load brands', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = search
    ? brands.filter(b => (b.name || '').toLowerCase().includes(search.toLowerCase()))
    : brands;

  return (
    <div className="brands-page">
      <section className="brands-page__hero">
        <div className="container">
          <h1>All Brands</h1>
          <div className="brands-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="container brands-page__body">
        {loading ? (
          <div className="brands-grid">
            {[...Array(12)].map((_, i) => <div key={i} className="brand-skeleton" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="brands-empty">
            <h3>No brands found</h3>
            <p>{search ? 'Try a different search term' : 'No brands available'}</p>
          </div>
        ) : (
          <div className="brands-grid">
            {filtered.map(brand => (
              <Link key={brand.id} to={`/brands/${brand.id}`} className="brand-card">
                <div className="brand-card__img-wrap">
                  {brand.image ? (
                    <img
                      src={brand.image_full_url || `https://admin.truehealglobal.com/storage/app/public/brand/${brand.image}`}
                      alt={brand.name}
                      className="brand-card__img"
                    />
                  ) : (
                    <div className="brand-card__placeholder">{(brand.name || 'B')[0]}</div>
                  )}
                </div>
                <span className="brand-card__name">{brand.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default BrandsPage;
