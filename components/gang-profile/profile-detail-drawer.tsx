"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ExternalLink, Users, Phone, Calendar, Globe, FileText, UserCircle } from "lucide-react"

const AVATAR_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500",
  "bg-pink-500", "bg-cyan-500", "bg-indigo-500",
]

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RelatedCluesPanel } from "./related-clues-panel"
import type { GangProfile, GangAccount, GangGroup } from "@/lib/modules/gang-profile/types"
import { mockRelatedGroups, mockRelatedClues, mockRelatedIOCs, mockRelatedFiles, mockRelatedAccounts } from "@/lib/modules/gang-profile/data"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface ProfileDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: GangProfile | null
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 py-1.5">
      <span className="text-muted-foreground shrink-0 mt-0.5">{icon}</span>
      <span className="text-sm text-muted-foreground w-[100px] shrink-0">{label}</span>
      <span className="text-sm flex-1 min-w-0">{value}</span>
    </div>
  )
}

function AccountBasicInfo({ profile }: { profile: GangAccount }) {
  const aliasText = profile.aliases.join("、")
  const showMore = profile.aliases.length > 3

  return (
    <div className="space-y-0.5">
      <InfoRow
        icon={<Users className="w-3.5 h-3.5" />}
        label="关注数 / 粉丝数"
        value={`${profile.followingCount} / ${profile.followersCount.toLocaleString()}`}
      />
      <InfoRow icon={<Phone className="w-3.5 h-3.5" />} label="手机号" value={profile.phone} />
      <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label="首次发现" value={profile.registerTime} />
      <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label="上次活跃" value={profile.lastActive} />
      <InfoRow icon={<Globe className="w-3.5 h-3.5" />} label="来源渠道" value={profile.sourceChannel} />
      <InfoRow
        icon={<UserCircle className="w-3.5 h-3.5" />}
        label="曾用昵称"
        value={
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate block max-w-[260px]">
                {aliasText}
                {showMore && ` 等${profile.aliases.length}个`}
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[300px]">
              <p className="text-xs">{aliasText}</p>
            </TooltipContent>
          </Tooltip>
        }
      />
      <InfoRow icon={<FileText className="w-3.5 h-3.5" />} label="账号简介" value={profile.bio} />
    </div>
  )
}

function GroupBasicInfo({ profile }: { profile: GangGroup }) {
  return (
    <div className="space-y-0.5">
      <InfoRow icon={<FileText className="w-3.5 h-3.5" />} label="群组名称" value={
        <span className="flex items-center gap-1">
          {profile.name}
          <button
            className="text-blue-500 hover:text-blue-700 transition-colors"
            onClick={() => window.open(`/antifraud/gang-profile?groupId=${profile.id}`, "_blank")}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </span>
      } />
      <InfoRow icon={<FileText className="w-3.5 h-3.5" />} label="群组ID" value={profile.id} />
      <InfoRow icon={<FileText className="w-3.5 h-3.5" />} label="群号" value={profile.groupNumber} />
      <InfoRow icon={<FileText className="w-3.5 h-3.5" />} label="群简介" value={profile.description} />
      <InfoRow icon={<Users className="w-3.5 h-3.5" />} label="群组成员" value={
        <span className="inline-flex items-center px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded border border-blue-200">
          {profile.memberCount} 人
        </span>
      } />
      <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label="首次监控" value={profile.firstMonitorTime} />
      <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label="最近活跃" value={profile.lastActive} />
    </div>
  )
}

