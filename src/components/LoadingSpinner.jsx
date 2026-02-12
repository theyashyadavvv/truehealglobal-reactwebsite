import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'default', color = 'primary' }) {
    const sizeClass = size === 'sm' ? 'loading-spinner--sm' : size === 'lg' ? 'loading-spinner--lg' : '';
    const colorClass = color === 'white' ? 'loading-spinner--white' : '';

    return (
        <div className={`loading-spinner ${sizeClass} ${colorClass}`}>
            <div className="loading-spinner__circle"></div>
        </div>
    );
}
