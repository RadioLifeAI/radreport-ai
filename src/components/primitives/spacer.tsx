import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex-1', className)}
        {...props}
      />
    )
  }
)

Spacer.displayName = 'Spacer'
