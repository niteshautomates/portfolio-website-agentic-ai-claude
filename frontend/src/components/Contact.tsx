import { Mail, Phone } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import { telHref } from '@/lib/utils'
import type { Profile } from '@/types'
import { Reveal } from './Reveal'
import { Section } from './Section'
import { ButtonLink } from './ui/button'

// Phase 1: links only. Phase 2 adds a form posting to /api/contact (decisions/003).
export function Contact({ links }: { links: Profile['links'] }) {
  const phone = links.phone?.trim()
  const phoneHref = phone ? telHref(phone) : ''
  return (
    <Section id="contact" eyebrow="contact" title="Let's talk">
      <Reveal>
        <div className="bg-gradient-brand rounded-3xl p-px">
          <div className="rounded-3xl bg-background px-6 py-12 text-center sm:px-12">
            <h3 className="text-2xl font-bold sm:text-3xl">
              Have a project, a role or a question? <span className="text-gradient">Say hello.</span>
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              The quickest way to reach me is email or LinkedIn. I'm always happy to talk DevOps, cloud and automation.
            </p>
            {phoneHref && <p className="mt-3 font-mono text-sm text-foreground">{phone}</p>}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {links.email && (
                <ButtonLink href={`mailto:${links.email}`}>
                  <Mail /> Email me
                </ButtonLink>
              )}
              {phoneHref && (
                <ButtonLink href={phoneHref} variant="outline">
                  <Phone /> Call
                </ButtonLink>
              )}
              {links.linkedin && (
                <ButtonLink href={links.linkedin} target="_blank" rel="noreferrer" variant="outline">
                  <FaLinkedin /> LinkedIn
                </ButtonLink>
              )}
              <ButtonLink href={links.github} target="_blank" rel="noreferrer" variant="outline">
                <FaGithub /> GitHub
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
