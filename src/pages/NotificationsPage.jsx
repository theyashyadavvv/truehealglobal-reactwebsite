import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiClock, FiPackage, FiDollarSign, FiTag, FiArrowLeft } from 'react-icons/fi';
import { fetchNotifications } from '../api';
import { useAuth } from '../context/AuthContext';
import './NotificationsPage.css';

const ICON_MAP = {
  order_status: FiPackage,
  push_notification: FiBell,
  payment: FiDollarSign,
  offer: FiTag,
  default: FiBell,
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      setError('Please login to view notifications');
      return;
    }
    loadNotifications();
  }, [isLoggedIn]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError('');
      // Flutter: GET /api/v1/customer/notifications — returns plain array, no pagination
      const res = await fetchNotifications();
      // Response is a plain array of NotificationModel objects
      const list = Array.isArray(res) ? res : (res?.notifications || res?.data || []);
      setNotifications(list);
    } catch (err) {
      console.error('Failed to load notifications', err);
      setError(err.message || 'Failed to load notifications');
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
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  // Flutter NotificationModel: { id, data: { title, description, image_full_url, type }, created_at, updated_at, image_full_url }
  const getTitle = (n) => n.data?.title || n.title || 'Notification';
  const getDescription = (n) => n.data?.description || n.description || n.body || '';
  const getImage = (n) => n.image_full_url || n.data?.image_full_url || n.image || '';
  const getType = (n) => n.data?.type || n.type || 'default';

  return (
    <div className="notifications-page">
      <section className="noti-page__hero">
        <div className="container">
          <button className="noti-page__back" onClick={() => navigate(-1)}>
            <FiArrowLeft size={20} />
          </button>
          <h1>Notifications</h1>
        </div>
      </section>

      <section className="container noti-page__body">
        {loading ? (
          <div className="noti-skeletons">
            {[...Array(6)].map((_, i) => <div key={i} className="noti-skeleton" />)}
          </div>
        ) : error ? (
          <div className="noti-empty">
            <FiBell size={48} />
            <h3>{error}</h3>
            {!isLoggedIn && (
              <button className="noti-login-btn" onClick={() => navigate('/login')}>Login</button>
            )}
            {isLoggedIn && (
              <button className="noti-retry-btn" onClick={loadNotifications}>Retry</button>
            )}
          </div>
        ) : notifications.length === 0 ? (
          <div className="noti-empty">
            <FiBell size={48} />
            <h3>No Notifications</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          <div className="noti-list">
            {notifications.map((n, idx) => {
              const image = getImage(n);
              const type = getType(n);
              return (
                <div key={n.id || idx} className="noti-card">
                  <div className={`noti-card__icon ${type}`}>
                    {image ? (
                      <img src={image} alt="" className="noti-card__img" onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      getIcon(type)
                    )}
                  </div>
                  <div className="noti-card__content">
                    <h4 className="noti-card__title">{getTitle(n)}</h4>
                    <p className="noti-card__desc">{getDescription(n)}</p>
                    <span className="noti-card__time">
                      <FiClock size={12} /> {timeAgo(n.created_at || n.updated_at)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default NotificationsPage;
