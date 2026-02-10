import ScrollReveal from '../ScrollReveal';
import AnimatedCounter from '../AnimatedCounter';
import { benefits } from '../../data/mockData';
import { HiLightningBolt, HiShieldCheck, HiSparkles, HiHeart, HiBeaker } from 'react-icons/hi';
import './ScienceBenefits.css';

const iconMap = {
    antioxidant: HiShieldCheck,
    muscle: HiLightningBolt,
    energy: HiLightningBolt,
    skin: HiSparkles,
    gut: HiHeart,
};

export default function ScienceBenefits() {
    return (
        <section className="benefits section">
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

                <div className="benefits__grid">
                    {benefits.map((benefit, i) => {
                        const Icon = iconMap[benefit.icon] || HiBeaker;
                        return (
                            <ScrollReveal key={benefit.id} delay={i * 0.1} className="benefits__card-wrap">
                                <div className="benefits__card">
                                    <div className="benefits__card-image">
                                        <img src={benefit.image} alt={benefit.title} />
                                        <div className="benefits__card-stat-overlay">
                                            <span className="benefits__stat-value">{benefit.stat}</span>
                                            <span className="benefits__stat-label">{benefit.statLabel}</span>
                                        </div>
                                    </div>
                                    <div className="benefits__card-content">
                                        <div className="benefits__card-icon">
                                            <Icon size={22} />
                                        </div>
                                        <h3 className="benefits__card-title">{benefit.title}</h3>
                                        <p className="benefits__card-desc">{benefit.description}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        );
                    })}
                </div>

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
