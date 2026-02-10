import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

export default function AnimatedCounter({
    target,
    duration = 2000,
    suffix = '',
    prefix = '',
    className = ''
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        const num = parseFloat(target.toString().replace(/[^0-9.]/g, ''));
        if (isNaN(num)) {
            setCount(target);
            return;
        }

        const startTime = performance.now();
        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * num);

            setCount(current);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                setCount(num);
            }
        };
        requestAnimationFrame(step);
    }, [isInView, target, duration]);

    const formatted = typeof target === 'string' && target.includes(',')
        ? count.toLocaleString()
        : count;

    return (
        <span ref={ref} className={className}>
            {prefix}{formatted}{suffix}
        </span>
    );
}
