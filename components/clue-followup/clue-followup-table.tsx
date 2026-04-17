"use client"

import React from "react"
import { Textarea } from "@/components/ui/textarea"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  ChevronDownIcon,
  ChevronRight,
  ChevronDown,
  UserPlus,
  EyeOff,
  FileText,
  MessageSquare,
  Search,
  CheckCircle2,
  MessageCircleX,
  UserCheck,
  Settings2,
} from "lucide-react"
import type { FollowupClue } from "@/lib/modules/clue-followup/types"
import { TableCell } from "@/components/ui/table"
import { MessageCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useState } from "react"
import { StartFollowupDialog } from "./start-followup-dialog"
import { ChatWorkstation } from "./chat-workstation"

interface FlowStep {
  id: number
  title: string
  note: string // 备注信息（显示在标题下方）
  status: "completed" | "current" | "pending"
}

const getFlowSteps = (clue: FollowupClue): FlowStep[] => {
  const status = clue.status

  // 1. 待跟进状态：捕获 → 审核通过 → 跟进中 → 生成事件，当前在第2个节点
  if (status === "pending") {
    return [
      {
        id: 1,
        title: "捕获",
        note: `捕获时间：${clue.captureTime}`,
        status: "completed",
      },
      {
        id: 2,
        title: "审核通过",
        note: `审核人：${clue.reviewer}\n审核时间：${clue.reviewTime}`,
        status: "current",
      },
      {
        id: 3,
        title: "跟进中",
        note: "",
        status: "pending",
      },
      {
        id: 4,
        title: "生成事件",
        note: "",
        status: "pending",
      },
    ]
  }

  // 2. 跟进中状态：捕获 → 审核通过 → 跟进中 → 生成事件，当前在第3个节点
  if (status === "following") {
    return [
      {
        id: 1,
        title: "捕获",
        note: `捕获时间：${clue.captureTime}`,
        status: "completed",
      },
      {
        id: 2,
        title: "审核通过",
        note: `审核人：${clue.reviewer}\n审核时间：${clue.reviewTime}`,
        status: "completed",
      },
      {
        id: 3,
        title: "跟进中",
        note: `跟进人：${clue.follower || "-"}\n开始跟进时间：${clue.followStartTime || "-"}`,
        status: "current",
      },
      {
        id: 4,
        title: "生成事件",
        note: "",
        status: "pending",
      },
    ]
  }

  // 3. 暂不关注状态：捕获 → 审核通过 → 跟进中 → 结束跟进，当前在第4个节点
  if (status === "ignored") {
    return [
      {
        id: 1,
        title: "捕获",
        note: `捕获时间：${clue.captureTime}`,
        status: "completed",
      },
      {
        id: 2,
        title: "审核通过",
        note: `审核人：${clue.reviewer}\n审核时间：${clue.reviewTime}`,
        status: "completed",
      },
      {
        id: 3,
        title: "跟进中",
        note: `跟进人：${clue.follower || "-"}\n开始跟进时间：${clue.followStartTime || "-"}`,
        status: "completed",
      },
      {
        id: 4,
        title: "结束跟进",
        note: `操作人：${clue.ignoreOperator || "-"}\n操作时间：${clue.ignoreTime || "-"}\n结束原因：${clue.ignoreReason || "-"}`,
        status: "current",
      },
    ]
  }

  // 默认返回空数组
  return []
}

interface ColumnConfig {
  key: string
  label: string
  defaultVisible: boolean
}

const COLUMN_CONFIGS: ColumnConfig[] = [
  { key: "clueId", label: "线索ID", defaultVisible: false },
  { key: "captureTime", label: "捕获时间", defaultVisible: false },
  { key: "customer", label: "客户", defaultVisible: true },
  { key: "clueText", label: "线索原文", defaultVisible: true },
  { key: "imageContent", label: "图片内容", defaultVisible: true },
  { key: "sourceInfo", label: "来源信息", defaultVisible: true },
  { key: "portrait", label: "黑产画像", defaultVisible: true },
  { key: "riskInfo", label: "风险信息", defaultVisible: true },
  { key: "status", label: "状态", defaultVisible: true },
  { key: "remarks", label: "备注", defaultVisible: true },
]

