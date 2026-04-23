"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { useUnread } from "@/contexts/unread-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Send,
  Smile,
  Paperclip,
  Plus,
  Trash2,
  StopCircle,
  Search,
  MessageSquare,
  Bot,
  User,
  FileText,
  ShieldAlert,
  Globe,
  Clock,
  Hash,
  Languages,
  Crown,
  Tag,
  AtSign,
  Phone,
  Users,
  History,
  Calendar,
  Image,
  Link2,
  Building,
  AlertTriangle,
} from "lucide-react"

interface MultiLangMessage {
  id: string
  sender: "bot" | "target"
  originalText: string
  translatedText: string
  time: string
}

interface IOCItem {
  id: string
  type: string
  value: string
  isManual: boolean
}

interface ConversationItem {
  id: string
  avatar: string
  name: string
  channel: string
  lastMessage: string
  time: string
  status: "messageFailed" | "messaged" | "connected" | "ended"
  unreadCount: number
  lastActive: string
  publisherId: string
  targetUsername: string
  targetFollowing: number
  targetFollowers: number
  targetPhone: string
  targetPreviousNames: string[]
  targetBio: string
  clueId: string
  customer: string
  riskScene: string
  riskTags: string[]
  botId: string
  botName: string
  botUsername: string
  botAvatar: string
  botSubscription: "normal" | "premium"
  botPremiumExpiry?: string
  botPersonaTags: string[]
  botBio: string
  sourceUrl: string
  original: string
  translation: string
  publishTime: string
  images: string[]
  platformSource: string
  sourceTitle: string
  relatedDomain: string
  gangType: "new" | "old"
  contentType: "new" | "old"
  portrait: string
}

