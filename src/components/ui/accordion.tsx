import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/cn'
import { ChevronDown } from 'lucide-react'

interface AccordionContextValue {
  openItems: string[]
  toggleItem: (value: string) => void
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

export interface AccordionProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  children: ReactNode
  className?: string
}

export function Accordion({
  type = 'single',
  defaultValue,
  children,
  className,
}: AccordionProps) {
  const initialOpen = Array.isArray(defaultValue)
    ? defaultValue
    : defaultValue
      ? [defaultValue]
      : []

  const [openItems, setOpenItems] = useState<string[]>(initialOpen)

  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      const isOpen = prev.includes(value)
      if (type === 'single') {
        return isOpen ? [] : [value]
      }
      return isOpen ? prev.filter((item) => item !== value) : [...prev, value]
    })
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn('divide-y divide-border-hairline border-y border-border-hairline', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemContextValue {
  value: string
  isOpen: boolean
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null)

export interface AccordionItemProps {
  value: string
  children: ReactNode
  className?: string
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error('AccordionItem must be used inside Accordion')

  const isOpen = ctx.openItems.includes(value)

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div className={cn('w-full', className)}>{children}</div>
    </AccordionItemContext.Provider>
  )
}

export interface AccordionTriggerProps {
  children: ReactNode
  className?: string
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const rootCtx = useContext(AccordionContext)
  const itemCtx = useContext(AccordionItemContext)
  if (!rootCtx || !itemCtx) throw new Error('AccordionTrigger must be used inside AccordionItem')

  const { value, isOpen } = itemCtx

  return (
    <button
      type="button"
      id={`accordion-trigger-${value}`}
      aria-controls={`accordion-content-${value}`}
      aria-expanded={isOpen}
      onClick={() => rootCtx.toggleItem(value)}
      className={cn(
        'flex w-full items-center justify-between py-4 text-left font-medium text-text-primary transition-all cursor-pointer select-none',
        'hover:text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm',
        className
      )}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          'w-4 h-4 shrink-0 text-text-muted transition-transform duration-200',
          isOpen && 'rotate-180 text-text-primary'
        )}
        aria-hidden="true"
      />
    </button>
  )
}

export interface AccordionContentProps {
  children: ReactNode
  className?: string
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  const itemCtx = useContext(AccordionItemContext)
  if (!itemCtx) throw new Error('AccordionContent must be used inside AccordionItem')

  const { value, isOpen } = itemCtx

  if (!isOpen) return null

  return (
    <div
      id={`accordion-content-${value}`}
      role="region"
      aria-labelledby={`accordion-trigger-${value}`}
      className={cn('pb-4 pt-0 text-sm text-text-secondary animate-fade-in', className)}
    >
      {children}
    </div>
  )
}
