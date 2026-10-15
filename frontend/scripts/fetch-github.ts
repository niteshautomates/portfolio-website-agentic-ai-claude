// Build-time data step (decisions/002). Merges GitHub repo metadata with content/*.yaml
// and writes src/data/repos.json + src/data/profile.json. Both outputs are committed so
// `docker build` never needs network access to GitHub.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

interface FeaturedEntry {
  repo: string
  title?: string
  summary?: string
  tags?: string[]
}

interface ProjectsConfig {
  owner: string
  featured: FeaturedEntry[]
  hidden: string[]
}

interface GitHubRepo {
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  topics?: string[]
  fork: boolean
  archived: boolean
  pushed_at: string
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const outDir = resolve(root, 'frontend/src/data')
const reposOut = resolve(outDir, 'repos.json')

async function fetchRepos(owner: string): Promise<GitHubRepo[]> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const repos: GitHubRepo[] = []
  for (let page = 1; ; page++) {
    const res = await fetch(
      `https://api.github.com/users/${owner}/repos?per_page=100&type=owner&page=${page}`,
      { headers },
    )
    if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText}`)
    const batch = (await res.json()) as GitHubRepo[]
    repos.push(...batch)
    if (batch.length < 100) return repos
  }
}

async function main() {
  const config = parse(await readFile(resolve(root, 'content/projects.yaml'), 'utf8')) as ProjectsConfig
  const profile = parse(await readFile(resolve(root, 'content/profile.yaml'), 'utf8'))
  await mkdir(outDir, { recursive: true })
  await writeFile(resolve(outDir, 'profile.json'), JSON.stringify(profile, null, 2) + '\n')

  let repos: GitHubRepo[]
  try {
    repos = await fetchRepos(config.owner)
  } catch (err) {
    if (existsSync(reposOut)) {
      console.warn(`GitHub fetch failed (${(err as Error).message}); keeping existing repos.json`)
      return
    }
    throw err
  }

  const hidden = new Set(config.hidden)
  const featuredIndex = new Map(config.featured.map((f, i) => [f.repo, i]))
  const projects = repos
    .filter((r) => !hidden.has(r.name) && (!r.fork || featuredIndex.has(r.name)))
    .map((r) => {
      const f = config.featured.find((x) => x.repo === r.name)
      return {
        name: r.name,
        title: f?.title ?? r.name,
        summary: f?.summary ?? r.description ?? '',
        tags: f?.tags ?? r.topics ?? [],
        language: r.language,
        url: r.html_url,
        homepage: r.homepage || null,
        stars: r.stargazers_count,
        featured: featuredIndex.has(r.name),
        updatedAt: r.pushed_at,
      }
    })
    .sort((a, b) => {
      const ai = featuredIndex.get(a.name) ?? Infinity
      const bi = featuredIndex.get(b.name) ?? Infinity
      return ai !== bi ? ai - bi : b.updatedAt.localeCompare(a.updatedAt)
    })

  const missing = config.featured.filter((f) => !repos.some((r) => r.name === f.repo))
  if (missing.length) console.warn('Featured repos not found on GitHub:', missing.map((m) => m.repo).join(', '))

  await writeFile(reposOut, JSON.stringify(projects, null, 2) + '\n')
  console.log(`Wrote ${projects.length} projects (${projects.filter((p) => p.featured).length} featured)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
