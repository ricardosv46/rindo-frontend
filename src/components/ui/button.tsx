import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white shadow hover:bg-primary-600/90',
        destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-600/90',
        outline: 'border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary-600 text-white shadow-sm hover:bg-secondary-600/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary-600 underline-offset-4 hover:underline'
      },
      color: {
        primary: 'bg-primary-600 text-white hover:bg-primary-600/90 border-primary-600',
        green: 'bg-green-600 text-white hover:bg-green-600/90 border-green-600',
        blue: 'bg-blue-600 text-white hover:bg-blue-600/90 border-blue-600',
        yellow: 'bg-yellow-600 text-white hover:bg-yellow-600/90 border-yellow-600',
        red: 'bg-red-600 text-white hover:bg-red-600/90 border-red-600',
        purple: 'bg-purple-600 text-white hover:bg-purple-600/90 border-purple-600',
        gray: 'bg-gray-600 text-white hover:bg-gray-600/90 border-gray-600',
        orange: 'bg-orange-600 text-white hover:bg-orange-600/90 border-orange-600'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  color?: 'primary' | 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'gray' | 'orange'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, color = 'primary', size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    // Definir clases personalizadas para outline basadas en el color
    let customClasses = ''

    if (variant === 'outline' && color) {
      // Estilos específicos para outline con color
      switch (color) {
        case 'primary':
          customClasses = 'text-primary-600 border-primary-600 hover:bg-primary-600/10 hover:text-primary-600'
          break
        case 'green':
          customClasses = 'text-green-600 border-green-600 hover:bg-green-600/10 hover:text-green-600'
          break
        case 'blue':
          customClasses = 'text-blue-600 border-blue-600 hover:bg-blue-600/10 hover:text-blue-600'
          break
        case 'yellow':
          customClasses = 'text-yellow-600 border-yellow-600 hover:bg-yellow-600/10 hover:text-yellow-600'
          break
        case 'red':
          customClasses = 'text-red-600 border-red-600 hover:bg-red-600/10 hover:text-red-600'
          break
        case 'purple':
          customClasses = 'text-purple-600 border-purple-600 hover:bg-purple-600/10 hover:text-purple-600'
          break
        case 'gray':
          customClasses = 'text-gray-600 border-gray-600 hover:bg-gray-600/10 hover:text-gray-600'
          break
        case 'orange':
          customClasses = 'text-orange-600 border-orange-600 hover:bg-orange-600/10 hover:text-orange-600'
          break
      }
    }

    // Determinar si aplicamos el color o no
    const shouldApplyColor = variant !== 'outline' && !(size === 'icon' && variant !== 'default')

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, color: shouldApplyColor ? color : undefined }), customClasses, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
