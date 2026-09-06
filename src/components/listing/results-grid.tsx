import type { ReactNode } from 'react'

export interface ResultsGridProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function ResultsGrid({ children, columns = 3, className = '' }: ResultsGridProps) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns]

  return (
    <div
      role="region"
      aria-label="Grade de resultados"
      className={`grid ${columnClasses} gap-4 sm:gap-5 ${className}`}
    >
      {children}
    </div>
  )
}
