'use client'

import * as React from 'react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', ...props }, ref) => (
    <button
      ref={ref}
      className={
        // sensible defaults + allow extra classes from props
        `inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium
         transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/60
         ${className}`
      }
      {...props}
    />
  )
)
Button.displayName = 'Button'
