'use client'

import Link, { useLinkStatus } from 'next/link'
import { LoaderCircle } from 'lucide-react'
import type { ComponentProps } from 'react'

function PendingIndicator() {
  const { pending } = useLinkStatus()
  return pending ? (
    <span className="link-pending" role="status">
      <LoaderCircle size={18} className="animate-spin" />
      <span className="sr-only">Carregando página...</span>
    </span>
  ) : null
}

export default function NavigationLink({ children, className = '', ...props }: ComponentProps<typeof Link>) {
  return <Link {...props} className={`navigation-link ${className}`}>{children}<PendingIndicator /></Link>
}