export function ClueFollowupTable({
  clues,
  onStartFollowup,
  onIgnore,
  onCreateEvent,
}: {
  clues: FollowupClue[]
  onStartFollowup?: (clue: FollowupClue) => void
  onIgnore?: (clue: FollowupClue, reason: string) => void
  onCreateEvent?: (clue: FollowupClue) => void
}) {
  const { t } = useLanguage()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const [ignoreDialogOpen, setIgnoreDialogOpen] = useState(false)
  const [currentClue, setCurrentClue] = useState<FollowupClue | null>(null)
  const [ignoreReason, setIgnoreReason] = useState("")
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false)
  const [selectedClueForChat, setSelectedClueForChat] = useState<FollowupClue | null>(null)
  const [showColumnSettings, setShowColumnSettings] = useState(false)
  const [startFollowupDialogOpen, setStartFollowupDialogOpen] = useState(false)
  const [selectedClueForFollowup, setSelectedClueForFollowup] = useState<FollowupClue | null>(null)
  const [chatWorkstationOpen, setChatWorkstationOpen] = useState(false)
  const [selectedClueForWorkstation, setSelectedClueForWorkstation] = useState<FollowupClue | null>(null)

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    COLUMN_CONFIGS.reduce((acc, col) => ({ ...acc, [col.key]: col.defaultVisible }), {}),
  )

  const [editingRemarks, setEditingRemarks] = React.useState<{ [key: string]: string }>({})
  const [savingRemarks, setSavingRemarks] = React.useState<{ [key: string]: boolean }>({})
  const [focusedRemarks, setFocusedRemarks] = React.useState<string | null>(null)

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === clues.length && clues.length > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(clues.map((c) => c.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleIgnoreClick = (clue: FollowupClue) => {
    setCurrentClue(clue)
    setIgnoreReason("")
    setIgnoreDialogOpen(true)
  }

  // 打开开始跟进弹窗
  const handleStartFollowupClick = (clue: FollowupClue) => {
    setSelectedClueForFollowup(clue)
    setStartFollowupDialogOpen(true)
  }

  // 确认开始跟进
  const handleStartFollowupConfirm = (clue: FollowupClue, message: string) => {
    console.log("开始跟进:", clue.id, "留言内容:", message)
    if (onStartFollowup) {
      onStartFollowup(clue)
    }
    setStartFollowupDialogOpen(false)
    setSelectedClueForFollowup(null)
  }

  const handleIgnoreConfirm = () => {
    if (currentClue && onIgnore && ignoreReason) {
      onIgnore(currentClue, ignoreReason)
    }
    setIgnoreDialogOpen(false)
    setCurrentClue(null)
    setIgnoreReason("")
  }

  const handleRemarksChange = (clueId: string, value: string) => {
    setEditingRemarks((prev) => ({ ...prev, [clueId]: value }))
  }

  const handleRemarksSave = async (clueId: string) => {
    setSavingRemarks((prev) => ({ ...prev, [clueId]: true }))
    const newRemarks = editingRemarks[clueId] ?? ""
    console.log("[v0] 保存备注:", clueId, newRemarks)

    // 模拟 API 调用
    await new Promise((resolve) => setTimeout(resolve, 500))

    const clueIndex = clues.findIndex((c) => c.id === clueId)
    if (clueIndex !== -1) {
      clues[clueIndex].remarks = newRemarks
    }

    setSavingRemarks((prev) => ({ ...prev, [clueId]: false }))
    setFocusedRemarks(null)
    setEditingRemarks((prev) => {
      const newState = { ...prev }
      delete newState[clueId]
      return newState
    })
  }

  const renderFollowupProgress = (clue: FollowupClue) => {
    // 只有状态为"跟进中"时才显示跟进进度
    if (clue.status !== "following") {
      return null
    }

    const progressConfig: Record<string, { label: string; bgColor: string; textColor: string; icon: React.ReactNode }> =
      {
        messageFailed: {
          label: "留言失败",
          bgColor: "#fee2e2",
          textColor: "#dc2626",
          icon: <MessageCircleX className="w-3 h-3 mr-1" />,
        },
        messaged: {
          label: "已留言",
          bgColor: "#dbeafe",
          textColor: "#1e40af",
          icon: <MessageCircle className="w-3 h-3 mr-1" />,
        },
        connected: {
          label: "已建联",
          bgColor: "#dcfce7",
          textColor: "#16a34a",
          icon: <UserCheck className="w-3 h-3 mr-1" />,
        },
      }

    const config = progressConfig[clue.followStatus]
    if (!config) {
      return null
    }

    // 留言失败：悬浮显示失败原因
    if (clue.followStatus === "messageFailed") {
      return (
        <HoverCard openDelay={200} closeDelay={100}>
          <HoverCardTrigger asChild>
            <span
              className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium cursor-help"
              style={{ backgroundColor: config.bgColor, color: config.textColor }}
            >
              {config.icon}
              {config.label}
            </span>
          </HoverCardTrigger>
          <HoverCardContent className="bg-gray-900 text-white border-gray-900 px-2 py-1 rounded-md w-auto">
            <p className="text-xs whitespace-nowrap">{clue.failReason || "对方账号已关闭私信功能，无法发送留言"}</p>
          </HoverCardContent>
        </HoverCard>
      )
    }

    // 已留言、已建联：点击显示聊天工作台
    if (clue.followStatus === "messaged" || clue.followStatus === "connected") {
      return (
        <span
          className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity"
          style={{ backgroundColor: config.bgColor, color: config.textColor }}
          onClick={(e) => {
            e.stopPropagation()
            setSelectedClueForWorkstation(clue)
            setChatWorkstationOpen(true)
          }}
        >
          {config.icon}
          {config.label}
        </span>
      )
    }

    return (
      <span
        className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
        style={{ backgroundColor: config.bgColor, color: config.textColor }}
      >
        {config.icon}
        {config.label}
      </span>
    )
  }

  const renderStatus = (status?: string, ignoreReason?: string, clue?: FollowupClue) => {
    const statusConfig: Record<string, { label: string; bgColor: string; textColor: string }> = {
      pending: { label: "待跟进", bgColor: "#feddb6", textColor: "#92400e" },
      following: { label: "跟进中", bgColor: "#dbeafe", textColor: "#1e40af" },
      ignored: { label: "跟进结束", bgColor: "#bbbfc4", textColor: "#374151" },
    }
    const config = statusConfig[status || "pending"] || statusConfig.pending

    const statusBadge =
      status === "ignored" && ignoreReason ? (
        <HoverCard openDelay={200} closeDelay={100}>
          <HoverCardTrigger asChild>
            <span
              className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium cursor-pointer"
              style={{ backgroundColor: config.bgColor, color: config.textColor }}
            >
              {config.label}
            </span>
          </HoverCardTrigger>
          <HoverCardContent className="bg-gray-900 text-white border-gray-900 px-2 py-1 rounded-md w-auto">
            <p className="text-xs whitespace-nowrap">{ignoreReason}</p>
          </HoverCardContent>
        </HoverCard>
      ) : (
        <span
          className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
          style={{ backgroundColor: config.bgColor, color: config.textColor }}
        >
          {config.label}
        </span>
      )

    return (
      <div className="flex flex-col gap-1 items-start">
        {statusBadge}
        {clue && renderFollowupProgress(clue)}
      </div>
    )
  }

  return (
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              共 <span className="text-blue-500 font-medium">{clues.length}</span> 条数据
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-7 bg-transparent ${selectedIds.length === 0 ? "text-gray-400 border-gray-200 cursor-not-allowed" : ""}`}
                  disabled={selectedIds.length === 0}
                >
                  {t("common.batchOperation")} {selectedIds.length > 0 && `(${selectedIds.length})`}
                  <ChevronDownIcon className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => console.log("结束跟进")}
                  className="hover:bg-gray-100 focus:bg-gray-100 text-black"
                >
                  结束跟进
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full table-auto">
            <thead className="sticky top-0 z-10">
              <tr className="border-b">
                <th className="w-[40px] px-2 py-3 text-left text-sm font-medium bg-muted">
                  <Checkbox
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length === clues.filter((clue) => clue.status !== "ignored").length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                {/* Dedicated expand icon column header */}
                <th className="w-[50px] px-2 py-3 text-left text-sm font-medium bg-muted"></th>
                {visibleColumns.clueId && <th className="px-3 py-3 text-left text-sm font-medium bg-muted">线索ID</th>}
                {visibleColumns.captureTime && (
                  <th className="px-3 py-3 text-left text-sm font-medium bg-muted">捕获时间</th>
                )}
                {visibleColumns.customer && <th className="px-3 py-3 text-left text-sm font-medium bg-muted">客户</th>}
                {visibleColumns.clueText && (
                  <th className="px-3 py-3 text-left text-sm font-medium bg-muted">线索原文</th>
                )}
                {visibleColumns.imageContent && (
                  <th className="px-3 py-3 text-left text-sm font-medium bg-muted">图片内容</th>
                )}
                {visibleColumns.sourceInfo && (
                  <th className="px-3 py-3 text-left text-sm font-medium bg-muted">来源信息</th>
                )}
                {visibleColumns.portrait && (
                  <th className="px-3 py-3 text-left text-sm font-medium bg-muted">黑产画像</th>
                )}
                {visibleColumns.riskInfo && (
                  <th className="px-3 py-3 text-left text-sm font-medium bg-muted">风险信息</th>
                )}
                <th className="px-3 py-3 text-left text-sm font-medium bg-muted">状态</th>
                {visibleColumns.remarks && <th className="px-3 py-3 text-left text-sm font-medium bg-muted">备注</th>}
                <th className="w-[80px] px-2 py-3 text-center align-middle text-sm font-medium bg-muted">
                  <div className="flex items-center justify-center gap-2">
                    <span>操作</span>
                    <Popover open={showColumnSettings} onOpenChange={setShowColumnSettings}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-200">
                          <Settings2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-0" align="end" sideOffset={5}>
                        <div className="max-h-[300px] overflow-y-auto py-2">
                          {COLUMN_CONFIGS.map((col) => (
                            <div
                              key={col.key}
                              className={`flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer ${
                                !visibleColumns[col.key] ? "text-red-500" : ""
                              }`}
                              onClick={() => toggleColumnVisibility(col.key)}
                            >
                              <Checkbox
                                checked={visibleColumns[col.key]}
                                onCheckedChange={() => toggleColumnVisibility(col.key)}
                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                              <span className="text-sm">{col.label}</span>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {clues.map((clue) => (
                <React.Fragment key={clue.id}>
                  <tr
                    key={clue.id}
                    className={`border-b hover:bg-muted/30 transition-colors ${expandedIds.includes(clue.id) ? "bg-blue-50/50" : ""}`}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={selectedIds.includes(clue.id)} onCheckedChange={() => toggleSelect(clue.id)} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="p-0.5 rounded hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => toggleExpand(clue.id)}
                      >
                        {expandedIds.includes(clue.id) ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </td>
                    {visibleColumns.clueId && (
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-gray-500">{clue.id}</span>
                      </td>
                    )}
                    {visibleColumns.captureTime && <td className="px-4 py-3 text-sm">{clue.captureTime || "-"}</td>}
                    {visibleColumns.customer && <td className="px-4 py-3 text-sm">{clue.customer}</td>}
                    {visibleColumns.clueText && (
                      <td className="px-4 py-3">
                        <HoverCard openDelay={200} closeDelay={100}>
                          <HoverCardTrigger asChild>
                            <div className="flex flex-col gap-2 max-w-[200px]">
                              <p
                                className="text-sm text-muted-foreground cursor-pointer hover:text-gray-600"
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 4,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "normal",
                                  wordBreak: "break-all",
                                  lineHeight: "1.5",
                                }}
                              >
                                {clue.original}
                              </p>
                              <a
                                href={clue.sourceUrl || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="self-end text-xs text-blue-500 hover:text-blue-600 hover:underline transition-colors"
                              >
                                查看详情
                              </a>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent
                            className="w-80 bg-slate-900 text-white border-slate-700 p-4"
                            side="bottom"
                            align="start"
                          >
                            <div className="space-y-3">
                              <div>
                                <p className="text-yellow-400 text-sm font-medium mb-1">中文翻译：</p>
                                <p className="text-sm text-slate-200">{clue.translation || clue.original}</p>
                              </div>
                              <div>
                                <p className="text-yellow-400 text-sm font-medium mb-1">原文：</p>
                                <p className="text-sm text-slate-200">{clue.original}</p>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </td>
                    )}
                    {visibleColumns.imageContent && (
                      <TableCell className="px-4 py-3">
                        {clue.images && clue.images.length > 0 ? (
                          <div className="flex gap-2 items-center">
                            {clue.images.slice(0, 2).map((img, idx) => (
                              <HoverCard key={idx} openDelay={200} closeDelay={100}>
                                <HoverCardTrigger asChild>
                                  <img
                                    src={img || "/placeholder.svg"}
                                    alt={`线索图片 ${idx + 1}`}
                                    className="w-12 h-12 object-cover rounded cursor-pointer border hover:border-primary transition-colors"
                                  />
                                </HoverCardTrigger>
                                <HoverCardContent
                                  className="w-[500px] bg-slate-900 text-white border-slate-700 p-0 overflow-hidden"
                                  side="right"
                                  align="start"
                                >
                                  <div className="flex">
                                    {/* 左侧图片预览 */}
                                    <div className="w-[200px] bg-slate-800 p-3 flex flex-col">
                                      <p className="text-yellow-400 text-sm font-medium mb-2">图片预览:</p>
                                      <div className="relative flex-1 flex items-center justify-center">
                                        <img
                                          src={img || "/placeholder.svg"}
                                          alt="预览"
                                          className="max-w-full max-h-[200px] object-contain rounded"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black/50 rounded-full p-1">
                                          <Search className="w-4 h-4 text-white" />
                                        </div>
                                      </div>
                                    </div>
                                    {/* 右侧文字内容 */}
                                    <div className="flex-1 p-3 space-y-3">
                                      <div>
                                        <p className="text-yellow-400 text-sm font-medium mb-1">中文翻译:</p>
                                        <div className="text-sm text-slate-200 space-y-0.5">
                                          <p>Temu商家中心</p>
                                          <p>店铺状态：已认证✓</p>
                                          <p>信用等级：5星</p>
                                          <p>月销售额：$50,000</p>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-yellow-400 text-sm font-medium mb-1">OCR识别结果:</p>
                                        <div className="text-sm text-slate-200 space-y-0.5">
                                          <p>Temu商家中心</p>
                                          <p>店铺状态：已认证✓</p>
                                          <p>信用等级：5星</p>
                                          <p>月销售额：$50,000</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            ))}
                            {clue.images.length > 2 && (
                              <span className="text-xs text-muted-foreground self-end">+{clue.images.length - 2}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">无</span>
                        )}
                      </TableCell>
                    )}
                    {visibleColumns.sourceInfo && (
                      <TableCell className="px-4 py-3">
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="flex gap-1">
                            <span className="text-muted-foreground shrink-0 w-16">发布时间：</span>
                            <span>{clue.publishTime || "2024-12-24 06:15:22"}</span>
                          </div>
                          <div className="flex gap-1">
                            <span className="text-muted-foreground shrink-0 w-16">发布渠道：</span>
                            <span>{clue.channel || "Telegram"}</span>
                          </div>
                          <div className="flex gap-1">
                            <span className="text-muted-foreground shrink-0 w-16">发布人：</span>
                            <span className="font-mono">{clue.publisherId || "@card_seller_888"}</span>
                          </div>
                          <div className="flex gap-1">
                            <span className="text-muted-foreground shrink-0 w-16">平台/来源：</span>
                            <span>{clue.channel || "Telegram"}</span>
                          </div>
                          <div className="flex gap-1">
                            <span className="text-muted-foreground shrink-0 w-16">群组/标题：</span>
                            <span className="truncate max-w-[120px]">{clue.sourceTitle || "暗网市场频道"}</span>
                          </div>
                          <div className="flex gap-1">
                            <span className="text-muted-foreground shrink-0 w-16">域名：</span>
                            <span>{clue.relatedDomain || "amazon.com"}</span>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.portrait && (
                      <TableCell className="px-4 py-3">
                        <div className="flex flex-col items-start">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs text-purple-600 border-purple-300 hover:bg-purple-50 hover:text-purple-700 bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedClueForChat(clue)
                              setChatHistoryOpen(true)
                            }}
                          >
                            <MessageSquare className="w-3.5 h-3.5 mr-1" />
                            历史会话
                          </Button>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.riskInfo && (
                      <TableCell className="px-4 py-3">
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground shrink-0">新老团伙：</span>
                            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                              {clue.gangType === "new" ? "新团伙" : "老团伙"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground shrink-0">新老内容：</span>
                            <Badge variant="outline" className="bg-teal-50 text-teal-600 border-teal-200">
                              {clue.contentType === "new" ? "新内容" : "老内容"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground shrink-0">风险场景：</span>
                            <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                              {clue.riskScene}
                            </Badge>
                          </div>
                          <div className="flex items-start gap-1">
                            <span className="text-muted-foreground shrink-0">风险标签：</span>
                            <div className="flex flex-wrap gap-1">
                              {clue.riskTags?.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-blue-50 text-blue-600 border-blue-200"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    <td className="px-4 py-3">{renderStatus(clue.status, clue.ignoreReason, clue)}</td>
                    {visibleColumns.remarks && (
                      <td className="px-4 py-3">
                        <div>
                          <Textarea
                            placeholder="添加备注"
                            value={
                              editingRemarks[clue.id] !== undefined ? editingRemarks[clue.id] : (clue.remarks ?? "")
                            }
                            onChange={(e) => handleRemarksChange(clue.id, e.target.value)}
                            onFocus={() => setFocusedRemarks(clue.id)}
                            onBlur={() => {
                              if (editingRemarks[clue.id] !== undefined && editingRemarks[clue.id] !== clue.remarks) {
                                handleRemarksSave(clue.id)
                              } else {
                                setFocusedRemarks(null)
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                e.currentTarget.blur()
                              }
                            }}
                            maxLength={50}
                            className={`w-[18ch] text-xs placeholder:text-xs resize-none break-words whitespace-normal focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black ${focusedRemarks === clue.id ? "text-black" : "text-gray-500"}`}
                            disabled={savingRemarks[clue.id]}
                            rows={5}
                          />
                        </div>
                      </td>
                    )}
                    <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs justify-start px-2 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 hover:text-blue-700 disabled:opacity-50"
                          onClick={() => handleStartFollowupClick(clue)}
                          disabled={clue.status === "ignored"}
                        >
                          <UserPlus className="w-3.5 h-3.5 mr-1" />
                          开始跟进
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs justify-start px-2 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 hover:text-orange-700 disabled:opacity-50"
                          onClick={() => handleIgnoreClick(clue)}
                          disabled={clue.status === "ignored"}
                        >
                          <EyeOff className="w-3.5 h-3.5 mr-1" />
                          结束跟进
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs justify-start px-2 bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-700 disabled:opacity-50"
                          onClick={() => onCreateEvent?.(clue)}
                          disabled={clue.status === "ignored"}
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          生成事件
                        </Button>
                      </div>
                    </td>
                  </tr>
                  {/* 展开行 */}
                  {expandedIds.includes(clue.id) && (
                    <tr className="bg-muted/30">
                      <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 4} className="px-4 py-4">
                        <div className="grid grid-cols-1 gap-4">
                          {/* 流转信息 */}
                          <div className="border border-border rounded-md bg-white p-4">
                            <h4 className="text-sm font-medium mb-3 text-foreground">流转信息</h4>
                            <div className="relative">
                              {/* 步骤条 */}
                              <div className="flex items-start">
                                {getFlowSteps(clue).map((step, index, arr) => (
                                  <div key={step.id} className="flex-1 relative">
                                    <div className="flex items-center">
                                      {/* 圆形步骤图标 */}
                                      <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 z-10 ${
                                          step.status === "completed"
                                            ? "bg-blue-500 border-blue-500 text-white"
                                            : step.status === "current"
                                              ? "bg-white border-blue-500 text-blue-500"
                                              : "bg-white border-gray-300 text-gray-400"
                                        }`}
                                      >
                                        {step.status === "completed" ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                                      </div>
                                      {/* 连接线 */}
                                      {index < arr.length - 1 && (
                                        <div
                                          className={`flex-1 h-0.5 ${
                                            step.status === "completed" ? "bg-blue-500" : "bg-gray-300"
                                          }`}
                                        />
                                      )}
                                    </div>
                                    {/* 步骤标题和备注 */}
                                    <div className="mt-2 pr-2">
                                      <div
                                        className={`text-sm font-medium ${
                                          step.status === "current"
                                            ? "text-blue-500"
                                            : step.status === "completed"
                                              ? "text-foreground"
                                              : "text-gray-400"
                                        }`}
                                      >
                                        {step.title}
                                      </div>
                                      {step.note && (
                                        <div
                                          className={`text-xs mt-1 leading-relaxed whitespace-pre-line ${
                                            step.status === "pending" ? "text-gray-400" : "text-gray-500"
                                          }`}
                                        >
                                          {step.note}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <Dialog open={ignoreDialogOpen} onOpenChange={setIgnoreDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>结束跟进</DialogTitle>
              <DialogDescription>请选择结束跟进的原因（必选）</DialogDescription>
            </DialogHeader>
            <Select value={ignoreReason} onValueChange={setIgnoreReason}>
              <SelectTrigger>
                <SelectValue placeholder="请选择结束原因..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="无效线索">无效线索</SelectItem>
                <SelectItem value="重复线索">重复线索</SelectItem>
                <SelectItem value="已处理完毕">已处理完毕</SelectItem>
                <SelectItem value="暂无资源跟进">暂无资源跟进</SelectItem>
                <SelectItem value="其他原因">其他原因</SelectItem>
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIgnoreDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleIgnoreConfirm} disabled={!ignoreReason}>
                确认
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 图片预览对话框 */}
        <Dialog open={!!selectedClueForChat} onOpenChange={() => setSelectedClueForChat(null)}>
          <DialogContent className="max-w-3xl">
            {selectedClueForChat && (
              <img src={selectedClueForChat.images?.[0] || ""} alt="预览" className="w-full h-auto" />
            )}
          </DialogContent>
        </Dialog>

        {/* 开始跟进弹窗 */}
        <StartFollowupDialog
          open={startFollowupDialogOpen}
          onOpenChange={setStartFollowupDialogOpen}
          clue={selectedClueForFollowup}
          onConfirm={handleStartFollowupConfirm}
        />

        {/* 聊天工作台 */}
        <ChatWorkstation
          open={chatWorkstationOpen}
          onOpenChange={setChatWorkstationOpen}
          clue={selectedClueForWorkstation}
        />
      </div>
    </>
  )
}
