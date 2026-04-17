"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, ChevronDown, ChevronRight, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const riskSceneData: Record<
  string,
  {
    categories: {
      id: string
      name: string
      labels: string[]
    }[]
  }
> = {
  账号盗用: {
    categories: [
      { id: "region", name: "区域", labels: ["美国", "中国", "欧洲"] },
      { id: "target", name: "目标", labels: ["个人", "企业", "金融机构"] },
      { id: "method", name: "作恶手法", labels: ["AI", "自动化脚本", "真人", "钓鱼攻击"] },
    ],
  },
  虚假交易: {
    categories: [
      { id: "region", name: "区域", labels: ["韩国", "日本", "加拿大", "澳大利亚"] },
      { id: "target", name: "目标", labels: ["电商平台", "个人卖家", "品牌商"] },
      { id: "resource", name: "资源", labels: ["VAT税号", "认证材料", "法人信用卡", "营业执照"] },
      {
        id: "coreService",
        name: "核心服务",
        labels: ["提供店铺账号虚假注册服务", "提供店铺账号代注册服务", "刷单服务"],
      },
    ],
  },
  信息窃取: {
    categories: [
      { id: "region", name: "区域", labels: ["东南亚", "印度", "巴西", "俄罗斯"] },
      { id: "target", name: "目标", labels: ["政府", "医疗机构", "教育机构", "企业"] },
      { id: "method", name: "作恶手法", labels: ["木马程序", "社会工程", "漏洞利用", "内部人员"] },
      { id: "sceneTag", name: "场景专属标签", labels: ["内鬼作弊", "数据泄露", "身份盗用"] },
    ],
  },
  提供礼品卡交易服务: {
    categories: [
      { id: "region", name: "区域", labels: ["北美", "英国", "德国", "法国"] },
      { id: "resource", name: "资源", labels: ["礼品卡渠道", "支付通道", "洗钱网络"] },
      { id: "coreService", name: "核心服务", labels: ["礼品卡代购", "礼品卡套现", "提供直邮店带入驻服务"] },
      { id: "sceneTag", name: "场景专属标签", labels: ["店铺代入驻", "资金转移", "跨境洗钱"] },
    ],
  },
}

interface RiskLabelSelectorProps {
  value: string[]
  onChange: (value: string[]) => void
  selectedRiskScenes?: string[]
  onShowMessage?: (type: "success" | "error", message: string) => void
}

