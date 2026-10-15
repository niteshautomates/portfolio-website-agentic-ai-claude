import { ExternalLink, Star } from 'lucide-react'
import type { MouseEvent } from 'react'
import { FaGithub } from 'react-icons/fa6'
import { languageColor } from '@/lib/language-colors'
import { cn, timeAgo } from '@/lib/utils'
import type { Project } from '@/types'
import { Badge } from './ui/badge'
import { Card } from './ui/card'

// Cursor-follow spotlight: updates CSS variables on the card, no React re-render per move.
function track(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export function ProjectCard({ project: p, spotlight = false }: { project: Project; spotlight?: boolean }) {
  const tags = p.tags.filter((t) => t.toLowerCase() !== p.language?.toLowerCase())
  return (
    <Card
      onMouseMove={track}
      className={cn(
        'group relative flex flex-col gap-3 overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50',
        spotlight && 'lg:col-span-2 lg:p-8',
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), var(--glow-1), transparent 70%)' }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          {spotlight && <Badge className="mb-3 border-primary/40 text-primary">★ Spotlight</Badge>}
          <h3 className={cn('font-semibold leading-snug', spotlight ? 'text-2xl' : 'text-lg')}>
            {/* stretched link makes the whole card clickable */}
            <a href={p.url} target="_blank" rel="noreferrer" className="after:absolute after:inset-0 after:z-0 after:content-['']">
              {p.title}
            </a>
          </h3>
        </div>
        <FaGithub className="mt-1 size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
      </div>

      <p className={cn('relative text-muted-foreground', spotlight ? 'max-w-2xl text-base' : 'text-sm')}>
        {p.summary || 'No description yet.'}
      </p>

      <div className="relative mt-auto flex flex-wrap items-center gap-2 pt-2">
        {p.language && (
          <Badge>
            <span className="size-2.5 rounded-full" style={{ background: languageColor(p.language) }} aria-hidden="true" />
            {p.language}
          </Badge>
        )}
        {tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>

      <div className="relative flex items-center gap-4 font-mono text-xs text-muted-foreground">
        {p.stars > 0 && (
          <span className="flex items-center gap-1">
            <Star className="size-3.5" aria-hidden="true" /> {p.stars}
          </span>
        )}
        <span>Updated {timeAgo(p.updatedAt)}</span>
        {p.homepage && (
          <a href={p.homepage} target="_blank" rel="noreferrer" className="relative z-10 ml-auto flex items-center gap-1 text-primary hover:underline">
            Live demo <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        )}
      </div>
    </Card>
  )
}
