
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { X } from 'lucide-react';
import CustomButton from './CustomButton'; // We will create this next
import './Alert.css';

const alertVariants = cva('alert', {
    variants: {
        variant: {
            secondary: 'alert--secondary',
            primary: 'alert--primary',
            destructive: 'alert--destructive',
            success: 'alert--success',
            info: 'alert--info',
            mono: 'alert--mono',
            warning: 'alert--warning',
        },
        appearance: {
            solid: 'alert--solid',
            outline: 'alert--outline',
            light: 'alert--light',
        },
        size: {
            lg: 'alert--lg',
            md: 'alert--md',
            sm: 'alert--sm',
        },
    },
    defaultVariants: {
        variant: 'secondary',
        appearance: 'solid',
        size: 'md',
    },
});

function Alert({ className, variant, size, icon, appearance, close = false, onClose, children, ...props }) {
    return (
        <div
            data-slot="alert"
            role="alert"
            className={cn(alertVariants({ variant, size, appearance }), className)}
            {...props}
        >
            {children}
            {close && (
                <CustomButton
                    size="sm"
                    variant="inverse" // We will map this in CustomButton
                    className="alert-close-btn"
                    onClick={onClose}
                    aria-label="Dismiss"
                >
                    <X className="alert-close-icon" />
                </CustomButton>
            )}
        </div>
    );
}

function AlertTitle({ className, ...props }) {
    return <div data-slot="alert-title" className={cn('alert-title', className)} {...props} />;
}

function AlertIcon({ children, className, ...props }) {
    return (
        <div data-slot="alert-icon" className={cn('alert-icon', className)} {...props}>
            {children}
        </div>
    );
}

function AlertToolbar({ children, className, ...props }) {
    return (
        <div data-slot="alert-toolbar" className={cn('alert-toolbar', className)} {...props}>
            {children}
        </div>
    );
}

function AlertDescription({ className, ...props }) {
    return (
        <div
            data-slot="alert-description"
            className={cn('alert-description', className)}
            {...props}
        />
    );
}

function AlertContent({ className, ...props }) {
    return (
        <div
            data-slot="alert-content"
            className={cn('alert-content', className)}
            {...props}
        />
    );
}

export { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle, AlertToolbar };