function RelatedGroupsList({ profileId }: { profileId: string }) {
  const groups = mockRelatedGroups[profileId] || []

  if (groups.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-8">暂无关联群组</div>
  }

  return (
    <div className="space-y-1">
      {groups.map((group) => (
        <div key={group.id} className="flex items-center justify-between py-2.5 px-3 border border-border rounded-lg hover:bg-accent/30 transition-colors">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">{group.name}</div>
              <div className="text-xs text-muted-foreground">ID: {group.id}  |  成员: {group.memberCount}</div>
            </div>
          </div>
          <button
            className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            onClick={() => window.open(`/antifraud/gang-profile?groupId=${group.id}`, "_blank")}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}

function RelatedIOCList({ profileId }: { profileId: string }) {
  const iocs = mockRelatedIOCs[profileId] || []

  if (iocs.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-8">暂无 IOC 信息</div>
  }

  const typeColor: Record<string, string> = {
    IP: "text-blue-600 bg-blue-50 border-blue-200",
    "域名": "text-green-600 bg-green-50 border-green-200",
    "邮箱": "text-purple-600 bg-purple-50 border-purple-200",
    "手机号": "text-orange-600 bg-orange-50 border-orange-200",
    Hash: "text-gray-600 bg-gray-50 border-gray-200",
  }

  return (
    <div className="space-y-1">
      {iocs.map((ioc) => (
        <div key={ioc.id} className="flex items-center justify-between py-2.5 px-3 border border-border rounded-lg hover:bg-accent/30 transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <span className={cn("inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium rounded border shrink-0", typeColor[ioc.type] || typeColor.Hash)}>
              {ioc.type}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{ioc.value}</div>
              <div className="text-xs text-muted-foreground">首次发现: {ioc.firstSeen}  |  最近发现: {ioc.lastSeen}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function RelatedFilesList({ profileId }: { profileId: string }) {
  const files = mockRelatedFiles[profileId] || []

  if (files.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-8">暂无关联文件</div>
  }

  return (
    <div className="space-y-1">
      {files.map((file) => (
        <div key={file.id} className="flex items-center justify-between py-2.5 px-3 border border-border rounded-lg hover:bg-accent/30 transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{file.name}</div>
              <div className="text-xs text-muted-foreground">{file.type}  |  {file.size}  |  {file.uploadTime}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function RelatedAccountsList({ profileId }: { profileId: string }) {
  const accounts = mockRelatedAccounts[profileId] || []

  if (accounts.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-8">暂无关联账号</div>
  }

  return (
    <div className="space-y-1">
      {accounts.map((account) => (
        <div key={account.id} className="flex items-center justify-between py-2.5 px-3 border border-border rounded-lg hover:bg-accent/30 transition-colors">
          <div className="flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">{account.name}</div>
              <div className="text-xs text-muted-foreground">ID: {account.id}  |  {account.role}</div>
            </div>
          </div>
          <button
            className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            onClick={() => window.open(`/antifraud/gang-profile?accountId=${account.id}`, "_blank")}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}

type RelatedTab = "clues" | "groups" | "ioc" | "files" | "accounts"

export function ProfileDetailDrawer({ open, onOpenChange, profile }: ProfileDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<RelatedTab>("clues")

  if (!profile) return null

  const isAccount = profile.type === "account"
  const clueCount = (mockRelatedClues[profile.id] || []).length
  const groupCount = (mockRelatedGroups[profile.id] || []).length
  const iocCount = (mockRelatedIOCs[profile.id] || []).length
  const fileCount = (mockRelatedFiles[profile.id] || []).length
  const accountCount = (mockRelatedAccounts[profile.id] || []).length

  const tabs: { key: RelatedTab; label: string; count: number }[] = isAccount
    ? [
        { key: "clues", label: "线索", count: clueCount },
        { key: "groups", label: "群组", count: groupCount },
        { key: "ioc", label: "IOC", count: iocCount },
        { key: "files", label: "文件", count: fileCount },
      ]
    : [
        { key: "clues", label: "线索", count: clueCount },
        { key: "accounts", label: "账号", count: accountCount },
      ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[600px] sm:max-w-[600px] p-0 flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-medium", getAvatarColor(profile.name))}>
              {profile.name.slice(0, 1)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-base">{profile.name}</SheetTitle>
                <span className={cn(
                  "inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium rounded border",
                  isAccount
                    ? "text-blue-600 bg-blue-50 border-blue-200"
                    : "text-orange-600 bg-orange-50 border-orange-200",
                )}>
                  {isAccount ? "账号" : "群组"}
                </span>
                <button className="text-blue-500 hover:text-blue-700 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">ID: {profile.id}</div>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-auto">
          <div className="px-6 py-4">
            {/* Basic Info */}
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-1 h-4 bg-foreground rounded-full" />
                <span className="text-sm font-medium">基本信息</span>
              </div>
              {isAccount ? (
                <AccountBasicInfo profile={profile as GangAccount} />
              ) : (
                <GroupBasicInfo profile={profile as GangGroup} />
              )}

              {/* Risk Scenes */}
              <div className="mt-3">
                <div className="text-sm text-muted-foreground mb-2">风险场景</div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.riskScenes.map((scene) => (
                    <span
                      key={scene.name}
                      className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
                    >
                      {scene.name} ({scene.count})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 关联信息 */}
            <div className="flex items-center gap-1.5 mb-3 mt-6">
              <div className="w-1 h-4 bg-red-500 rounded-full" />
              <span className="text-sm font-medium">关联信息</span>
            </div>

            <div className="flex border-b border-border mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={cn(
                    "px-4 py-2 text-sm border-b-2 transition-colors",
                    activeTab === tab.key
                      ? "border-blue-500 text-blue-600 font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {activeTab === "clues" && <RelatedCluesPanel profileId={profile.id} />}
            {activeTab === "groups" && <RelatedGroupsList profileId={profile.id} />}
            {activeTab === "ioc" && <RelatedIOCList profileId={profile.id} />}
            {activeTab === "files" && <RelatedFilesList profileId={profile.id} />}
            {activeTab === "accounts" && <RelatedAccountsList profileId={profile.id} />}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
