"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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
import { MessageToast } from "@/components/shared/message-toast"
import { ClearableSelect } from "@/components/shared/clearable-select"
import { RiskLabelSelector } from "./risk-label-selector"
import { MultiSelectRiskScene } from "./multi-select-risk-scene"
import { cn } from "@/lib/utils"
import { getCustomerList } from "@/lib/modules/config-management/customer-config"

// 筛选条件类型
interface ClueReviewFiltersType {
  searchText: string
  startDate: string
  endDate: string
  customer: string
  channel: string
  status: string
  gangType: string
  contentType: string
  riskScene: string
  riskScenes: string[]
  riskTags: string[]
}

// 视图类型
interface FilterView {
  id: string
  name: string
  isDefault: boolean
  filters: ClueReviewFiltersType
  syncedToFollowup?: boolean
  syncSourceId?: string // ID of the original view if this is a synced copy
  syncToOtherPage?: boolean // New property to indicate if the view is synced to another page
}

// 选项数据
const channelOptions = ["Telegram", "Discord", "微信群", "QQ群", "暗网论坛"]
const riskSceneOptions = ["账号盗用", "虚假交易", "信息窃取", "提供礼品卡交易服务"]

// 初始筛选条件
const initialFilters: ClueReviewFiltersType = {
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
}

// 初始视图
const initialViews: FilterView[] = [{ id: "base", name: "基础视图", isDefault: true, filters: { ...initialFilters } }]

interface ClueReviewFiltersProps {
  onSearch?: () => void
  onReset?: () => void
}

const VIEWS_STORAGE_KEY = "clue-review-views"
const ACTIVE_VIEW_STORAGE_KEY = "clue-review-active-view"
const FOLLOWUP_VIEWS_STORAGE_KEY = "clue-followup-views"