const mockConversations: ConversationItem[] = [
  {
    id: "1",
    avatar: "AC",
    name: "Alex Crypto",
    channel: "Discord",
    lastMessage: "USA fullz $15 each, EU $20. Sample pack...",
    time: "14:38",
    status: "connected",
    unreadCount: 3,
    lastActive: "10分钟前",
    publisherId: "shuadan_master#1234",
    targetUsername: "shuadan_master#1234",
    targetFollowing: 156,
    targetFollowers: 2340,
    targetPhone: "+1-555-0199",
    targetPreviousNames: ["crypto_dealer_99", "card_master_2023"],
    targetBio: "BTC/USDT accepted. Fresh CC dumps daily. DM for bulk pricing.",
    clueId: "CLU-2024122402",
    customer: "TIKTOKSHOP",
    riskScene: "提供礼品卡交易服务",
    riskTags: ["刷单", "虚假交易", "佣金诈骗"],
    botId: "BOT-DC-002",
    botName: "Discord跟进Bot-02",
    botUsername: "@dc_followbot_02",
    botAvatar: "D2",
    botSubscription: "premium",
    botPremiumExpiry: "2025-06-30",
    botPersonaTags: ["币圈买家", "急切求购", "新手伪装"],
    botBio: "币圈新手，想入行学习数据交易，手上有USDT，寻找靠谱供应商长期合作。",
    sourceUrl: "https://discord.gg/abcd1234",
    original: "专业刷单团队，日入500+，无需押金，工资日结。",
    translation: "",
    publishTime: "2024-12-24 06:15:22",
    images: ["/placeholder.svg", "/placeholder.svg"],
    platformSource: "Discord",
    sourceTitle: "Crypto Trading Hub",
    relatedDomain: "discord.gg",
    gangType: "new",
    contentType: "new",
    portrait: "历史会话",
  },
  {
    id: "2",
    avatar: "CK",
    name: "CreditKing2024",
    channel: "暗网论坛",
    lastMessage: "未获取有效信息，黑产不回复",
    time: "13:20",
    status: "ended",
    unreadCount: 0,
    lastActive: "1小时前",
    publisherId: "CreditKing2024",
    targetUsername: "CreditKing2024",
    targetFollowing: 45,
    targetFollowers: 890,
    targetPhone: "",
    targetPreviousNames: ["DumpKing2023"],
    targetBio: "Premium CC vendor since 2022. Quality guaranteed 80%+.",
    clueId: "CLU-2024122403",
    customer: "SHEIN",
    riskScene: "信息窃取",
    riskTags: ["信用卡盗刷", "CVV交易", "数据泄露"],
    botId: "BOT-DW-001",
    botName: "暗网跟进Bot-01",
    botUsername: "@darkweb_bot_01",
    botAvatar: "W1",
    botSubscription: "normal",
    botPersonaTags: ["数据贩子", "中间人"],
    botBio: "暗网数据中间商，专做CVV和fullz批发，接受加密货币支付。",
    sourceUrl: "http://darkforum.onion/thread/98765",
    original: "High quality credit card dumps, CVV full info available.",
    translation: "高质量信用卡转储，CVV完整信息可用。",
    publishTime: "2024-12-23 18:42:10",
    images: [],
    platformSource: "暗网论坛",
    sourceTitle: "Premium CC Market",
    relatedDomain: "darkforum.onion",
    gangType: "old",
    contentType: "old",
    portrait: "历史会话",
  },
  {
    id: "3",
    avatar: "CS",
    name: "@card_seller_888",
    channel: "Telegram",
    lastMessage: "对方账号已关闭私信功能",
    time: "昨天",
    status: "messageFailed",
    unreadCount: 0,
    lastActive: "1天前",
    publisherId: "@card_seller_888",
    targetUsername: "@card_seller_888",
    targetFollowing: 320,
    targetFollowers: 5600,
    targetPhone: "+86-138-8888-0001",
    targetPreviousNames: ["银行卡批发商", "@card_king_666"],
    targetBio: "出售银行卡四件套，支持各大银行，量大从优。",
    clueId: "CLU-2024122406",
    customer: "AMAZON",
    riskScene: "账号盗用",
    riskTags: ["银行卡买卖", "四件套", "身份信息泄露"],
    botId: "BOT-TG-001",
    botName: "Telegram跟进Bot-01",
    botUsername: "@tg_followbot_01",
    botAvatar: "T1",
    botSubscription: "premium",
    botPremiumExpiry: "2025-09-15",
    botPersonaTags: ["银行卡收购", "批量采购"],
    botBio: "长期收购各类银行卡套件，量大价优，诚信合作。",
    sourceUrl: "https://t.me/darkmarket_channel/12345",
    original: "出售银行卡四件套，身份证+银行卡+U盾+手机卡",
    translation: "",
    publishTime: "2024-12-22 14:30:00",
    images: ["/placeholder.svg"],
    platformSource: "Telegram",
    sourceTitle: "暗网市场频道",
    relatedDomain: "t.me",
    gangType: "new",
    contentType: "old",
    portrait: "历史会话",
  },
  {
    id: "4",
    avatar: "FC",
    name: "fake_claim_888",
    channel: "微信群",
    lastMessage: "发票和病历就行，其他我们搞定",
    time: "昨天",
    status: "connected",
    unreadCount: 1,
    lastActive: "2小时前",
    publisherId: "fake_claim_888",
    targetUsername: "fake_claim_888",
    targetFollowing: 89,
    targetFollowers: 430,
    targetPhone: "+86-139-0000-8888",
    targetPreviousNames: ["理赔专家_v2"],
    targetBio: "代办各类保险理赔，成功率95%以上，手续费仅10%。",
    clueId: "CLU-2024122404",
    customer: "ALIEXPRESS",
    riskScene: "虚假交易",
    riskTags: ["保险欺诈", "虚假理赔", "骗保"],
    botId: "BOT-WX-003",
    botName: "微信跟进Bot-03",
    botUsername: "wx_followbot_03",
    botAvatar: "W3",
    botSubscription: "normal",
    botPersonaTags: ["理赔客户", "小白求助"],
    botBio: "刚出了车祸想走保险理赔，朋友介绍说你们这边能帮忙处理。",
    sourceUrl: "",
    original: "代办车险理赔，无需出险现场，全程线上操作。",
    translation: "",
    publishTime: "2024-12-24 09:20:15",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    platformSource: "微信",
    sourceTitle: "车险理赔互助群",
    relatedDomain: "",
    gangType: "old",
    contentType: "new",
    portrait: "历史会话",
  },
  {
    id: "5",
    avatar: "DB",
    name: "@data_buyer_pro",
    channel: "Telegram",
    lastMessage: "支付通道费率多少？",
    time: "前天",
    status: "ended",
    unreadCount: 0,
    lastActive: "3天前",
    publisherId: "@data_buyer_pro",
    targetUsername: "@data_buyer_pro",
    targetFollowing: 210,
    targetFollowers: 1200,
    targetPhone: "",
    targetPreviousNames: ["@data_market_vip", "数据收购站"],
    targetBio: "收购各银行内部员工数据，客户信息、账户余额等，价格面议。",
    clueId: "CLU-2024122410",
    customer: "LAZADA",
    riskScene: "信息窃取",
    riskTags: ["内部数据", "客户信息", "数据买卖"],
    botId: "BOT-TG-005",
    botName: "Telegram跟进Bot-05",
    botUsername: "@tg_followbot_05",
    botAvatar: "T5",
    botSubscription: "premium",
    botPremiumExpiry: "2025-03-20",
    botPersonaTags: ["数据买手", "支付渠道"],
    botBio: "做跨境支付的，需要大量银行内部数据做风控分析，价格好谈。",
    sourceUrl: "https://t.me/data_market/5678",
    original: "收购各银行内部员工数据，客户信息、账户余额等",
    translation: "",
    publishTime: "2024-12-21 22:10:45",
    images: [],
    platformSource: "Telegram",
    sourceTitle: "数据交易市场",
    relatedDomain: "t.me",
    gangType: "new",
    contentType: "new",
    portrait: "历史会话",
  },
  {
    id: "6",
    avatar: "SM",
    name: "shuadan_pro#5678",
    channel: "Discord",
    lastMessage: "重复线索，已合并到其他任务",
    time: "前天",
    status: "ended",
    unreadCount: 0,
    lastActive: "5小时前",
    publisherId: "shuadan_pro#5678",
    targetUsername: "shuadan_pro#5678",
    targetFollowing: 78,
    targetFollowers: 1560,
    targetPhone: "+86-137-5678-0000",
    targetPreviousNames: ["刷单大师_v1"],
    targetBio: "专业刷单团队，日入500+，无需押金，工资日结。",
    clueId: "CLU-2024122407",
    customer: "TIKTOKSHOP",
    riskScene: "提供礼品卡交易服务",
    riskTags: ["刷单", "虚假交易"],
    botId: "BOT-DC-003",
    botName: "Discord跟进Bot-03",
    botUsername: "@dc_followbot_03",
    botAvatar: "D3",
    botSubscription: "normal",
    botPersonaTags: ["兼职求职", "新手"],
    botBio: "在校大学生找兼职，听说刷单能赚钱，想了解一下怎么操作。",
    sourceUrl: "https://discord.gg/xyz5678",
    original: "专业刷单团队，日入500+，无需押金",
    translation: "",
    publishTime: "2024-12-23 11:00:00",
    images: ["/placeholder.svg"],
    platformSource: "Discord",
    sourceTitle: "刷单兼职群",
    relatedDomain: "discord.gg",
    gangType: "old",
    contentType: "old",
    portrait: "历史会话",
  },
  {
    id: "7",
    avatar: "FC",
    name: "fake_claim_002",
    channel: "微信群",
    lastMessage: "发票和病历就行，其他我们搞定",
    time: "昨天",
    status: "connected",
    unreadCount: 0,
    lastActive: "3小时前",
    publisherId: "fake_claim_002",
    targetUsername: "fake_claim_002",
    targetFollowing: 55,
    targetFollowers: 280,
    targetPhone: "+86-136-0002-0000",
    targetPreviousNames: ["理赔助手_小王"],
    targetBio: "车险、医保理赔一条龙服务，全程线上操作，快速到账。",
    clueId: "CLU-2024122409",
    customer: "ALIEXPRESS",
    riskScene: "虚假交易",
    riskTags: ["保险欺诈", "虚假理赔", "骗保"],
    botId: "BOT-WX-005",
    botName: "微信跟进Bot-05",
    botUsername: "wx_followbot_05",
    botAvatar: "W5",
    botSubscription: "premium",
    botPremiumExpiry: "2025-12-01",
    botPersonaTags: ["理赔客户", "小白求助"],
    botBio: "朋友推荐来的，家里人出了事故需要走理赔流程，不太懂怎么弄。",
    sourceUrl: "",
    original: "代办车险理赔，无需出险现场，全程线上操作。",
    translation: "",
    publishTime: "2024-12-24 10:05:30",
    images: ["/placeholder.svg", "/placeholder.svg"],
    platformSource: "微信",
    sourceTitle: "医保理赔互助群",
    relatedDomain: "",
    gangType: "old",
    contentType: "new",
    portrait: "历史会话",
  },
]

