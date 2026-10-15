import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-brand text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-primary/40',
        outline: 'glass text-foreground hover:-translate-y-0.5 hover:border-primary/60',
        ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
      },
      size: {
        default: 'h-10 px-5',
        sm: 'h-8 px-3 text-xs',
        icon: 'size-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

type Props = VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, ...props }: ComponentProps<'button'> & Props) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

// Same look for <a>, so links styled as buttons stay real links.
export function ButtonLink({ className, variant, size, ...props }: ComponentProps<'a'> & Props) {
  return <a className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
