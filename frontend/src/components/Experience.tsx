import type { ExperienceEntry } from '@/types'
import { Reveal } from './Reveal'
import { Section } from './Section'

export function Experience({ entries }: { entries: ExperienceEntry[] }) {
  if (entries.length === 0) return null
  return (
    <Section id="experience" eyebrow="experience" title="Where I've worked">
      <ol className="relative ml-3 border-l border-border">
        {entries.map((e, i) => (
          <li key={`${e.company}-${e.role}-${i}`} className="mb-10 ml-8 last:mb-0">
            <Reveal delay={i * 0.05}>
              <span className="bg-gradient-brand absolute -left-[7px] mt-2 size-3.5 rounded-full ring-4 ring-background" aria-hidden="true" />
              <div className="glass rounded-2xl p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold">{e.role}</h3>
                  <span className="font-mono text-xs text-primary">{e.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{e.company}</p>
                <p className="mt-3 text-sm text-muted-foreground">{e.summary}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
