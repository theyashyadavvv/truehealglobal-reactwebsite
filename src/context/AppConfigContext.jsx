/**
 * App Config Context — provides app configuration globally.
 * Mirrors Flutter's SplashController for config data.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchConfig, fetchModules } from '../api/services/configService';

const AppConfigContext = createContext(null);

export function AppConfigProvider({ children }) {
    const [config, setConfig] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function init() {
            try {
                const [configData, moduleData] = await Promise.all([
                    fetchConfig(),
                    fetchModules(),
                ]);
                setConfig(configData);
                setModules(moduleData || []);
            } catch (err) {
                console.error('Failed to load app config:', err);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    return (
        <AppConfigContext.Provider value={{
            config,
            modules,
            loading,
            // Helper getters from config
            appName: config?.business_name || 'TrueHealGlobal',
            logo: config?.logo_full_url || config?.logo || '',
            currencySymbol: config?.currency_symbol || '₹',
            currencyPosition: config?.currency_symbol_direction || 'left',
            maintenanceMode: config?.maintenance_mode || false,
            toggles: {
                wallet: config?.customer_wallet_status === 1,
                loyalty: config?.customer_loyalty_point_status === 1,
                cashOnDelivery: config?.cash_on_delivery || false,
                digitalPayment: config?.digital_payment || false,
                socialLogin: config?.social_login || [],
            },
        }}>
            {children}
        </AppConfigContext.Provider>
    );
}

export function useAppConfig() {
    const ctx = useContext(AppConfigContext);
    if (!ctx) throw new Error('useAppConfig must be used within AppConfigProvider');
    return ctx;
}
