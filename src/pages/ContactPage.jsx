import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineLocationMarker,
    HiOutlineGlobeAlt,
    HiOutlineSupport,
    HiOutlineUser,
    HiOutlineChatAlt2
} from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import './StaticPage.css';

export default function ContactPage() {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Mock success to match Flutter app behavior
        setTimeout(() => {
            toast.success("Thank you! Your message has been sent. We'll get back to you soon.");
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="static-page">
            <div className="container section">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="contact-header-bg"
                >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                        <HiOutlineSupport size={56} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>Get in Touch</h1>
                    <p className="section-subtitle">We'd love to hear from you. Our team is ready to help!</p>
                </motion.div>

                <div className="contact-grid">
                    {/* Contact Info Column */}
                    <div>
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Contact Information</h2>
                            <p style={{ color: 'var(--color-gray-500)' }}>Feel free to reach out through any of the following channels.</p>
                        </div>

                        <div>
                            <ContactCard
                                icon={<HiOutlineMail />}
                                title="Email Us"
                                value="support@truehealglobal.com"
                                subtitle="We'll respond within 24 hours"
                                href="mailto:support@truehealglobal.com"
                            />
                            <ContactCard
                                icon={<HiOutlinePhone />}
                                title="Call Us"
                                value="+91 97692 16919"
                                subtitle="Mon-Sat, 9 AM - 6 PM IST"
                                href="tel:+919769216919"
                            />
                            <ContactCard
                                icon={<HiOutlineLocationMarker />}
                                title="Visit Us"
                                value="True Heal Global LLP"
                                subtitle="A-8 Nutan Kalpana, S.N. Road, Opp Sitara Hotel, Mulund West, Mumbai - 400080. India"
                                href="https://maps.google.com/?q=Mulund+West+Mumbai+400080"
                            />
                            <ContactCard
                                icon={<HiOutlineGlobeAlt />}
                                title="Website"
                                value="www.truehealglobal.com"
                                subtitle="Visit our official website"
                                href="https://www.truehealglobal.com"
                            />
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Follow Us</h3>
                            <div className="social-btns">
                                <SocialBtn icon={<FaFacebookF />} bg="#3b5998" href="https://www.facebook.com/people/Truehealglobal/61576012675998/" />
                                <SocialBtn icon={<FaInstagram />} bg="#E1306C" href="https://www.instagram.com/truehealglobal/" />
                                <SocialBtn icon={<FaYoutube />} bg="#FF0000" />
                                <SocialBtn icon={<FaLinkedinIn />} bg="#0077b5" />
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Column */}
                    <div>
                        <div className="card" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Send us a Message</h2>
                            <p style={{ color: 'var(--color-gray-500)', marginBottom: '2rem' }}>Fill out the form and our team will get back to you shortly.</p>

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                    <InputGroup
                                        label="Full Name"
                                        name="name"
                                        icon={<HiOutlineUser size={20} />}
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    <InputGroup
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        icon={<HiOutlineMail size={20} />}
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                    <InputGroup
                                        label="Phone Number"
                                        name="phone"
                                        type="tel"
                                        icon={<HiOutlinePhone size={20} />}
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                    <InputGroup
                                        label="Subject"
                                        name="subject"
                                        icon={<HiOutlineChatAlt2 size={20} />}
                                        value={formData.subject}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Your Message</label>
                                    <div className="form-input-wrapper">
                                        <div className="form-input-icon top-aligned">
                                            <HiOutlineChatAlt2 size={20} />
                                        </div>
                                        <textarea
                                            name="message"
                                            rows="5"
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Write your message here..."
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary btn-block"
                                    style={{ width: '100%' }}
                                >
                                    {loading ? (
                                        'Sending...'
                                    ) : (
                                        <>
                                            Send Message
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
                                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="faq-section">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <HiOutlineSupport size={24} color="var(--color-primary)" />
                        <h2 style={{ fontSize: '1.25rem', marginBottom: 0 }}>Frequently Asked Questions</h2>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <FAQItem q="How can I track my order?" a="You can track your order by logging into your account and visiting the 'My Orders' section. You'll receive tracking updates via email and SMS." />
                        <FAQItem q="What is your return policy?" a="We offer a 30-day return policy for unused products in original packaging. Please contact our support team to initiate a return." />
                        <FAQItem q="How long does shipping take?" a="Standard shipping takes 5-7 business days. Express shipping options are available at checkout for faster delivery." />
                    </div>
                </div>

            </div>
        </div>
    );
}

function ContactCard({ icon, title, value, subtitle, href }) {
    return (
        <a href={href} target="_blank" rel="noreferrer" className="contact-card-link">
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="contact-icon-box">
                    {icon}
                </div>
                <div>
                    <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-gray-500)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{title}</h3>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem', color: 'var(--color-gray-800)' }}>{value}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)', whiteSpace: 'pre-line' }}>{subtitle}</p>
                </div>
            </div>
        </a>
    );
}

function InputGroup({ label, name, type = "text", icon, value, onChange }) {
    return (
        <div className="form-group">
            <label className="form-label">{label}</label>
            <div className="form-input-wrapper">
                <div className="form-input-icon">
                    {icon}
                </div>
                <input
                    type={type}
                    name={name}
                    required
                    value={value}
                    onChange={onChange}
                    className="form-control"
                    placeholder={`Enter your ${label.toLowerCase()}`}
                />
            </div>
        </div>
    );
}

function SocialBtn({ icon, bg, href = "#" }) {
    return (
        <a href={href} target="_blank" rel="noreferrer" className="social-btn" style={{ backgroundColor: bg }}>
            {icon}
        </a>
    );
}

function FAQItem({ q, a }) {
    return (
        <div className="faq-item">
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--color-gray-800)' }}>{q}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', lineHeight: 1.6 }}>{a}</p>
        </div>
    );
}
