import React, { useState, useEffect } from 'react';
import { FiBell, FiTrash2, FiClock, FiPackage, FiDollarSign, FiTag, FiAlertCircle } from 'react-icons/fi';
import { fetchNotifications } from '../api';
import './NotificationsPage.css';

const ICON_MAP = {
  order: FiPackage,
  payment: FiDollarSign,
  offer: FiTag,
  default: FiBell,
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadNotifications(1);
  }, []);

  const loadNotifications = async (page) => {
    try {
      if (page === 1) setLoading(true);
      const res = await fetchNotifications(page);
      const list = res?.data || res?.notifications || res || [];
      if (page === 1) {
        setNotifications(list);
      } else {
        setNotifications(prev => [...prev, ...list]);
      }
      setHasMore(list.length >= 10);
      setOffset(page);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    const Icon = ICON_MAP[type] || ICON_MAP.default;
    return <Icon size={20} />;
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="notifications-page">
      <section className="noti-page__hero">
        <div className="container">
          <h1>Notifications</h1>
        </div>
      </section>

      <section className="container noti-page__body">
        {loading ? (
          <div className="noti-skeletons">
            {[...Array(6)].map((_, i) => <div key={i} className="noti-skeleton" />)}
          </div>
        ) : notifications.length === 0 ? (
          <div className="noti-empty">
            <FiBell size={48} />
            <h3>No Notifications</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          <>
            <div className="noti-list">
              {notifications.map((n, idx) => (
                <div key={n.id || idx} className={`noti-card ${n.is_read ? '' : 'unread'}`}>
                  <div className={`noti-card__icon ${n.type || 'default'}`}>
                    {n.image ? (
                      <img src={n.image} alt="" className="noti-card__img" />
                    ) : (
                      getIcon(n.type)
                    )}
                  </div>
                  <div className="noti-card__content">
                    <h4 className="noti-card__title">{n.title || 'Notification'}</h4>
                    <p className="noti-card__desc">{n.description || n.body || ''}</p>
                    <span className="noti-card__time">
                      <FiClock size={12} /> {timeAgo(n.created_at || n.updated_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {hasMore && (
              <button className="noti-load-more" onClick={() => loadNotifications(offset + 1)}>
                Load More
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default NotificationsPage;
