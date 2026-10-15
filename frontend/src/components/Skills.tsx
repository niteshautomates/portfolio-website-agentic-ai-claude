import { Boxes, Cloud, Code2, GitBranch, Sparkles, type LucideIcon } from 'lucide-react'
import { techIcon } from '@/lib/tech-icons'
import { Reveal } from './Reveal'
import { Section } from './Section'
import { Badge } from './ui/badge'
import { Card } from './ui/card'

const GROUP_ICONS: [RegExp, LucideIcon][] = [
  [/cloud|iac/i, Cloud],
  [/container|orchestr/i, Boxes],
  [/ci\/?cd|pipeline/i, GitBranch],
  [/language/i, Code2],
  [/observ|ai/i, Sparkles],
]

function groupIcon(name: string): LucideIcon {
  return GROUP_ICONS.find(([re]) => re.test(name))?.[1] ?? Code2
}

export function Skills({ skills }: { skills: Record<string, string[]> }) {
  return (
    <Section id="skills" eyebrow="skills" title="Tools of the trade">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(skills).map(([group, items], i) => {
          const Icon = groupIcon(group)
          return (
            <Reveal key={group} delay={i * 0.05} className="flex">
              <Card className="w-full p-6 transition-colors hover:border-primary/40">
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-muted text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-semibold">{group}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((s) => {
                    const TechIcon = techIcon(s)
                    return (
                      <Badge key={s} className="text-foreground">
                        {TechIcon && <TechIcon className="size-3.5" aria-hidden="true" />}
                        {s}
                      </Badge>
                    )
                  })}
                </div>
              </Card>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
