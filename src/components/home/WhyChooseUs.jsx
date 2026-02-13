import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { HiOfficeBuilding, HiShoppingBag, HiUserGroup, HiStar } from 'react-icons/hi';
import ScrollReveal from '../ScrollReveal';
import './WhyChooseUs.css';

function AnimatedCounter({ target, suffix = '', duration = 2 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const end = parseFloat(target);
        const isDecimal = target.toString().includes('.');
        const increment = end / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(isDecimal ? parseFloat(start.toFixed(1)) : Math.floor(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [isInView, target, duration]);

    return (
        <span ref={ref}>
            {count}{suffix}
        </span>
    );
}

const stats = [
    { icon: HiOfficeBuilding, number: 50, suffix: '+', label: 'Partner Stores', delay: 0 },
    { icon: HiShoppingBag, number: 1000, suffix: '+', label: 'Premium Products', delay: 0.1 },
    { icon: HiUserGroup, number: 10, suffix: 'K+', label: 'Happy Customers', delay: 0.2 },
    { icon: HiStar, number: 4.8, suffix: '★', label: 'Average Rating', delay: 0.3 },
];

export default function WhyChooseUs() {
    return (
        <section className="why-choose-us">
            <div className="container">
                <ScrollReveal>
                    <div className="why-choose-us__header">
                        <span className="why-choose-us__label">Why True Heal Global</span>
                        <h2 className="why-choose-us__title">Trusted by Thousands</h2>
                        <p className="why-choose-us__subtitle">
                            We bring together the best brands and stores for your wellness journey.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="why-choose-us__grid">
                    {stats.map((stat, i) => (
                        <ScrollReveal key={i} delay={stat.delay}>
                            <motion.div
                                className="why-choose-us__card"
                                whileHover={{ scale: 1.03 }}
                            >
                                <div className="why-choose-us__icon">
                                    <stat.icon />
                                </div>
                                <div className="why-choose-us__number">
                                    <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                                </div>
                                <div className="why-choose-us__stat-label">{stat.label}</div>
                            </motion.div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
