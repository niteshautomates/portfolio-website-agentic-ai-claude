// Fixed decorative backdrop: grid + two soft glows. Purely visual, hidden from assistive tech.
export function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-grid absolute inset-0" />
      <div className="absolute -top-40 left-1/4 size-[32rem] rounded-full blur-3xl" style={{ background: 'var(--glow-1)' }} />
      <div className="absolute -top-20 right-0 size-[28rem] rounded-full blur-3xl" style={{ background: 'var(--glow-2)' }} />
    </div>
  )
}
