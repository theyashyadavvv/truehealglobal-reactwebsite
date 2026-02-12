import React, { useState, useEffect } from 'react';
import { FiCopy, FiCheck, FiTag, FiClock } from 'react-icons/fi';
import { fetchCoupons } from '../api';
import './CouponPage.css';

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetchCoupons();
      setCoupons(Array.isArray(res) ? res : res?.coupons || res?.data || []);
    } catch (err) {
      console.error('Failed to load coupons', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="coupon-page">
      <section className="coupon-page__hero">
        <div className="container">
          <h1>My Coupons</h1>
          <p className="coupon-page__subtitle">Use these coupons to get discounts on your orders</p>
        </div>
      </section>

      <section className="container coupon-page__body">
        {loading ? (
          <div className="coupon-skeletons">
            {[...Array(4)].map((_, i) => <div key={i} className="coupon-skeleton" />)}
          </div>
        ) : coupons.length === 0 ? (
          <div className="coupon-empty">
            <FiTag size={48} />
            <h3>No Coupons Available</h3>
            <p>Check back later for exciting offers!</p>
          </div>
        ) : (
          <div className="coupon-grid">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="coupon-card">
                <div className="coupon-card__left">
                  <span className="coupon-discount">
                    {coupon.discount_type === 'percent'
                      ? `${coupon.discount}% OFF`
                      : `₹${coupon.discount} OFF`}
                  </span>
                  {coupon.max_discount && coupon.discount_type === 'percent' && (
                    <span className="coupon-max">Up to ₹{coupon.max_discount}</span>
                  )}
                </div>
                <div className="coupon-card__right">
                  <div className="coupon-card__header">
                    <span className="coupon-code">{coupon.code}</span>
                    <button
                      className="coupon-copy-btn"
                      onClick={() => handleCopy(coupon.code)}
                    >
                      {copiedCode === coupon.code ? <FiCheck /> : <FiCopy />}
                      {copiedCode === coupon.code ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  {coupon.title && <p className="coupon-title">{coupon.title}</p>}
                  {coupon.min_purchase > 0 && (
                    <p className="coupon-min">Min. order: ₹{coupon.min_purchase}</p>
                  )}
                  {coupon.expire_date && (
                    <p className="coupon-expiry">
                      <FiClock size={12} /> Expires: {new Date(coupon.expire_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CouponPage;