export function RiskLabelSelector({ value, onChange, selectedRiskScenes = [] }: RiskLabelSelectorProps) {
  const [open, setOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [expandedScenes, setExpandedScenes] = useState<string[]>(selectedRiskScenes)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  // 获取选中场景的数据
  const filteredSceneData = useMemo(() => {
    if (selectedRiskScenes.length === 0) {
      return riskSceneData
    }
    const result: typeof riskSceneData = {}
    selectedRiskScenes.forEach((scene) => {
      if (riskSceneData[scene]) {
        result[scene] = riskSceneData[scene]
      }
    })
    return result
  }, [selectedRiskScenes])

  // 搜索过滤
  const filterLabels = (labels: string[], search: string) => {
    if (!search) return labels
    return labels.filter((label) => label.toLowerCase().includes(search.toLowerCase()))
  }

  // 切换场景展开
  const toggleScene = (scene: string) => {
    setExpandedScenes((prev) => (prev.includes(scene) ? prev.filter((s) => s !== scene) : [...prev, scene]))
  }

  // 切换分类展开
  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryKey) ? prev.filter((id) => id !== categoryKey) : [...prev, categoryKey],
    )
  }

  // 切换标签选中
  const toggleLabel = (label: string) => {
    const newValue = value.includes(label) ? value.filter((l) => l !== label) : [...value, label]
    onChange(newValue)
  }

  // 显示值
  const getDisplayValue = () => {
    if (value.length === 0) return null
    if (value.length <= 2) return value.join("、")
    return `已选 ${value.length} 项`
  }

  const handleClearClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange([])
    setOpen(false)
  }

  // 计算场景下选中的标签数量
  const getSceneSelectedCount = (scene: string) => {
    const sceneData = riskSceneData[scene]
    if (!sceneData) return 0
    let count = 0
    sceneData.categories.forEach((category) => {
      category.labels.forEach((label) => {
        if (value.includes(label)) count++
      })
    })
    return count
  }

  // 计算分类下选中的标签数量
  const getCategorySelectedCount = (labels: string[]) => {
    return labels.filter((l) => value.includes(l)).length
  }

  const displayValue = getDisplayValue()

  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-[220px] h-10 justify-between font-normal rounded-lg shadow-xs hover:bg-gray-100/50",
              value.length > 0 ? "border-blue-400 bg-blue-50/50" : "border-border",
            )}
          >
            <span className={cn(value.length === 0 && "text-muted-foreground")}>{displayValue || "风险标签"}</span>
            {value.length > 0 && isHovered ? (
              <div onClick={handleClearClick} className="ml-auto shrink-0 cursor-pointer">
                <XCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </div>
            ) : (
              <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[450px] p-0" align="start">
          {/* 搜索框 */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索风险标签..."
                className="h-8 pl-8 text-sm"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          {/* 三级层次列表：场景 -> 分类 -> 标签 */}
          <div className="max-h-[350px] overflow-y-auto p-2">
            {Object.keys(filteredSceneData).length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">请先选择风险场景</div>
            ) : (
              Object.entries(filteredSceneData).map(([sceneName, sceneData]) => {
                const isSceneExpanded = expandedScenes.includes(sceneName)
                const sceneSelectedCount = getSceneSelectedCount(sceneName)

                // 搜索时检查是否有匹配的标签
                const hasMatchingLabels = sceneData.categories.some(
                  (category) => filterLabels(category.labels, searchText).length > 0,
                )
                if (searchText && !hasMatchingLabels) return null

                return (
                  <div key={sceneName} className="mb-1">
                    {/* 场景级别 */}
                    <button
                      className="flex items-center gap-1 w-full px-2 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 rounded bg-gray-50"
                      onClick={() => toggleScene(sceneName)}
                    >
                      {isSceneExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <span>{sceneName}</span>
                      {sceneSelectedCount > 0 && (
                        <span className="ml-auto text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                          {sceneSelectedCount}
                        </span>
                      )}
                    </button>

                    {/* 分类级别 */}
                    {isSceneExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {sceneData.categories.map((category) => {
                          const categoryKey = `${sceneName}-${category.id}`
                          const isCategoryExpanded = expandedCategories.includes(categoryKey)
                          const filteredLabels = filterLabels(category.labels, searchText)
                          const categorySelectedCount = getCategorySelectedCount(category.labels)

                          if (filteredLabels.length === 0) return null

                          return (
                            <div key={categoryKey}>
                              <button
                                className="flex items-center gap-1 w-full px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                                onClick={() => toggleCategory(categoryKey)}
                              >
                                {isCategoryExpanded ? (
                                  <ChevronDown className="h-3.5 w-3.5" />
                                ) : (
                                  <ChevronRight className="h-3.5 w-3.5" />
                                )}
                                <span>{category.name}</span>
                                {categorySelectedCount > 0 && (
                                  <span className="ml-auto text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                                    {categorySelectedCount}
                                  </span>
                                )}
                              </button>

                              {/* 标签级别 */}
                              {isCategoryExpanded && (
                                <div className="ml-5 space-y-0.5 mt-1">
                                  {filteredLabels.map((label) => (
                                    <div
                                      key={label}
                                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer"
                                      onClick={() => toggleLabel(label)}
                                    >
                                      <Checkbox checked={value.includes(label)} className="pointer-events-none" />
                                      <span className="text-sm">{label}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          <div className="p-3 border-t flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => onChange([])}
            >
              清空
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              确定
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
