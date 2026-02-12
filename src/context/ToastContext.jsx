/**
 * Toast / Snackbar Notification System
 * Provides global toast notifications like Flutter's showCustomSnackBar
 */
import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiCheckCircle, HiXCircle, HiExclamation, HiInformationCircle, HiX } from 'react-icons/hi';

const ToastContext = createContext(null);

let toastIdCounter = 0;

const ICONS = {
    success: HiCheckCircle,
    error: HiXCircle,
    warning: HiExclamation,
    info: HiInformationCircle,
};

const COLORS = {
    success: { bg: '#ecfdf5', border: '#10b981', text: '#065f46', icon: '#10b981' },
    error: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b', icon: '#ef4444' },
    warning: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e', icon: '#f59e0b' },
    info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af', icon: '#3b82f6' },
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef({});

    const removeToast = useCallback((id) => {
        clearTimeout(timersRef.current[id]);
        delete timersRef.current[id];
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message, type = 'info', duration = 3500) => {
        const id = ++toastIdCounter;
        setToasts(prev => [...prev.slice(-4), { id, message, type }]); // max 5 visible
        timersRef.current[id] = setTimeout(() => removeToast(id), duration);
        return id;
    }, [removeToast]);

    const success = useCallback((msg, dur) => showToast(msg, 'success', dur), [showToast]);
    const error = useCallback((msg, dur) => showToast(msg, 'error', dur ?? 5000), [showToast]);
    const warning = useCallback((msg, dur) => showToast(msg, 'warning', dur), [showToast]);
    const info = useCallback((msg, dur) => showToast(msg, 'info', dur), [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
            {children}

            {/* Toast Container */}
            <div style={{
                position: 'fixed',
                top: '1rem',
                right: '1rem',
                zIndex: 99999,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                maxWidth: '420px',
                width: '100%',
                pointerEvents: 'none',
            }}>
                <AnimatePresence>
                    {toasts.map(toast => {
                        const colors = COLORS[toast.type] || COLORS.info;
                        const Icon = ICONS[toast.type] || HiInformationCircle;
                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, x: 80, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 80, scale: 0.95 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                style={{
                                    background: colors.bg,
                                    border: `1px solid ${colors.border}`,
                                    borderLeft: `4px solid ${colors.border}`,
                                    borderRadius: '10px',
                                    padding: '0.85rem 1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    pointerEvents: 'auto',
                                    cursor: 'pointer',
                                }}
                                onClick={() => removeToast(toast.id)}
                            >
                                <Icon size={22} style={{ color: colors.icon, flexShrink: 0 }} />
                                <span style={{ color: colors.text, fontSize: '0.9rem', fontWeight: 500, flex: 1 }}>
                                    {toast.message}
                                </span>
                                <HiX size={16} style={{ color: colors.text, opacity: 0.5, flexShrink: 0 }} />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}
