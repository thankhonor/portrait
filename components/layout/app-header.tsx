"use client"

import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Sun, Moon, Globe, User, LogOut } from "lucide-react"
import { BreadcrumbNav } from "./breadcrumb-nav"

export function AppHeader() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="h-14 border-b border-sidebar-border bg-sidebar flex items-center justify-between px-4">
      {/* Breadcrumb Navigation - Left side */}
      <BreadcrumbNav />

      {/* Right side controls */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          {theme === "light" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <Globe className="w-5 h-5" />
        </Button>

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
