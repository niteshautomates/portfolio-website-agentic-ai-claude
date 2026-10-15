// Data seam (decisions/001, 003). Components call only these functions.
// Phase 1 reads build-time JSON; Phase 2 swaps the bodies for fetch('/api/...').
import repos from '../data/repos.json'
import profile from '../data/profile.json'
import type { Profile, Project } from '../types'

export async function getProjects(): Promise<Project[]> {
  return repos as Project[]
}

export async function getProfile(): Promise<Profile> {
  return profile as Profile
}
