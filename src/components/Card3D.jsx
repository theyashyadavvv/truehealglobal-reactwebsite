import { useRef, useState, useCallback } from 'react';
import './Card3D.css';

export default function Card3D({ children, className = '', glowColor = 'rgba(57, 166, 186, 0.15)' }) {
    const containerRef = useRef(null);
    const [style, setStyle] = useState({});

    const handleMouseMove = useCallback((e) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 20;
        const y = (e.clientY - top - height / 2) / 20;
        setStyle({
            transform: `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) scale3d(1.04, 1.04, 1.04)`,
            boxShadow: `${-x * 2}px ${y * 2}px 24px ${glowColor}`,
        });
    }, [glowColor]);

    const handleMouseLeave = useCallback(() => {
        setStyle({
            transform: 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)',
            boxShadow: 'none',
        });
    }, []);

    return (
        <div
            ref={containerRef}
            className={`card-3d ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={style}
        >
            {children}
        </div>
    );
}
