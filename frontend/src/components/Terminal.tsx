import { useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

const isCommand = (line: string) => line.startsWith('$ ')

// Types commands char by char, prints output instantly, loops. Static under reduced motion (decisions/009, 011).
export function Terminal({ lines }: { lines: string[] }) {
  const reduce = useReducedMotion()
  const [pos, setPos] = useState({ line: 0, char: 0 })

  useEffect(() => {
    if (reduce || lines.length === 0) return
    const { line, char } = pos
    let timer: ReturnType<typeof setTimeout>
    if (line >= lines.length) {
      timer = setTimeout(() => setPos({ line: 0, char: 0 }), 5000)
    } else {
      const current = lines[line]!
      if (isCommand(current) && char < current.length) {
        timer = setTimeout(() => setPos({ line, char: char + 1 }), 30 + Math.random() * 45)
      } else {
        timer = setTimeout(() => setPos({ line: line + 1, char: 0 }), isCommand(current) ? 350 : 250)
      }
    }
    return () => clearTimeout(timer)
  }, [pos, reduce, lines])

  const shown = reduce
    ? lines
    : lines.slice(0, pos.line + 1).map((l, i) => (i === pos.line && isCommand(l) ? l.slice(0, pos.char) : l))

  return (
    <div className="glass overflow-hidden rounded-2xl shadow-2xl shadow-primary/10">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-3 rounded-full bg-red-400/80" />
        <span className="size-3 rounded-full bg-yellow-400/80" />
        <span className="size-3 rounded-full bg-green-400/80" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">nitesh@devops: ~</span>
      </div>
      <p className="sr-only">{lines.map((l) => l.replace(/^\$ /, '')).join('. ')}</p>
      <div aria-hidden="true" className="min-h-64 p-5 font-mono text-sm leading-7">
        {shown.map((l, i) => (
          <div key={i} className={isCommand(l) ? 'text-foreground' : 'text-muted-foreground'}>
            {isCommand(l) ? (
              <>
                <span className="text-primary">$</span>
                {l.slice(1)}
              </>
            ) : (
              l
            )}
            {!reduce && i === shown.length - 1 && <span className="animate-blink ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-primary" />}
          </div>
        ))}
      </div>
    </div>
  )
}
