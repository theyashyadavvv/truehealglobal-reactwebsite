import ScrollReveal from '../ScrollReveal';
import AnimatedCounter from '../AnimatedCounter';
import { benefits } from '../../data/mockData';
import { HiBeaker } from 'react-icons/hi';
import { Carousel, Card } from '../ui/apple-cards-carousel';
import './ScienceBenefits.css';

/* Build detail content for each benefit card modal */
const BenefitDetail = ({ benefit }) => (
    <div>
        <div className="apple-card__detail-block">
            <div className="apple-card__detail-stat">
                {benefit.stat}
                <span className="apple-card__detail-stat-label">{benefit.statLabel}</span>
            </div>
            <p className="apple-card__detail-text">
                <strong>{benefit.title}:</strong> {benefit.description}
            </p>
            <img
                src={benefit.image}
                alt={benefit.title}
                className="apple-card__detail-image"
            />
        </div>
    </div>
);

/* Map benefits data → card format for the carousel */
const cardsData = benefits.map((b) => ({
    category: 'Science-Backed',
    title: b.title,
    src: b.image,
    content: <BenefitDetail benefit={b} />,
}));

export default function ScienceBenefits() {
    const cards = cardsData.map((card, index) => (
        <Card key={card.src + index} card={card} index={index} />
    ));

    return (
        <section className="benefits section" style={{ background: '#fff' }}>
            <div className="container">
                <ScrollReveal>
                    <div className="section-header">
                        <p className="section-label"><HiBeaker /> Science-Backed Benefits</p>
                        <h2 className="section-title">Why Hydrogen Water Changes Everything</h2>
                        <p className="section-subtitle">
                            Over 1,000 peer-reviewed studies prove the remarkable health benefits
                            of molecular hydrogen. Here is what science says.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Apple-style horizontal card carousel */}
                <Carousel items={cards} />

                {/* Science metrics bar with animated counters */}
                <ScrollReveal delay={0.3}>
                    <div className="benefits__metrics">
                        <div className="benefits__metric">
                            <span className="benefits__metric-icon">⚡</span>
                            <div>
                                <span className="benefits__metric-value">
                                    -<AnimatedCounter target={800} suffix=" mV" />
                                </span>
                                <span className="benefits__metric-label">ORP Value</span>
                            </div>
                        </div>
                        <div className="benefits__metric">
                            <span className="benefits__metric-icon">🧪</span>
                            <div>
                                <span className="benefits__metric-value">pH 8.5-9.5</span>
                                <span className="benefits__metric-label">Alkaline Range</span>
                            </div>
                        </div>
                        <div className="benefits__metric">
                            <span className="benefits__metric-icon">💧</span>
                            <div>
                                <span className="benefits__metric-value">
                                    <AnimatedCounter target={1600} suffix=" ppb" />
                                </span>
                                <span className="benefits__metric-label">H₂ Dissolved</span>
                            </div>
                        </div>
                        <div className="benefits__metric">
                            <span className="benefits__metric-icon">🔬</span>
                            <div>
                                <span className="benefits__metric-value">
                                    <AnimatedCounter target={1000} suffix="+" />
                                </span>
                                <span className="benefits__metric-label">Studies Published</span>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