const mockMessagesMap: Record<string, MultiLangMessage[]> = {
  "1": [
    {
      id: "1",
      sender: "target",
      originalText: "I have high quality CC dumps, fresh daily. BTC/USDT accepted.",
      translatedText: "我有高质量的信用卡数据，每日更新。接受BTC/USDT支付。",
      time: "14:32",
    },
    {
      id: "2",
      sender: "bot",
      originalText: "Bro, how do we handle escrow for bulk orders?",
      translatedText: "老哥，量大怎么走担保？",
      time: "14:33",
    },
    {
      id: "3",
      sender: "target",
      originalText: "We can use middleman for large orders. Min 500 pieces. Contact me on Telegram @creditking2024",
      translatedText: "大单可以走担保。最低500条起。Telegram联系我 @creditking2024",
      time: "14:35",
    },
    {
      id: "4",
      sender: "bot",
      originalText: "What's the price? Any samples for testing?",
      translatedText: "价格怎么算？有没有样品测试？",
      time: "14:36",
    },
    {
      id: "5",
      sender: "target",
      originalText: "USA fullz $15 each, EU $20. Sample pack 10 pieces $100. Quality guaranteed 80%+",
      translatedText: "美国全套信息$15一条，欧洲$20。样品包10条$100。质量保证80%以上可用。",
      time: "14:38",
    },
  ],
  "2": [
    {
      id: "1",
      sender: "bot",
      originalText: "Hi, I saw your post about CC dumps. Do you have fresh USA data?",
      translatedText: "你好，看到你发的信用卡数据。有新鲜的美国数据吗？",
      time: "12:30",
    },
    {
      id: "2",
      sender: "target",
      originalText: "Yes, updated daily. What quantity are you looking for?",
      translatedText: "有的，每天更新。你要多少量？",
      time: "13:20",
    },
  ],
  "3": [],
  "4": [
    {
      id: "1",
      sender: "bot",
      originalText: "你好，车险理赔怎么弄？",
      translatedText: "你好，车险理赔怎么弄？",
      time: "09:30",
    },
    {
      id: "2",
      sender: "target",
      originalText: "发票和病历就行，其他我们搞定",
      translatedText: "发票和病历就行，其他我们搞定",
      time: "09:35",
    },
  ],
  "5": [
    {
      id: "1",
      sender: "bot",
      originalText: "支付通道费率多少？",
      translatedText: "支付通道费率多少？",
      time: "17:30",
    },
  ],
  "6": [
    {
      id: "1",
      sender: "bot",
      originalText: "你好，看到招刷单的，怎么操作？",
      translatedText: "你好，看到招刷单的，怎么操作？",
      time: "11:00",
    },
  ],
  "7": [
    {
      id: "1",
      sender: "bot",
      originalText: "医保报销需要哪些材料？",
      translatedText: "医保报销需要哪些材料？",
      time: "16:00",
    },
    {
      id: "2",
      sender: "target",
      originalText: "发票和病历就行，其他我们搞定",
      translatedText: "发票和病历就行，其他我们搞定",
      time: "16:10",
    },
  ],
}

