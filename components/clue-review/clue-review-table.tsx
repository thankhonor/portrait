"use client"

// ====================================
// 线索审核模块 - 专用表格组件
// Clue Review Module - Dedicated Table Component
// ====================================
// 此组件仅供线索审核模块使用
// 修改此组件不会影响其他模块（线索跟进等）

import type React from "react"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDownIcon, Settings2, EyeOff, ChevronsRight, MessageSquarePlus } from "lucide-react"
import type { Clue } from "@/lib/modules/clue-review/types"
import { CascadingRiskSelector, type SelectedRiskLabel } from "@/components/clue-review/cascading-risk-selector"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { TableCell } from "@/components/ui/table"

// 定义列配置
type ColumnKey = "clueId" | "captureTime" | "customer" | "original" | "images" | "sourceInfo" | "riskInfo" | "status"

interface ColumnConfig {
  key: ColumnKey
  label: string
  width: string
  visible: boolean
}

interface ClueReviewTableProps {
  clues: Clue[]
  selectedIds: string[]
  onSelectChange: (ids: string[]) => void
  onFollowup?: (clue: Clue) => void
  onIgnore?: (clue: Clue, reason: string) => void
  onCreateEvent?: (clue: Clue) => void
  onBatchAction?: (action: "followup" | "ignore") => void
  onRestoreReview?: (clue: Clue) => void
  totalCount?: number
}

