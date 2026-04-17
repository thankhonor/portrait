"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale/zh-CN"
import {
  Search,
  RotateCcw,
  Eye,
  Edit,
  Trash2,
  Power,
  PowerOff,
  Clock,
  AlertTriangle,
  Ban,
  Zap,
  MessageSquare,
  Users,
  History,
  Activity,
  CheckCircle2,
  XCircle,
  FileWarning,
  Plus,
  CalendarIcon,
  FileText,
} from "lucide-react"
import { Pagination } from "@/components/layout/pagination"
import { mockBots, mockBotSummary, mockBotSessions } from "@/lib/modules/bot-management/data"
import {
  type BotInfo,
  type BotSession,
  type BotStatus,
  type PersonaTag,
  statusConfig,
  subscriptionConfig,
  unavailableReasonConfig,
  personaTagColors,
  type UsageCategory,
  type SuccessRateCategory,
} from "@/lib/modules/bot-management/types"

const allPersonaTags: PersonaTag[] = [
  "海外小白买家", "寻找上游的代理", "同行交流", "技术宅", "资深玩家", "新手入行",
]

export function BotManagementTable() {
  const [bots, setBots] = useState<BotInfo[]>(mockBots)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [channelFilter, setChannelFilter] = useState<string>("all")
  const [usageFilter, setUsageFilter] = useState<UsageCategory | "all">("all")
  const [successRateFilter, setSuccessRateFilter] = useState<SuccessRateCategory | "all">("all")
  const [selectedBot, setSelectedBot] = useState<BotInfo | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [countdowns, setCountdowns] = useState<Record<string, string>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [botToDelete, setBotToDelete] = useState<BotInfo | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  // 添加 Bot 弹窗
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    tgUsername: "",
    tgId: "",
    registrationDate: undefined as Date | undefined,
    boundPhone: "",
    boundProxyIp: "",
    personaTags: [] as PersonaTag[],
    subscriptionType: "normal" as "normal" | "premium",
  })

  // 会话日志
  const [logDialogOpen, setLogDialogOpen] = useState(false)
  const [logBot, setLogBot] = useState<BotInfo | null>(null)

  const currentSessions = logBot
    ? [...(mockBotSessions[logBot.id] || [])].sort((a, b) => b.startTime.localeCompare(a.startTime))
    : []

  // 计算冷却倒计时
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns: Record<string, string> = {}
      bots.forEach((bot) => {
        if (bot.unavailableReason === "cooling_down" && bot.cooldownEndTime) {
          const remaining = bot.cooldownEndTime.getTime() - Date.now()
          if (remaining > 0) {
            const minutes = Math.floor(remaining / 60000)
            const seconds = Math.floor((remaining % 60000) / 1000)
            newCountdowns[bot.id] = `${minutes}:${seconds.toString().padStart(2, "0")}`
          } else {
            newCountdowns[bot.id] = "已结束"
          }
        }
      })
      setCountdowns(newCountdowns)
    }, 1000)

    return () => clearInterval(interval)
  }, [bots])

  // 筛选 Bot
  const filteredBots = bots.filter((bot) => {
    const matchesSearch =
      searchKeyword === "" ||
      bot.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      bot.tgUsername.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      bot.tgId.includes(searchKeyword)
    
    const matchesStatus =
      statusFilter === "all" || bot.status === statusFilter

    const matchesUsage =
      usageFilter === "all" || bot.usageCategory === usageFilter

    const matchesSuccessRate =
      successRateFilter === "all" || bot.successRateCategory === successRateFilter

    return matchesSearch && matchesStatus && matchesUsage && matchesSuccessRate
  })

  // 分页
  const startIndex = (currentPage - 1) * pageSize
  const paginatedBots = filteredBots.slice(startIndex, startIndex + pageSize)

  // 重置筛选
  const handleReset = () => {
    setSearchKeyword("")
    setStatusFilter("all")
    setChannelFilter("all")
    setUsageFilter("all")
    setSuccessRateFilter("all")
    setCurrentPage(1)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  // 添加 Bot
  const handleAddBot = () => {
    if (!addForm.tgUsername || !addForm.tgId || !addForm.registrationDate) return

    const regDays = Math.floor(
      (Date.now() - addForm.registrationDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const newBot: BotInfo = {
      id: `BOT-${String(bots.length + 1).padStart(3, "0")}`,
      tgAvatar: addForm.tgUsername[0]?.toUpperCase() || "?",
      tgId: addForm.tgId,
      tgUsername: addForm.tgUsername,
      registrationDays: Math.max(regDays, 0),
      followingCount: 0,
      followersCount: 0,
      boundPhone: addForm.boundPhone,
      boundProxyIp: addForm.boundProxyIp,
      personaTags: addForm.personaTags,
      subscriptionType: addForm.subscriptionType,
      joinedGroupCount: 0,
      joinedChannelCount: 0,
      createdChannelCount: 0,
      channelSubscriberCount: 0,
      todayPrivateChatCount: 0,
      totalConnectionCount: 0,
      historyRestrictionCount: 0,
      usageCategory: "never_used",
      successRateCategory: "zero",
      status: "available",
    }
    setBots((prev) => [...prev, newBot])
    setAddForm({
      tgUsername: "",
      tgId: "",
      registrationDate: undefined,
      boundPhone: "",
      boundProxyIp: "",
      personaTags: [],
      subscriptionType: "normal",
    })
    setAddDialogOpen(false)
  }

  // 查看详情
  const handleViewDetail = (bot: BotInfo) => {
    setSelectedBot(bot)
    setDetailDialogOpen(true)
  }

  // 渲染状态徽章
  const renderStatusBadge = (bot: BotInfo) => {
    const config = statusConfig[bot.status]
    return (
      <Badge variant="outline" className={`${config.color} text-xs`}>
        {config.label}
      </Badge>
    )
  }

  // 渲染不可用原因
  const renderUnavailableReason = (bot: BotInfo) => {
    if (bot.status !== "unavailable" || !bot.unavailableReason) return null

    const config = unavailableReasonConfig[bot.unavailableReason]
    const icon = {
      in_progress: <Zap className="w-3 h-3" />,
      cooling_down: <Clock className="w-3 h-3" />,
      chat_limit: <MessageSquare className="w-3 h-3" />,
      rate_limited: <AlertTriangle className="w-3 h-3" />,
      banned: <Ban className="w-3 h-3" />,
    }[bot.unavailableReason]

    return (
      <div className="flex items-center gap-1 mt-1">
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${config.color}`}>
          {icon}
          {config.label}
          {bot.unavailableReason === "cooling_down" && countdowns[bot.id] && (
            <span className="font-mono ml-1">{countdowns[bot.id]}</span>
          )}
        </span>
      </div>
    )
  }

  // 渲染人设标签
  const renderPersonaTags = (tags: string[]) => {
    return (
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="outline"
            className={`text-[10px] px-1.5 py-0 ${personaTagColors[tag as keyof typeof personaTagColors] || "bg-gray-100 text-gray-700"}`}
          >
            {tag}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 概览面板 — 按内容比例分配宽度 */}
      <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1.3fr 1.6fr 0.9fr' }}>
        {/* Bot 使用分布 */}
        <Card className="shadow-sm">
          <CardContent className="px-3 py-2">
            <p className="text-base font-semibold text-muted-foreground flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Bot 使用分布
            </p>
            <div className="flex items-baseline justify-center gap-2 mt-6 mb-4">
              <span className="text-sm text-muted-foreground">Bot 总数</span>
              <span className="text-2xl font-bold">{mockBotSummary.totalBots}</span>
            </div>
            <div className="grid grid-cols-3 text-center text-sm">
              {([
                { key: "has_send" as const, label: "有发送", count: mockBotSummary.botsWithSendAttempts, color: "text-green-600", activeColor: "bg-green-50" },
                { key: "started_only" as const, label: "仅启动", count: mockBotSummary.botsStartedOnly, color: "text-yellow-600", activeColor: "bg-yellow-50" },
                { key: "never_used" as const, label: "未使用", count: mockBotSummary.botsNeverUsed, color: "text-gray-400", activeColor: "bg-gray-100" },
              ]).map((item) => (
                <div
                  key={item.key}
                  className={`cursor-pointer rounded-md px-1 py-1 transition-colors hover:bg-muted ${usageFilter === item.key ? item.activeColor + " ring-1 ring-inset ring-current/20" : ""}`}
                  onClick={() => {
                    setUsageFilter(usageFilter === item.key ? "all" : item.key)
                    setCurrentPage(1)
                  }}
                >
                  <div className="text-muted-foreground text-xs">{item.label}</div>
                  <div className={`font-semibold ${item.color}`}>{item.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 发送成功率分布 */}
        <Card className="shadow-sm">
          <CardContent className="px-3 py-2">
            <p className="text-base font-semibold text-muted-foreground flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              发送成功率分布
            </p>
            <div className="space-y-2 mt-5">
              {([
                { key: "full" as const, label: "100%", icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />, count: mockBotSummary.successRate100.count, percent: mockBotSummary.successRate100.percent, barColor: "bg-green-500", activeBg: "bg-green-50" },
                { key: "partial" as const, label: "部分成功", icon: <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />, count: mockBotSummary.partialSuccess.count, percent: mockBotSummary.partialSuccess.percent, barColor: "bg-yellow-500", activeBg: "bg-yellow-50" },
                { key: "zero" as const, label: "0%", icon: <XCircle className="w-3.5 h-3.5 text-red-500" />, count: mockBotSummary.successRate0.count, percent: mockBotSummary.successRate0.percent, barColor: "bg-red-500", activeBg: "bg-red-50" },
              ]).map((item) => (
                <div
                  key={item.key}
                  className={`cursor-pointer rounded-md px-2 py-1 -mx-2 transition-colors hover:bg-muted ${successRateFilter === item.key ? item.activeBg + " ring-1 ring-inset ring-current/20" : ""}`}
                  onClick={() => {
                    setSuccessRateFilter(successRateFilter === item.key ? "all" : item.key)
                    setCurrentPage(1)
                  }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 font-medium">
                      {item.icon}
                      {item.label}
                    </span>
                    <span className="text-muted-foreground text-xs">{item.count} 个 ({item.percent}%)</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mt-1">
                    <div className={`h-full rounded-full ${item.barColor}`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 错误概览 */}
        <Card className="shadow-sm">
          <CardContent className="px-3 py-2">
            <p className="text-base font-semibold text-muted-foreground flex items-center gap-1.5 mb-1.5">
              <FileWarning className="w-3.5 h-3.5" />
              错误概览
            </p>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex items-center gap-1 bg-red-50 rounded px-2 py-0.5">
                <span className="text-base font-bold text-red-600">{mockBotSummary.totalErrors}</span>
                <span className="text-[9px] text-red-400 leading-tight">错误<br/>总数</span>
              </div>
              <div className="flex items-center gap-1 bg-orange-50 rounded px-2 py-0.5">
                <span className="text-base font-bold text-orange-600">{mockBotSummary.errorCategories}</span>
                <span className="text-[9px] text-orange-400 leading-tight">错误<br/>分类</span>
              </div>
            </div>
            <div className="space-y-0 flex-1 overflow-hidden">
              {mockBotSummary.topErrors.map((err, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] leading-[18px]">
                  <span className="text-muted-foreground truncate mr-2">{err.category}</span>
                  <Badge variant="outline" className="text-[10px] px-1 py-0 font-mono shrink-0">
                    {err.count}次/{err.botCount}bot
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 今日私聊总数 */}
        <Card className="shadow-sm">
          <CardContent className="px-3 py-2">
            <p className="text-base font-semibold text-muted-foreground flex items-center gap-1.5 mb-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              今日私聊总数
            </p>
            <div className="flex items-baseline gap-1.5 mb-1.5">
              <span className="text-xl font-bold text-blue-600">
                {bots.reduce((sum, b) => sum + b.todayPrivateChatCount, 0)}
              </span>
            </div>
            <div className="h-px bg-border mb-1.5" />
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">可用</span>
                <span className="font-medium text-green-600">{bots.filter(b => b.status === "available").length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">不可用</span>
                <span className="font-medium text-red-600">{bots.filter(b => b.status === "unavailable").length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">总 Bot</span>
                <span className="font-medium">{bots.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">受限</span>
                <span className="font-medium text-orange-600">{bots.filter(b => b.historyRestrictionCount > 0).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选区域 */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="w-[280px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Bot ID / TG ID / TG 用户名"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        <div className="w-[130px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="available">可用</SelectItem>
              <SelectItem value="unavailable">不可用</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-[130px]">
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="全部渠道" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部渠道</SelectItem>
              <SelectItem value="tg">TG</SelectItem>
              <SelectItem value="xiaohongshu">小红书</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-1" />
            重置
          </Button>
          <Button size="sm">
            <Search className="w-4 h-4 mr-1" />
            搜索
          </Button>
        </div>

        <div className="ml-auto">
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            添加 Bot
          </Button>
        </div>
      </div>

      {/* Bot 列表表格 */}
      <Card>
        <CardHeader className="py-2 px-4">
          <span className="text-sm text-muted-foreground">
            共 <span className="text-blue-500 font-medium">{filteredBots.length}</span> 条数据
          </span>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[90px]">Bot ID</TableHead>
                  <TableHead className="w-[80px]">订阅服务</TableHead>
                  <TableHead className="w-[170px]">TG 信息</TableHead>
                  <TableHead className="w-[80px]">养号时长</TableHead>
                  <TableHead className="w-[140px]">人设标签</TableHead>
                  <TableHead className="w-[170px]">绑定信息</TableHead>
                  <TableHead className="w-[110px]">加入群组/频道数</TableHead>
                  <TableHead className="w-[120px]">创建频道/订阅数</TableHead>
                  <TableHead className="w-[100px]">风控数据</TableHead>
                  <TableHead className="w-[100px]">状态</TableHead>
                  <TableHead className="w-[80px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBots.map((bot) => (
                  <TableRow key={bot.id}>
                    {/* Bot ID */}
                    <TableCell className="font-mono text-xs">{bot.id}</TableCell>
                    {/* 订阅服务 */}
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${subscriptionConfig[bot.subscriptionType].color}`}>
                        {subscriptionConfig[bot.subscriptionType].label}
                      </Badge>
                    </TableCell>
                    {/* TG 信息 */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0 ${
                          bot.status === "available"
                            ? "bg-gradient-to-br from-blue-500 to-purple-500"
                            : "bg-gray-400"
                        }`}>
                          {bot.tgAvatar}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">@{bot.tgUsername}</div>
                          <div className="text-xs text-muted-foreground">{bot.tgId}</div>
                        </div>
                      </div>
                    </TableCell>
                    {/* 养号时长 */}
                    <TableCell className="text-sm">{bot.registrationDays} 天</TableCell>
                    {/* 人设标签 */}
                    <TableCell>{renderPersonaTags(bot.personaTags)}</TableCell>
                    {/* 绑定信息 */}
                    <TableCell>
                      <div className="text-xs space-y-0.5">
                        <div className="text-muted-foreground">{bot.boundPhone}</div>
                        <div className="text-muted-foreground truncate max-w-[150px]" title={bot.boundProxyIp}>
                          {bot.boundProxyIp}
                        </div>
                      </div>
                    </TableCell>
                    {/* 加入群组/频道数 */}
                    <TableCell>
                      <div className="text-xs space-y-0.5">
                        <div>群组: <span className="font-medium">{bot.joinedGroupCount}</span></div>
                        <div>频道: <span className="font-medium">{bot.joinedChannelCount}</span></div>
                      </div>
                    </TableCell>
                    {/* 创建频道/订阅数 */}
                    <TableCell>
                      <div className="text-xs space-y-0.5">
                        <div>频道: <span className="font-medium">{bot.createdChannelCount}</span></div>
                        <div>订阅: <span className="font-medium">{bot.channelSubscriberCount}</span></div>
                      </div>
                    </TableCell>
                    {/* 风控数据 */}
                    <TableCell>
                      <div className="text-xs space-y-0.5">
                        <div>今日私聊: <span className="font-medium">{bot.todayPrivateChatCount}</span></div>
                        <div>累计建联: <span className="font-medium">{bot.totalConnectionCount}</span></div>
                        <div>
                          受限记录:
                          <span className={`font-medium ${bot.historyRestrictionCount > 0 ? "text-red-500" : ""}`}>
                            {bot.historyRestrictionCount}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    {/* 状态 */}
                    <TableCell>
                      {renderStatusBadge(bot)}
                      {renderUnavailableReason(bot)}
                    </TableCell>
                    {/* 操作 */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-blue-500 hover:text-blue-600"
                          title="会话日志"
                          onClick={() => {
                            setLogBot(bot)
                            setLogDialogOpen(true)
                          }}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600"
                          onClick={() => {
                            setBotToDelete(bot)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 分页 */}
      <Pagination
        total={filteredBots.length}
        current={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* 删除确认弹窗 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            确定要删除 Bot <span className="font-medium text-foreground">{botToDelete?.id}</span>（@{botToDelete?.tgUsername}）吗？此操作不可撤销。
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (botToDelete) {
                  setBots((prev) => prev.filter((b) => b.id !== botToDelete.id))
                }
                setDeleteDialogOpen(false)
                setBotToDelete(null)
              }}
            >
              删除
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bot 详情弹窗 */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bot 详情</DialogTitle>
          </DialogHeader>
          {selectedBot && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6 pr-4">
                {/* 基本信息 */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    基本信息
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-lg ${
                        selectedBot.status === "available" 
                          ? "bg-gradient-to-br from-blue-500 to-purple-500" 
                          : "bg-gray-400"
                      }`}>
                        {selectedBot.tgAvatar}
                      </div>
                      <div>
                        <div className="font-medium">@{selectedBot.tgUsername}</div>
                        <div className="text-xs text-muted-foreground">TG ID: {selectedBot.tgId}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {renderStatusBadge(selectedBot)}
                      {selectedBot.status === "unavailable" && renderUnavailableReason(selectedBot)}
                    </div>
                    
                    <div>
                      <span className="text-xs text-muted-foreground">Bot ID</span>
                      <div className="font-mono text-sm">{selectedBot.id}</div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">养号时长</span>
                      <div className="text-sm">{selectedBot.registrationDays} 天</div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">订阅服务</span>
                      <div className="mt-0.5">
                        <Badge variant="outline" className={`text-xs ${subscriptionConfig[selectedBot.subscriptionType].color}`}>
                          {subscriptionConfig[selectedBot.subscriptionType].label}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">关注数</span>
                      <div className="text-sm text-blue-600 font-medium">{selectedBot.followingCount}</div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">粉丝数</span>
                      <div className="text-sm text-green-600 font-medium">{selectedBot.followersCount}</div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">绑定手机号</span>
                      <div className="text-sm">{selectedBot.boundPhone}</div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">绑定代理IP</span>
                      <div className="text-sm">{selectedBot.boundProxyIp}</div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">加入群组/频道数</span>
                      <div className="text-sm font-medium">{selectedBot.joinedGroupCount} / {selectedBot.joinedChannelCount}</div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">创建频道/订阅数</span>
                      <div className="text-sm font-medium">{selectedBot.createdChannelCount} / {selectedBot.channelSubscriberCount}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-muted-foreground">人设标签</span>
                      <div className="mt-1">{renderPersonaTags(selectedBot.personaTags)}</div>
                    </div>
                  </div>
                </div>

                {/* 风控数据 */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    风控数据
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <MessageSquare className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                        <div className="text-2xl font-bold">{selectedBot.todayPrivateChatCount}</div>
                        <div className="text-xs text-muted-foreground">今日私聊数</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <Users className="w-6 h-6 mx-auto text-green-500 mb-2" />
                        <div className="text-2xl font-bold">{selectedBot.totalConnectionCount}</div>
                        <div className="text-xs text-muted-foreground">累计建联数</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4 text-center">
                        <History className="w-6 h-6 mx-auto text-red-500 mb-2" />
                        <div className="text-2xl font-bold">{selectedBot.historyRestrictionCount}</div>
                        <div className="text-xs text-muted-foreground">历史受限记录</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                    关闭
                  </Button>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-1" />
                    编辑
                  </Button>
                  {selectedBot.status === "available" ? (
                    <Button variant="destructive">
                      <PowerOff className="w-4 h-4 mr-1" />
                      停用
                    </Button>
                  ) : (
                    <Button>
                      <Power className="w-4 h-4 mr-1" />
                      启用
                    </Button>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* 添加 Bot 弹窗 */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>添加 Bot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {/* TG 信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>TG 用户名 <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="请输入 TG 用户名"
                  value={addForm.tgUsername}
                  onChange={(e) => setAddForm((f) => ({ ...f, tgUsername: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>TG ID <span className="text-red-500">*</span></Label>
                <Input
                  placeholder="请输入 TG ID"
                  value={addForm.tgId}
                  onChange={(e) => setAddForm((f) => ({ ...f, tgId: e.target.value }))}
                />
              </div>
            </div>

            {/* 注册时间 */}
            <div className="space-y-1.5">
              <Label>注册时间 <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!addForm.registrationDate ? "text-muted-foreground" : ""}`}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {addForm.registrationDate
                      ? format(addForm.registrationDate, "yyyy-MM-dd", { locale: zhCN })
                      : "请选择注册时间"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={addForm.registrationDate}
                    onSelect={(date) => setAddForm((f) => ({ ...f, registrationDate: date }))}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 绑定信息 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>绑定手机号</Label>
                <Input
                  placeholder="如 +1-555-0123"
                  value={addForm.boundPhone}
                  onChange={(e) => setAddForm((f) => ({ ...f, boundPhone: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>绑定代理 IP</Label>
                <Input
                  placeholder="如 192.168.1.1 (美国-加州)"
                  value={addForm.boundProxyIp}
                  onChange={(e) => setAddForm((f) => ({ ...f, boundProxyIp: e.target.value }))}
                />
              </div>
            </div>

            {/* 人设标签 */}
            <div className="space-y-1.5">
              <Label>人设标签</Label>
              <div className="flex flex-wrap gap-2">
                {allPersonaTags.map((tag) => {
                  const selected = addForm.personaTags.includes(tag)
                  return (
                    <label
                      key={tag}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs cursor-pointer transition-colors ${
                        selected
                          ? personaTagColors[tag]
                          : "bg-background text-muted-foreground border-border hover:bg-muted"
                      }`}
                    >
                      <Checkbox
                        checked={selected}
                        onCheckedChange={(checked) => {
                          setAddForm((f) => ({
                            ...f,
                            personaTags: checked
                              ? [...f.personaTags, tag]
                              : f.personaTags.filter((t) => t !== tag),
                          }))
                        }}
                        className="w-3 h-3"
                      />
                      {tag}
                    </label>
                  )
                })}
              </div>
            </div>

            {/* 订阅服务 */}
            <div className="space-y-1.5">
              <Label>订阅服务</Label>
              <div className="flex gap-2">
                {(["normal", "premium"] as const).map((type) => (
                  <label
                    key={type}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs cursor-pointer transition-colors ${
                      addForm.subscriptionType === type
                        ? subscriptionConfig[type].color
                        : "bg-background text-muted-foreground border-border hover:bg-muted"
                    }`}
                    onClick={() => setAddForm((f) => ({ ...f, subscriptionType: type }))}
                  >
                    {subscriptionConfig[type].label}
                  </label>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                取消
              </Button>
              <Button
                onClick={handleAddBot}
                disabled={!addForm.tgUsername || !addForm.tgId || !addForm.registrationDate}
              >
                <Plus className="w-4 h-4 mr-1" />
                确认添加
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 会话日志弹窗 */}
      <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              会话日志
              {logBot && (
                <span className="text-sm font-normal text-muted-foreground">
                  — {logBot.id} (@{logBot.tgUsername})
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* 统计栏 */}
          <div className="flex items-center gap-4 py-2 border-b text-sm">
            <span className="text-muted-foreground">
              共 <span className="font-medium text-foreground">{currentSessions.length}</span> 条会话
            </span>
            <span className="text-green-600">
              正常 {currentSessions.filter((s) => s.endReason === "正常结束").length}
            </span>
            <span className="text-red-600">
              异常 {currentSessions.filter((s) => s.endReason !== "正常结束").length}
            </span>
          </div>

          {/* 会话表格 */}
          <ScrollArea className="flex-1 min-h-0 -mx-6 px-6">
            {currentSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileText className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm">暂无会话记录</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">目标</TableHead>
                    <TableHead className="w-[150px]">开始时间</TableHead>
                    <TableHead className="w-[150px]">结束时间</TableHead>
                    <TableHead>结束原因</TableHead>
                    <TableHead className="w-[90px] text-center">会话耗时</TableHead>
                    <TableHead className="w-[80px] text-center">消息条数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSessions.map((session) => {
                    const isError = session.endReason !== "正常结束"
                    return (
                      <TableRow key={session.id}>
                        <TableCell className="text-xs font-medium text-blue-600 truncate max-w-[160px]" title={session.target}>
                          {session.target}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {session.startTime.split(" ")[1]}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {session.endTime ? session.endTime.split(" ")[1] : "-"}
                        </TableCell>
                        <TableCell>
                          {isError ? (
                            <Badge variant="outline" className="text-[11px] px-1.5 py-0 text-red-600 bg-red-50 border-red-200">
                              {session.endReason}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[11px] px-1.5 py-0 text-green-600 bg-green-50 border-green-200">
                              正常结束
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-center text-muted-foreground">
                          {session.duration || "-"}
                        </TableCell>
                        <TableCell className="text-xs text-center text-muted-foreground">
                          {session.messageCount ?? "-"}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </ScrollArea>

          {/* 日期标注 */}
          {currentSessions.length > 0 && (
            <div className="pt-2 border-t text-xs text-muted-foreground text-center">
              {currentSessions[0]?.startTime.split(" ")[0]} — {currentSessions[currentSessions.length - 1]?.startTime.split(" ")[0]}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