const mockIOCMap: Record<string, IOCItem[]> = {
  "1": [
    { id: "1", type: "phone", value: "+1-555-0123", isManual: false },
    { id: "2", type: "domain", value: "creditking2024.cc", isManual: false },
    { id: "3", type: "email", value: "dumps@proton.me", isManual: true },
  ],
  "2": [
    { id: "1", type: "domain", value: "darkforum.onion", isManual: false },
    { id: "2", type: "email", value: "creditking@mail.com", isManual: false },
  ],
  "3": [
    { id: "1", type: "telegram", value: "@card_seller_888", isManual: false },
  ],
  "4": [
    { id: "1", type: "phone", value: "+86-138-0000-8888", isManual: true },
  ],
  "5": [
    { id: "1", type: "telegram", value: "@data_buyer_pro", isManual: false },
    { id: "2", type: "domain", value: "datamarket.cc", isManual: false },
  ],
  "6": [],
  "7": [
    { id: "1", type: "phone", value: "+86-138-0000-9999", isManual: true },
  ],
}

type FilterStatus = "all" | "messageFailed" | "messaged" | "connected" | "ended"
type RightTab = "bot" | "target" | "clue" | "ioc"

const statusLabels: Record<FilterStatus, string> = {
  all: "全部",
  messageFailed: "留言失败",
  messaged: "已留言",
  connected: "已建联",
  ended: "会话结束",
}

