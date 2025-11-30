import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'tiptap-toolbar sticky top-0 z-40 flex items-center gap-1 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2',
          className
        )}
        {...props}
      />
    )
  }
)

Toolbar.displayName = 'Toolbar'

export const ToolbarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-1', className)}
        {...props}
      />
    )
  }
)

ToolbarGroup.displayName = 'ToolbarGroup'

export const ToolbarSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('h-6 w-px bg-border', className)}
        {...props}
      />
    )
  }
)

ToolbarSeparator.displayName = 'ToolbarSeparator'