export function ClueReviewFilters({ onSearch, onReset }: ClueReviewFiltersProps) {
  const [filters, setFilters] = useState<ClueReviewFiltersType>({ ...initialFilters })
  
  // 从配置管理获取客户列表
  const [customerOptions, setCustomerOptions] = useState<string[]>([])
  
  useEffect(() => {
    setCustomerOptions(getCustomerList())
  }, [])

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

  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null)

  // 对话框状态
  const [newViewDialogOpen, setNewViewDialogOpen] = useState(false)
  const [newViewName, setNewViewName] = useState("")
  const [newViewIsDefault, setNewViewIsDefault] = useState(false)
  const [newViewSyncToFollowup, setNewViewSyncToFollowup] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [renameViewId, setRenameViewId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteViewId, setDeleteViewId] = useState<string | null>(null)
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  // Toast状态
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; message: string; visible: boolean }>({
    type: "success",
    message: "",
    visible: false,
  })

  const activeView = views.find((v) => v.id === activeViewId)

  // 检查是否有未保存的更改
  const hasUnsavedChanges = useCallback(() => {
    if (!activeView) return false
    const saved = activeView.filters
    return (
      filters.searchText !== saved.searchText ||
      filters.startDate !== saved.startDate ||
      filters.endDate !== saved.endDate ||
      filters.customer !== saved.customer ||
      filters.channel !== saved.channel ||
      filters.status !== saved.status ||
      filters.gangType !== saved.gangType ||
      filters.contentType !== saved.contentType ||
      JSON.stringify(filters.riskScenes || []) !== JSON.stringify(saved.riskScenes || []) ||
      JSON.stringify(filters.riskTags) !== JSON.stringify(saved.riskTags)
    )
  }, [activeView, filters])

  // 显示消息
  const showMessage = (type: "success" | "error", message: string) => {
    setToastMessage({ type, message, visible: true })
    setTimeout(() => setToastMessage((prev) => ({ ...prev, visible: false })), 3000)
  }

  // 更新筛选条件
  const updateFilters = (updates: Partial<ClueReviewFiltersType>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
  }

  // 切换视图
  const switchView = (viewId: string) => {
    const action = () => {
      setActiveViewId(viewId)
      const view = views.find((v) => v.id === viewId)
      if (view) setFilters({ ...view.filters })
    }
    if (hasUnsavedChanges() && activeViewId !== "base") {
      setPendingAction(() => action)
      setUnsavedDialogOpen(true)
    } else {
      action()
    }
  }

  // 保存视图
  const handleSaveView = () => {
    if (activeViewId !== "base") {
      // 直接更新当前视图
      const currentView = views.find((v) => v.id === activeViewId)
      const updatedFilters = { ...filters }
      setViews((prev) => prev.map((v) => (v.id === activeViewId ? { ...v, filters: updatedFilters } : v)))

      if (currentView?.syncedToFollowup) {
        const followupViewsStr = localStorage.getItem(FOLLOWUP_VIEWS_STORAGE_KEY)
        if (followupViewsStr) {
          try {
            const followupViews = JSON.parse(followupViewsStr)
            const updatedFollowupViews = followupViews.map((v: FilterView) =>
              v.syncSourceId === activeViewId ? { ...v, filters: updatedFilters } : v,
            )
            localStorage.setItem(FOLLOWUP_VIEWS_STORAGE_KEY, JSON.stringify(updatedFollowupViews))
          } catch {}
        }
      }

      showMessage("success", `视图"${activeView?.name}"更新成功`)
    } else {
      // 新建视图
      setNewViewSyncToFollowup(false)
      setNewViewDialogOpen(true)
    }
  }

  // 创建新视图
  const handleCreateView = () => {
    if (!newViewName.trim()) return
    const newView: FilterView = {
      id: `view-${Date.now()}`,
      name: newViewName.trim(),
      isDefault: newViewIsDefault,
      filters: { ...filters },
      syncedToFollowup: newViewSyncToFollowup,
      syncToOtherPage: false, // Default to false
    }
    let newViews = [...views, newView]
    if (newViewIsDefault) {
      newViews = newViews.map((v) => ({ ...v, isDefault: v.id === newView.id }))
    }
    setViews(newViews)

    if (newViewSyncToFollowup) {
      const followupViewsStr = localStorage.getItem(FOLLOWUP_VIEWS_STORAGE_KEY)
      let followupViews: FilterView[] = []
      if (followupViewsStr) {
        try {
          followupViews = JSON.parse(followupViewsStr)
        } catch {}
      }

      const syncedView: FilterView = {
        id: `synced-${newView.id}`,
        name: newView.name,
        isDefault: false,
        filters: newView.filters as any, // filters structure is compatible
        syncSourceId: newView.id, // Track the source view
      }
      followupViews.push(syncedView)
      localStorage.setItem(FOLLOWUP_VIEWS_STORAGE_KEY, JSON.stringify(followupViews))
    }

    setActiveViewId(newView.id)
    setNewViewDialogOpen(false)
    setNewViewName("")
    setNewViewIsDefault(false)
    showMessage("success", `视图"${newView.name}"创建成功`)
  }

  // 设为默认视图
  const setAsDefault = (viewId: string) => {
    const action = () => {
      setViews((prev) => prev.map((v) => ({ ...v, isDefault: v.id === viewId })))
      const viewName = views.find((v) => v.id === viewId)?.name
      showMessage("success", `视图"${viewName}"已设为默认视图`)
    }
    if (hasUnsavedChanges() && activeViewId !== "base") {
      setPendingAction(() => action)
      setUnsavedDialogOpen(true)
    } else {
      action()
    }
  }

  // 双击重命名
  const handleDoubleClick = (viewId: string, viewName: string) => {
    if (viewId === "base") return
    setRenameViewId(viewId)
    setRenameValue(viewName)
    setRenameDialogOpen(true)
  }

  // 确认重命名
  const handleRename = () => {
    if (!renameViewId || !renameValue.trim()) return

    const viewToRename = views.find((v) => v.id === renameViewId)

    if (viewToRename?.syncedToFollowup) {
      const followupViewsStr = localStorage.getItem(FOLLOWUP_VIEWS_STORAGE_KEY)
      if (followupViewsStr) {
        try {
          const followupViews = JSON.parse(followupViewsStr)
          const updatedFollowupViews = followupViews.map((v: FilterView) =>
            v.syncSourceId === renameViewId ? { ...v, name: renameValue.trim() } : v,
          )
          localStorage.setItem(FOLLOWUP_VIEWS_STORAGE_KEY, JSON.stringify(updatedFollowupViews))
        } catch {}
      }
    }

    if (viewToRename?.syncSourceId) {
      const followupViewsStr = localStorage.getItem(FOLLOWUP_VIEWS_STORAGE_KEY)
      if (followupViewsStr) {
        try {
          const followupViews = JSON.parse(followupViewsStr)
          const updatedFollowupViews = followupViews.map((v: FilterView) =>
            v.id === viewToRename.syncSourceId ? { ...v, name: renameValue.trim() } : v,
          )
          localStorage.setItem(FOLLOWUP_VIEWS_STORAGE_KEY, JSON.stringify(updatedFollowupViews))
        } catch {}
      }
    }

    setViews((prev) => prev.map((v) => (v.id === renameViewId ? { ...v, name: renameValue.trim() } : v)))
    setRenameDialogOpen(false)
    setRenameViewId(null)
    setRenameValue("")
    showMessage("success", "视图重命名成功")
  }

  // 删除视图
  const handleDeleteView = () => {
    if (!deleteViewId) return
    const deletedView = views.find((v) => v.id === deleteViewId)
    const viewName = deletedView?.name

    if (deletedView?.syncedToFollowup) {
      const followupViewsStr = localStorage.getItem(FOLLOWUP_VIEWS_STORAGE_KEY)
      if (followupViewsStr) {
        try {
          const followupViews = JSON.parse(followupViewsStr)
          const filteredFollowupViews = followupViews.filter((v: FilterView) => v.syncSourceId !== deleteViewId)
          localStorage.setItem(FOLLOWUP_VIEWS_STORAGE_KEY, JSON.stringify(filteredFollowupViews))
        } catch {}
      }
    }

    setViews((prev) => prev.filter((v) => v.id !== deleteViewId))
    if (activeViewId === deleteViewId) {
      setActiveViewId("base")
      setFilters({ ...initialFilters })
    }
    setDeleteDialogOpen(false)
    setDeleteViewId(null)
    showMessage("success", `视图"${viewName}"已删除`)
  }

  // 重置筛选
  const handleReset = () => {
    setFilters({ ...initialFilters })
    onReset?.()
  }

  // 处理未保存对话框
  const handleUnsavedDiscard = () => {
    setUnsavedDialogOpen(false)
    pendingAction?.()
    setPendingAction(null)
  }

  const handleUnsavedSave = () => {
    setViews((prev) => prev.map((v) => (v.id === activeViewId ? { ...v, filters: { ...filters } } : v)))
    showMessage("success", `视图"${activeView?.name}"更新成功`)
    setUnsavedDialogOpen(false)
    pendingAction?.()
    setPendingAction(null)
  }

  useEffect(() => {
    localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify(views))
  }, [views])

  useEffect(() => {
    localStorage.setItem(ACTIVE_VIEW_STORAGE_KEY, activeViewId)
  }, [activeViewId])

  useEffect(() => {
    const activeView = views.find((v) => v.id === activeViewId)
    if (activeView) {
      setFilters({ ...activeView.filters })
    }
  }, []) // Only run once on mount

  const sortedViews = useMemo(() => {
    const baseView = views.find((v) => v.id === "base")
    const syncedViews = views.filter((v) => v.id !== "base" && v.syncedToFollowup)
    const otherViews = views.filter((v) => v.id !== "base" && !v.syncedToFollowup)
    return [baseView, ...syncedViews, ...otherViews].filter(Boolean) as FilterView[]
  }, [views])

  return (
    <div className="space-y-3">
      {/* Toast消息 */}
      <MessageToast
        type={toastMessage.type}
        message={toastMessage.message}
        visible={toastMessage.visible}
        onClose={() => setToastMessage((prev) => ({ ...prev, visible: false }))}
      />

      {/* 视图管理区 */}
      <div className="p-3 bg-white rounded-lg border border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">视图:</span>
          {sortedViews.map((view) => (
            <div
              key={view.id}
              className={cn(
                "group relative flex items-center gap-1 px-3 py-1.5 rounded-md cursor-pointer text-sm transition-colors",
                activeViewId === view.id
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "bg-gray-50 hover:bg-gray-100 border border-transparent",
              )}
              onClick={() => switchView(view.id)}
              onDoubleClick={() => handleDoubleClick(view.id, view.name)}
            >
              {/* 星标 */}
              <Star
                className={cn(
                  "h-3.5 w-3.5 cursor-pointer",
                  view.isDefault ? "fill-yellow-400 text-yellow-400" : "text-gray-400 hover:text-yellow-400",
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!view.isDefault) setAsDefault(view.id)
                }}
              />
              <span>{view.name}</span>
              {/* 删除按钮 */}
              {view.id !== "base" && activeViewId === view.id && (
                <X
                  className="h-3.5 w-3.5 text-gray-400 hover:text-red-500 ml-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteViewId(view.id)
                    setDeleteDialogOpen(true)
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 筛选区 */}
      <div className="p-3 bg-background rounded-lg border border-border">
        <div className="flex flex-wrap gap-2 items-center">
          {/* 搜索框 */}
          <div
            className="relative w-[220px]"
            onMouseEnter={() => setHoveredFilter("search")}
            onMouseLeave={() => setHoveredFilter(null)}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="线索ID/发布人/线索内容"
              className={cn(
                "h-10 pl-9 pr-9 w-full rounded-lg text-sm focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 hover:bg-gray-100/50",
                filters.searchText ? "border-blue-400 bg-blue-50/50" : "border-gray-300",
              )}
              value={filters.searchText}
              onChange={(e) => updateFilters({ searchText: e.target.value })}
            />
            {filters.searchText && hoveredFilter === "search" && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
                onClick={() => updateFilters({ searchText: "" })}
              >
                <XCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* 捕获时间 */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-10 w-[160px] justify-start rounded-lg font-normal bg-transparent hover:bg-gray-100/50",
                  filters.startDate && filters.endDate ? "border-blue-400 bg-blue-50/50" : "border-border",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate && filters.endDate
                  ? `${filters.startDate.split("T")[0]} ~ ${filters.endDate.split("T")[0]}`
                  : "捕获时间"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">开始时间</Label>
                  <Input
                    type="datetime-local"
                    value={filters.startDate}
                    onChange={(e) => updateFilters({ startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">结束时间</Label>
                  <Input
                    type="datetime-local"
                    value={filters.endDate}
                    onChange={(e) => updateFilters({ endDate: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => updateFilters({ startDate: "", endDate: "" })}>
                    清空
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* 客户 */}
          <ClearableSelect
            value={filters.customer}
            onValueChange={(value) => updateFilters({ customer: value })}
            onClear={() => updateFilters({ customer: "" })}
            placeholder="客户"
            options={customerOptions.map((o) => ({ value: o, label: o }))}
          />

          {/* 发布渠道 */}
          <ClearableSelect
            value={filters.channel}
            onValueChange={(value) => updateFilters({ channel: value })}
            onClear={() => updateFilters({ channel: "" })}
            placeholder="发布渠道"
            options={channelOptions.map((o) => ({ value: o, label: o }))}
          />

          {/* 新老团伙 */}
          <ClearableSelect
            value={filters.gangType}
            onValueChange={(value) => updateFilters({ gangType: value })}
            onClear={() => updateFilters({ gangType: "" })}
            placeholder="新老团伙"
            options={[
              { value: "new", label: "新团伙" },
              { value: "old", label: "老团伙" },
            ]}
          />

          {/* 新老内容 */}
          <ClearableSelect
            value={filters.contentType}
            onValueChange={(value) => updateFilters({ contentType: value })}
            onClear={() => updateFilters({ contentType: "" })}
            placeholder="新老内容"
            options={[
              { value: "new", label: "新内容" },
              { value: "old", label: "老内容" },
            ]}
          />

          {/* 风险场景 */}
          <MultiSelectRiskScene
            value={filters.riskScenes || []}
            onChange={(value) => updateFilters({ riskScenes: value })}
            options={riskSceneOptions}
            placeholder="风险场景"
          />

          {/* 风险标签 */}
          <RiskLabelSelector
            value={filters.riskTags}
            onChange={(value) => updateFilters({ riskTags: value })}
            selectedRiskScenes={filters.riskScenes || []}
            onShowMessage={showMessage}
          />

          {/* 状态 */}
          <ClearableSelect
            value={filters.status}
            onValueChange={(value) => updateFilters({ status: value })}
            onClear={() => updateFilters({ status: "" })}
            placeholder="状态"
            options={[
              { value: "pending", label: "待审核" },
              { value: "ignored", label: "暂不关注" },
            ]}
          />

          {/* 操作按钮 */}
          <Button variant="outline" className="h-10 rounded-lg bg-transparent gap-1" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            重置
          </Button>
          <Button className="h-10 rounded-lg bg-blue-500 hover:bg-blue-600 gap-1" onClick={onSearch}>
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

      {/* 新建视图对话框 */}
      <Dialog open={newViewDialogOpen} onOpenChange={setNewViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建视图</DialogTitle>
            <DialogDescription>保存当前筛选条件为新视图</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>视图名称</Label>
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
                onCheckedChange={(checked) => setNewViewIsDefault(checked === true)}
              />
              <Label htmlFor="setDefault" className="text-sm cursor-pointer">
                设为默认视图
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="syncToFollowup"
                checked={newViewSyncToFollowup}
                onCheckedChange={(checked) => setNewViewSyncToFollowup(checked === true)}
              />
              <Label htmlFor="syncToFollowup" className="text-sm cursor-pointer">
                同步至线索跟进
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewViewDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreateView}>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 重命名对话框 */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>重命名视图</DialogTitle>
            <DialogDescription>修改视图名称</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>视图名称</Label>
              <Input placeholder="请输入新名称" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleRename}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除视图</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除视图"{views.find((v) => v.id === deleteViewId)?.name}"吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteView} className="bg-red-500 hover:bg-red-600">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 未保存更改对话框 */}
      <AlertDialog open={unsavedDialogOpen} onOpenChange={setUnsavedDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>未保存的更改</AlertDialogTitle>
            <AlertDialogDescription>当前视图有未保存的更改，是否在离开前保存？</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingAction(null)}>取消</AlertDialogCancel>
            <Button variant="outline" onClick={handleUnsavedDiscard}>
              不保存
            </Button>
            <Button onClick={handleUnsavedSave}>保存并继续</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
