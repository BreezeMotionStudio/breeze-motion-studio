import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl">Page not found</h1>
      <p className="mt-4 max-w-md font-[family-name:var(--font-functional)] text-bms-dark-100">
        That page doesn&apos;t exist, or it&apos;s moved. Here&apos;s where you can pick back up.
      </p>
      <div className="mt-8 flex gap-4">
        <Button href="/" variant="black">
          Home
        </Button>
        <Button href="/case-studies" variant="white" className="border border-black">
          Case Studies
        </Button>
      </div>
    </div>
  )
}
