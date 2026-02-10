
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import './CustomButton.css';

const buttonVariants = cva('custom-btn', {
    variants: {
        variant: {
            primary: 'custom-btn--primary',
            mono: 'custom-btn--mono',
            destructive: 'custom-btn--destructive',
            secondary: 'custom-btn--secondary',
            outline: 'custom-btn--outline',
            dashed: 'custom-btn--dashed',
            ghost: 'custom-btn--ghost',
            dim: 'custom-btn--dim',
            foreground: 'custom-btn--foreground',
            inverse: 'custom-btn--inverse',
        },
        size: {
            lg: 'custom-btn--lg',
            md: 'custom-btn--md',
            sm: 'custom-btn--sm',
            icon: 'custom-btn--icon',
        },
        shape: {
            default: '',
            circle: 'custom-btn--circle',
        },
        mode: {
            default: '',
            icon: '',
            link: 'custom-btn--link',
        },
        underlined: {
            solid: 'custom-btn--underline-solid',
            dashed: 'custom-btn--underline-dashed',
        }
    },
    defaultVariants: {
        variant: 'primary',
        size: 'md',
        mode: 'default',
    },
});

const CustomButton = React.forwardRef(({
    className,
    variant,
    size,
    shape,
    mode,
    underlined,
    asChild = false,
    ...props
}, ref) => {
    const Comp = asChild ? 'span' : 'button';
    return (
        <Comp
            className={cn(buttonVariants({ variant, size, shape, mode, underlined }), className)}
            ref={ref}
            {...props}
        />
    );
});
CustomButton.displayName = "CustomButton";

export default CustomButton;