const statusColors: Record<string, string> = {
  messageFailed: "bg-red-100 text-red-700",
  messaged: "bg-yellow-100 text-yellow-700",
  connected: "bg-green-100 text-green-700",
  ended: "bg-gray-100 text-gray-500",
}

export function FollowSessionsWorkstation() {
  const searchParams = useSearchParams()
  const clueIdParam = searchParams.get("clueId")

  const getInitialSelectedId = () => {
    if (clueIdParam) {
      const match = mockConversations.find((c) => c.clueId === clueIdParam)
      if (match) return match.id
    }
    return "1"
  }

  const [searchText, setSearchText] = useState("")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [selectedId, setSelectedId] = useState(getInitialSelectedId)
  const [inputMessage, setInputMessage] = useState("")
  const [translateLang, setTranslateLang] = useState("en")
  const [rightTab, setRightTab] = useState<RightTab>("ioc")
  const [conversations, setConversations] = useState(mockConversations)
  const [iocData, setIocData] = useState(mockIOCMap)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { setHasUnread, setUnreadCount } = useUnread()

  const syncUnread = useCallback(
    (convs: ConversationItem[]) => {
      const totalUnread = convs.reduce((sum, c) => sum + c.unreadCount, 0)
      setHasUnread(totalUnread > 0)
      setUnreadCount(totalUnread)
    },
    [setHasUnread, setUnreadCount],
  )

  useEffect(() => {
    syncUnread(conversations)
  }, [conversations, syncUnread])

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      !searchText ||
      conv.name.toLowerCase().includes(searchText.toLowerCase()) ||
      conv.publisherId.toLowerCase().includes(searchText.toLowerCase()) ||
      conv.clueId.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = filterStatus === "all" || conv.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const currentConv = conversations.find((c) => c.id === selectedId)
  const currentMessages = mockMessagesMap[selectedId] || []
  const currentIOC = iocData[selectedId] || []

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [selectedId])

  const handleSelectConversation = (id: string) => {
    setSelectedId(id)
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    )
  }

  const handleSend = () => {
    if (!inputMessage.trim()) return
    setInputMessage("")
  }

  const handleEndConversation = () => {
    setConversations((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, status: "ended" as const } : c))
    )
  }

  const handleAddIOC = () => {
    const newId = `ioc-${Date.now()}`
    setIocData((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), { id: newId, type: "", value: "", isManual: true }],
    }))
  }

  const handleDeleteIOC = (iocId: string) => {
    setIocData((prev) => ({
      ...prev,
      [selectedId]: (prev[selectedId] || []).filter((item) => item.id !== iocId),
    }))
  }

  const handleIOCTypeChange = (iocId: string, type: string) => {
    setIocData((prev) => ({
      ...prev,
      [selectedId]: (prev[selectedId] || []).map((item) =>
        item.id === iocId ? { ...item, type } : item
      ),
    }))
  }

  const handleIOCValueChange = (iocId: string, value: string) => {
    setIocData((prev) => ({
      ...prev,
      [selectedId]: (prev[selectedId] || []).map((item) =>
        item.id === iocId ? { ...item, value } : item
      ),
    }))
  }

  const statusCounts = {
    all: conversations.length,
    messageFailed: conversations.filter((c) => c.status === "messageFailed").length,
    messaged: conversations.filter((c) => c.status === "messaged").length,
    connected: conversations.filter((c) => c.status === "connected").length,
    ended: conversations.filter((c) => c.status === "ended").length,
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.14)-theme(spacing.12))] bg-white rounded-lg border overflow-hidden">
      {/* ===== LEFT: Conversation List ===== */}
      <div className="w-[340px] shrink-0 flex flex-col border-r bg-gray-50/50">
        {/* Search */}
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索会话/ID/线索..."
              className="pl-9 h-9 text-sm bg-white"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="px-2 py-2 border-b flex gap-1 overflow-x-auto">
          {(Object.keys(statusLabels) as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors shrink-0 ${
                filterStatus === status
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {statusLabels[status]}
              <span className="ml-1 opacity-70">{statusCounts[status]}</span>
            </button>
          ))}
        </div>

        {/* Conversation list */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={`flex items-start gap-3 px-3 py-3 cursor-pointer transition-colors ${
                  selectedId === conv.id
                    ? "bg-blue-50 border-l-2 border-l-blue-500"
                    : "hover:bg-gray-50 border-l-2 border-l-transparent"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-xs shrink-0">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-medium text-sm text-gray-900 truncate">
                        {conv.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-4 font-normal border-0 shrink-0 ${statusColors[conv.status]}`}
                      >
                        {statusLabels[conv.status as FilterStatus]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {conv.unreadCount > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-red-500 text-white text-[10px] font-medium flex items-center justify-center">
                          {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                        </span>
                      )}
                      <span className="text-[11px] text-gray-400">{conv.time}</span>
                    </div>
                  </div>
                  <div className="mt-0.5">
                    <span className="inline-flex items-center text-[10px] text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0 h-4">
                      <Bot className="w-3 h-3 mr-0.5" />
                      {conv.botId.replace("BOT-", "Bot")}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 truncate mt-1">
                    {conv.lastMessage}
                  </div>
                </div>
              </div>
            ))}
            {filteredConversations.length === 0 && (
              <div className="py-12 text-center text-sm text-gray-400">
                暂无匹配的会话
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* ===== MIDDLE: Chat Area ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {currentConv ? (
          <>
            {/* Header - target info */}
            <div className="px-5 py-3 border-b bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-medium text-sm">
                  {currentConv.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {currentConv.publisherId}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-4 font-normal border-0 ${statusColors[currentConv.status]}`}
                    >
                      {statusLabels[currentConv.status as FilterStatus]}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-3 mt-0.5">
                    <span>{currentConv.channel}</span>
                    <span>·</span>
                    <span>最后活跃 {currentConv.lastActive}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {currentConv.status !== "ended" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    onClick={handleEndConversation}
                  >
                    <StopCircle className="w-3.5 h-3.5 mr-1" />
                    结束会话
                  </Button>
                )}
              </div>
            </div>

            {/* Chat messages */}
            <ScrollArea className="flex-1 p-4 bg-gray-50" ref={scrollRef}>
              {currentMessages.length > 0 ? (
                <div className="space-y-4">
                  {currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "bot" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="max-w-[70%] flex flex-col">
                        <div
                          className={`text-[10px] mb-1 text-gray-400 ${
                            msg.sender === "bot" ? "self-end" : "self-start"
                          }`}
                        >
                          {msg.time}
                        </div>
                        <div
                          className={`${
                            msg.sender === "bot"
                              ? "bg-blue-500 text-white rounded-2xl rounded-br-sm"
                              : "bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-bl-sm shadow-sm"
                          } px-4 py-3`}
                        >
                          <div className="space-y-1.5">
                            {msg.originalText !== msg.translatedText && (
                              <div
                                className={`text-[11px] leading-relaxed ${
                                  msg.sender === "bot" ? "text-blue-200" : "text-gray-400"
                                }`}
                              >
                                {msg.originalText}
                              </div>
                            )}
                            <div className="text-sm leading-relaxed">
                              {msg.translatedText}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20">
                  <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                  <span className="text-sm">
                    {currentConv.status === "messageFailed"
                      ? "留言发送失败，暂无聊天记录"
                      : "暂无聊天记录"}
                  </span>
                </div>
              )}
            </ScrollArea>

            {/* Input area */}
            <div className="border-t bg-white p-4 shrink-0">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    placeholder="输入消息..."
                    className="pr-24 h-[44px] text-sm"
                    disabled={currentConv.status === "ended"}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-600"
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-600"
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <Select value={translateLang} onValueChange={setTranslateLang} disabled={currentConv.status === "ended"}>
                  <SelectTrigger className="w-[160px] h-[44px] min-h-[44px] shrink-0 text-sm">
                    <Languages className="w-4 h-4 mr-1.5 text-gray-500 shrink-0" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="ko">한국어</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="th">ไทย</SelectItem>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="zh">简体中文</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleSend}
                  className="h-[44px] px-5 bg-blue-500 hover:bg-blue-600"
                  disabled={currentConv.status === "ended"}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-sm">请选择一个会话开始</p>
            </div>
          </div>
        )}
      </div>

      {/* ===== RIGHT: Auxiliary Info ===== */}
      <div className="w-[380px] shrink-0 flex flex-col border-l bg-white">
        {/* Tabs */}
        <div className="flex border-b shrink-0">
          {(
            [
              { key: "bot", label: "Bot信息", icon: Bot },
              { key: "target", label: "黑产信息", icon: User },
              { key: "clue", label: "线索信息", icon: FileText },
              { key: "ioc", label: "IOC", icon: ShieldAlert },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setRightTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1 py-3 text-xs font-medium transition-colors border-b-2 ${
                rightTab === tab.key
                  ? "text-blue-600 border-blue-500 bg-blue-50/50"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <ScrollArea className="flex-1">
          {currentConv ? (
            <div className="p-4">
              {/* Bot Info Tab */}
              {rightTab === "bot" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {currentConv.botAvatar}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">
                        {currentConv.botName}
                      </div>
                      <div className="text-xs text-gray-500">{currentConv.botId}</div>
                    </div>
                  </div>
                  <InfoRow icon={Globe} label="渠道" value={currentConv.channel} />
                  <InfoRow
                    icon={Crown}
                    label="订阅服务"
                    value={
                      currentConv.botSubscription === "premium" ? (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-100 text-amber-700 border-0 text-xs shrink-0">
                            会员号
                          </Badge>
                          <span className="text-xs text-gray-500">
                            到期：{currentConv.botPremiumExpiry}
                          </span>
                        </div>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-600 border-0 text-xs">
                          普通号
                        </Badge>
                      )
                    }
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Tag className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-xs text-gray-500">人设标签</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 ml-10">
                      {currentConv.botPersonaTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-[11px] text-blue-600 border-blue-200 bg-blue-50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">简介</div>
                        <div className="text-sm text-gray-700 leading-relaxed p-2 bg-gray-50 rounded border border-gray-100">
                          {currentConv.botBio}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Target Info Tab */}
              {rightTab === "target" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {currentConv.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">
                        {currentConv.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {currentConv.targetUsername}
                      </div>
                    </div>
                  </div>
                  <InfoRow
                    icon={Users}
                    label="关注/粉丝"
                    value={`${currentConv.targetFollowing} 关注 / ${currentConv.targetFollowers} 粉丝`}
                  />
                  {currentConv.targetPhone && (
                    <InfoRow icon={Phone} label="手机号" value={currentConv.targetPhone} />
                  )}
                  <InfoRow icon={Clock} label="上次活跃" value={currentConv.lastActive} />
                  <InfoRow icon={Globe} label="渠道" value={currentConv.channel} />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <History className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-xs text-gray-500">曾用昵称</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 ml-10">
                      {currentConv.targetPreviousNames.map((n) => (
                        <Badge
                          key={n}
                          variant="outline"
                          className="text-[11px] text-gray-600 border-gray-300 bg-gray-50"
                        >
                          {n}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">简介</div>
                        <div className="text-sm text-gray-700 leading-relaxed p-2 bg-gray-50 rounded border border-gray-100">
                          {currentConv.targetBio}
                        </div>
                      </div>
                    </div>
                  </div>
                  <InfoRow
                    icon={ShieldAlert}
                    label="风险场景"
                    value={currentConv.riskScene}
                  />
                </div>
              )}

              {/* Clue Info Tab */}
              {rightTab === "clue" && (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">线索ID</div>
                    <div className="font-medium text-sm text-blue-600">
                      {currentConv.clueId}
                    </div>
                  </div>

                  <InfoRow icon={Building} label="客户" value={currentConv.customer} />

                  <div>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">线索原文</div>
                        <div className="text-sm text-gray-700 p-2 bg-gray-50 rounded border leading-relaxed">
                          {currentConv.original}
                        </div>
                        {currentConv.translation && (
                          <>
                            <div className="text-xs text-gray-500 mb-1 mt-2">中文翻译</div>
                            <div className="text-sm text-gray-700 p-2 bg-blue-50 rounded border border-blue-100 leading-relaxed">
                              {currentConv.translation}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Image className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">图片内容</div>
                        {currentConv.images.length > 0 ? (
                          <div className="flex gap-2 flex-wrap">
                            {currentConv.images.slice(0, 2).map((img, idx) => (
                              <div key={idx} className="w-16 h-16 rounded border border-gray-200 bg-gray-100 overflow-hidden">
                                <img src={img} alt={`图片${idx + 1}`} className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {currentConv.images.length > 2 && (
                              <span className="text-xs text-gray-400 self-end">+{currentConv.images.length - 2}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">无</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">来源信息</div>
                        <div className="flex flex-col gap-1 text-xs p-2 bg-gray-50 rounded border border-gray-100">
                          <div className="flex gap-1">
                            <span className="text-gray-400 shrink-0 w-16">发布时间：</span>
                            <span className="text-gray-700">{currentConv.publishTime}</span>
                          </div>
                          <div className="flex gap-1">
                            <span className="text-gray-400 shrink-0 w-16">发布渠道：</span>
                            <span className="text-gray-700">{currentConv.channel}</span>
                          </div>
                          <div className="flex gap-1">
                            <span className="text-gray-400 shrink-0 w-16">发布人：</span>
                            <span className="text-gray-700 font-mono">{currentConv.publisherId}</span>
                          </div>
                          <div className="flex gap-1">
                            <span className="text-gray-400 shrink-0 w-16">平台/来源：</span>
                            <span className="text-gray-700">{currentConv.platformSource}</span>
                          </div>
                          <div className="flex gap-1">
                            <span className="text-gray-400 shrink-0 w-16">群组/标题：</span>
                            <span className="text-gray-700">{currentConv.sourceTitle}</span>
                          </div>
                          {currentConv.relatedDomain && (
                            <div className="flex gap-1">
                              <span className="text-gray-400 shrink-0 w-16">域名：</span>
                              <span className="text-gray-700">{currentConv.relatedDomain}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">风险信息</div>
                        <div className="flex flex-col gap-1.5 text-xs">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400 shrink-0">新老团伙：</span>
                            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 text-[11px]">
                              {currentConv.gangType === "new" ? "新团伙" : "老团伙"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400 shrink-0">新老内容：</span>
                            <Badge variant="outline" className="bg-teal-50 text-teal-600 border-teal-200 text-[11px]">
                              {currentConv.contentType === "new" ? "新内容" : "老内容"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400 shrink-0">风险场景：</span>
                            <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 text-[11px]">
                              {currentConv.riskScene}
                            </Badge>
                          </div>
                          <div className="flex items-start gap-1">
                            <span className="text-gray-400 shrink-0">风险标签：</span>
                            <div className="flex flex-wrap gap-1">
                              {currentConv.riskTags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-[11px] text-blue-600 border-blue-200 bg-blue-50"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* IOC Tab */}
              {rightTab === "ioc" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">
                      关键证据（IOC）
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-blue-600 hover:text-blue-700 px-2"
                      onClick={handleAddIOC}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      新增
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {currentIOC.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                      >
                        <Select
                          value={item.type}
                          onValueChange={(val) => handleIOCTypeChange(item.id, val)}
                        >
                          <SelectTrigger className="w-[90px] h-8 text-xs">
                            <SelectValue placeholder="类型" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="phone">手机号</SelectItem>
                            <SelectItem value="domain">域名</SelectItem>
                            <SelectItem value="email">邮箱</SelectItem>
                            <SelectItem value="card">银行卡</SelectItem>
                            <SelectItem value="ip">IP地址</SelectItem>
                            <SelectItem value="telegram">Telegram</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={item.value}
                          onChange={(e) => handleIOCValueChange(item.id, e.target.value)}
                          placeholder="请输入值"
                          className="flex-1 h-8 text-xs"
                        />
                        {item.isManual && (
                          <Badge
                            variant="outline"
                            className="text-[10px] text-red-500 border-red-200 bg-red-50 shrink-0"
                          >
                            人工添加
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-400 hover:text-red-500 shrink-0"
                          onClick={() => handleDeleteIOC(item.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                    {currentIOC.length === 0 && (
                      <div className="py-8 text-center text-xs text-gray-400">
                        暂无IOC数据，点击上方"新增"添加
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4 text-sm text-gray-400">
              请选择一个会话查看详情
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm text-gray-900 mt-0.5 break-all">{typeof value === "string" ? value : value}</div>
      </div>
    </div>
  )
}
