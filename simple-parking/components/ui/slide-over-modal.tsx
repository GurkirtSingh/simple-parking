'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

type SlideOverModalProps = {
  children: ReactNode
}

export default function SlideOverModal({ children }: SlideOverModalProps) {
  const router = useRouter()

  // Close on Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [router])

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => router.back()}
        className="fixed inset-0 transition-opacity duration-300"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-background shadow-xl overflow-y-auto">
        <div className="p-4 flex justify-start">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}