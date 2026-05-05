"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { GangProfileSearch } from "@/components/gang-profile/gang-profile-search"
import { ProfileList } from "@/components/gang-profile/profile-list"
import type { GangProfile } from "@/lib/modules/gang-profile/types"
import { mockGangProfiles } from "@/lib/modules/gang-profile/data"

export default function GangProfilePage() {
  const router = useRouter()
  const [searchKeyword, setSearchKeyword] = useState("")
  const [searchChannel, setSearchChannel] = useState("all")

  const filteredProfiles = useMemo(() => {
    let results = [...mockGangProfiles]

    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase()
      results = results.filter((p) => {
        if (p.name.toLowerCase().includes(kw)) return true
        if (p.id.toLowerCase().includes(kw)) return true
        if (p.type === "account") {
          return p.aliases.some((a) => a.toLowerCase().includes(kw))
        }
        return false
      })
    }

    if (searchChannel !== "all") {
      results = results.filter((p) => p.sourceChannel === searchChannel)
    }

    results.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())

    if (!searchKeyword.trim() && searchChannel === "all") {
      return results.slice(0, 5)
    }

    return results
  }, [searchKeyword, searchChannel])

  const handleSearch = (keyword: string, channel: string) => {
    setSearchKeyword(keyword)
    setSearchChannel(channel)
  }

  const handleSelectProfile = (profile: GangProfile) => {
    router.push(`/antifraud/gang-profile/${profile.id}`)
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.14)-theme(spacing.12))] bg-white rounded-lg border overflow-hidden">
      <div className="w-[280px] shrink-0 border-r bg-gray-50/50 p-4 flex flex-col">
        <GangProfileSearch
          onSearch={handleSearch}
          resultCount={filteredProfiles.length}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium">检索结果</span>
        </div>
        <ProfileList
          profiles={filteredProfiles}
          onSelect={handleSelectProfile}
        />
      </div>
    </div>
  )
}
