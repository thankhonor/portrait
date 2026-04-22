"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { useUnread } from "@/contexts/unread-context"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  FileSearch,
  UserSearch,
  AlertCircle,
  Shield,
  Cpu,
  Settings,
  Bot,
  MessageSquareMore,
} from "lucide-react"

interface NavItem {
  titleKey: string
  href: string
  icon: React.ReactNode
}

interface NavModule {
  titleKey: string
  icon: React.ReactNode
  items: NavItem[]
}

const navModules: NavModule[] = [
  {
    titleKey: "nav.antifraud",
    icon: <Shield className="w-5 h-5" />,
    items: [
      { titleKey: "nav.clueFollowup", href: "/antifraud/clue-followup", icon: <UserSearch className="w-4 h-4" /> },
      { titleKey: "nav.followSessions", href: "/antifraud/follow-sessions", icon: <MessageSquareMore className="w-4 h-4" /> },
      { titleKey: "nav.configManagement", href: "/antifraud/config-management", icon: <Settings className="w-4 h-4" /> },
    ],
  },
]

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedModules, setExpandedModules] = useState<string[]>(["nav.antifraud"])
  const pathname = usePathname()
  const { t } = useLanguage()
  const { hasUnread } = useUnread()

  const showUnread = (item: NavItem) =>
    item.href === "/antifraud/follow-sessions" && hasUnread

  const toggleModule = (titleKey: string) => {
    setExpandedModules((prev) =>
      prev.includes(titleKey) ? prev.filter((key) => key !== titleKey) : [...prev, titleKey],
    )
  }

  const isActive = (href: string) => pathname === href

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Cpu className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && <span className="font-semibold text-sm whitespace-nowrap">{t("nav.platform")}</span>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navModules.map((module) => (
          <div key={module.titleKey} className="mb-2">
            <button
              onClick={() => !collapsed && toggleModule(module.titleKey)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                collapsed && "justify-center",
              )}
            >
              {module.icon}
              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-sm font-medium">{t(module.titleKey)}</span>
                  {expandedModules.includes(module.titleKey) ? (
                    <ChevronUp className="w-4 h-4 text-sidebar-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-sidebar-muted" />
                  )}
                </>
              )}
            </button>

            {!collapsed && expandedModules.includes(module.titleKey) && (
              <div className="mt-1 space-y-0.5">
                {module.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 pl-12 text-sm transition-colors",
                      isActive(item.href)
                        ? "bg-sidebar-accent text-sidebar-primary border-l-2 border-sidebar-primary"
                        : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                    )}
                  >
                    <span className="relative">
                      {item.icon}
                      {showUnread(item) && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </span>
                    <span>{t(item.titleKey)}</span>
                  </Link>
                ))}
              </div>
            )}

            {collapsed && (
              <div className="mt-1 space-y-0.5">
                {module.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex items-center justify-center py-2 transition-colors",
                      isActive(item.href) ? "text-sidebar-primary" : "text-sidebar-muted hover:text-sidebar-foreground",
                    )}
                    title={t(item.titleKey)}
                  >
                    {item.icon}
                    {item.hasUnread && (
                      <span className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 text-sidebar-muted hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  )
}
