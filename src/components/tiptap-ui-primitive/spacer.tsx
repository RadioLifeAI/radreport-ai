import * as React from 'react'

export const Spacer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    return (
      <div
        ref={ref}
        style={{ flex: 1 }}
        {...props}
      />
    )
  }
)

Spacer.displayName = 'Spacer'
