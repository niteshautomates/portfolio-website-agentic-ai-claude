// Loaded synchronously from <head> (CSP allows 'self' scripts) to avoid a flash of the wrong theme.
try {
  var t = localStorage.getItem('theme')
  document.documentElement.classList.toggle('dark', t !== 'light')
} catch {
  document.documentElement.classList.add('dark')
}
