
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './SignInPage.css';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="signin-icon" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }) => (
    <div className="signin-glass-input">
        {children}
    </div>
);

const TestimonialCard = ({ testimonial, delay }) => (
    <div className={`signin-testimonial ${delay}`}>
        <img src={testimonial.avatarSrc} className="signin-testimonial-avatar" alt="avatar" />
        <div className="signin-testimonial-content">
            <p className="signin-testimonial-name">{testimonial.name}</p>
            <p className="signin-testimonial-handle">{testimonial.handle}</p>
            <p className="signin-testimonial-text">{testimonial.text}</p>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

const SignInPage = ({
    title = <span className="signin-title-span">Welcome</span>,
    description = "Access your account and continue your journey with us",
    heroImageSrc,
    testimonials = [],
    onSignIn,
    onGoogleSignIn,
    onResetPassword,
    onCreateAccount,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="signin-page">
            {/* Left column: sign-in form */}
            <section className="signin-left">
                <div className="signin-form-max-w">
                    <div className="signin-flex-col">
                        <h1 className="signin-title animate-element delay-100">{title}</h1>
                        <p className="signin-description animate-element delay-200">{description}</p>

                        <form className="signin-form animate-element delay-300" onSubmit={onSignIn}>
                            <div className="signin-field">
                                <label className="signin-label">Email Address</label>
                                <GlassInputWrapper>
                                    <input name="email" type="email" placeholder="Enter your email address" className="signin-input" />
                                </GlassInputWrapper>
                            </div>

                            <div className="signin-field animate-element delay-400">
                                <label className="signin-label">Password</label>
                                <GlassInputWrapper>
                                    <div className="signin-password-wrapper">
                                        <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="signin-input signin-input-password" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="signin-eye-btn">
                                            {showPassword ? <EyeOff className="signin-eye-icon" /> : <Eye className="signin-eye-icon" />}
                                        </button>
                                    </div>
                                </GlassInputWrapper>
                            </div>

                            <div className="signin-options animate-element delay-500">
                                <label className="signin-remember">
                                    <input type="checkbox" name="rememberMe" className="signin-checkbox" />
                                    <span>Keep me signed in</span>
                                </label>
                                <a href="#" onClick={(e) => { e.preventDefault(); onResetPassword?.(); }} className="signin-forgot">Reset password</a>
                            </div>

                            <button type="submit" className="signin-submit-btn animate-element delay-600">
                                Sign In
                            </button>
                        </form>

                        <div className="signin-divider animate-element delay-700">
                            <span className="signin-divider-line"></span>
                            <span className="signin-divider-text">Or continue with</span>
                        </div>

                        <button onClick={onGoogleSignIn} className="signin-google-btn animate-element delay-800">
                            <GoogleIcon />
                            Continue with Google
                        </button>

                        <p className="signin-footer animate-element delay-900">
                            New to our platform? <a href="#" onClick={(e) => { e.preventDefault(); onCreateAccount?.(); }} className="signin-create-account">Create Account</a>
                        </p>
                    </div>
                </div>
            </section>

            {/* Right column: hero image + testimonials */}
            {heroImageSrc && (
                <section className="signin-right">
                    <div className="signin-hero-bg animate-slide-right delay-300" style={{ backgroundImage: `url(${heroImageSrc})` }}></div>
                    {testimonials.length > 0 && (
                        <div className="signin-testimonials-container">
                            <TestimonialCard testimonial={testimonials[0]} delay="delay-1000" />
                            {testimonials[1] && <div className="hidden-xl"><TestimonialCard testimonial={testimonials[1]} delay="delay-1200" /></div>}
                            {testimonials[2] && <div className="hidden-2xl"><TestimonialCard testimonial={testimonials[2]} delay="delay-1400" /></div>}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default SignInPage;
