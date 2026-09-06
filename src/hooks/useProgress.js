import { useEffect, useState } from 'react'

// Tracks which specimen ids are marked "done" for a given page, persisted
// to localStorage so progress survives a refresh or a new visit.
// Usage: const { isDone, toggle, completedCount, total } = useProgress('basic-elements', ['textbox', 'buttons', ...])
export function useProgress(pageKey, allIds) {
  const storageKey = `progress:${pageKey}`

  const [done, setDone] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(done))
    } catch {
      // localStorage can throw in private-browsing/quota-exceeded cases — safe to ignore, progress just won't persist
    }
  }, [done, storageKey])

  const toggle = (id) => {
    setDone((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const isDone = (id) => done.includes(id)
  const completedCount = done.filter((id) => allIds.includes(id)).length

  return { isDone, toggle, completedCount, total: allIds.length }
}
