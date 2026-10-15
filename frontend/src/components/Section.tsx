import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-5">
        <Reveal className="mb-10 max-w-2xl">
          <p className="font-mono text-sm text-primary">// {eyebrow}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          {description && <p className="mt-3 text-muted-foreground">{description}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}
