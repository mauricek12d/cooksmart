'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          // variants
          variant === 'default' && 'bg-purple-600 text-white hover:bg-purple-700',
          variant === 'outline' && 'border border-gray-700 bg-transparent hover:bg-gray-800 text-white',
          variant === 'ghost' && 'hover:bg-gray-800 text-white',
          // sizes
          size === 'sm' && 'px-3 py-2 text-sm',
          size === 'md' && 'px-4 py-2',
          size === 'lg' && 'px-6 py-3 text-lg',
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
