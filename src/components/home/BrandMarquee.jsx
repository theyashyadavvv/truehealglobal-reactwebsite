import ScrollReveal from '../ScrollReveal';
import { brands } from '../../data/mockData';
import './BrandMarquee.css';

export default function BrandMarquee() {
    return (
        <section className="brand-marquee section">
            <div className="container">
                <ScrollReveal>
                    <div className="section-header">
                        <p className="section-label">Trusted Partners</p>
                        <h2 className="section-title">Brands We Work With</h2>
                    </div>
                </ScrollReveal>
            </div>
            <div className="brand-marquee__track">
                <div className="brand-marquee__content">
                    {[...brands, ...brands, ...brands].map((brand, i) => (
                        <div key={`brand-${i}`} className="brand-marquee__item">
                            <img src={brand.logo} alt={brand.name} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
