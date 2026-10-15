// Name -> brand icon map (decisions/010). Imports are named so unused icons are tree-shaken.
import type { IconType } from 'react-icons'
import { FaAws, FaJava } from 'react-icons/fa6'
import {
  SiAnsible,
  SiAnthropic,
  SiChef,
  SiDocker,
  SiGithubactions,
  SiGnubash,
  SiJavascript,
  SiJenkins,
  SiKubernetes,
  SiOpentelemetry,
  SiPacker,
  SiPython,
  SiTerraform,
  SiTypescript,
} from 'react-icons/si'
import { VscAzure } from 'react-icons/vsc'

const ICONS: Record<string, IconType> = {
  aws: FaAws,
  azure: VscAzure,
  terraform: SiTerraform,
  chef: SiChef,
  ansible: SiAnsible,
  packer: SiPacker,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  aks: SiKubernetes,
  jenkins: SiJenkins,
  'github actions': SiGithubactions,
  python: SiPython,
  java: FaJava,
  bash: SiGnubash,
  javascript: SiJavascript,
  typescript: SiTypescript,
  opentelemetry: SiOpentelemetry,
  'anthropic sdk': SiAnthropic,
}

export function techIcon(name: string): IconType | undefined {
  return ICONS[name.toLowerCase()]
}
