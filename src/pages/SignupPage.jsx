import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLockClosed, HiOutlineUser, HiOutlineTag, HiEye, HiEyeOff } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import './LoginPage.css'; // Reusing login styles for consistency
import GradientButton from '../components/GradientButton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { register } from '../api/services/auth';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [refCode, setRefCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { onLoginSuccess } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!name.trim()) { setError('Please enter your name'); return; }
        if (!phone.trim()) { setError('Please enter your phone number'); return; }
        if (!email.trim()) { setError('Please enter your email address'); return; }
        if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
        if (password !== confirmPassword) { setError('Passwords do not match'); return; }
        if (!agreedToTerms) { setError('Please agree to Terms & Conditions'); return; }

        setLoading(true);
        try {
            const fullPhone = `${countryCode}${phone.replace(/\s/g, '')}`;
            const data = await register({
                name: name.trim(),
                phone: fullPhone,
                email: email.trim(),
                password,
                ref_code: refCode.trim() || undefined,
            });

            // Handle response like Flutter auth flow
            if (data.token && data.is_phone_verified && data.is_email_verified) {
                // Fully verified — auto login
                await onLoginSuccess(data.token);
                toast.success('Account created! Welcome!');
                navigate('/');
            } else if (!data.is_phone_verified) {
                // Phone not verified — need OTP
                setSuccess('Account created successfully! Please verify your phone number. Check your SMS for the verification code.');
            } else if (!data.is_email_verified) {
                setSuccess('Account created! Please verify your email address. Check your inbox.');
            } else if (data.token) {
                await onLoginSuccess(data.token);
                navigate('/');
            } else {
                setSuccess('Account created successfully! Please sign in.');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
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
                        <h1>Create Account</h1>
                        <p>Join the wellness revolution today</p>
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

                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-icon-wrapper">
                                <HiOutlineUser className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-icon-wrapper">
                                <HiOutlineLockClosed className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Min. 8 characters"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    minLength={8}
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

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="input-icon-wrapper">
                                <HiOutlineLockClosed className="input-icon" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Re-enter password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Referral Code <span style={{ color: 'var(--color-gray-400)', fontWeight: 400 }}>(Optional)</span></label>
                            <div className="input-icon-wrapper">
                                <HiOutlineTag className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="Enter referral code"
                                    value={refCode}
                                    onChange={e => setRefCode(e.target.value)}
                                />
                            </div>
                        </div>

                        <label className="remember-me" style={{ marginTop: '-0.5rem' }}>
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={e => setAgreedToTerms(e.target.checked)}
                            />
                            <span>I agree to the <Link to="/terms" style={{ color: 'var(--color-primary)' }}>Terms &amp; Conditions</Link></span>
                        </label>

                        <GradientButton type="submit" size="lg" block disabled={loading || !agreedToTerms}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </GradientButton>
                    </form>

                    <div className="login-page__divider">
                        <span>Or register with</span>
                    </div>

                    <div className="login-page__social">
                        <button className="social-btn" type="button">
                            <FcGoogle size={24} />
                            <span>Google</span>
                        </button>
                        <button className="social-btn" type="button">
                            <FaApple size={24} />
                            <span>Apple</span>
                        </button>
                    </div>

                    <div className="login-page__footer">
                        <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
