import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLockClosed } from 'react-icons/hi';
import GradientButton from '../components/GradientButton';
import { forgotPassword, verifyToken, resetPassword } from '../api/services/auth';
import './LoginPage.css';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1=enter email/phone, 2=OTP, 3=new password
    const [method, setMethod] = useState('phone');
    const [countryCode, setCountryCode] = useState('+91');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resetToken, setResetToken] = useState('');
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Match Flutter: sends phone (with country code), email, verification_method
            const fullPhone = method === 'phone' ? `${countryCode}${phone.replace(/\s/g, '')}` : '';
            const body = {
                phone: fullPhone,
                email: method === 'email' ? email : '',
                verification_method: method,
            };
            const data = await forgotPassword(body);
            if (data.errors) {
                setError(Object.values(data.errors).flat().join('. '));
            } else {
                setStep(2);
            }
        } catch (err) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Match Flutter: phone (with country code), email, verification_method, reset_token
            const fullPhone = method === 'phone' ? `${countryCode}${phone.replace(/\s/g, '')}` : '';
            const body = {
                phone: fullPhone,
                email: method === 'email' ? email : '',
                verification_method: method,
                reset_token: otp,
            };
            const data = await verifyToken(body);
            if (data.errors) {
                setError(Object.values(data.errors).flat().join('. '));
            } else {
                setResetToken(data.token || otp);
                setStep(3);
            }
        } catch (err) {
            setError(err.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            // Match Flutter: _method: put, reset_token, phone (with country code), email, verification_method, password, confirm_password
            const fullPhone = method === 'phone' ? `${countryCode}${phone.replace(/\s/g, '')}` : '';
            const body = {
                _method: 'put',
                reset_token: resetToken,
                phone: fullPhone,
                email: method === 'email' ? email : '',
                verification_method: method,
                password: newPassword,
                confirm_password: confirmPassword,
            };
            const data = await resetPassword(body);
            if (data.errors) {
                setError(Object.values(data.errors).flat().join('. '));
            } else {
                navigate('/login');
            }
        } catch (err) {
            setError(err.message || 'Password reset failed');
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
                        <h1>{step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'Reset Password'}</h1>
                        <p>{step === 1 ? 'Enter your registered email or phone' : step === 2 ? 'Enter the code sent to you' : 'Create a new password'}</p>
                    </div>

                    {step === 1 && (
                        <>
                            <div className="login-page__tabs">
                                <button className={`login-page__tab ${method === 'phone' ? 'active' : ''}`} onClick={() => setMethod('phone')}>Phone</button>
                                <button className={`login-page__tab ${method === 'email' ? 'active' : ''}`} onClick={() => setMethod('email')}>Email</button>
                            </div>
                            <form className="login-page__form" onSubmit={handleSendOtp}>
                                {error && <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                                {method === 'phone' ? (
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <div className="input-icon-wrapper">
                                            <HiOutlinePhone className="input-icon" />
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
                                            <input type="tel" placeholder="98765 43210" value={phone} onChange={e => setPhone(e.target.value)} required />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <div className="input-icon-wrapper">
                                            <HiOutlineMail className="input-icon" />
                                            <input type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                                        </div>
                                    </div>
                                )}
                                <GradientButton type="submit" size="lg" block disabled={loading}>
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </GradientButton>
                            </form>
                        </>
                    )}

                    {step === 2 && (
                        <form className="login-page__form" onSubmit={handleVerifyOtp}>
                            {error && <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                            <div className="form-group">
                                <label>Verification Code</label>
                                <div className="input-icon-wrapper">
                                    <HiOutlineLockClosed className="input-icon" />
                                    <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6} />
                                </div>
                            </div>
                            <GradientButton type="submit" size="lg" block disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </GradientButton>
                        </form>
                    )}

                    {step === 3 && (
                        <form className="login-page__form" onSubmit={handleResetPassword}>
                            {error && <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                            <div className="form-group">
                                <label>New Password</label>
                                <div className="input-icon-wrapper">
                                    <HiOutlineLockClosed className="input-icon" />
                                    <input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <div className="input-icon-wrapper">
                                    <HiOutlineLockClosed className="input-icon" />
                                    <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} />
                                </div>
                            </div>
                            <GradientButton type="submit" size="lg" block disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </GradientButton>
                        </form>
                    )}

                    <div className="login-page__footer">
                        <p>Remember your password? <Link to="/login">Sign In</Link></p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
