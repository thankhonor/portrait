"use client"

import { cn } from "@/lib/utils"
import { ChevronRight, Search } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { GangProfile, GangAccount } from "@/lib/modules/gang-profile/types"

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-indigo-500",
]

function ProfileAvatar({ name, index }: { name: string; index: number }) {
  const initial = name.slice(0, 1)
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length]
  return (
    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0", color)}>
      {initial}
    </div>
  )
}

interface ProfileListProps {
  profiles: GangProfile[]
  onSelect: (profile: GangProfile) => void
}

function TypeBadge({ type }: { type: "account" | "group" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium rounded border",
        type === "account"
          ? "text-blue-600 bg-blue-50 border-blue-200"
          : "text-orange-600 bg-orange-50 border-orange-200",
      )}
    >
      {type === "account" ? "账号" : "群组"}
    </span>
  )
}

function AliasesDisplay({ aliases }: { aliases: string[] }) {
  if (aliases.length === 0) return null
  const text = aliases.join("、")

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="text-xs text-muted-foreground truncate max-w-[200px] inline-block align-bottom">
          曾用昵称：{text}
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[300px]">
        <p className="text-xs">{text}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export function ProfileList({ profiles, onSelect }: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
        <Search className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-sm">未找到匹配的账号或群组</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto space-y-2">
      {profiles.map((profile, index) => (
        <div
          key={profile.id}
          className="border border-border rounded-lg p-4 hover:bg-blue-50 cursor-pointer transition-colors group"
          onClick={() => onSelect(profile)}
        >
          <div className="flex items-start gap-3">
            <ProfileAvatar name={profile.name} index={index} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{profile.name}</span>
                <TypeBadge type={profile.type} />
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  ID: {profile.id}
                </div>

                {profile.type === "account" && (profile as GangAccount).aliases.length > 0 && (
                  <div className="text-xs text-muted-foreground truncate">
                    曾用昵称：{(profile as GangAccount).aliases.join("、")}
                  </div>
                )}

                <div className="flex items-center gap-1 flex-wrap mt-1">
                  <span className="text-xs text-muted-foreground mr-1">风险场景：</span>
                  {profile.riskScenes.map((scene) => (
                    <span
                      key={scene.name}
                      className="inline-flex items-center px-1.5 py-0.5 text-[11px] bg-gray-100 text-gray-600 rounded"
                    >
                      {scene.name} ({scene.count})
                    </span>
                  ))}
                </div>

                <div className="text-xs text-muted-foreground mt-1">
                  来源渠道：{profile.sourceChannel}
                </div>
                <div className="text-xs text-muted-foreground">
                  最近活跃：{profile.lastActive}
                </div>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      ))}
    </div>
  )
}
