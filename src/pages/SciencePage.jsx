import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import WarpShaderHero from '../components/WarpShaderHero';
import CircularGallery from '../components/CircularGallery';
import { HiBeaker, HiLightningBolt, HiShieldCheck } from 'react-icons/hi';
import { scienceData } from '../data/mockData';
import './SciencePage.css';

export default function SciencePage() {
    return (
        <main className="science-page">
            {/* Hero */}
            <WarpShaderHero
                title="Understanding Water Technology"
                subtitle="Explore the science behind hydrogen and alkaline water — backed by 1,000+ peer-reviewed studies"
                label="The Science"
                primaryBtnText="Get Started"
                secondaryBtnText="View Research"
            />
            {/* Why Hydrogen Water Changes Everything - 3D Gallery */}
            <section className="section" style={{ overflow: 'hidden', padding: '6rem 0' }}>
                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <ScrollReveal>
                        <div className="section-header">
                            <h2 className="section-title">Why Hydrogen Water Changes Everything</h2>
                            <p className="section-subtitle">Discover the transformative power of molecular hydrogen.</p>
                        </div>
                    </ScrollReveal>
                </div>

                {/* 3D Gallery Container */}
                <div style={{ height: '600px', width: '100%', position: 'relative' }}>
                    <CircularGallery
                        items={[
                            {
                                image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=900&q=80",
                                title: "Superior Hydration",
                                subtitle: "Micro-clustering",
                                description: "Smaller water clusters penetrate cells faster for deeper hydration."
                            },
                            {
                                image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80",
                                title: "Antioxidant Power",
                                subtitle: "Neutralize Free Radicals",
                                description: "Selectively targets toxic ROS to reduce oxidative stress."
                            },
                            {
                                image: "https://images.unsplash.com/photo-1552674605-46f5c836697c?w=900&q=80",
                                title: "Athletic Performance",
                                subtitle: "Faster Recovery",
                                description: "Reduces lactic acid buildup and muscle fatigue."
                            },
                            {
                                image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=900&q=80",
                                title: "Anti-Aging",
                                subtitle: "Cellular Health",
                                description: "Promotes collagen production and protects DNA."
                            },
                            {
                                image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=900&q=80",
                                title: "Immune Support",
                                subtitle: "Balance & Defense",
                                description: "Supports the body's natural defense mechanisms."
                            },
                            {
                                image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=900&q=80",
                                title: "Mental Clarity",
                                subtitle: "Neuroprotection",
                                description: "Crosses the blood-brain barrier to support cognitive function."
                            }
                        ]}
                        radius={600}
                        autoRotateSpeed={0.05} // Slightly faster rotation
                    />
                </div>
            </section>

            {/* Hydrogen Water */}
            <section className="section">
                <div className="container">
                    <div className="science-page__explainer">
                        <ScrollReveal direction="right" className="science-page__explainer-content">
                            <p className="section-label"><HiLightningBolt /> Molecular Hydrogen</p>
                            <h2 className="section-title" style={{ textAlign: 'left' }}>{scienceData.hydrogenWater.title}</h2>
                            <p className="science-page__explainer-desc">{scienceData.hydrogenWater.description}</p>
                            <ul className="science-page__key-points">
                                {scienceData.hydrogenWater.keyPoints.map((point, i) => (
                                    <li key={i}><span className="science-page__bullet">✓</span> {point}</li>
                                ))}
                            </ul>
                        </ScrollReveal>
                        <ScrollReveal direction="left" className="science-page__explainer-image">
                            <img src="/assets/image/pem_technology.png" alt="PEM Technology" />
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Alkaline Water */}
            <section className="section" style={{ background: 'var(--color-off-white)' }}>
                <div className="container">
                    <div className="science-page__explainer science-page__explainer--reverse">
                        <ScrollReveal direction="left" className="science-page__explainer-image">
                            <img src="/assets/image/lab_testing.jpg" alt="Lab Testing" />
                        </ScrollReveal>
                        <ScrollReveal direction="right" className="science-page__explainer-content">
                            <p className="section-label"><HiShieldCheck /> Alkaline Ionization</p>
                            <h2 className="section-title" style={{ textAlign: 'left' }}>{scienceData.alkalineWater.title}</h2>
                            <p className="science-page__explainer-desc">{scienceData.alkalineWater.description}</p>
                            <ul className="science-page__key-points">
                                {scienceData.alkalineWater.keyPoints.map((point, i) => (
                                    <li key={i}><span className="science-page__bullet">✓</span> {point}</li>
                                ))}
                            </ul>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* ORP Scale */}
            <section className="section">
                <div className="container">
                    <ScrollReveal>
                        <div className="section-header">
                            <p className="section-label">⚡ ORP Scale</p>
                            <h2 className="section-title">Oxidation-Reduction Potential</h2>
                            <p className="section-subtitle">
                                ORP measures water&#39;s ability to act as an antioxidant. Negative values indicate
                                stronger antioxidant potential.
                            </p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal>
                        <div className="science-page__orp-scale">
                            {scienceData.orpScale.map((item, i) => (
                                <div
                                    key={i}
                                    className={`science-page__orp-item science-page__orp-item--${item.type}`}
                                >
                                    <span className="science-page__orp-value">{item.value} mV</span>
                                    <div className="science-page__orp-bar" />
                                    <span className="science-page__orp-label">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="section" style={{ background: 'var(--color-off-white)' }}>
                <div className="container">
                    <ScrollReveal>
                        <div className="section-header">
                            <p className="section-label">📊 Comparison</p>
                            <h2 className="section-title">Water Type Comparison</h2>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal>
                        <div className="science-page__comparison-wrap">
                            <table className="science-page__comparison">
                                <thead>
                                    <tr>
                                        <th>Feature</th>
                                        <th>Regular Water</th>
                                        <th>Alkaline Water</th>
                                        <th className="science-page__comparison-best">Hydrogen Water</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scienceData.comparison.map(row => (
                                        <tr key={row.feature}>
                                            <td className="science-page__comparison-feature">{row.feature}</td>
                                            <td>{row.regular}</td>
                                            <td>{row.alkaline}</td>
                                            <td className="science-page__comparison-best">{row.hydrogen}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </main>
    );
}
