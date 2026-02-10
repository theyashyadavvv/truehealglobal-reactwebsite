import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ScrollReveal({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.6,
    distance = 40,
    once = true,
    className = '',
    scale: scaleFrom,
    blur = false,
    rotate: rotateFrom,
    stagger = 0,
    style = {}
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: "-80px" });

    const directions = {
        up: { y: distance, x: 0 },
        down: { y: -distance, x: 0 },
        left: { y: 0, x: distance },
        right: { y: 0, x: -distance },
        none: { y: 0, x: 0 }
    };

    const dir = directions[direction] || directions.up;

    const initial = {
        opacity: 0,
        x: dir.x,
        y: dir.y,
        ...(scaleFrom !== undefined && { scale: scaleFrom }),
        ...(rotateFrom !== undefined && { rotate: rotateFrom }),
        ...(blur && { filter: 'blur(10px)' }),
    };

    const animate = {
        opacity: 1,
        x: 0,
        y: 0,
        ...(scaleFrom !== undefined && { scale: 1 }),
        ...(rotateFrom !== undefined && { rotate: 0 }),
        ...(blur && { filter: 'blur(0px)' }),
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            style={style}
            initial={initial}
            animate={isInView ? animate : initial}
            transition={{
                duration,
                delay: delay + stagger,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
        >
            {children}
        </motion.div>
    );
}
