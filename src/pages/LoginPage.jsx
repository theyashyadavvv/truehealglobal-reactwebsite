import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import './LoginPage.css';
import GradientButton from '../components/GradientButton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { login as loginApi, socialLogin, verifyPhone } from '../api/services/auth';

export default function LoginPage() {
    const [method, setMethod] = useState('phone'); // 'phone' or 'email'
    const [countryCode, setCountryCode] = useState('+91');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // Phone verification flow
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [pendingPhone, setPendingPhone] = useState('');
    const [pendingToken, setPendingToken] = useState('');
    const { onLoginSuccess } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (method === 'phone' && !phone.trim()) {
            setError('Please enter your phone number');
            return;
        }
        if (method === 'email' && !email.trim()) {
            setError('Please enter your email address');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const fullPhone = method === 'phone' ? `${countryCode}${phone.replace(/\s/g, '')}` : undefined;
            const data = await loginApi({
                phone: fullPhone,
                email: method === 'email' ? email : undefined,
                password,
                fieldType: method,
            });

            // Handle response like Flutter auth_service.dart
            if (data.token && data.is_phone_verified && data.is_email_verified && data.is_personal_info) {
                // Fully verified — login success
                await onLoginSuccess(data.token);
                toast.success('Welcome back!');
                navigate(from, { replace: true });
            } else if (data.token && !data.is_phone_verified) {
                // Phone not verified — show OTP input
                setPendingPhone(fullPhone || '');
                setPendingToken(data.token);
                setShowOtpInput(true);
                setSuccess('Phone verification required. Please enter the OTP sent to your phone.');
            } else if (data.token && !data.is_email_verified) {
                setSuccess('Account found! Email verification required. Please check your email.');
            } else if (data.token) {
                // Token exists, verification passed
                await onLoginSuccess(data.token);
                navigate(from, { replace: true });
            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            // API errors come as thrown Error objects from handleResponse
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-page__container">
                <motion.div
                    className="login-page__card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="login-page__header">
                        <img src="/assets/image/thg-logo.png" alt="THG" className="login-page__logo" />
                        <h1>Welcome Back</h1>
                        <p>Sign in to continue to True Heal Global</p>
                    </div>

                    <div className="login-page__tabs">
                        <button
                            className={`login-page__tab ${method === 'phone' ? 'active' : ''}`}
                            onClick={() => { setMethod('phone'); setError(''); }}
                        >
                            Phone Number
                        </button>
                        <button
                            className={`login-page__tab ${method === 'email' ? 'active' : ''}`}
                            onClick={() => { setMethod('email'); setError(''); }}
                        >
                            Email Address
                        </button>
                    </div>

                    <form className="login-page__form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="login-page__alert login-page__alert--error">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="login-page__alert login-page__alert--success">
                                {success}
                            </div>
                        )}

                        {method === 'phone' ? (
                            <div className="form-group">
                                <label>Phone Number</label>
                                <div className="input-icon-wrapper input-phone-wrapper">
                                    <select
                                        className="country-code-select"
                                        value={countryCode}
                                        onChange={e => setCountryCode(e.target.value)}
                                    >
                                        <option value="+91">🇮🇳 +91</option>
                                        <option value="+1">🇺🇸 +1</option>
                                        <option value="+44">🇬🇧 +44</option>
                                        <option value="+971">🇦🇪 +971</option>
                                        <option value="+880">🇧🇩 +880</option>
                                        <option value="+61">🇦🇺 +61</option>
                                        <option value="+81">🇯🇵 +81</option>
                                    </select>
                                    <input
                                        type="tel"
                                        placeholder="98765 43210"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-icon-wrapper">
                                    <HiOutlineMail className="input-icon" />
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-icon-wrapper">
                                <HiOutlineLockClosed className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <HiEyeOff /> : <HiEye />}
                                </button>
                            </div>
                        </div>

                        <div className="login-page__options">
                            <label className="remember-me">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={e => setRememberMe(e.target.checked)}
                                />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                        </div>

                        <GradientButton type="submit" size="lg" block disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </GradientButton>
                    </form>

                    <div className="login-page__divider">
                        <span>Or continue with</span>
                    </div>

                    <div className="login-page__social">
                        <button className="social-btn" type="button" onClick={async () => {
                            toast.info('Google sign-in: For production, integrate Google OAuth. Redirecting to manual login.');
                            // In production, use Google OAuth to get idToken, then call:
                            // const data = await socialLogin({ token: idToken, unique_id: googleId, email, medium: 'google' });
                            // if (data.token) { await onLoginSuccess(data.token); navigate(from); }
                        }}>
                            <FcGoogle size={24} />
                            <span>Google</span>
                        </button>
                        <button className="social-btn" type="button" onClick={() => {
                            toast.info('Apple sign-in is only available on Apple devices.');
                        }}>
                            <FaApple size={24} />
                            <span>Apple</span>
                        </button>
                    </div>
                    {/* OTP Verification Modal */}
                    {showOtpInput && (
                        <div className="login-page__otp-section">
                            <form className="login-page__form" onSubmit={async (e) => {
                                e.preventDefault();
                                setLoading(true);
                                setError('');
                                try {
                                    await verifyPhone({ phone: pendingPhone, otp: otpCode });
                                    // Now login with the token
                                    if (pendingToken) {
                                        await onLoginSuccess(pendingToken);
                                        toast.success('Phone verified! Welcome!');
                                        navigate(from, { replace: true });
                                    }
                                } catch (err) {
                                    setError(err.message || 'OTP verification failed');
                                } finally {
                                    setLoading(false);
                                }
                            }}>
                                <div className="form-group">
                                    <label>Enter OTP</label>
                                    <div className="input-icon-wrapper">
                                        <HiOutlineLockClosed className="input-icon" />
                                        <input type="text" placeholder="Enter 6-digit OTP" value={otpCode} onChange={e => setOtpCode(e.target.value)} required maxLength={6} />
                                    </div>
                                </div>
                                <GradientButton type="submit" size="lg" block disabled={loading || otpCode.length < 4}>
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </GradientButton>
                            </form>
                        </div>
                    )}
                    <div className="login-page__footer">
                        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
