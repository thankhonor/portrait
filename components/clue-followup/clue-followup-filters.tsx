"use client"

import { DialogDescription } from "@/components/ui/dialog"
import { useState, useCallback, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, RotateCcw, CalendarIcon, Star, X, Save, XCircle } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import type { ClueFollowupFilters as ClueFollowupFiltersType } from "@/lib/modules/clue-followup/types"
import { MessageToast } from "./message-toast"
import { RiskLabelSelector } from "./risk-label-selector"
import { ClearableSelect } from "./clearable-select"
import { MultiSelectRiskScene } from "./multi-select-risk-scene"
import { cn } from "@/lib/utils"

// ====================================
// 线索跟进模块 - 筛选组件
// Clue Followup Module - Filters Component
// ====================================

interface ClueFollowupFiltersProps {
  onSearch?: () => void
  onReset?: () => void
}

interface ClueFollowupFiltersComponentProps {
  filters: ClueFollowupFiltersType
  onFiltersChange: (filters: ClueFollowupFiltersType) => void
  onSearch?: () => void
  onReset?: () => void
}

const customerFilterOptions = ["AMAZON", "TIKTOKSHOP", "TIKTOK", "SHEIN", "ICBU", "ALIEXPRESS", "LAZADA", "VINTED"]
const channelOptions = ["Telegram", "Discord", "微信群", "QQ群", "暗网论坛"]
const riskSceneOptions = ["账号盗用", "虚假交易", "信息窃取", "提供礼品卡交易服务"]
const followupProgressOptions = ["留言失败", "已留言", "已建联"]

interface FilterView {
  id: string
  name: string
  isDefault: boolean
  filters: ClueFollowupFiltersType
  syncedToReview?: boolean
  syncSourceId?: string // ID of the original view if this is a synced copy
}

const initialViews: FilterView[] = [
  {
    id: "base",
    name: "基础视图",
    isDefault: true,
    filters: {
      searchText: "",
      startDate: "",
      endDate: "",
      customer: "",
      channel: "",
      status: "",
      gangType: "",
      contentType: "",
      riskScene: "",
      riskScenes: [],
      riskTags: [],
      followupProgress: "",
      channelOptions: ["Telegram", "Discord", "微信群", "QQ群", "暗网论坛"],
      riskSceneOptions: ["账号盗用", "虚假交易", "信息窃取", "提供礼品卡交易服务"],
    },
  },
]

const VIEWS_STORAGE_KEY = "clue-followup-views"
const ACTIVE_VIEW_STORAGE_KEY = "clue-followup-active-view"
const REVIEW_VIEWS_STORAGE_KEY = "clue-review-views"

export function ClueFollowupFilters({ onSearch, onReset }: ClueFollowupFiltersProps) {
  const [filters, setFilters] = useState<ClueFollowupFiltersType>({
    searchText: "",
    startDate: "",
    endDate: "",
    customer: "",
    channel: "",
    status: "",
    gangType: "",
    contentType: "",
    riskScene: "",
    riskScenes: [],
    riskTags: [],
    followupProgress: "",
    channelOptions: ["Telegram", "Discord", "微信群", "QQ群", "暗网论坛"],
    riskSceneOptions: ["账号盗用", "虚假交易", "信息窃取", "提供礼品卡交易服务"],
  })

  return (
    <ClueFollowupFiltersComponent
      filters={filters}
      onFiltersChange={setFilters}
      onSearch={onSearch}
      onReset={onReset}
    />
  )
}

