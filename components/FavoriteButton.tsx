'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useFavorites } from './FavoritesProvider'

/**
 * Heart toggle backed by the FavoritesProvider. Two shapes:
 *   - 'icon'   : compact heart, for skill cards (overlaid top-right)
 *   - 'button' : full-width labelled button, for the skill detail sidebar
 * Signed-out users are routed to /login (with a next param) on click.
 */
export function FavoriteButton({
  skillId,
  variant = 'icon',
}: {
  skillId: string
  variant?: 'icon' | 'button'
}) {
  const { signedIn, isFavorited, toggle } = useFavorites()
  const router = useRouter()
  const pathname = usePathname()
  const favorited = isFavorited(skillId)

  async function onClick(e: React.MouseEvent) {
    // On cards the button sits inside a Link — don't navigate to the skill.
    e.preventDefault()
    e.stopPropagation()
    if (signedIn === false) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`)
      return
    }
    await toggle(skillId)
  }

  const label = favorited ? 'Remove from favorites' : 'Save to favorites'

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={favorited}
        aria-label={label}
        title={label}
        className="group absolute left-1.5 top-1.5 z-10 flex h-11 w-11 items-center justify-center rounded-full text-base"
      >
        {/* 44×44 tap target (WCAG/HIG min); the visible 32px disc is an inner
            span so the larger hit area doesn't change the card's visual weight. */}
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full border bg-shelf-void/70 backdrop-blur transition-colors ${
            favorited
              ? 'border-accent/60 text-accent'
              : 'border-shelf-border text-shelf-text-tertiary group-hover:border-accent/60 group-hover:text-accent'
          }`}
        >
          {favorited ? '♥' : '♡'}
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={favorited}
      className={`btn w-full ${favorited ? 'btn-secondary' : 'btn-ghost'}`}
    >
      <span className={favorited ? 'text-accent' : ''}>{favorited ? '♥' : '♡'}</span>
      <span className="ml-2">{favorited ? 'Saved to favorites' : 'Save to favorites'}</span>
    </button>
  )
}
