import type React from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { FilterProvider } from "@/contexts/filter-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FilterProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <AppHeader />
          <main className="flex-1 overflow-hidden bg-background px-6 pt-3 min-h-0">{children}</main>
        </div>
      </div>
    </FilterProvider>
  )
}
