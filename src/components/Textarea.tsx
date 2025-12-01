import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-[13px] font-medium text-[var(--color-neutral-700)]">
                    {label}
                </label>
            )}
            <textarea
                className={`
          min-h-32 px-4 py-3 rounded-lg border border-[var(--color-neutral-300)]
          bg-white text-[var(--color-neutral-700)]
          focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]
          transition-all duration-200 resize-vertical
          ${error ? 'border-[var(--color-danger)]' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <span className="text-xs text-[var(--color-danger)]">{error}</span>
            )}
        </div>
    );
};
