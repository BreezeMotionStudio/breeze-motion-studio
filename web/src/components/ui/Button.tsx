type ButtonVariant = 'black' | 'white'
type ButtonSize = 'sm' | 'md' | 'lg'

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2',
  md: 'px-8 py-3',
  lg: 'px-10 py-4',
}

const VARIANTS: Record<ButtonVariant, string> = {
  black: 'bg-black text-white hover:bg-neutral-800',
  white: 'bg-white text-black hover:bg-gray-200',
}

const BASE =
  'cursor-pointer rounded-sm font-[family-name:var(--font-functional)] text-sm uppercase tracking-widest text-center transition duration-200 hover:scale-105'

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  children: React.ReactNode
  className?: string
  'aria-label'?: string
}

export function Button({
  variant = 'black',
  size = 'md',
  href,
  onClick,
  type = 'button',
  disabled = false,
  children,
  className = '',
  'aria-label': ariaLabel,
}: ButtonProps) {
  const classes = [
    'inline-block',
    SIZES[size],
    BASE,
    VARIANTS[variant],
    disabled ? 'opacity-50 pointer-events-none' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (href) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} aria-label={ariaLabel}>
      {children}
    </button>
  )
}
