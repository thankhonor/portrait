"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface UnreadContextType {
  hasUnread: boolean
  unreadCount: number
  setHasUnread: (value: boolean) => void
  setUnreadCount: (value: number) => void
}

const UnreadContext = createContext<UnreadContextType | undefined>(undefined)

export function UnreadProvider({ children }: { children: ReactNode }) {
  const [hasUnread, setHasUnread] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  return (
    <UnreadContext.Provider value={{ hasUnread, setHasUnread, unreadCount, setUnreadCount }}>
      {children}
    </UnreadContext.Provider>
  )
}

export function useUnread() {
  const context = useContext(UnreadContext)
  if (context === undefined) {
    throw new Error("useUnread must be used within an UnreadProvider")
  }
  return context
}
