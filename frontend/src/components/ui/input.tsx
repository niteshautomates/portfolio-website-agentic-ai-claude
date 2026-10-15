import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'glass h-10 w-full rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary',
        className,
      )}
      {...props}
    />
  )
}
