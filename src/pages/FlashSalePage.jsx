import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiZap } from 'react-icons/fi';
import { fetchFlashSales, fetchFlashSaleProducts } from '../api';
import './FlashSalePage.css';

const FlashSalePage = () => {
  const [sales, setSales] = useState([]);
  const [activeSale, setActiveSale] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      const res = await fetchFlashSales();
      const list = res?.data || res?.flash_sales || res || [];
      setSales(list);
      if (list.length > 0) {
        setActiveSale(list[0]);
        loadProducts(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load flash sales', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (saleId) => {
    try {
      setProductsLoading(true);
      const res = await fetchFlashSaleProducts(saleId);
      setProducts(res?.data?.products || res?.products || res?.data || res || []);
    } catch (err) {
      console.error('Failed to load flash sale products', err);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleSaleClick = (sale) => {
    setActiveSale(sale);
    loadProducts(sale.id);
  };

  const getTimeLeft = (endDate) => {
    if (!endDate) return '';
    const diff = new Date(endDate) - Date.now();
    if (diff <= 0) return 'Ended';
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hrs}h ${mins}m left`;
  };

  return (
    <div className="flash-sale-page">
      <section className="flash-sale__hero">
        <div className="container">
          <h1><FiZap /> Flash Sales</h1>
          <p>Limited time offers with amazing discounts!</p>
        </div>
      </section>

      <section className="container flash-sale__body">
        {loading ? (
          <div className="flash-skeleton-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="flash-skeleton" />)}
          </div>
        ) : sales.length === 0 ? (
          <div className="flash-empty">
            <FiZap size={48} />
            <h3>No Active Flash Sales</h3>
            <p>Check back later for exciting deals!</p>
          </div>
        ) : (
          <>
            {sales.length > 1 && (
              <div className="flash-tabs">
                {sales.map(sale => (
                  <button
                    key={sale.id}
                    className={`flash-tab ${activeSale?.id === sale.id ? 'active' : ''}`}
                    onClick={() => handleSaleClick(sale)}
                  >
                    {sale.title || sale.name || `Sale #${sale.id}`}
                    {sale.end_date && (
                      <span className="flash-tab__time"><FiClock size={12} /> {getTimeLeft(sale.end_date)}</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {productsLoading ? (
              <div className="flash-skeleton-grid">
                {[...Array(6)].map((_, i) => <div key={i} className="flash-skeleton" />)}
              </div>
            ) : products.length === 0 ? (
              <p className="flash-no-products">No products in this sale</p>
            ) : (
              <div className="flash-products-grid">
                {products.map(item => (
                  <Link key={item.id} to={`/products/${item.id}`} className="flash-product-card">
                    <div className="flash-product__img-wrap">
                      <img src={item.image_full_url || item.image} alt={item.name} />
                      {item.discount > 0 && (
                        <span className="flash-product__badge">
                          {item.discount_type === 'percent' ? `${item.discount}%` : `₹${item.discount}`} OFF
                        </span>
                      )}
                      {item.available_stock !== undefined && item.available_stock <= 5 && (
                        <span className="flash-product__stock">Only {item.available_stock} left!</span>
                      )}
                    </div>
                    <div className="flash-product__info">
                      <h4>{item.name}</h4>
                      <div className="flash-product__price">
                        <span className="price-current">₹{item.price}</span>
                        {item.discount > 0 && (
                          <span className="price-original">₹{item.price + item.discount}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default FlashSalePage;
