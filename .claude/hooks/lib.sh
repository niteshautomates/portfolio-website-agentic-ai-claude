#!/bin/bash
# Shared path policy for the review hooks (decisions/012). Source this file; do not execute it.
# Written for bash 3.2 (macOS default): no associative arrays, no mapfile.

# classify <path relative to project root>  ->  prints: code | infra | docs | skip
classify() {
  local p="$1"
  # Never review: our own output, VCS, deps, build output, lockfiles, generated data, secrets, task.md.
  case "$p" in
    .claude/*|.git/*|*/.git/*|node_modules/*|*/node_modules/*|dist/*|*/dist/*) echo skip; return ;;
    task.md|*package-lock.json|*yarn.lock|*pnpm-lock.yaml|*.min.*) echo skip; return ;;
    .env|.env.*|*/.env|*/.env.*|*.pem|*.key|*secret*|*Secret*|*SECRET*) echo skip; return ;;
    frontend/src/data/*.json) echo skip; return ;;
  esac
  case "$p" in
    frontend/src/*.ts|frontend/src/*.tsx|frontend/src/*.css) echo code ;;
    frontend/scripts/*.ts|frontend/vite.config.ts|frontend/index.html) echo code ;;
    backend/*.py) echo code ;;
    nginx/*|docker/*|docker-compose.yml|backend/Dockerfile|backend/requirements*.txt) echo infra ;;
    content/*.yaml|decisions/*.md|README.md) echo docs ;;
    *) echo skip ;;
  esac
}

# mtime <file>  ->  epoch seconds (BSD stat on macOS, GNU stat elsewhere)
mtime() {
  stat -f %m "$1" 2>/dev/null || stat -c %Y "$1" 2>/dev/null || echo 0
}
