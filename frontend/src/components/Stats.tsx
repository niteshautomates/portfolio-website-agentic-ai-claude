import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { Project } from '@/types'
import { Reveal } from './Reveal'

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, to, { duration: 1.4, ease: 'easeOut', onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [inView, reduce, to])

  return (
    <span ref={ref}>
      {reduce ? to : value}
      {suffix}
    </span>
  )
}

// Numbers come from repos.json / profile.yaml only (decisions/011).
export function Stats({ projects, yearsExperience }: { projects: Project[]; yearsExperience?: number }) {
  const languages = new Set(projects.map((p) => p.language).filter(Boolean)).size
  const stats = [
    { label: 'Public projects', value: projects.length, suffix: '' },
    { label: 'Featured', value: projects.filter((p) => p.featured).length, suffix: '' },
    { label: 'Languages', value: languages, suffix: '' },
    ...(yearsExperience ? [{ label: 'Years experience', value: yearsExperience, suffix: '+' }] : []),
  ]

  return (
    <div className="mx-auto w-full max-w-6xl px-5">
      <Reveal className="glass grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
        {stats.map((s) => (
          <div key={s.label} className="bg-background/80 px-6 py-6 text-center [&:last-child:nth-child(odd)]:col-span-2 sm:[&:last-child:nth-child(odd)]:col-span-1">
            <div className="text-gradient text-3xl font-extrabold sm:text-4xl">
              <CountUp to={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-1 font-mono text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </Reveal>
    </div>
  )
}
