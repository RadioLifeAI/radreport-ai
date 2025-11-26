import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-1 p-2 border-b border-border bg-background',
          className
        )}
        {...props}
      />
    )
  }
)

Toolbar.displayName = 'Toolbar'
