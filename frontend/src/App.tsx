import { useEffect, useState } from 'react'
import { getProfile, getProjects } from '@/api/projects'
import type { Profile, Project } from '@/types'
import { Background } from '@/components/Background'
import { Contact } from '@/components/Contact'
import { Experience } from '@/components/Experience'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Projects } from '@/components/Projects'
import { Skills } from '@/components/Skills'
import { Stats } from '@/components/Stats'
import { TechMarquee } from '@/components/TechMarquee'

const YEAR = new Date().getFullYear()

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    getProfile().then(setProfile)
    getProjects().then(setProjects)
  }, [])

  if (!profile) return null

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Background />
      <Header name={profile.name} />
      <main id="main">
        <Hero profile={profile} />
        <Stats projects={projects} yearsExperience={profile.yearsExperience} />
        <TechMarquee skills={profile.skills} />
        <Projects projects={projects} />
        <Experience entries={profile.experience ?? []} />
        <Skills skills={profile.skills} />
        <Contact links={profile.links} />
      </main>
      <footer className="border-t border-border py-8 text-center font-mono text-xs text-muted-foreground">
        © {YEAR} {profile.name} · Built with React, Tailwind and Motion · Served by nginx in Docker
      </footer>
    </>
  )
}
