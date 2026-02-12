import { Link } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';
import { useBrands } from '../../hooks/useDataHooks';
import './BrandMarquee.css';

export default function BrandMarquee() {
    const { data: brands, loading } = useBrands();
    const brandList = brands || [];

    if (loading || brandList.length === 0) return null;

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
                    {[...brandList, ...brandList, ...brandList].map((brand, i) => (
                        <Link key={`brand-${i}`} to={`/brands/${brand.id}`} className="brand-marquee__item">
                            <img
                                src={brand.image_full_url || `https://admin.truehealglobal.com/storage/app/public/brand/${brand.image}`}
                                alt={brand.name}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
