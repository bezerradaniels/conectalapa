import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from 'react'
import { cn } from '@/lib/cn'

interface TabsContextValue {
  value: string
  onChange: (val: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

export interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: ReactNode
  className?: string
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '')
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : uncontrolledValue

  const handleChange = (val: string) => {
    if (!isControlled) {
      setUncontrolledValue(val)
    }
    onValueChange?.(val)
  }

  return (
    <TabsContext.Provider value={{ value: currentValue, onChange: handleChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps {
  children: ReactNode
  className?: string
  'aria-label'?: string
}

export function TabsList({
  children,
  className,
  'aria-label': ariaLabel,
}: TabsListProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center gap-1 border-b border-border-hairline p-1 w-full',
        className
      )}
    >
      {children}
    </div>
  )
}

export interface TabTriggerProps {
  value: string
  children: ReactNode
  disabled?: boolean
  className?: string
}

export function TabTrigger({
  value,
  children,
  disabled = false,
  className,
}: TabTriggerProps) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabTrigger must be used inside Tabs')

  const isActive = ctx.value === value

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const tablist = e.currentTarget.closest('[role="tablist"]')
    if (!tablist) return
    const tabs = Array.from(
      tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
    )
    const currentIndex = tabs.indexOf(e.currentTarget)
    if (currentIndex === -1) return

    let nextIndex: number
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    } else if (e.key === 'Home') {
      nextIndex = 0
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1
    } else {
      return
    }

    e.preventDefault()
    tabs[nextIndex]?.focus()
    tabs[nextIndex]?.click()
  }

  return (
    <button
      type="button"
      role="tab"
      id={`tab-${value}`}
      aria-controls={`panel-${value}`}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => ctx.onChange(value)}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative px-4 py-2 text-sm font-medium transition-colors cursor-pointer select-none rounded-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isActive
          ? 'text-accent-text font-semibold bg-accent-subtle/50 after:absolute after:bottom-[-5px] after:left-0 after:right-0 after:h-0.5 after:bg-accent'
          : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle',
        className
      )}
    >
      {children}
    </button>
  )
}

export interface TabPanelProps {
  value: string
  children: ReactNode
  className?: string
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabPanel must be used inside Tabs')

  if (ctx.value !== value) return null

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      className={cn('py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg', className)}
    >
      {children}
    </div>
  )
}
