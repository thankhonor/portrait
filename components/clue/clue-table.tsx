"use client"

import React, { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
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
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, ChevronDownIcon, ChevronRight, ChevronDown } from "lucide-react"
import type { Clue } from "@/lib/mock-data"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { TableCell } from "@/components/ui/table"

interface ClueTableProps {
  clues: Clue[]
  type: "review" | "followup"
  selectedIds: string[]
  onSelectChange: (ids: string[]) => void
  onFollowup?: (clue: Clue) => void
  onIgnore?: (clue: Clue, reason: string) => void
  onCreateEvent?: (clue: Clue) => void
  onStartFollow?: (clue: Clue) => void
  onBatchAction?: (action: "followup" | "ignore" | "createEvent") => void
  totalCount?: number
}

export function ClueTable({
  clues,
  type,
  selectedIds,
  onSelectChange,
  onFollowup,
  onIgnore,
  onCreateEvent,
  onStartFollow,
  onBatchAction,
  totalCount,
}: ClueTableProps) {
  const { t } = useLanguage()
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const [ignoreDialogOpen, setIgnoreDialogOpen] = useState(false)
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null)
  const [ignoreReason, setIgnoreReason] = useState("")
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [detailClue, setDetailClue] = useState<Clue | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
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

  const handleViewDetail = (clue: Clue) => {
    setDetailClue(clue)
    setDetailDialogOpen(true)
  }

  const renderStatus = (status?: string, ignoreReason?: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
      pending: { label: "待审核", variant: "secondary" },
      following: { label: t("status.following"), variant: "default" },
      messaged: { label: t("status.messaged"), variant: "default" },
      connected: { label: t("status.connected"), variant: "default" },
      messageFailed: { label: t("status.messageFailed"), variant: "destructive" },
      ignored: { label: "暂不关注", variant: "outline" },
    }
    const config = statusConfig[status || "pending"] || statusConfig.pending

    if (status === "ignored" && ignoreReason) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={config.variant} className="cursor-pointer">
                {config.label}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{ignoreReason}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return <Badge variant={config.variant}>{config.label}</Badge>
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
              <DropdownMenuItem
                onClick={() => onBatchAction?.("createEvent")}
                className="hover:bg-gray-100 focus:bg-gray-100 text-black"
              >
                {t("review.createEvent")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button variant="outline" size="sm" className="h-7 bg-transparent">
          <Download className="w-4 h-4 mr-1" />
          {t("common.export")}
        </Button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full table-fixed">
          <thead className="sticky top-0 z-10">
            <tr className="border-b">
              <th className="w-[40px] px-2 py-3 text-left bg-muted">
                <Checkbox
                  checked={selectedIds.length === clues.length && clues.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </th>
              <th className="w-[100px] px-3 py-3 text-left text-sm font-medium bg-muted">{t("review.clueId")}</th>
              {type === "review" && (
                <th className="w-[140px] px-3 py-3 text-left text-sm font-medium bg-muted">
                  {t("review.captureTime")}
                </th>
              )}
              <th className="w-[100px] px-3 py-3 text-left text-sm font-medium bg-muted">{t("review.customer")}</th>
              <th className="w-[180px] px-3 py-3 text-left text-sm font-medium bg-muted">线索原文</th>
              <th className="w-[100px] px-3 py-3 text-left text-sm font-medium bg-muted">图片内容</th>
              {type === "review" && (
                <th className="w-[200px] px-3 py-3 text-left text-sm font-medium bg-muted">来源信息</th>
              )}
              <th className="w-[200px] px-3 py-3 text-left text-sm font-medium bg-muted">风险信息</th>
              <th className="w-[80px] px-3 py-3 text-left text-sm font-medium bg-muted">状态</th>
              <th className="w-[80px] px-2 py-3 text-center align-middle text-sm font-medium bg-muted">操作</th>
            </tr>
          </thead>
          <tbody>
            {clues.map((clue) => (
              <React.Fragment key={clue.id}>
                <tr
                  key={clue.id}
                  className={`border-b hover:bg-muted/30 transition-colors ${
                    type === "followup" ? "cursor-pointer" : ""
                  } ${expandedIds.includes(clue.id) && type === "followup" ? "bg-blue-50/50" : ""}`}
                  onClick={() => type === "followup" && toggleExpand(clue.id)}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={selectedIds.includes(clue.id)} onCheckedChange={() => toggleSelect(clue.id)} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {type === "followup" &&
                        (expandedIds.includes(clue.id) ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        ))}
                      <span className="text-sm font-mono text-primary">{clue.id}</span>
                    </div>
                  </td>
                  {type === "review" && <td className="px-4 py-3 text-sm text-muted-foreground">{clue.captureTime}</td>}
                  <td className="px-4 py-3 text-sm">{clue.customer}</td>
                  <td className="px-4 py-3">
                    <HoverCard openDelay={200} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <div className="flex flex-col gap-2 max-w-[200px]">
                          <p className="text-sm cursor-pointer hover:text-primary">{clue.original}</p>
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
                  <TableCell>
                    {clue.images && clue.images.length > 0 ? (
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
                            <HoverCardContent
                              className="w-[550px] bg-slate-900 border-slate-700 p-4"
                              side="bottom"
                              align="start"
                            >
                              <div className="flex gap-6">
                                {/* 左侧：图片预览 */}
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
                                {/* 右侧：中文翻译和OCR识别结果 */}
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
                    )}
                  </TableCell>
                  {type === "review" && (
                    <TableCell className="px-4 py-3">
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex">
                          <span className="text-muted-foreground shrink-0 w-20">发布时间：</span>
                          <span>{clue.publishTime}</span>
                        </div>
                        <div className="flex">
                          <span className="text-muted-foreground shrink-0 w-20">发布渠道：</span>
                          <span>{clue.channel}</span>
                        </div>
                        <div className="flex">
                          <span className="text-muted-foreground shrink-0 w-20">发布人：</span>
                          <span className="font-mono">{clue.publisherId}</span>
                        </div>
                        <div className="flex">
                          <span className="text-muted-foreground shrink-0 w-20">平台/来源：</span>
                          <span>{clue.channel}</span>
                        </div>
                        <div className="flex">
                          <span className="text-muted-foreground shrink-0 w-20">群组/标题：</span>
                          <span className="truncate max-w-[120px]">{clue.sourceTitle || "-"}</span>
                        </div>
                        <div className="flex">
                          <span className="text-muted-foreground shrink-0 w-20">域名：</span>
                          <span>{clue.relatedDomain || "-"}</span>
                        </div>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="px-4 py-3">
                    <div className="flex flex-col gap-1 text-xs">
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
                  </TableCell>
                  <td className="px-4 py-3">{renderStatus(clue.status, clue.ignoreReason)}</td>
                  <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col gap-0.5">
                      <Button
                        variant="link"
                        size="sm"
                        className="h-6 text-xs w-full"
                        onClick={() => onFollowup?.(clue)}
                        disabled={clue.status === "ignored"}
                      >
                        {t("review.followup")}
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-6 text-xs w-full"
                        onClick={() => handleIgnoreClick(clue)}
                        disabled={clue.status === "ignored"}
                      >
                        {t("review.ignore")}
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-6 text-xs w-full"
                        onClick={() => onCreateEvent?.(clue)}
                        disabled={clue.status === "ignored"}
                      >
                        {t("review.createEvent")}
                      </Button>
                    </div>
                  </td>
                </tr>
                {type === "followup" && expandedIds.includes(clue.id) && (
                  <tr key={`${clue.id}-expanded`} className="bg-gray-100">
                    <td colSpan={8} className="px-4 py-4">
                      <div className="grid grid-cols-2 gap-6">
                        {/* 左侧来源信息 */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                          <h4 className="text-sm font-medium text-foreground">来源信息</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex">
                              <span className="w-28 text-muted-foreground shrink-0">发布时间：</span>
                              <span>{clue.publishTime}</span>
                            </div>
                            <div className="flex">
                              <span className="w-28 text-muted-foreground shrink-0">发布渠道：</span>
                              <span>{clue.channel}</span>
                            </div>
                            <div className="flex">
                              <span className="w-28 text-muted-foreground shrink-0">发布人：</span>
                              <span className="font-mono">{clue.publisherId}</span>
                            </div>
                            <div className="flex">
                              <span className="w-28 text-muted-foreground shrink-0">平台/来源：</span>
                              <span>{clue.channel}</span>
                            </div>
                            <div className="flex">
                              <span className="w-28 text-muted-foreground shrink-0">群组/标题：</span>
                              <span>{clue.sourceTitle || "-"}</span>
                            </div>
                            <div className="flex">
                              <span className="w-28 text-muted-foreground shrink-0">域名：</span>
                              <span>{clue.relatedDomain || "-"}</span>
                            </div>
                          </div>
                        </div>
                        {/* 右侧基础信息 */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                          <h4 className="text-sm font-medium text-foreground">基础信息</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex">
                              <span className="w-28 text-muted-foreground shrink-0">捕获时间：</span>
                              <span>{clue.captureTime}</span>
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

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>线索详情 - {detailClue?.id}</DialogTitle>
            <DialogDescription>线索原文来源信息</DialogDescription>
          </DialogHeader>
          {detailClue && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">线索原文</h4>
                <div className="bg-muted rounded-lg p-4">
                  <p className="whitespace-pre-wrap">{detailClue.original}</p>
                  {detailClue.translation && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-1">翻译:</p>
                      <p className="whitespace-pre-wrap">{detailClue.translation}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">来源信息</h4>
                <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex">
                    <span className="w-24 text-muted-foreground shrink-0">发布渠道:</span>
                    <span>{detailClue.channel}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-muted-foreground shrink-0">发布人:</span>
                    <span className="font-mono">{detailClue.publisherId}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-muted-foreground shrink-0">发布群组:</span>
                    <span>{detailClue.sourceTitle || "-"}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-muted-foreground shrink-0">发布时间:</span>
                    <span>{detailClue.publishTime}</span>
                  </div>
                  {detailClue.sourceUrl && (
                    <div className="flex">
                      <span className="w-24 text-muted-foreground shrink-0">原网页:</span>
                      <a
                        href={detailClue.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {detailClue.sourceUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              {detailClue.images.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">相关图片</h4>
                  <div className="flex gap-3 flex-wrap">
                    {detailClue.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border"
                      >
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`证据图片 ${idx + 1}`}
                          className="w-10 h-10 object-cover rounded cursor-pointer hover:opacity-80"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
