import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxImage({
    src,
    alt = '',
    speed = 0.3,
    className = '',
    style = {},
    overlay = true,
    overlayColor = 'rgba(0,0,0,0.4)'
}) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}%`, `${speed * 100}%`]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                overflow: 'hidden',
                position: 'relative',
                ...style
            }}
        >
            <motion.img
                src={src}
                alt={alt}
                style={{
                    y,
                    scale,
                    width: '100%',
                    height: '120%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: '-10%',
                    left: 0,
                }}
            />
            {overlay && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: overlayColor,
                    zIndex: 1
                }} />
            )}
        </div>
    );
}
