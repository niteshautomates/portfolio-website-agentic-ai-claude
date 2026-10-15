export interface Project {
  name: string
  title: string
  summary: string
  tags: string[]
  language: string | null
  url: string
  homepage: string | null
  stars: number
  featured: boolean
  updatedAt: string
}

export interface ExperienceEntry {
  role: string
  company: string
  period: string
  summary: string
}

export interface Profile {
  name: string
  role: string
  company: string
  location: string
  tagline: string
  about: string[]
  skills: Record<string, string[]>
  links: { github: string; linkedin: string; email: string; phone?: string }
  terminal?: string[]
  yearsExperience?: number
  experience?: ExperienceEntry[]
}
