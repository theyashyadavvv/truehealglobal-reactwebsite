import { ContainerScroll } from '../ContainerScroll';
import './HeroScroll.css';

export default function HeroScroll() {
    return (
        <section className="hero-scroll">
            <ContainerScroll
                titleComponent={
                    <div className="hero-scroll__title-wrap">
                        <p className="hero-scroll__label">Experience the Difference</p>
                        <h2 className="hero-scroll__title">
                            Premium Hydrogen &<br />
                            <span className="hero-scroll__title-gradient">Water Purification</span>
                        </h2>
                        <p className="hero-scroll__subtitle">
                            Advanced ionization technology that transforms ordinary water
                            into a powerful source of molecular hydrogen for your health.
                        </p>
                    </div>
                }
            >
                <img
                    src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1400&h=720&fit=crop&q=80"
                    alt="Premium hydrogen water purification system showcase"
                    draggable={false}
                />
            </ContainerScroll>
        </section>
    );
}
