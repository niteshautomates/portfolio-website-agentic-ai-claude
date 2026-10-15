import { Search } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'
import { ProjectCard } from './ProjectCard'
import { Section } from './Section'
import { Input } from './ui/input'

const FEATURED = 'Featured'
const ALL = 'All'

export function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState(FEATURED)
  const [query, setQuery] = useState('')
  const reduce = useReducedMotion()

  const languages = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of projects) if (p.language) counts.set(p.language, (counts.get(p.language) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([l]) => l)
  }, [projects])

  const q = query.trim().toLowerCase()
  const visible = projects.filter((p) => {
    const inFilter = filter === ALL ? true : filter === FEATURED ? p.featured : p.language === filter
    const inQuery = !q || [p.title, p.summary, p.language ?? '', ...p.tags].join(' ').toLowerCase().includes(q)
    return inFilter && inQuery
  })
  const spotlightFirst = filter === FEATURED && !q

  return (
    <Section id="projects" eyebrow="projects" title="Things I've built" description="Pulled from my GitHub, curated for what matters. Click a card to open the repo.">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
          {[FEATURED, ALL, ...languages].map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                'cursor-pointer rounded-full border border-border px-3.5 py-1.5 font-mono text-xs transition-colors',
                filter === f ? 'bg-gradient-brand border-transparent text-primary-foreground' : 'glass text-muted-foreground hover:text-foreground',
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input type="search" placeholder="Search projects" aria-label="Search projects" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <motion.div
            key={`${filter}-${p.name}`}
            className={cn('flex', spotlightFirst && i === 0 && 'lg:col-span-2')}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: reduce ? 0 : Math.min(i, 8) * 0.04 }}
          >
            <ProjectCard project={p} spotlight={spotlightFirst && i === 0} />
          </motion.div>
        ))}
      </div>
      {visible.length === 0 && <p className="py-12 text-center text-muted-foreground">No projects match. Try a different filter or search.</p>}
      <p className="mt-6 text-center font-mono text-xs text-muted-foreground" aria-live="polite">
        Showing {visible.length} of {projects.length}
      </p>
    </Section>
  )
}
