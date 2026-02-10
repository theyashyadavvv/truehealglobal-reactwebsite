import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLockClosed } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import './LoginPage.css';
import GradientButton from '../components/GradientButton';

export default function LoginPage() {
    const [method, setMethod] = useState('phone'); // 'phone' or 'email'

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
                            onClick={() => setMethod('phone')}
                        >
                            Phone Number
                        </button>
                        <button
                            className={`login-page__tab ${method === 'email' ? 'active' : ''}`}
                            onClick={() => setMethod('email')}
                        >
                            Email Address
                        </button>
                    </div>

                    <form className="login-page__form" onSubmit={(e) => e.preventDefault()}>
                        {method === 'phone' ? (
                            <div className="form-group">
                                <label>Phone Number</label>
                                <div className="input-icon-wrapper">
                                    <HiOutlinePhone className="input-icon" />
                                    <input type="tel" placeholder="+91 98765 43210" />
                                </div>
                            </div>
                        ) : (
                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-icon-wrapper">
                                    <HiOutlineMail className="input-icon" />
                                    <input type="email" placeholder="john@example.com" />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-icon-wrapper">
                                <HiOutlineLockClosed className="input-icon" />
                                <input type="password" placeholder="••••••••" />
                            </div>
                        </div>

                        <div className="login-page__forgot">
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>

                        <GradientButton type="submit" size="lg" block>
                            Sign In
                        </GradientButton>
                    </form>

                    <div className="login-page__divider">
                        <span>Or continue with</span>
                    </div>

                    <div className="login-page__social">
                        <button className="social-btn">
                            <FcGoogle size={24} />
                            <span>Google</span>
                        </button>
                        <button className="social-btn">
                            <FaApple size={24} />
                            <span>Apple</span>
                        </button>
                    </div>

                    <div className="login-page__footer">
                        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
