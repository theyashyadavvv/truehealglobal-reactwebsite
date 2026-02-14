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
                <video
                    src="/Blue%20Cream%20Collage%20Water%20Pollution%20Action%20Video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    draggable={false}
                />
            </ContainerScroll>
        </section>
    );
}
