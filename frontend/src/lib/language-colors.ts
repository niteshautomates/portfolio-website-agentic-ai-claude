// GitHub-style language colours for the dot on project cards.
const COLORS: Record<string, string> = {
  Python: '#3572A5',
  Java: '#b07219',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HCL: '#844fba',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Go: '#00ADD8',
}

export function languageColor(language: string | null): string {
  return (language && COLORS[language]) || '#8b949e'
}