export function ClueReviewTable({
  clues,
  selectedIds,
  onSelectChange,
  onFollowup,
  onIgnore,
  onCreateEvent,
  onBatchAction,
  onRestoreReview,
  totalCount,
}: ClueReviewTableProps) {
  const { t } = useLanguage()
  const [ignoreDialogOpen, setIgnoreDialogOpen] = useState(false)
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null)
  const [ignoreReason, setIgnoreReason] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  // 风险信息反馈弹窗状态
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [feedbackClue, setFeedbackClue] = useState<Clue | null>(null)
  const [feedbackSelectedLabels, setFeedbackSelectedLabels] = useState<SelectedRiskLabel[]>([])
  const [feedbackRiskScenes, setFeedbackRiskScenes] = useState<string[]>([])
  const [feedbackRiskTags, setFeedbackRiskTags] = useState<string[]>([])

  const [columnVisibility, setColumnVisibility] = useState<Record<ColumnKey, boolean>>({
    clueId: true,
    captureTime: true,
    customer: true,
    original: true,
    images: true,
    sourceInfo: true,
    riskInfo: true,
    status: true,
  })

  // 列配置定义
  const columns: ColumnConfig[] = [
    { key: "clueId", label: t("review.clueId"), width: "w-[100px]", visible: columnVisibility.clueId },
    { key: "captureTime", label: t("review.captureTime"), width: "w-[140px]", visible: columnVisibility.captureTime },
    { key: "customer", label: t("review.customer"), width: "w-[100px]", visible: columnVisibility.customer },
    { key: "original", label: "线索原文", width: "w-[180px]", visible: columnVisibility.original },
    { key: "images", label: "图片内容", width: "w-[100px]", visible: columnVisibility.images },
    { key: "sourceInfo", label: "来源信息", width: "w-[200px]", visible: columnVisibility.sourceInfo },
    { key: "riskInfo", label: "风险信息", width: "w-[200px]", visible: columnVisibility.riskInfo },
    { key: "status", label: "状态", width: "w-[80px]", visible: columnVisibility.status },
  ]

  const visibleColumns = columns.filter((col) => col.visible)

  // 切换列可见性
  const toggleColumnVisibility = (key: ColumnKey) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === clues.length && clues.length > 0) {
      onSelectChange([])
    } else {
      onSelectChange(clues.map((c) => c.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectChange(selectedIds.filter((i) => i !== id))
    } else {
      onSelectChange([...selectedIds, id])
    }
  }

  const handleIgnoreClick = (clue: Clue) => {
    setSelectedClue(clue)
    setIgnoreReason("")
    setIgnoreDialogOpen(true)
  }

  const handleIgnoreConfirm = () => {
    if (selectedClue && onIgnore) {
      onIgnore(selectedClue, ignoreReason)
    }
    setIgnoreDialogOpen(false)
    setSelectedClue(null)
  }

  // 添加恢复审核处理函数
  const handleRestoreReviewClick = (clue: Clue) => {
    if (onRestoreReview) {
      onRestoreReview(clue)
    }
  }

  // 风险信息反馈处理函数
  const handleFeedbackClick = (clue: Clue) => {
    setFeedbackClue(clue)
    // 清空选择，让用户重新选择
    setFeedbackSelectedLabels([])
    setFeedbackDialogOpen(true)
  }

  const handleFeedbackConfirm = () => {
    if (feedbackClue) {
      // 这里可以添加回调函数来处理反馈提交
      // 目前只是关闭弹窗，实际项目中需要调用API保存反馈
      console.log("反馈提交:", {
        clueId: feedbackClue.id,
        originalRiskScene: feedbackClue.riskScene,
        originalRiskTags: feedbackClue.riskTags,
        newSelectedLabels: feedbackSelectedLabels,
      })
    }
    setFeedbackDialogOpen(false)
    setFeedbackClue(null)
  }

  // 渲染单元格内容
  const renderStatus = (status?: string, ignoreReason?: string) => {
    if (status === "pending" || !status) {
      return (
        <span
          className="inline-flex items-center rounded-md px-2 py-1 text-sm"
          style={{ backgroundColor: "#feddb6", color: "#7c5a1e" }}
        >
          待审核
        </span>
      )
    }

    if (status === "ignored") {
      const badge = (
        <span
          className="inline-flex items-center rounded-md px-2 py-1 text-sm cursor-pointer"
          style={{ backgroundColor: "#bbbfc4", color: "#4a4d51" }}
        >
          暂不关注
        </span>
      )

      if (ignoreReason) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{badge}</TooltipTrigger>
              <TooltipContent>
                <p>{ignoreReason}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }
      return badge
    }

    // 其他状态使用默认 Badge
    const statusConfig: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
      following: { label: t("status.following"), variant: "default" },
      messaged: { label: t("status.messaged"), variant: "default" },
      connected: { label: t("status.connected"), variant: "default" },
      messageFailed: { label: t("status.messageFailed"), variant: "destructive" },
    }
    const config = statusConfig[status] || { label: status, variant: "secondary" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const renderCellContent = (clue: Clue, columnKey: ColumnKey) => {
    switch (columnKey) {
      case "clueId":
        return <span className="text-sm font-mono text-primary">{clue.id}</span>
      case "captureTime":
        return <span className="text-sm text-muted-foreground">{clue.captureTime}</span>
      case "customer":
        return <span className="text-sm">{clue.customer}</span>
      case "original":
        return (
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
            <HoverCardContent className="w-80 bg-slate-900 text-white border-slate-700 p-4" side="bottom" align="start">
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
        )
      case "images":
        return clue.images && clue.images.length > 0 ? (
          <div className="flex gap-1">
            {clue.images.slice(0, 2).map((img, idx) => (
              <HoverCard key={idx} openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`证据图片 ${idx + 1}`}
                    className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-80"
                    onClick={() => setPreviewImage(img)}
                  />
                </HoverCardTrigger>
                <HoverCardContent className="w-[550px] bg-slate-900 border-slate-700 p-4" side="bottom" align="start">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <p className="text-sm font-medium mb-2" style={{ color: "#f5c201" }}>
                        {t("review.imagePreview")}
                      </p>
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`证据图片 ${idx + 1}`}
                        className="w-52 h-auto rounded object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2" style={{ color: "#f5c201" }}>
                          {t("review.chineseTranslationLabel")}
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm text-white">Temu商家中心</p>
                          <p className="text-sm text-white">店铺状态：已认证✓</p>
                          <p className="text-sm text-white">信用等级：5星</p>
                          <p className="text-sm text-white">月销售额：$50,000</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2" style={{ color: "#f5c201" }}>
                          {t("review.ocrResult")}
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm text-white">Temu商家中心</p>
                          <p className="text-sm text-white">店铺状态：已认证✓</p>
                          <p className="text-sm text-white">信用等级：5星</p>
                          <p className="text-sm text-white">月销售额：$50,000</p>
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
        )
      case "sourceInfo":
        return (
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex gap-1">
              <span className="text-muted-foreground shrink-0 w-16">发布时间：</span>
              <span>{clue.publishTime}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-muted-foreground shrink-0 w-16">发布渠道：</span>
              <span>{clue.channel}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-muted-foreground shrink-0 w-16">发布人：</span>
              <span className="font-mono">{clue.publisherId}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-muted-foreground shrink-0 w-16">平台/来源：</span>
              <span>{clue.channel}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-muted-foreground shrink-0 w-16">群组/标题：</span>
              <span className="truncate max-w-[120px]">{clue.sourceTitle || "-"}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-muted-foreground shrink-0 w-16">域名：</span>
              <span>{clue.relatedDomain || "-"}</span>
            </div>
          </div>
        )
      case "riskInfo":
        return (
          <div className="flex gap-2 text-xs">
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground shrink-0">新老团伙：</span>
                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                  {clue.isNewGang ? t("review.newGang") : t("review.oldGang")}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground shrink-0">新老内容：</span>
                <Badge variant="outline" className="bg-teal-50 text-teal-600 border-teal-200">
                  {clue.isNewContent ? t("review.newContent") : t("review.oldContent")}
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
                  {clue.riskTags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs px-2 text-gray-500 hover:text-primary hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation()
                  handleFeedbackClick(clue)
                }}
              >
                <MessageSquarePlus className="w-3 h-3 mr-1" />
                反馈
              </Button>
            </div>
          </div>
        )
      case "status":
        return renderStatus(clue.status, clue.ignoreReason)
      default:
        return null
    }
  }

  return (
    <div className="border rounded-lg bg-background flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            共 <span className="text-blue-500 font-medium">{totalCount ?? clues.length}</span> 条数据
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
                onClick={() => onBatchAction?.("followup")}
                className="hover:bg-gray-100 focus:bg-gray-100 text-black"
              >
                {t("review.followup")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onBatchAction?.("ignore")}
                className="hover:bg-gray-100 focus:bg-gray-100 text-black"
              >
                {t("review.ignore")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="border-b">
              <th className="w-[40px] px-2 py-3 text-left bg-muted">
                <Checkbox
                  checked={selectedIds.length === clues.length && clues.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </th>
              {visibleColumns.map((col) => (
                <th key={col.key} className={`${col.width} px-3 py-3 text-left text-sm font-medium bg-muted`}>
                  {col.label}
                </th>
              ))}
              <th className="w-[80px] px-2 py-3 text-center align-middle text-sm font-medium bg-muted">
                <div className="flex items-center justify-center gap-2">
                  <span>操作</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-200">
                        <Settings2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0" align="end" sideOffset={5}>
                      <div className="max-h-[300px] overflow-y-auto py-2">
                        {columns.map((col) => (
                          <div
                            key={col.key}
                            className={`flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer ${
                              !columnVisibility[col.key] ? "text-red-500" : ""
                            }`}
                            onClick={() => toggleColumnVisibility(col.key)}
                          >
                            <Checkbox
                              checked={columnVisibility[col.key]}
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
              <tr key={clue.id} className="border-b hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <Checkbox checked={selectedIds.includes(clue.id)} onCheckedChange={() => toggleSelect(clue.id)} />
                </td>
                {visibleColumns.map((col) => (
                  <TableCell key={col.key} className="px-4 py-3">
                    {renderCellContent(clue, col.key)}
                  </TableCell>
                ))}
                <td className="px-2 py-3">
                  <div className="flex flex-col gap-1.5">
                    {clue.status === "ignored" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs justify-start px-2 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 hover:text-blue-700"
                        onClick={() => onFollowup?.(clue)}
                      >
                        <ChevronsRight className="w-3.5 h-3.5 mr-1" />
                        {t("review.followup")}
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs justify-start px-2 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 hover:text-blue-700"
                          onClick={() => onFollowup?.(clue)}
                        >
                          <ChevronsRight className="w-3.5 h-3.5 mr-1" />
                          {t("review.followup")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs justify-start px-2 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 hover:text-orange-700"
                          onClick={() => handleIgnoreClick(clue)}
                        >
                          <EyeOff className="w-3.5 h-3.5 mr-1" />
                          {t("review.ignore")}
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={ignoreDialogOpen} onOpenChange={setIgnoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("review.ignore")}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={ignoreReason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIgnoreReason(e.target.value)}
            placeholder={t("review.ignoreReasonPlaceholder")}
            rows={4}
            required
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIgnoreDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleIgnoreConfirm} disabled={!ignoreReason.trim()}>
              {t("common.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 风险信息反馈弹窗 */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>场景标签反馈</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {feedbackClue && (
              <div className="text-sm text-muted-foreground mb-4 p-3 bg-muted/50 rounded-lg">
                <span className="font-medium text-foreground">线索ID：</span>
                {feedbackClue.id}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                AI 风险场景及标签
              </label>
              <div className="p-2 bg-muted/30 rounded text-sm">
                {feedbackClue?.riskScene || "-"}/{feedbackClue?.riskTags.join("、") || "-"}
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <p className="text-sm text-muted-foreground">请选择正确的风险场景和标签：</p>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  风险场景/标签类型/标签 <span className="text-red-500">*</span>
                </label>
                <CascadingRiskSelector
                  value={feedbackSelectedLabels}
                  onChange={setFeedbackSelectedLabels}
                  placeholder="请选择风险场景和标签"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button 
              onClick={handleFeedbackConfirm} 
              disabled={feedbackSelectedLabels.length === 0}
            >
              提交反馈
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
