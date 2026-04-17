"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// 三级联动数据结构：风险场景 -> 标签类型 -> 标签
export interface RiskCascadeData {
  scene: string
  labelTypes: {
    type: string
    labels: string[]
  }[]
}

// 选中的标签结构
export interface SelectedRiskLabel {
  scene: string
  labelType: string
  label: string
}

// 三级联动数据
export const riskCascadeData: RiskCascadeData[] = [
  {
    scene: "账号盗用",
    labelTypes: [
      {
        type: "账户交易",
        labels: ["银行卡买卖", "四件套", "对公账户买卖", "企业账户"],
      },
      {
        type: "信息泄露",
        labels: ["身份信息泄露", "客户信息", "内部数据"],
      },
    ],
  },
  {
    scene: "虚假交易",
    labelTypes: [
      {
        type: "刷单诈骗",
        labels: ["刷单", "虚假交易", "佣金诈骗"],
      },
      {
        type: "保险欺诈",
        labels: ["保险欺诈", "虚假理赔", "骗保", "发票造假"],
      },
      {
        type: "投资诈骗",
        labels: ["荐股诈骗", "投资诈骗", "贷款诈骗", "虚假广告", "非法金融"],
      },
    ],
  },
  {
    scene: "提供礼品卡交易服务",
    labelTypes: [
      {
        type: "礼品卡相关",
        labels: ["礼品卡买卖", "礼品卡套现", "优惠券滥用"],
      },
      {
        type: "代购相关",
        labels: ["代下单", "薅羊毛", "代购欺诈"],
      },
    ],
  },
  {
    scene: "信息窃取",
    labelTypes: [
      {
        type: "信用卡相关",
        labels: ["信用卡盗刷", "CVV交易", "数据泄露"],
      },
      {
        type: "数据买卖",
        labels: ["内部数据", "客户信息", "数据买卖"],
      },
    ],
  },
  {
    scene: "资金盗取",
    labelTypes: [
      {
        type: "支付通道",
        labels: ["非法支付通道", "洗钱", "资金转移"],
      },
      {
        type: "账户盗取",
        labels: ["盗刷", "非法转账", "资金挪用"],
      },
    ],
  },
  {
    scene: "身份冒用",
    labelTypes: [
      {
        type: "身份伪造",
        labels: ["身份证伪造", "证件买卖", "冒名开户"],
      },
      {
        type: "账号冒用",
        labels: ["账号盗用", "冒充客服", "钓鱼诈骗"],
      },
    ],
  },
  {
    scene: "其他",
    labelTypes: [
      {
        type: "其他类型",
        labels: ["其他风险", "待分类"],
      },
    ],
  },
]

interface CascadingRiskSelectorProps {
  value: SelectedRiskLabel[]
  onChange: (value: SelectedRiskLabel[]) => void
  placeholder?: string
}

export function CascadingRiskSelector({
  value,
  onChange,
  placeholder = "请选择风险场景和标签",
}: CascadingRiskSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedScene, setSelectedScene] = useState<string | null>(null)
  const [selectedLabelType, setSelectedLabelType] = useState<string | null>(null)

  // 获取当前场景下的标签类型
  const currentSceneData = riskCascadeData.find((item) => item.scene === selectedScene)

  // 获取当前标签类型下的标签
  const currentLabelTypeData = currentSceneData?.labelTypes.find((item) => item.type === selectedLabelType)

  // 检查标签是否已选中
  const isLabelSelected = (scene: string, labelType: string, label: string) => {
    return value.some((item) => item.scene === scene && item.labelType === labelType && item.label === label)
  }

  // 切换标签选中状态
  const toggleLabel = (scene: string, labelType: string, label: string) => {
    if (isLabelSelected(scene, labelType, label)) {
      onChange(value.filter((item) => !(item.scene === scene && item.labelType === labelType && item.label === label)))
    } else {
      onChange([...value, { scene, labelType, label }])
    }
  }

  // 移除已选标签
  const removeLabel = (scene: string, labelType: string, label: string) => {
    onChange(value.filter((item) => !(item.scene === scene && item.labelType === labelType && item.label === label)))
  }

  // 清空所有选择
  const clearAll = () => {
    onChange([])
  }

  // 重置级联选择
  useEffect(() => {
    if (!open) {
      setSelectedScene(null)
      setSelectedLabelType(null)
    }
  }, [open])

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between h-auto min-h-[38px] font-normal",
              value.length === 0 && "text-muted-foreground"
            )}
          >
            {value.length > 0 ? (
              <span>已选 {value.length} 项</span>
            ) : (
              <span>{placeholder}</span>
            )}
            <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-0" align="start">
          <div className="flex h-[300px]">
            {/* 第一级：风险场景 */}
            <div className="w-1/3 border-r">
              <div className="p-2 border-b bg-muted/50 text-xs font-medium text-muted-foreground">
                风险场景
              </div>
              <ScrollArea className="h-[260px]">
                <div className="p-1">
                  {riskCascadeData.map((item) => (
                    <div
                      key={item.scene}
                      className={cn(
                        "flex items-center justify-between px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-muted",
                        selectedScene === item.scene && "bg-primary/10 text-primary"
                      )}
                      onClick={() => {
                        setSelectedScene(item.scene)
                        setSelectedLabelType(null)
                      }}
                    >
                      <span>{item.scene}</span>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* 第二级：标签类型 */}
            <div className="w-1/3 border-r">
              <div className="p-2 border-b bg-muted/50 text-xs font-medium text-muted-foreground">
                标签类型
              </div>
              <ScrollArea className="h-[260px]">
                <div className="p-1">
                  {currentSceneData?.labelTypes.map((item) => (
                    <div
                      key={item.type}
                      className={cn(
                        "flex items-center justify-between px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-muted",
                        selectedLabelType === item.type && "bg-primary/10 text-primary"
                      )}
                      onClick={() => setSelectedLabelType(item.type)}
                    >
                      <span>{item.type}</span>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </div>
                  )) || (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      请先选择风险场景
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* 第三级：标签 */}
            <div className="w-1/3">
              <div className="p-2 border-b bg-muted/50 text-xs font-medium text-muted-foreground">
                标签
              </div>
              <ScrollArea className="h-[260px]">
                <div className="p-1">
                  {currentLabelTypeData?.labels.map((label) => {
                    const isSelected = isLabelSelected(selectedScene!, selectedLabelType!, label)
                    return (
                      <div
                        key={label}
                        className={cn(
                          "flex items-center justify-between px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-muted",
                          isSelected && "bg-primary/10 text-primary"
                        )}
                        onClick={() => toggleLabel(selectedScene!, selectedLabelType!, label)}
                      >
                        <span>{label}</span>
                        {isSelected && <Check className="h-4 w-4" />}
                      </div>
                    )
                  }) || (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      请先选择标签类型
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* 已选标签展示 */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((item, idx) => (
            <Badge
              key={`${item.scene}-${item.labelType}-${item.label}-${idx}`}
              variant="secondary"
              className="text-xs pr-1"
            >
              <span className="text-muted-foreground mr-1">{item.scene}/</span>
              {item.label}
              <button
                type="button"
                className="ml-1 hover:text-destructive"
                onClick={() => removeLabel(item.scene, item.labelType, item.label)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {value.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 text-xs px-1 text-muted-foreground hover:text-destructive"
              onClick={clearAll}
            >
              清空
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
