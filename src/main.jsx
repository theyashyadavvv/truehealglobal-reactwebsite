import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppConfigProvider } from './context/AppConfigContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import App from './App.jsx'
import './index.css'
import './animations.css'

class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, info) { console.error('React Error Boundary caught:', error, info); }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', color: 'red', fontFamily: 'monospace', background: '#fff', minHeight: '100vh' }}>
                    <h2>Something went wrong</h2>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error)}</pre>
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', marginTop: '1rem' }}>{this.state.error?.stack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <AppConfigProvider>
                    <AuthProvider>
                        <CartProvider>
                            <ToastProvider>
                                <App />
                            </ToastProvider>
                        </CartProvider>
                    </AuthProvider>
                </AppConfigProvider>
            </BrowserRouter>
        </ErrorBoundary>
    </React.StrictMode>,
)
