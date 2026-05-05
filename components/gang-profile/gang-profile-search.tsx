"use client"

import { useState } from "react"
import { Search, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GangProfileSearchProps {
  onSearch: (keyword: string, channel: string) => void
  resultCount: number
}

export function GangProfileSearch({ onSearch, resultCount }: GangProfileSearchProps) {
  const [keyword, setKeyword] = useState("")
  const [channel, setChannel] = useState("all")

  const handleSearch = () => {
    onSearch(keyword, channel)
  }

  const handleReset = () => {
    setKeyword("")
    setChannel("all")
    onSearch("", "all")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-sm">账号/群组检索</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">搜索内容</label>
          <Input
            placeholder="输入账号昵称/曾用昵称/账号ID"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">来源渠道</label>
          <Select value={channel} onValueChange={setChannel}>
            <SelectTrigger className="h-8 text-sm w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="Telegram">Telegram</SelectItem>
              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              <SelectItem value="Discord">Discord</SelectItem>
              <SelectItem value="暗网论坛">暗网论坛</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="flex-1 h-8" onClick={handleSearch}>
            <Search className="w-3.5 h-3.5 mr-1" />
            搜索
          </Button>
          <Button size="sm" variant="outline" className="h-8" onClick={handleReset}>
            重置
          </Button>
        </div>
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        共找到 {resultCount} 个账号
      </div>
    </div>
  )
}
