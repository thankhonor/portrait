"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut } from "lucide-react"
import { BreadcrumbNav } from "./breadcrumb-nav"

export function AppHeader() {
  return (
    <header className="h-14 border-b border-sidebar-border bg-sidebar flex items-center justify-between px-4">
      {/* Breadcrumb Navigation - Left side */}
      <BreadcrumbNav />

      {/* Right side controls */}
      <div className="flex items-center gap-2">
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <div className="w-7 h-7 rounded-full bg-sidebar-primary flex items-center justify-center">
                <User className="w-4 h-4 text-sidebar-primary-foreground" />
              </div>
              <span className="text-sm hidden md:inline">{`zhangsan@threathunter.cn`}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{`zhangsan@threathunter.cn`}</p>
              <p className="text-xs text-muted-foreground">Security Analyst</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
