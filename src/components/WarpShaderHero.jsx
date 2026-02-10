import { Warp } from "@paper-design/shaders-react";
import React from "react";
import './WarpShaderHero.css';
import { HiBeaker } from "react-icons/hi";

export default function WarpShaderHero({
    title = "Understanding Water Technology",
    subtitle = "Explore the science behind hydrogen and alkaline water — backed by 1,000+ peer-reviewed studies.",
    label = "The Science",
    onPrimaryClick,
    onSecondaryClick,
    primaryBtnText = "Get Started",
    secondaryBtnText = "View Research"
}) {
    return (
        <section className="warp-hero">
            <div className="warp-hero__bg">
                <Warp
                    style={{ height: "100%", width: "100%" }}
                    proportion={0.45}
                    softness={1}
                    distortion={0.25}
                    swirl={0.8}
                    swirlIterations={10}
                    shape="checks"
                    shapeScale={0.1}
                    scale={1}
                    rotation={0}
                    speed={1}
                    fillColor="transparent"
                    colors={["hsl(200, 100%, 20%)", "hsl(160, 100%, 75%)", "hsl(180, 90%, 30%)", "hsl(170, 100%, 80%)"]}
                />
            </div>

            <div className="container warp-hero__content">
                <div className="warp-hero__text-wrap">
                    <div className="warp-hero__label">
                        <HiBeaker /> {label}
                    </div>
                    <h1 className="warp-hero__title">
                        {title}
                    </h1>

                    <p className="warp-hero__subtitle">
                        {subtitle}
                    </p>

                    <div className="warp-hero__actions">
                        <button className="warp-hero__btn warp-hero__btn--primary" onClick={onPrimaryClick}>
                            {primaryBtnText}
                        </button>
                        <button className="warp-hero__btn warp-hero__btn--secondary" onClick={onSecondaryClick}>
                            {secondaryBtnText}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
