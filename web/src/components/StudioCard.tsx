function getYouTubeVideoId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0]
    if (u.hostname.includes('youtube.com'))
      return u.searchParams.get('v') || u.pathname.split('/').pop() || null
    return null
  } catch {
    return null
  }
}

function buildYouTubeEmbedUrl(id: string): string {
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0&iv_load_policy=3`
}

type Props = {
  href: string
  title: string
  purpose: string
  videoUrl?: string
  image?: {asset?: {url: string}; alt?: string}
}

export function StudioCard({href, title, purpose, videoUrl, image}: Props) {
  const ytId = videoUrl ? getYouTubeVideoId(videoUrl) : null
  const isYouTube = !!ytId

  return (
    <a
      href={href}
      className="group relative flex flex-col transition-transform duration-300 hover:scale-[1.03] hover:z-10"
    >
      {/* Square 1:1 media container */}
      <div className="relative w-full aspect-square shrink-0 overflow-hidden bg-[#111111]">
        {videoUrl ? (
          isYouTube && ytId ? (
            <iframe
              style={{
                position: 'absolute',
                top: '-62px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'calc(177.78% + 110px)',
                height: 'calc(100% + 62px)',
                border: 0,
                pointerEvents: 'none',
              }}
              src={buildYouTubeEmbedUrl(ytId)}
              allow="autoplay; encrypted-media"
              allowFullScreen={false}
            />
          ) : (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
            />
          )
        ) : image?.asset?.url ? (
          <img
            src={image.asset.url}
            alt={image.alt || title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}
      </div>

      {/* Black title bar */}
      <div className="bg-black px-5 py-4 text-center">
        <h3 className="font-[family-name:var(--font-brand)] text-base uppercase tracking-wide text-bms-grey-300 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
      </div>

      {/* White description area — grows with content, no clipping */}
      <div className="bg-white px-5 pt-4 pb-8 text-center">
        <p className="text-sm text-black font-[family-name:var(--font-body)]">
          {purpose}
        </p>
      </div>
    </a>
  )
}
