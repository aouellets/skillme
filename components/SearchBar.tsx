'use client'

import { useEffect, useState } from 'react'

export function SearchBar({
  initialValue = '',
  placeholder = 'Search skills…',
  onSearch,
  debounceMs = 300,
}: {
  initialValue?: string
  placeholder?: string
  onSearch: (value: string) => void
  debounceMs?: number
}) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    const id = setTimeout(() => onSearch(value.trim()), debounceMs)
    return () => clearTimeout(id)
    // onSearch is stable from the parent; intentionally tracking value only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, debounceMs])

  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-shelf-text-tertiary"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
      >
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        className="input pl-9"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search skills"
      />
    </div>
  )
}
