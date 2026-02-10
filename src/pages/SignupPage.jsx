import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import './LoginPage.css'; // Reusing login styles for consistency
import GradientButton from '../components/GradientButton';

export default function SignupPage() {
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

                    <form className="login-page__form" onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-icon-wrapper">
                                <HiOutlineUser className="input-icon" />
                                <input type="text" placeholder="John Doe" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <div className="input-icon-wrapper">
                                <HiOutlinePhone className="input-icon" />
                                <input type="tel" placeholder="+91 98765 43210" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-icon-wrapper">
                                <HiOutlineMail className="input-icon" />
                                <input type="email" placeholder="john@example.com" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-icon-wrapper">
                                <HiOutlineLockClosed className="input-icon" />
                                <input type="password" placeholder="Create password" />
                            </div>
                        </div>

                        <GradientButton type="submit" size="lg" block>
                            Sign Up
                        </GradientButton>
                    </form>

                    <div className="login-page__divider">
                        <span>Or register with</span>
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
                        <p>Already have an account? <Link to="/login">Sign In</Link></p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
