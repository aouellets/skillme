import Image from 'next/image'

interface ThumbnailData {
  name: string
  thumbnail_url?: string
  thumbnail_gif?: string
  media_alt?: string
}

const ASPECT: Record<'card' | 'detail', string> = {
  card: 'aspect-[16/9]',
  detail: 'aspect-[2/1]',
}

/**
 * Media block for packs (and skills with media). Renders a thumbnail image when
 * one is available, otherwise a generated initial-letter placeholder so cards
 * always have a consistent header. GIFs take precedence over static images.
 */
export function SkillThumbnail({
  skill,
  size = 'card',
}: {
  skill: ThumbnailData
  size?: 'card' | 'detail'
}) {
  const src = skill.thumbnail_gif || skill.thumbnail_url
  const alt = skill.media_alt || skill.name

  if (src) {
    return (
      <div className={`relative w-full overflow-hidden bg-shelf-elevated ${ASPECT[size]}`}>
        <Image src={src} alt={alt} fill unoptimized className="object-cover" />
      </div>
    )
  }

  const initial = skill.name.trim().charAt(0).toUpperCase() || '?'

  return (
    <div
      className={`flex w-full items-center justify-center overflow-hidden border-b border-shelf-border bg-gradient-to-br from-shelf-elevated to-shelf-surface ${ASPECT[size]}`}
      aria-hidden
    >
      <span className="font-display text-5xl text-shelf-text-tertiary">{initial}</span>
    </div>
  )
}
