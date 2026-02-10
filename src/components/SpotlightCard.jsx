import { useEffect, useRef } from 'react';
import './SpotlightCard.css';

/**
 * SpotlightCard  — adapted from 21st.dev's spotlight-card.
 * Wraps children in a card with a cursor-following radial glow.
 *
 * Props:
 *  - glowColor: 'teal' | 'purple' | 'green' | 'blue' | 'orange'  (default 'teal')
 *  - className: extra class names
 *  - as: element tag (default 'div')
 *  - ...rest passed through
 */

const colorMap = {
    teal: { base: 180, spread: 120 },
    blue: { base: 220, spread: 200 },
    purple: { base: 280, spread: 300 },
    green: { base: 120, spread: 200 },
    orange: { base: 30, spread: 200 },
};

export default function SpotlightCard({
    children,
    glowColor = 'teal',
    className = '',
    as: Tag = 'div',
    ...rest
}) {
    const cardRef = useRef(null);

    useEffect(() => {
        const sync = (e) => {
            const el = cardRef.current;
            if (!el) return;
            el.style.setProperty('--x', e.clientX.toFixed(2));
            el.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
            el.style.setProperty('--y', e.clientY.toFixed(2));
            el.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2));
        };
        document.addEventListener('pointermove', sync);
        return () => document.removeEventListener('pointermove', sync);
    }, []);

    const { base, spread } = colorMap[glowColor] ?? colorMap.teal;

    return (
        <Tag
            ref={cardRef}
            className={`spotlight-card ${className}`}
            data-glow
            style={{
                '--sc-base': base,
                '--sc-spread': spread,
            }}
            {...rest}
        >
            {/* outer glow layer */}
            <div className="spotlight-card__glow" data-glow />
            {children}
        </Tag>
    );
}
