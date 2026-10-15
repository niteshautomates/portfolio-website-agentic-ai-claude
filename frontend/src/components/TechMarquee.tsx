import { techIcon } from '@/lib/tech-icons'

// CSS-only infinite scroll. The list is rendered twice and the animation moves by -50%.
export function TechMarquee({ skills }: { skills: Record<string, string[]> }) {
  const items = [...new Set(Object.values(skills).flat())].filter((n) => techIcon(n))
  if (items.length === 0) return null

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {items.map((name) => {
        const Icon = techIcon(name)!
        return (
          <li key={name} className="flex items-center gap-2.5 text-muted-foreground">
            <Icon className="size-7" aria-hidden="true" />
            <span className="font-mono text-sm">{name}</span>
          </li>
        )
      })}
    </ul>
  )

  return (
    <div
      className="relative mt-16 overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
      role="group"
      aria-label="Technologies I work with"
    >
      <div className="animate-marquee flex w-max hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