export function ClueFollowupFiltersComponent({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
}: ClueFollowupFiltersComponentProps) {
  const [views, setViews] = useState<FilterView[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(VIEWS_STORAGE_KEY)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return initialViews
        }
      }
    }
    return initialViews
  })

  const [activeViewId, setActiveViewId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(ACTIVE_VIEW_STORAGE_KEY)
      if (saved) {
        return saved
      }
    }
    return "base"
  })

  const [newViewDialogOpen, setNewViewDialogOpen] = useState(false)
  const [newViewName, setNewViewName] = useState("")
  const [newViewIsDefault, setNewViewIsDefault] = useState(false)
  const [newViewSyncToReview, setNewViewSyncToReview] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [renameViewId, setRenameViewId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteViewId, setDeleteViewId] = useState<string | null>(null)
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error"
    message: string
    visible: boolean
  }>({
    type: "success",
    message: "",
    visible: false,
  })
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null)

  const activeView = views.find((v) => v.id === activeViewId)

  const hasUnsavedChanges = useCallback(() => {
    if (!activeView) return false
    const savedFilters = activeView.filters
    return (
      filters.searchText !== savedFilters.searchText ||
      filters.startDate !== savedFilters.startDate ||
      filters.endDate !== savedFilters.endDate ||
      filters.customer !== savedFilters.customer ||
      filters.channel !== savedFilters.channel ||
      filters.status !== savedFilters.status ||
      filters.gangType !== savedFilters.gangType ||
      filters.contentType !== savedFilters.contentType ||
      JSON.stringify(filters.riskScenes || []) !== JSON.stringify(savedFilters.riskScenes || []) ||
      JSON.stringify(filters.riskTags) !== JSON.stringify(savedFilters.riskTags) ||
      filters.followupProgress !== savedFilters.followupProgress
    )
  }, [activeView, filters])

  const saveCurrentFilters = () => {
    return { ...filters }
  }

  const handleViewSwitch = (viewId: string) => {
    if (viewId === activeViewId) return

    const switchAction = () => {
      const targetView = views.find((v) => v.id === viewId)
      if (targetView) {
        setActiveViewId(viewId)
        onFiltersChange({ ...targetView.filters })
      }
    }

    if (hasUnsavedChanges() && activeViewId !== "base") {
      setPendingAction(() => switchAction)
      setUnsavedDialogOpen(true)
    } else {
      switchAction()
    }
  }

  const handleSaveView = () => {
    if (activeViewId === "base") {
      setNewViewName("")
      setNewViewIsDefault(false)
      setNewViewSyncToReview(false)
      setContextMenuPosition(null)
      setNewViewDialogOpen(true)
    } else {
      const currentView = views.find((v) => v.id === activeViewId)
      try {
        const updatedFilters = saveCurrentFilters()
        setViews((prev) => prev.map((v) => (v.id === activeViewId ? { ...v, filters: updatedFilters } : v)))

        if (currentView?.syncedToReview) {
          const reviewViewsStr = localStorage.getItem(REVIEW_VIEWS_STORAGE_KEY)
          if (reviewViewsStr) {
            try {
              const reviewViews = JSON.parse(reviewViewsStr)
              const updatedReviewViews = reviewViews.map((v: FilterView) =>
                v.syncSourceId === activeViewId ? { ...v, filters: updatedFilters } : v,
              )
              localStorage.setItem(REVIEW_VIEWS_STORAGE_KEY, JSON.stringify(updatedReviewViews))
            } catch {}
          }
        }

        showToast("success", `视图"${currentView?.name || ""}"更新成功`)
      } catch {
        showToast("error", `视图"${currentView?.name || ""}"更新失败`)
      }
    }
  }

  const handleCreateView = () => {
    if (!newViewName.trim()) return

    const newView: FilterView = {
      id: `view-${Date.now()}`,
      name: newViewName.trim(),
      isDefault: newViewIsDefault,
      filters: saveCurrentFilters(),
      syncedToReview: newViewSyncToReview,
    }

    setViews((prev) => {
      let updatedViews = [...prev, newView]
      if (newViewIsDefault) {
        updatedViews = updatedViews.map((v) => ({
          ...v,
          isDefault: v.id === newView.id,
        }))
      }
      return updatedViews
    })

    if (newViewSyncToReview) {
      const reviewViewsStr = localStorage.getItem(REVIEW_VIEWS_STORAGE_KEY)
      let reviewViews: FilterView[] = []
      if (reviewViewsStr) {
        try {
          reviewViews = JSON.parse(reviewViewsStr)
        } catch {}
      }

      const syncedView: FilterView = {
        id: `synced-${newView.id}`,
        name: newView.name,
        isDefault: false,
        filters: newView.filters,
        syncSourceId: newView.id,
      }
      reviewViews.push(syncedView)
      localStorage.setItem(REVIEW_VIEWS_STORAGE_KEY, JSON.stringify(reviewViews))
    }

    setActiveViewId(newView.id)
    setNewViewDialogOpen(false)
  }

  const handleDoubleClick = (viewId: string, viewName: string) => {
    if (viewId === "base") return
    setRenameViewId(viewId)
    setRenameValue(viewName)
    setRenameDialogOpen(true)
  }

  const handleRename = () => {
    if (!renameViewId || !renameValue.trim()) return

    const viewToRename = views.find((v) => v.id === renameViewId)

    if (viewToRename?.syncedToReview) {
      const reviewViewsStr = localStorage.getItem(REVIEW_VIEWS_STORAGE_KEY)
      if (reviewViewsStr) {
        try {
          const reviewViews = JSON.parse(reviewViewsStr)
          const updatedReviewViews = reviewViews.map((v: FilterView) =>
            v.syncSourceId === renameViewId ? { ...v, name: renameValue.trim() } : v,
          )
          localStorage.setItem(REVIEW_VIEWS_STORAGE_KEY, JSON.stringify(updatedReviewViews))
        } catch {}
      }
    }

    if (viewToRename?.syncSourceId) {
      const reviewViewsStr = localStorage.getItem(REVIEW_VIEWS_STORAGE_KEY)
      if (reviewViewsStr) {
        try {
          const reviewViews = JSON.parse(reviewViewsStr)
          const updatedReviewViews = reviewViews.map((v: FilterView) =>
            v.id === viewToRename.syncSourceId ? { ...v, name: renameValue.trim() } : v,
          )
          localStorage.setItem(REVIEW_VIEWS_STORAGE_KEY, JSON.stringify(updatedReviewViews))
        } catch {}
      }
    }

    setViews((prev) => prev.map((v) => (v.id === renameViewId ? { ...v, name: renameValue.trim() } : v)))
    setRenameDialogOpen(false)
    setRenameViewId(null)
  }

  const handleSetDefault = (viewId: string) => {
    const setDefaultAction = () => {
      const viewName = views.find((v) => v.id === viewId)?.name || ""
      setViews((prev) =>
        prev.map((v) => ({
          ...v,
          isDefault: v.id === viewId,
        })),
      )
      showMessage("success", `视图"${viewName}"已设为默认视图`)
    }

    if (hasUnsavedChanges() && activeViewId !== "base") {
      setPendingAction(() => setDefaultAction)
      setUnsavedDialogOpen(true)
    } else {
      setDefaultAction()
    }
  }

  const handleDeleteView = (viewId: string) => {
    setDeleteViewId(viewId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!deleteViewId) return
    const deletedView = views.find((v) => v.id === deleteViewId)

    if (deletedView?.syncedToReview) {
      const reviewViewsStr = localStorage.getItem(REVIEW_VIEWS_STORAGE_KEY)
      if (reviewViewsStr) {
        try {
          const reviewViews = JSON.parse(reviewViewsStr)
          const filteredReviewViews = reviewViews.filter((v: FilterView) => v.syncSourceId !== deleteViewId)
          localStorage.setItem(REVIEW_VIEWS_STORAGE_KEY, JSON.stringify(filteredReviewViews))
        } catch {}
      }
    }

    setViews((prev) => {
      const filtered = prev.filter((v) => v.id !== deleteViewId)
      if (deletedView?.isDefault) {
        return filtered.map((v) => (v.id === "base" ? { ...v, isDefault: true } : v))
      }
      return filtered
    })
    if (activeViewId === deleteViewId) {
      setActiveViewId("base")
      const baseView = views.find((v) => v.id === "base")
      if (baseView) {
        onFiltersChange(baseView.filters)
      }
    }
    setDeleteDialogOpen(false)
    setDeleteViewId(null)
  }

  const handleUnsavedConfirm = (save: boolean) => {
    if (save && activeViewId !== "base") {
      setViews((prev) => prev.map((v) => (v.id === activeViewId ? { ...v, filters: saveCurrentFilters() } : v)))
    }
    if (pendingAction) {
      pendingAction()
    }
    setUnsavedDialogOpen(false)
    setPendingAction(null)
  }

  const handleReset = () => {
    onFiltersChange({
      searchText: "",
      startDate: "",
      endDate: "",
      customer: "",
      channel: "",
      status: "",
      gangType: "",
      contentType: "",
      riskScene: "",
      riskScenes: [],
      riskTags: [],
      followupProgress: "",
      channelOptions: ["Telegram", "Discord", "微信群", "QQ群", "暗网论坛"],
      riskSceneOptions: ["账号盗用", "虚假交易", "信息窃取", "提供礼品卡交易服务"],
    })
    onReset?.()
  }

  const handleSearch = () => {
    onSearch?.()
  }

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToastMessage({ type, message, visible: true })
    setTimeout(() => {
      setToastMessage((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }, [])

  const showMessage = (type: "success" | "error", message: string) => {
    setToastMessage({ type, message, visible: true })
    setTimeout(() => {
      setToastMessage((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }

  const isFollowupProgressEnabled = filters.status === "following"

  useEffect(() => {
    localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify(views))
  }, [views])

  useEffect(() => {
    localStorage.setItem(ACTIVE_VIEW_STORAGE_KEY, activeViewId)
  }, [activeViewId])

  useEffect(() => {
    const activeView = views.find((v) => v.id === activeViewId)
    if (activeView) {
      onFiltersChange(activeView.filters)
    }
  }, []) // Only run once on mount

  const sortedViews = useMemo(() => {
    const baseView = views.find((v) => v.id === "base")
    const syncedViews = views.filter((v) => v.id !== "base" && v.syncedToReview)
    const otherViews = views.filter((v) => v.id !== "base" && !v.syncedToReview)
    return [baseView, ...syncedViews, ...otherViews].filter(Boolean) as FilterView[]
  }, [views])

  return (
    <div className="space-y-3">
      <MessageToast
        type={toastMessage.type}
        message={toastMessage.message}
        visible={toastMessage.visible}
        onClose={() => setToastMessage((prev) => ({ ...prev, visible: false }))}
      />

      {/* 视图管理区域 */}
      <div className="p-3 bg-white rounded-lg border border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground mr-1">视图:</span>
          {sortedViews.map((view) => (
            <div
              key={view.id}
              className={`group relative flex items-center gap-1 px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
                activeViewId === view.id
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent"
              }`}
              onClick={() => handleViewSwitch(view.id)}
              onDoubleClick={() => handleDoubleClick(view.id, view.name)}
            >
              {view.isDefault ? (
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ) : (
                <Star
                  className="h-3 w-3 text-gray-400 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSetDefault(view.id)
                  }}
                />
              )}
              <span>{view.name}</span>
              {view.id !== "base" && (
                <X
                  className="h-3 w-3 text-gray-400 hover:text-red-500 ml-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteView(view.id)
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 筛选区域 */}
      <div className="p-3 bg-background rounded-lg border border-border">
        <div className="flex flex-wrap gap-2 items-center">
          {/* 1. 线索ID/发布人/线索内容 */}
          <div
            className="relative w-[220px] group"
            onMouseEnter={() => setHoveredFilter("searchText")}
            onMouseLeave={() => setHoveredFilter(null)}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="线索ID/发布人/线索内容"
              className={cn(
                "h-10 pl-9 pr-9 w-full rounded-lg text-sm focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-300 focus:border-gray-300 focus:outline-none hover:bg-gray-100/50",
                filters.searchText ? "border-blue-400 bg-blue-50/50" : "border-gray-300",
              )}
              value={filters.searchText}
              onChange={(e) => onFiltersChange({ ...filters, searchText: e.target.value })}
            />
            {filters.searchText && hoveredFilter === "searchText" && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onFiltersChange({ ...filters, searchText: "" })
                }}
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* 2. 捕获时间 */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-10 w-[220px] justify-start rounded-lg border-border font-normal bg-transparent focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 hover:bg-gray-100/50"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate && filters.endDate
                  ? `${format(new Date(filters.startDate), "yyyy-MM-dd", { locale: zhCN })} ~ ${format(new Date(filters.endDate), "yyyy-MM-dd", { locale: zhCN })}`
                  : "捕获时间"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">开始时间</Label>
                  <Input
                    type="datetime-local"
                    step="1"
                    value={filters.startDate}
                    onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">结束时间</Label>
                  <Input
                    type="datetime-local"
                    step="1"
                    value={filters.endDate}
                    onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFiltersChange({ ...filters, startDate: "", endDate: "" })}
                  >
                    清空
                  </Button>
                  <Button size="sm">确定</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* 3. 客户 - 使用 ClearableSelect 组件，悬浮时显示清空按钮替换下拉箭头 */}
          <ClearableSelect
            value={filters.customer}
            onValueChange={(value) => onFiltersChange({ ...filters, customer: value })}
            onClear={() => onFiltersChange({ ...filters, customer: "" })}
            placeholder="客户"
            options={customerFilterOptions.map((opt) => ({ value: opt, label: opt }))}
          />

          {/* 4. 发布渠道 */}
          <ClearableSelect
            value={filters.channel}
            onValueChange={(value) => onFiltersChange({ ...filters, channel: value })}
            onClear={() => onFiltersChange({ ...filters, channel: "" })}
            placeholder="发布渠道"
            options={channelOptions.map((opt) => ({ value: opt, label: opt }))}
          />

          {/* 5. 新老团伙 */}
          <ClearableSelect
            value={filters.gangType}
            onValueChange={(value) => onFiltersChange({ ...filters, gangType: value })}
            onClear={() => onFiltersChange({ ...filters, gangType: "" })}
            placeholder="新老团伙"
            options={[
              { value: "new", label: "新团伙" },
              { value: "old", label: "老团伙" },
            ]}
          />

          {/* 6. 新老内容 */}
          <ClearableSelect
            value={filters.contentType}
            onValueChange={(value) => {
              if (value !== "following") {
                onFiltersChange({ ...filters, contentType: value, followupProgress: "" })
              } else {
                onFiltersChange({ ...filters, contentType: value })
              }
            }}
            onClear={() => onFiltersChange({ ...filters, contentType: "", followupProgress: "" })}
            placeholder="新老内容"
            options={[
              { value: "new", label: "新内容" },
              { value: "old", label: "老内容" },
            ]}
          />

          {/* 7. 风险场景 */}
          <MultiSelectRiskScene
            value={filters.riskScenes || []}
            onChange={(value) => onFiltersChange({ ...filters, riskScenes: value })}
            options={riskSceneOptions}
            placeholder="风险场景"
          />

          {/* 8. 风险标签 */}
          <RiskLabelSelector
            value={filters.riskTags}
            onChange={(newTags) => onFiltersChange({ ...filters, riskTags: newTags })}
            selectedRiskScenes={filters.riskScenes || []}
            onShowMessage={showMessage}
          />

          {/* 9. 状态 */}
          <ClearableSelect
            value={filters.status}
            onValueChange={(value) => {
              if (value !== "following") {
                onFiltersChange({ ...filters, status: value, followupProgress: "" })
              } else {
                onFiltersChange({ ...filters, status: value })
              }
            }}
            onClear={() => onFiltersChange({ ...filters, status: "", followupProgress: "" })}
            placeholder="状态"
            options={[
              { value: "pending", label: "待跟进" },
              { value: "following", label: "跟进中" },
              { value: "completed", label: "跟进结束" },
            ]}
          />

          {/* 10. 跟进进度 */}
          <ClearableSelect
            value={filters.followupProgress || ""}
            onValueChange={(value) => onFiltersChange({ ...filters, followupProgress: value })}
            onClear={() => onFiltersChange({ ...filters, followupProgress: "" })}
            placeholder="跟进进度"
            options={followupProgressOptions.map((opt) => ({ value: opt, label: opt }))}
            disabled={!isFollowupProgressEnabled}
          />

          {/* 操作按钮 */}
          <Button variant="outline" className="h-10 rounded-lg bg-transparent gap-1" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            重置
          </Button>
          <Button className="h-10 rounded-lg bg-blue-500 hover:bg-blue-600 gap-1" onClick={handleSearch}>
            <Search className="h-4 w-4" />
            搜索
          </Button>
          <Button
            variant="outline"
            className="h-10 rounded-lg border-blue-500 text-blue-500 hover:bg-blue-50 gap-1 bg-transparent"
            onClick={handleSaveView}
          >
            <Save className="h-4 w-4" />
            保存视图
          </Button>
        </div>
      </div>

      {/* 对话框 */}
      <Dialog open={newViewDialogOpen} onOpenChange={setNewViewDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>新建视图</DialogTitle>
            <DialogDescription>保存当前筛选条件为新视图</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">视图名称</Label>
              <Input
                placeholder="请输入视图名称"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="setDefault"
                checked={newViewIsDefault}
                onCheckedChange={(checked) => setNewViewIsDefault(checked as boolean)}
              />
              <Label htmlFor="setDefault" className="text-sm cursor-pointer">
                设为默认视图
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="syncToReview"
                checked={newViewSyncToReview}
                onCheckedChange={(checked) => setNewViewSyncToReview(checked as boolean)}
              />
              <Label htmlFor="syncToReview" className="text-sm cursor-pointer">
                同步至线索审核
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewViewDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreateView} disabled={!newViewName.trim()}>
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>重命名视图</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">视图名称</Label>
              <Input
                placeholder="请输入视图名称"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleRename} disabled={!renameValue.trim()}>
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除视图</AlertDialogTitle>
            <AlertDialogDescription>确定要删除此视图吗？此操作无法撤销。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={unsavedDialogOpen} onOpenChange={setUnsavedDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>未保存的更改</AlertDialogTitle>
            <AlertDialogDescription>当前筛选条件已修改但未保存。是否在离开前保存更改？</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleUnsavedConfirm(false)}>不保存</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleUnsavedConfirm(true)}>保存</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
