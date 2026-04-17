"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, RotateCcw, X, ChevronDown, ChevronUp } from "lucide-react"
import { channelOptions, riskSceneOptions } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useFilters } from "@/contexts/filter-context"

interface ClueFiltersProps {
  onSearch?: () => void
  onReset?: () => void
}

const riskTagOptions = ["银行卡", "信用卡", "对公账户", "礼品卡", "优惠券", "贷款", "发票", "支付通道"]
const customerFilterOptions = ["AMAZON", "TIKTOKSHOP", "TIKTOK", "SHEIN", "ICBU", "ALIEXPRESS", "LAZADA", "VINTED"]

export function ClueFilters({ onSearch, onReset }: ClueFiltersProps) {
  const { filters, setFilters, resetFilters } = useFilters()
  const {
    searchText,
    startDate,
    endDate,
    customer,
    channel,
    status,
    gangType,
    contentType,
    riskScene,
    riskTags,
    isCollapsed,
  } = filters

  const handleReset = () => {
    resetFilters()
    onReset?.()
  }

  const toggleRiskTag = (tag: string) => {
    const newTags = riskTags.includes(tag) ? riskTags.filter((t) => t !== tag) : [...riskTags, tag]
    setFilters({ riskTags: newTags })
  }

  const getSelectedFilters = () => {
    const selected: { label: string; value: string; onClear: () => void }[] = []

    if (searchText) {
      selected.push({ label: "搜索", value: searchText, onClear: () => setFilters({ searchText: "" }) })
    }
    if (startDate && endDate) {
      selected.push({
        label: "捕获时间",
        value: `${startDate.split("T")[0]} ~ ${endDate.split("T")[0]}`,
        onClear: () => setFilters({ startDate: "", endDate: "" }),
      })
    }
    if (customer) {
      selected.push({ label: "客户", value: customer, onClear: () => setFilters({ customer: "" }) })
    }
    if (channel) {
      selected.push({ label: "发布渠道", value: channel, onClear: () => setFilters({ channel: "" }) })
    }
    if (gangType) {
      selected.push({
        label: "新老团伙",
        value: gangType === "new" ? "新团伙" : "老团伙",
        onClear: () => setFilters({ gangType: "" }),
      })
    }
    if (contentType) {
      selected.push({
        label: "新老内容",
        value: contentType === "new" ? "新内容" : "老内容",
        onClear: () => setFilters({ contentType: "" }),
      })
    }
    if (riskScene) {
      selected.push({ label: "风险场景", value: riskScene, onClear: () => setFilters({ riskScene: "" }) })
    }
    if (riskTags.length > 0) {
      selected.push({
        label: "风险标签",
        value: riskTags.join("、"),
        onClear: () => setFilters({ riskTags: [] }),
      })
    }
    if (status) {
      selected.push({
        label: "状态",
        value: status === "pending" ? "待审核" : "暂不关注",
        onClear: () => setFilters({ status: "" }),
      })
    }

    return selected
  }

  const selectedFilters = getSelectedFilters()

  if (isCollapsed) {
    return (
      <div className="mb-2 p-3 bg-background rounded-lg border border-border">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {selectedFilters.length > 0 ? (
              selectedFilters.map((filter, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-2 py-1 bg-gray-100 border-gray-300 text-gray-700 rounded-md flex items-center gap-1"
                >
                  <span className="text-gray-500 text-xs">{filter.label}:</span>
                  <span className="text-sm">{filter.value}</span>
                  <button
                    type="button"
                    className="ml-1 p-0 bg-transparent border-none cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      filter.onClear()
                    }}
                  >
                    <X className="h-3 w-3 hover:text-red-500" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">暂无筛选条件</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-10 rounded-lg bg-transparent gap-1" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              重置
            </Button>
            <Button className="h-10 rounded-lg bg-blue-400/60 hover:bg-blue-400/70 gap-1" onClick={onSearch}>
              <Search className="h-4 w-4" />
              搜索
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setFilters({ isCollapsed: false })}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-2 p-3 bg-background rounded-lg border border-border">
      <div className="flex flex-wrap gap-2 items-center">
        {/* 1. 线索ID/发布人/线索内容 */}
        <div className="relative w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="线索ID/发布人/线索内容"
            className="h-10 pl-9 w-full rounded-lg border-gray-300 text-sm focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-300 focus:border-gray-300 focus:outline-none hover:bg-gray-100/50"
            value={searchText}
            onChange={(e) => setFilters({ searchText: e.target.value })}
          />
        </div>

        {/* 2. 捕获时间 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 w-[220px] justify-start rounded-lg border-border font-normal bg-transparent focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 hover:bg-gray-100/50"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {startDate && endDate ? `${startDate.split("T")[0]} ~ ${endDate.split("T")[0]}` : "捕获时间"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">开始时间</label>
                <Input
                  type="datetime-local"
                  step="1"
                  value={startDate}
                  onChange={(e) => setFilters({ startDate: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">结束时间</label>
                <Input
                  type="datetime-local"
                  step="1"
                  value={endDate}
                  onChange={(e) => setFilters({ endDate: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setFilters({ startDate: "", endDate: "" })}>
                  清空
                </Button>
                <Button size="sm">确定</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* 3. 客户 */}
        <Select value={customer} onValueChange={(value) => setFilters({ customer: value })}>
          <SelectTrigger className="h-10 w-[220px] rounded-lg border-border focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 hover:bg-gray-100/50">
            <SelectValue placeholder="客户" />
          </SelectTrigger>
          <SelectContent>
            {customerFilterOptions.map((option) => (
              <SelectItem key={option} value={option} className="hover:bg-gray-100 focus:bg-gray-100 text-black">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 4. 发布渠道 */}
        <Select value={channel} onValueChange={(value) => setFilters({ channel: value })}>
          <SelectTrigger className="h-10 w-[220px] rounded-lg border-border focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 hover:bg-gray-100/50">
            <SelectValue placeholder="发布渠道" />
          </SelectTrigger>
          <SelectContent>
            {channelOptions.map((option) => (
              <SelectItem key={option} value={option} className="hover:bg-gray-100 focus:bg-gray-100 text-black">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 5. 新老团伙 */}
        <Select value={gangType} onValueChange={(value) => setFilters({ gangType: value })}>
          <SelectTrigger className="h-10 w-[220px] rounded-lg border-border focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 hover:bg-gray-100/50">
            <SelectValue placeholder="新老团伙" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new" className="hover:bg-gray-100 focus:bg-gray-100 text-black">
              新团伙
            </SelectItem>
            <SelectItem value="old" className="hover:bg-gray-100 focus:bg-gray-100 text-black">
              老团伙
            </SelectItem>
          </SelectContent>
        </Select>

        {/* 6. 新老内容 */}
        <Select value={contentType} onValueChange={(value) => setFilters({ contentType: value })}>
          <SelectTrigger className="h-10 w-[220px] rounded-lg border-border focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 hover:bg-gray-100/50">
            <SelectValue placeholder="新老内容" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new" className="hover:bg-gray-100 focus:bg-gray-100 text-black">
              新内容
            </SelectItem>
            <SelectItem value="old" className="hover:bg-gray-100 focus:bg-gray-100 text-black">
              老内容
            </SelectItem>
          </SelectContent>
        </Select>

        {/* 7. 风险场景 */}
        <Select value={riskScene} onValueChange={(value) => setFilters({ riskScene: value })}>
          <SelectTrigger className="h-10 w-[220px] rounded-lg border-border focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 hover:bg-gray-100/50">
            <SelectValue placeholder="风险场景" />
          </SelectTrigger>
          <SelectContent>
            {riskSceneOptions.map((option) => (
              <SelectItem key={option} value={option} className="hover:bg-gray-100 focus:bg-gray-100 text-black">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 8. 风险标签 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 w-[220px] justify-start rounded-lg border-border font-normal bg-transparent focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-gray-100/50 hover:text-gray-500 overflow-hidden"
            >
              {riskTags.length > 0 ? (
                <div className="flex items-center gap-1 overflow-hidden w-full">
                  <span className="text-sm text-black">{riskTags.join("、")}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">风险标签</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-2" align="start">
            <div className="space-y-1">
              {riskTagOptions.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer group"
                  onClick={() => toggleRiskTag(tag)}
                >
                  <Checkbox checked={riskTags.includes(tag)} className="pointer-events-none" />
                  <span className="text-sm text-black group-hover:text-gray-500">{tag}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* 9. 状态 */}
        <Select value={status} onValueChange={(value) => setFilters({ status: value })}>
          <SelectTrigger className="h-10 w-[220px] rounded-lg border-border focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 hover:bg-gray-100/50">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending" className="hover:bg-gray-100 focus:bg-gray-100 text-black">
              待审核
            </SelectItem>
            <SelectItem value="ignored" className="hover:bg-gray-100 focus:bg-gray-100 text-black">
              暂不关注
            </SelectItem>
          </SelectContent>
        </Select>

        {/* 重置和搜索按钮 */}
        <Button variant="outline" className="h-10 rounded-lg bg-transparent gap-1" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
          重置
        </Button>
        <Button className="h-10 rounded-lg bg-blue-400/60 hover:bg-blue-400/70 gap-1" onClick={onSearch}>
          <Search className="h-4 w-4" />
          搜索
        </Button>
        <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setFilters({ isCollapsed: true })}>
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
