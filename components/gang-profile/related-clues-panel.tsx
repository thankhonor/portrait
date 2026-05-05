"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Eye, Search, MessageSquare } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { RelatedClue, ClueStatistics } from "@/lib/modules/gang-profile/types"
import { mockRelatedClues, getClueStatistics } from "@/lib/modules/gang-profile/data"

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
        <text x={center} y={center - 4} textAnchor="middle" className="fill-foreground text-lg font-bold" fontSize="16">
          {total}
        </text>
        <text x={center} y={center + 10} textAnchor="middle" className="fill-muted-foreground" fontSize="9">
          线索总数
        </text>
      </svg>

      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1 text-xs">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="font-medium">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface RelatedCluesPanelProps {
  profileId: string
}

export function RelatedCluesPanel({ profileId }: RelatedCluesPanelProps) {
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

  const statItems = [
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
      {/* Statistics row */}
      <div className="grid grid-cols-7 gap-2 text-center border border-border rounded-lg p-3">
        {statItems.map((item) => (
          <div key={item.label}>
            <div className={cn("text-lg font-bold", item.color)}>{item.value}</div>
            <div className="text-[11px] text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Donut chart */}
      <div className="border border-border rounded-lg p-3">
        <DonutChart data={riskDistribution} />
      </div>

      {/* Clue list */}
      <div className="space-y-1">
        {clues.map((clue) => {
          const statusConfig = STATUS_CONFIG[clue.status]
          return (
            <div key={clue.id} className="flex items-center justify-between py-2.5 px-3 border border-border rounded-lg hover:bg-accent/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] text-blue-600 font-medium">{clue.product}</span>
                  <Search className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm font-medium">{clue.id}</span>
                  <span className={cn("inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium rounded border", statusConfig.bg, statusConfig.color)}>
                    {statusConfig.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>风险场景: {clue.riskScene}</span>
                  <span>发布渠道: {clue.channel}</span>
                  <span>发布时间: {clue.publishTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>查看历史会话</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(`/antifraud/clue-followup?clueId=${clue.id}`, "_blank")
                      }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>查看详情</TooltipContent>
                </Tooltip>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
