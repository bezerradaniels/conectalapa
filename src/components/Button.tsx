import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    children,
    className = '',
    ...props
}) => {
    const baseStyles = 'px-5 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]',
        secondary: 'bg-white border border-[var(--color-neutral-300)] text-[var(--color-neutral-900)] hover:bg-[var(--color-neutral-100)]',
        ghost: 'bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-neutral-100)]',
        danger: 'bg-[var(--color-danger)] text-white hover:bg-[#A4031F]'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
