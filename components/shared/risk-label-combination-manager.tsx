"use client"
import { createContext, useContext, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
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
import { Search, ChevronDown, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

// 风险标签分类数据
export const riskLabelCategories = [
  {
    id: "region",
    name: "区域",
    labels: ["中国", "美国", "欧洲", "东南亚", "日本", "韩国"],
  },
  {
    id: "target",
    name: "目标",
    labels: ["个人", "企业", "政府", "金融机构"],
  },
  {
    id: "resource",
    name: "资源",
    labels: ["VAT税号", "认证材料", "法人信用卡", "营业执照"],
  },
  {
    id: "coreService",
    name: "核心服务",
    labels: ["提供店铺账号虚假注册服务", "提供店铺账号代注册服务", "提供直邮店带入驻服务"],
  },
  {
    id: "method",
    name: "作恶手法",
    labels: ["AI", "自动化脚本", "真人"],
  },
  {
    id: "sceneTag",
    name: "场景专属标签",
    labels: ["内鬼作弊", "店铺代入驻"],
  },
]

// 组合类型
export interface LabelCombination {
  id: string
  name: string
  labels: string[]
}

// 默认组合数据
const defaultCombinations: LabelCombination[] = [
  {
    id: "amazon",
    name: "Amazon专属组合",
    labels: ["VAT税号", "法人信用卡", "提供店铺账号虚假注册服务"],
  },
]

// Context 类型
interface RiskLabelCombinationContextType {
  combinations: LabelCombination[]
  addCombination: (combination: LabelCombination) => void
  updateCombination: (id: string, updates: Partial<LabelCombination>) => void
  deleteCombination: (id: string) => void
}

// 创建 Context
const RiskLabelCombinationContext = createContext<RiskLabelCombinationContextType | null>(null)

// Provider 组件
export function RiskLabelCombinationProvider({ children }: { children: ReactNode }) {
  const [combinations, setCombinations] = useState<LabelCombination[]>(defaultCombinations)

  const addCombination = (combination: LabelCombination) => {
    setCombinations((prev) => [...prev, combination])
  }

  const updateCombination = (id: string, updates: Partial<LabelCombination>) => {
    setCombinations((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const deleteCombination = (id: string) => {
    setCombinations((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <RiskLabelCombinationContext.Provider
      value={{ combinations, addCombination, updateCombination, deleteCombination }}
    >
      {children}
    </RiskLabelCombinationContext.Provider>
  )
}

// Hook 来使用 Context
export function useRiskLabelCombinations() {
  const context = useContext(RiskLabelCombinationContext)
  if (!context) {
    throw new Error("useRiskLabelCombinations must be used within RiskLabelCombinationProvider")
  }
  return context
}

// 组合管理抽屉组件
interface RiskLabelCombinationManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onShowMessage?: (type: "success" | "error", message: string) => void
}

export function RiskLabelCombinationManager({ open, onOpenChange, onShowMessage }: RiskLabelCombinationManagerProps) {
  const { combinations, addCombination, updateCombination, deleteCombination } = useRiskLabelCombinations()

  const [drawerSearchText, setDrawerSearchText] = useState("")
  const [drawerExpandedCategories, setDrawerExpandedCategories] = useState<string[]>(
    riskLabelCategories.map((c) => c.id),
  )
  const [editingCombination, setEditingCombination] = useState<LabelCombination | null>(null)
  const [editingLabels, setEditingLabels] = useState<string[]>([])

  // 对话框状态
  const [newCombinationDialogOpen, setNewCombinationDialogOpen] = useState(false)
  const [newCombinationName, setNewCombinationName] = useState("")
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [renameCombinationId, setRenameCombinationId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteCombinationId, setDeleteCombinationId] = useState<string | null>(null)

  // 过滤标签
  const filterLabels = (labels: string[], search: string) => {
    if (!search) return labels
    return labels.filter((label) => label.toLowerCase().includes(search.toLowerCase()))
  }

  // 开始编辑组合
  const startEditCombination = (combination: LabelCombination) => {
    setEditingCombination(combination)
    setEditingLabels([...combination.labels])
  }

  // 切换抽屉内分类展开
  const toggleDrawerCategory = (categoryId: string) => {
    setDrawerExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  // 切换抽屉内标签选中
  const toggleDrawerLabel = (label: string) => {
    setEditingLabels((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]))
  }

  // 保存组合编辑
  const saveEditingCombination = () => {
    if (!editingCombination) return

    updateCombination(editingCombination.id, { labels: [...editingLabels] })
    onShowMessage?.("success", `组合"${editingCombination.name}"更新成功`)
    setEditingCombination(null)
    setEditingLabels([])
  }

  // 取消编辑
  const cancelEditingCombination = () => {
    setEditingCombination(null)
    setEditingLabels([])
  }

  // 新建组合
  const handleCreateCombination = () => {
    if (!newCombinationName.trim()) return

    const newCombination: LabelCombination = {
      id: `combination-${Date.now()}`,
      name: newCombinationName.trim(),
      labels: [],
    }

    addCombination(newCombination)
    onShowMessage?.("success", `组合"${newCombinationName}"创建成功`)
    setNewCombinationDialogOpen(false)
    setNewCombinationName("")
    // 自动进入编辑模式
    startEditCombination(newCombination)
  }

  // 重命名组合
  const handleRename = () => {
    if (!renameCombinationId || !renameValue.trim()) return

    updateCombination(renameCombinationId, { name: renameValue.trim() })
    onShowMessage?.("success", `组合重命名成功`)
    setRenameDialogOpen(false)
    setRenameCombinationId(null)
    setRenameValue("")
  }

  // 删除组合
  const confirmDelete = () => {
    if (!deleteCombinationId) return

    const deletedCombination = combinations.find((c) => c.id === deleteCombinationId)
    deleteCombination(deleteCombinationId)

    if (editingCombination?.id === deleteCombinationId) {
      setEditingCombination(null)
      setEditingLabels([])
    }

    onShowMessage?.("success", `组合"${deletedCombination?.name}"已删除`)
    setDeleteDialogOpen(false)
    setDeleteCombinationId(null)
  }

  // 重置编辑状态当抽屉关闭时
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setEditingCombination(null)
      setEditingLabels([])
      setDrawerSearchText("")
    }
    onOpenChange(newOpen)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="right" className="w-[500px] sm:max-w-[500px] p-0 flex flex-col">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>风险标签组合管理</SheetTitle>
            <SheetDescription>管理您的风险标签组合，方便快速筛选</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-hidden flex">
            {/* 左侧组合列表 */}
            <div className="w-[180px] border-r flex flex-col bg-gray-50/50">
              <div className="p-2 border-b">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1 bg-white hover:bg-gray-50"
                  onClick={() => {
                    setNewCombinationName("")
                    setNewCombinationDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4" />
                  新建组合
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {combinations.map((combination) => (
                  <div
                    key={combination.id}
                    className={cn(
                      "group flex items-center gap-1 px-2 py-2 rounded-md text-sm cursor-pointer transition-colors",
                      editingCombination?.id === combination.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100",
                    )}
                    onClick={() => startEditCombination(combination)}
                  >
                    <span className="truncate flex-1">{combination.name}</span>
                    <div className="hidden group-hover:flex items-center gap-0.5">
                      <button
                        className="p-1 rounded hover:bg-gray-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          setRenameCombinationId(combination.id)
                          setRenameValue(combination.name)
                          setRenameDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-3 w-3 text-gray-500" />
                      </button>
                      <button
                        className="p-1 rounded hover:bg-gray-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteCombinationId(combination.id)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧标签编辑区域 */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {editingCombination ? (
                <>
                  <div className="p-3 border-b">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{editingCombination.name}</span>
                      <span className="text-sm text-muted-foreground">已选 {editingLabels.length} 项</span>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索标签..."
                        className="h-8 pl-8 text-sm"
                        value={drawerSearchText}
                        onChange={(e) => setDrawerSearchText(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2">
                    {riskLabelCategories.map((category) => {
                      const filteredLabels = filterLabels(category.labels, drawerSearchText)
                      if (filteredLabels.length === 0) return null

                      const isExpanded = drawerExpandedCategories.includes(category.id)
                      const selectedCount = category.labels.filter((l) => editingLabels.includes(l)).length

                      return (
                        <div key={category.id} className="mb-2">
                          <button
                            className="flex items-center gap-1 w-full px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                            onClick={() => toggleDrawerCategory(category.id)}
                          >
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            <span>{category.name}</span>
                            {selectedCount > 0 && (
                              <span className="ml-auto text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                                {selectedCount}
                              </span>
                            )}
                          </button>
                          {isExpanded && (
                            <div className="ml-5 space-y-1 mt-1">
                              {filteredLabels.map((label) => (
                                <div
                                  key={label}
                                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer"
                                  onClick={() => toggleDrawerLabel(label)}
                                >
                                  <Checkbox checked={editingLabels.includes(label)} className="pointer-events-none" />
                                  <span className="text-sm">{label}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="p-3 border-t flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={cancelEditingCombination}>
                      取消
                    </Button>
                    <Button size="sm" onClick={saveEditingCombination}>
                      保存组合
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  请从左侧选择一个组合进行编辑
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* 新建组合对话框 */}
      <Dialog open={newCombinationDialogOpen} onOpenChange={setNewCombinationDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>新建组合</DialogTitle>
            <DialogDescription>创建一个新的风险标签组合</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="combination-name">组合名称</Label>
              <Input
                id="combination-name"
                placeholder="请输入组合名称"
                value={newCombinationName}
                onChange={(e) => setNewCombinationName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateCombination()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewCombinationDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreateCombination} disabled={!newCombinationName.trim()}>
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 重命名对话框 */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>重命名组合</DialogTitle>
            <DialogDescription>修改组合的名称</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rename-name">组合名称</Label>
              <Input
                id="rename-name"
                placeholder="请输入新名称"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRename()
                  }
                }}
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

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>确定要删除该组合吗？此操作无法撤销。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
