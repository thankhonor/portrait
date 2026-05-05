"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ArrowLeft, ExternalLink, Users, Phone, Calendar, Globe,
  FileText, UserCircle, Search, Eye, Share2,
  Download, ZoomIn, ZoomOut, Maximize2, RotateCw, X, ChevronLeft, ChevronRight,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ProfileDetailDrawer } from "@/components/gang-profile/profile-detail-drawer"
import type { GangAccount, GangGroup, GangProfile } from "@/lib/modules/gang-profile/types"
import {
  mockGangProfiles, mockRelatedClues, mockRelatedGroups,
  mockRelatedIOCs, mockRelatedFiles, mockRelatedAccounts,
  getClueStatistics,
} from "@/lib/modules/gang-profile/data"

const AVATAR_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500",
  "bg-pink-500", "bg-cyan-500", "bg-indigo-500",
]

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
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
      <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label="最近活跃" value={profile.lastActive} />
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
      <InfoRow icon={<FileText className="w-3.5 h-3.5" />} label="群组名称" value={profile.name} />
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

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pendingReview: { label: "待审核", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  ignored: { label: "暂不关注", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
  pendingFollowup: { label: "待跟进", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  following: { label: "跟进中", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  followEnded: { label: "跟进结束", color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  eventCreated: { label: "已生成事件", color: "text-red-600", bg: "bg-red-50 border-red-200" },
}

const CHART_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"]

function DonutChart({ data }: { data: { name: string; count: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0)
  if (total === 0) return null

  const radius = 40
  const strokeWidth = 12
  const center = 50
  let cumulative = 0

  const segments = data.map((d) => {
    const percentage = d.count / total
    const offset = cumulative
    cumulative += percentage
    const circumference = 2 * Math.PI * radius
    return {
      ...d,
      dashArray: `${circumference * percentage} ${circumference * (1 - percentage)}`,
      dashOffset: -circumference * offset,
      circumference,
    }
  })

  return (
    <div className="flex items-center gap-4">
      <svg width="100" height="100" viewBox="0 0 100 100">
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={seg.dashArray}
            strokeDashoffset={seg.dashOffset}
            transform={`rotate(-90 ${center} ${center})`}
            className="transition-all duration-300"
          />
        ))}
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="font-medium">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RelatedGroupsList({ profileId, onView }: { profileId: string; onView: (name: string) => void }) {
  const groups = mockRelatedGroups[profileId] || []
  if (groups.length === 0) return <div className="text-sm text-muted-foreground text-center py-8">暂无关联群组</div>

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
            onClick={() => onView(group.name)}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}

function RelatedIOCList({ profileId }: { profileId: string }) {
  const iocs = mockRelatedIOCs[profileId] || []
  if (iocs.length === 0) return <div className="text-sm text-muted-foreground text-center py-8">暂无 IOC 信息</div>

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

const FILE_CATEGORY_COLOR: Record<string, string> = {
  "图片": "text-blue-600 bg-blue-50 border-blue-200",
  "文档": "text-green-600 bg-green-50 border-green-200",
  "代码": "text-purple-600 bg-purple-50 border-purple-200",
  "数据": "text-orange-600 bg-orange-50 border-orange-200",
}

const THUMBNAIL_COLORS = ["bg-gray-200", "bg-blue-100", "bg-green-100", "bg-orange-100", "bg-purple-100"]

function ImageLightbox({ files, currentIndex, onClose, onNavigate }: {
  files: { id: string; name: string }[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}) {
  const total = files.length
  const current = files[currentIndex]

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col" onClick={onClose}>
      <div className="flex justify-end p-4">
        <button className="text-white/80 hover:text-white transition-colors" onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center relative px-16" onClick={(e) => e.stopPropagation()}>
        {currentIndex > 0 && (
          <button
            className="absolute left-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            onClick={() => onNavigate(currentIndex - 1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div className="max-w-3xl w-full bg-white rounded-lg overflow-hidden shadow-2xl">
          <div className="bg-gray-100 h-[500px] flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-2" />
              <span className="text-sm text-muted-foreground">{current.name}</span>
            </div>
          </div>
        </div>

        {currentIndex < total - 1 && (
          <button
            className="absolute right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            onClick={() => onNavigate(currentIndex + 1)}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 pb-6">
        <span className="text-white/80 text-sm">{currentIndex + 1} / {total}</span>
        <div className="flex items-center gap-2">
          {[ZoomOut, ZoomIn, Maximize2, RotateCw].map((Icon, i) => (
            <button key={i} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function RelatedFilesList({ profileId }: { profileId: string }) {
  const files = mockRelatedFiles[profileId] || []
  const [fileFilter, setFileFilter] = useState<"all" | "图片">("all")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (files.length === 0) return <div className="text-sm text-muted-foreground text-center py-8">暂无关联文件</div>

  const imageFiles = files.filter((f) => f.fileCategory === "图片")
  const filteredFiles = fileFilter === "图片" ? imageFiles : files

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          className={cn(
            "px-3 py-1 text-xs rounded-full border transition-colors",
            fileFilter === "all"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-muted-foreground border-border hover:text-foreground",
          )}
          onClick={() => setFileFilter("all")}
        >
          全部 ({files.length})
        </button>
        <button
          className={cn(
            "px-3 py-1 text-xs rounded-full border transition-colors",
            fileFilter === "图片"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-muted-foreground border-border hover:text-foreground",
          )}
          onClick={() => setFileFilter("图片")}
        >
          图片 ({imageFiles.length})
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filteredFiles.map((file, i) => {
          const isImage = file.fileCategory === "图片"
          return (
            <div key={file.id} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow group">
              <div className={cn("h-[160px] flex items-center justify-center relative", THUMBNAIL_COLORS[i % THUMBNAIL_COLORS.length])}>
                <div className="text-center">
                  <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                  <span className="text-xs text-muted-foreground/60 mt-1">{isImage ? file.name : file.type}</span>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  {isImage && (
                    <button
                      className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-700 transition-colors shadow"
                      onClick={() => {
                        const imgIndex = imageFiles.findIndex((f) => f.id === file.id)
                        setLightboxIndex(imgIndex >= 0 ? imgIndex : 0)
                      }}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  )}
                  <button className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-700 transition-colors shadow">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground truncate flex-1">{file.source}</span>
                  <span className={cn("inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded border shrink-0 ml-2", FILE_CATEGORY_COLOR[file.fileCategory])}>
                    {file.fileCategory}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{file.uploadTime}</span>
                  <button className="text-xs text-blue-500 hover:text-blue-700 transition-colors">查看详情</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          files={imageFiles}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  )
}

function RelatedAccountsList({ profileId, onView }: { profileId: string; onView: (id: string) => void }) {
  const accounts = mockRelatedAccounts[profileId] || []
  if (accounts.length === 0) return <div className="text-sm text-muted-foreground text-center py-8">暂无关联账号</div>

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
            onClick={() => onView(account.id)}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}

type RelatedTab = "clues" | "groups" | "ioc" | "files" | "accounts"

function CluesTabContent({ profileId }: { profileId: string }) {
  const clues = mockRelatedClues[profileId] || []
  const stats = getClueStatistics(profileId)

  const riskDistribution = useMemo(() => {
    const map = new Map<string, number>()
    clues.forEach((c) => {
      map.set(c.riskScene, (map.get(c.riskScene) || 0) + 1)
    })
    return Array.from(map.entries()).map(([name, count], i) => ({
      name,
      count,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }))
  }, [clues])

  const summaryStats = [
    { label: "线索总数", value: stats.total, color: "text-foreground" },
    { label: "待审核", value: stats.pendingReview, color: "text-orange-500" },
    { label: "暂不关注", value: stats.ignored, color: "text-gray-400" },
    { label: "待跟进", value: stats.pendingFollowup, color: "text-blue-500" },
    { label: "跟进中", value: stats.following, color: "text-green-500" },
    { label: "跟进结束", value: stats.followEnded, color: "text-purple-500" },
    { label: "已生成事件", value: stats.eventCreated, color: "text-red-500" },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2 text-center border border-border rounded-lg p-3">
        {summaryStats.map((item) => (
          <div key={item.label}>
            <div className={cn("text-lg font-bold", item.color)}>{item.value}</div>
            <div className="text-[11px] text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="border border-border rounded-lg p-4">
        <DonutChart data={riskDistribution} />
      </div>

      <div className="space-y-2">
        {clues.map((clue) => {
          const statusConfig = STATUS_CONFIG[clue.status]
          return (
            <div key={clue.id} className="py-3 px-4 border border-border rounded-lg hover:bg-accent/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <Search className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={cn("inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium rounded border shrink-0", statusConfig.bg, statusConfig.color)}>
                        {statusConfig.label}
                      </span>
                      <span className="text-sm truncate">{clue.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <span>ID: {clue.id}</span>
                      <span className="text-border">|</span>
                      <span>风险场景: {clue.riskScene}</span>
                      <span className="text-border">|</span>
                      <span>发布渠道: {clue.channel}</span>
                      <span className="text-border">|</span>
                      <span>发布时间: {clue.publishTime}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground shrink-0"
                  onClick={() => window.open(`/antifraud/clue-followup?clueId=${clue.id}`, "_blank")}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function GangProfileDetailPage() {
  const params = useParams()
  const router = useRouter()
  const profileId = params.id as string
  const [activeTab, setActiveTab] = useState<RelatedTab>("clues")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerProfile, setDrawerProfile] = useState<GangProfile | null>(null)

  const openDrawerByName = (name: string) => {
    const found = mockGangProfiles.find((p) => p.name === name)
    if (found) {
      setDrawerProfile(found)
      setDrawerOpen(true)
    }
  }

  const openDrawerById = (id: string) => {
    const found = mockGangProfiles.find((p) => p.id === id)
    if (found) {
      setDrawerProfile(found)
      setDrawerOpen(true)
    }
  }


  const profile = mockGangProfiles.find((p) => p.id === profileId)

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-theme(spacing.14)-theme(spacing.12))]">
        <div className="text-muted-foreground">未找到该画像信息</div>
      </div>
    )
  }

  const isAccount = profile.type === "account"
  const clueCount = (mockRelatedClues[profile.id] || []).length
  const groupCount = (mockRelatedGroups[profile.id] || []).length
  const iocCount = (mockRelatedIOCs[profile.id] || []).length
  const fileCount = (mockRelatedFiles[profile.id] || []).length
  const accountCount = (mockRelatedAccounts[profile.id] || []).length

  const tabs: { key: RelatedTab; label: string }[] = isAccount
    ? [
        { key: "clues", label: "线索" },
        { key: "groups", label: "群组" },
        { key: "ioc", label: "IOC" },
        { key: "files", label: "文件" },
      ]
    : [
        { key: "clues", label: "线索" },
        { key: "accounts", label: "账号" },
      ]

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.14)-theme(spacing.12))]">
      {/* Top header */}
      <div className="flex items-center gap-4 mt-2 mb-4">
        <button
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => router.push("/antifraud/gang-profile")}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回列表</span>
        </button>
      </div>

      {/* Main content */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left panel */}
        <div className="w-[520px] shrink-0 border border-border rounded-lg flex flex-col min-h-0">
          <div className="flex items-center gap-1.5 px-6 pt-5 pb-3">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{isAccount ? "账号画像" : "群组画像"}</span>
          </div>

          <ScrollArea className="flex-1 overflow-auto">
            <div className="px-6 pb-5 pt-2">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-medium", getAvatarColor(profile.name))}>
                  {profile.name.slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{profile.name}</span>
                    <button className="text-blue-500 hover:text-blue-700 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">ID: {profile.id}</div>
                </div>
              </div>

              {isAccount ? (
                <AccountBasicInfo profile={profile as GangAccount} />
              ) : (
                <GroupBasicInfo profile={profile as GangGroup} />
              )}

              <div className="mt-4">
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
          </ScrollArea>
        </div>

        {/* Right panel */}
        <div className="flex-1 min-w-0 border border-border rounded-lg flex flex-col">
          {/* Right header */}
          <div className="px-6 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">关联信息</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="mx-6 flex rounded-lg bg-gray-100 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={cn(
                  "flex-1 px-4 py-2 text-sm rounded-md transition-all",
                  activeTab === tab.key
                    ? "bg-white text-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <ScrollArea className="flex-1 overflow-auto">
            <div className="px-6 py-4">
              {activeTab === "clues" && <CluesTabContent profileId={profile.id} />}
              {activeTab === "groups" && <RelatedGroupsList profileId={profile.id} onView={openDrawerByName} />}
              {activeTab === "ioc" && <RelatedIOCList profileId={profile.id} />}
              {activeTab === "files" && <RelatedFilesList profileId={profile.id} />}
              {activeTab === "accounts" && <RelatedAccountsList profileId={profile.id} onView={openDrawerById} />}
            </div>
          </ScrollArea>
        </div>
      </div>

      <ProfileDetailDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        profile={drawerProfile}
      />
    </div>
  )
}
