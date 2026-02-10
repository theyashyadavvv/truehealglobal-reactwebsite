import { forwardRef } from 'react';
import './GradientButton.css';

/**
 * GradientButton — animated radial gradient with CSS @property transitions.
 * Props:
 *  - variant: 'default' | 'accent'
 *  - size: 'sm' | 'default' | 'lg'
 *  - block: boolean — full width
 */
const GradientButton = forwardRef(function GradientButton(
    { variant = 'default', size = 'default', block = false, className = '', children, ...props },
    ref
) {
    const classes = [
        'gradient-btn',
        variant === 'accent' ? 'gradient-btn--accent' : '',
        size === 'sm' ? 'gradient-btn--sm' : '',
        size === 'lg' ? 'gradient-btn--lg' : '',
        block ? 'gradient-btn--block' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button ref={ref} className={classes} {...props}>
            {children}
        </button>
    );
});

export default GradientButton;
