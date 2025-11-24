'use client'

import { useState, useEffect } from 'react'
import { WebOS } from '@/components/web-os'
import { OSProvider } from '@/context/os-context'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <OSProvider>
      <WebOS />
    </OSProvider>
  )
}
