import { ArrowRight, Mail, MapPin } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import type { Profile } from '@/types'
import { initials } from '@/lib/utils'
import { Reveal } from './Reveal'
import { Terminal } from './Terminal'
import { Badge } from './ui/badge'
import { ButtonLink } from './ui/button'

export function Hero({ profile }: { profile: Profile }) {
  const { links } = profile
  return (
    <section id="top" className="pb-16 pt-16 sm:pt-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <div className="mb-6 flex items-center gap-4">
            <div className="bg-gradient-brand rounded-full p-0.5">
              <div className="grid size-16 place-items-center rounded-full bg-background font-mono text-xl font-bold">
                <span className="text-gradient">{initials(profile.name)}</span>
              </div>
            </div>
            <Badge>
              {profile.role} · {profile.company}
            </Badge>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Hi, I'm <span className="text-gradient">{profile.name}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground sm:text-xl">{profile.tagline}</p>
          <p className="mt-3 flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
            <MapPin className="size-4" /> {profile.location}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="#projects">
              View projects <ArrowRight />
            </ButtonLink>
            <ButtonLink href="#contact" variant="outline">
              Get in touch
            </ButtonLink>
            <div className="ml-1 flex items-center gap-1">
              <ButtonLink href={links.github} target="_blank" rel="noreferrer" variant="ghost" size="icon" aria-label="GitHub">
                <FaGithub />
              </ButtonLink>
              {links.linkedin && (
                <ButtonLink href={links.linkedin} target="_blank" rel="noreferrer" variant="ghost" size="icon" aria-label="LinkedIn">
                  <FaLinkedin />
                </ButtonLink>
              )}
              {links.email && (
                <ButtonLink href={`mailto:${links.email}`} variant="ghost" size="icon" aria-label="Email">
                  <Mail />
                </ButtonLink>
              )}
            </div>
          </div>
        </Reveal>

        {profile.terminal && profile.terminal.length > 0 && (
          <Reveal delay={0.15}>
            <Terminal lines={profile.terminal} />
          </Reveal>
        )}
      </div>
    </section>
  )
}
