function getYouTubeId(url: string) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m?.[1] ?? null
}

function getVimeoId(url: string) {
  const m = url.match(/vimeo\.com\/(\d+)/)
  return m?.[1] ?? null
}

export function VideoEmbed({ url, platform, title }: { url: string; platform?: string; title?: string }) {
  if (platform === 'youtube' || (!platform && (url.includes('youtube') || url.includes('youtu.be')))) {
    const id = getYouTubeId(url)
    if (!id) return null
    return (
      <div className="aspect-video w-full overflow-hidden rounded-sm">
        <iframe
          src={`https://www.youtube.com/embed/${id}?vq=hd1080&rel=0`}
          title={title || 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    )
  }
  if (platform === 'vimeo' || (!platform && url.includes('vimeo'))) {
    const id = getVimeoId(url)
    if (!id) return null
    return (
      <div className="aspect-video w-full overflow-hidden rounded-sm">
        <iframe
          src={`https://player.vimeo.com/video/${id}?quality=1080p`}
          title={title || 'Video'}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    )
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="font-[family-name:var(--font-functional)] text-xs uppercase tracking-widest text-bms-accent hover:underline"
    >
      {title || 'View Video →'}
    </a>
  )
}
