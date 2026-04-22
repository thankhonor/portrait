"use client"

import { Suspense } from "react"
import { FollowSessionsWorkstation } from "@/components/follow-sessions/follow-sessions-workstation"

export default function FollowSessionsPage() {
  return (
    <Suspense>
      <FollowSessionsWorkstation />
    </Suspense>
  )
}
