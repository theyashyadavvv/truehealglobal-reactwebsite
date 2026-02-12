import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchAboutUs, fetchTermsAndConditions, fetchPrivacyPolicy, fetchCancellationPolicy, fetchShippingPolicy, fetchRefundPolicy } from '../api';
import './StaticPage.css';

const PAGE_CONFIG = {
  '/about': { title: 'About Us', fetcher: fetchAboutUs },
  '/terms': { title: 'Terms & Conditions', fetcher: fetchTermsAndConditions },
  '/privacy': { title: 'Privacy Policy', fetcher: fetchPrivacyPolicy },
  '/cancellation-policy': { title: 'Cancellation Policy', fetcher: fetchCancellationPolicy },
  '/shipping-policy': { title: 'Shipping Policy', fetcher: fetchShippingPolicy },
  '/refund-policy': { title: 'Refund Policy', fetcher: fetchRefundPolicy },
};

const StaticPage = () => {
  const { pathname } = useLocation();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const config = PAGE_CONFIG[pathname] || { title: 'Page', fetcher: null };

  useEffect(() => {
    loadContent();
  }, [pathname]);

  const loadContent = async () => {
    if (!config.fetcher) return;
    try {
      setLoading(true);
      const res = await config.fetcher();
      // API may return { data: "html string" } or { value: "html" } etc.
      const html = typeof res === 'string' ? res : (res?.data || res?.value || res?.content || '');
      setContent(typeof html === 'string' ? html : JSON.stringify(html));
    } catch (err) {
      console.error('Failed to load page content', err);
      setContent('<p>Failed to load content. Please try again later.</p>');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="static-page">
      <section className="static-page__hero">
        <div className="container">
          <h1>{config.title}</h1>
        </div>
      </section>
      <section className="container static-page__body">
        {loading ? (
          <div className="static-skeleton">
            {[...Array(5)].map((_, i) => <div key={i} className="static-skeleton__line" style={{ width: `${80 - i * 10}%` }} />)}
          </div>
        ) : (
          <div className="static-content" dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </section>
    </div>
  );
};

export default StaticPage;
