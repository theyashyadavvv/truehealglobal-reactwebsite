import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import WarpShaderHero from '../components/WarpShaderHero';
import { HiChevronDown, HiSearch } from 'react-icons/hi';
import { faqs } from '../data/mockData';
import './FAQPage.css';

export default function FAQPage() {
    const [openId, setOpenId] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState('');

    const categories = useMemo(() => {
        const cats = ['All', ...new Set(faqs.map(f => f.category))];
        return cats;
    }, []);

    const filtered = useMemo(() => {
        let result = faqs;
        if (activeCategory !== 'All') {
            result = result.filter(f => f.category === activeCategory);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(f =>
                f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
            );
        }
        return result;
    }, [activeCategory, search]);

    return (
        <main className="faq-page">
            {/* Hero */}
            {/* Hero */}
            <WarpShaderHero
                title="Frequently Asked Questions"
                subtitle="Everything you need to know about hydrogen and alkaline water machines"
                label="Help Center"
                primaryBtnText="Ask a Question"
                secondaryBtnText="Contact Support"
            />

            <section className="faq-page__search-section">
                <div className="container">
                    <div className="faq-page__search">
                        <HiSearch size={20} />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container-narrow">
                    {/* Category tabs */}
                    <ScrollReveal>
                        <div className="faq-page__categories">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`faq-page__cat-btn ${activeCategory === cat ? 'faq-page__cat-btn--active' : ''}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </ScrollReveal>

                    {/* FAQ List */}
                    <div className="faq-page__list">
                        {filtered.map((faq, i) => (
                            <ScrollReveal key={faq.id} delay={i * 0.05}>
                                <div className={`faq-page__item ${openId === faq.id ? 'faq-page__item--open' : ''}`}>
                                    <button
                                        className="faq-page__question"
                                        onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                    >
                                        <div>
                                            <span className="faq-page__question-cat">{faq.category}</span>
                                            <span className="faq-page__question-text">{faq.question}</span>
                                        </div>
                                        <motion.span
                                            className="faq-page__chevron"
                                            animate={{ rotate: openId === faq.id ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <HiChevronDown size={22} />
                                        </motion.span>
                                    </button>
                                    <AnimatePresence>
                                        {openId === faq.id && (
                                            <motion.div
                                                className="faq-page__answer"
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
                            </ScrollReveal>
                        ))}

                        {filtered.length === 0 && (
                            <div className="faq-page__empty">
                                <p>No questions found matching your search. Try different keywords.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
