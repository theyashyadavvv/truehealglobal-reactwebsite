import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../ScrollReveal';
import { HiChevronDown, HiArrowRight } from 'react-icons/hi';
import { faqs } from '../../data/mockData';
import GradientButton from '../GradientButton';
import './FAQPreview.css';

export default function FAQPreview() {
    const [openId, setOpenId] = useState(null);
    const previewFaqs = faqs.slice(0, 4);

    return (
        <section className="faq-preview section">
            <div className="container">
                <div className="faq-preview__layout">
                    <ScrollReveal direction="right" className="faq-preview__info">
                        <p className="section-label">FAQs</p>
                        <h2 className="section-title" style={{ textAlign: 'left' }}>
                            Questions? We Have Answers.
                        </h2>
                        <p className="faq-preview__desc">
                            Everything you need to know about hydrogen water, alkaline water,
                            and our machines. If you cannot find your answer here, get in touch.
                        </p>
                        <Link to="/faq">
                            <GradientButton>
                                View All FAQs <HiArrowRight />
                            </GradientButton>
                        </Link>
                    </ScrollReveal>

                    <ScrollReveal direction="left" className="faq-preview__list">
                        {previewFaqs.map((faq) => (
                            <div
                                key={faq.id}
                                className={`faq-preview__item ${openId === faq.id ? 'faq-preview__item--open' : ''}`}
                            >
                                <button
                                    className="faq-preview__question"
                                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                >
                                    <span>{faq.question}</span>
                                    <motion.span
                                        className="faq-preview__chevron"
                                        animate={{ rotate: openId === faq.id ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <HiChevronDown size={20} />
                                    </motion.span>
                                </button>
                                <AnimatePresence>
                                    {openId === faq.id && (
                                        <motion.div
                                            className="faq-preview__answer"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <p>{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
