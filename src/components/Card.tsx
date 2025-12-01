import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    return (
        <div
            className={`
        bg-white rounded-xl border border-[var(--color-neutral-200)] 
        p-6 transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-md hover:border-[var(--color-neutral-300)]' : ''}
        ${className}
      `}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
