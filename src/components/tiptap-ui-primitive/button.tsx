import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'data-style'?: 'ghost' | 'default' | 'text'
  'data-active'?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, 'data-style': dataStyle, 'data-active': dataActive, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'tiptap-button inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          dataStyle === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
          dataStyle === 'text' && 'hover:bg-transparent hover:underline',
          dataActive && 'bg-accent text-accent-foreground',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
