/**
 * Auth Context — provides authentication state globally.
 * Mirrors Flutter's AuthController behavior.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, saveToken, clearAllSession } from '../api/config';
import { fetchCustomerInfo } from '../api/services/customer';
import { guestLogin, logout as apiLogout } from '../api/services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(getToken());
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);

    const isLoggedIn = !!token && !isGuest;

    // Load user profile when token exists
    const loadUser = useCallback(async () => {
        const t = getToken();
        if (!t) {
            setUser(null);
            setToken(null);
            setLoading(false);
            return;
        }
        try {
            const data = await fetchCustomerInfo();
            setUser(data);
            setToken(t);
        } catch (err) {
            console.warn('Failed to load user info:', err.message);
            if (err.status === 401) {
                setUser(null);
                setToken(null);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Initialize: check for existing token or request guest login
    useEffect(() => {
        const t = getToken();
        if (t) {
            loadUser();
        } else {
            // Auto guest-login like Flutter does
            guestLogin()
                .then(() => setIsGuest(true))
                .catch(() => {})
                .finally(() => setLoading(false));
        }
    }, [loadUser]);

    // Listen for 401 events from apiClient
    useEffect(() => {
        const handler = () => {
            setUser(null);
            setToken(null);
            setIsGuest(false);
        };
        window.addEventListener('auth:unauthorized', handler);
        window.addEventListener('auth:logout', handler);
        return () => {
            window.removeEventListener('auth:unauthorized', handler);
            window.removeEventListener('auth:logout', handler);
        };
    }, []);

    const onLoginSuccess = useCallback(async (tkn) => {
        if (tkn) saveToken(tkn);
        setIsGuest(false);
        setToken(tkn || getToken());
        await loadUser();
    }, [loadUser]);

    const logout = useCallback(() => {
        apiLogout();
        setUser(null);
        setToken(null);
        setIsGuest(false);
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            isLoggedIn,
            isGuest,
            onLoginSuccess,
            logout,
            refreshUser: loadUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
