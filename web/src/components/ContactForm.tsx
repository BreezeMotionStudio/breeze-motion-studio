'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'

type Props = {
  namePlaceholder?: string
  emailPlaceholder?: string
  companyPlaceholder?: string
  messagePlaceholder?: string
  submitLabel?: string
}

export function ContactForm({
  namePlaceholder,
  emailPlaceholder,
  companyPlaceholder,
  messagePlaceholder,
  submitLabel,
}: Props) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('submitting')

    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      company: (form.elements.namedItem('company') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="font-[family-name:var(--font-body)] text-white text-base leading-relaxed">
        Thanks for reaching out, I&apos;ll get back to you shortly.
      </p>
    )
  }

  const inputClass =
    'w-full bg-transparent border border-white/30 text-white placeholder-white/70 px-4 py-3 focus:outline-none focus:border-white font-[family-name:var(--font-body)]'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <input name="name" type="text" required placeholder={namePlaceholder || 'Your name'} className={inputClass} />
      <input name="email" type="email" required placeholder={emailPlaceholder || 'Your email'} className={inputClass} />
      <input
        name="company"
        type="text"
        placeholder={companyPlaceholder || 'Company / Organisation (optional)'}
        className={inputClass}
      />
      <textarea
        name="message"
        required
        placeholder={messagePlaceholder || 'Tell us about your project'}
        rows={9}
        className={`${inputClass} resize-none`}
      />
      <div>
        <Button type="submit" variant="white" size="lg" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : submitLabel || 'Send Message'}
        </Button>
        {status === 'error' && (
          <p className="mt-3 text-sm text-red-400 font-[family-name:var(--font-body)]">
            Something went wrong - please try again, or email directly instead.
          </p>
        )}
      </div>
    </form>
  )
}
