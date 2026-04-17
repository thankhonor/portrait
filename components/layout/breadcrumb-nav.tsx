"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { ChevronRight, Home } from "lucide-react"

const pathKeyMap: Record<string, string> = {
  antifraud: "nav.antifraud",
  overview: "nav.overview",
  "clue-review": "nav.clueReview",
  "clue-followup": "nav.clueFollowup",
  "event-center": "nav.eventCenter",
  "bot-management": "nav.botManagement",
  "config-management": "nav.configManagement",
}

export function BreadcrumbNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const segments = pathname.split("/").filter(Boolean)

  return (
    <nav className="flex items-center gap-2 text-sm text-sidebar-muted">
      <Link href="/" className="hover:text-sidebar-foreground transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/")
        const titleKey = pathKeyMap[segment] || segment
        const isLast = index === segments.length - 1

        return (
          <span key={segment} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            {isLast ? (
              <span className="text-sidebar-foreground font-medium">{t(titleKey)}</span>
            ) : (
              <Link href={href} className="hover:text-sidebar-foreground transition-colors">
                {t(titleKey)}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
