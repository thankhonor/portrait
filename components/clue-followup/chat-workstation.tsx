"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
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
  X,
  Send,
  Smile,
  Paperclip,
  Plus,
  Trash2,
  StopCircle,
} from "lucide-react"
import type { FollowupClue, ChatMessage } from "@/lib/modules/clue-followup/types"

interface ChatWorkstationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clue: FollowupClue | null
}

// 模拟多语言聊天消息
interface MultiLangMessage extends ChatMessage {
  originalText: string
  translatedText: string
}

// 模拟 IOC 数据
interface IOCItem {
  id: string
  type: string
  value: string
  isManual: boolean
}

// 模拟 Bot 会话列表
interface BotConversation {
  id: string
  avatar: string
  name: string
  lastMessage: string
  time: string
  isBot?: boolean
  isEnded?: boolean
  unreadCount?: number
}

export function ChatWorkstation({ open, onOpenChange, clue }: ChatWorkstationProps) {
  const [inputMessage, setInputMessage] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedConvId, setSelectedConvId] = useState("1")

  // Bot 会话列表
  const [botConversations, setBotConversations] = useState<BotConversation[]>([
    { id: "1", avatar: "A", name: "Alex Crypto", lastMessage: "价格怎么算？有没有样品测试？", time: "14:36", isEnded: false, unreadCount: 3 },
    { id: "2", avatar: "B", name: "Bot-79", lastMessage: "老哥，量大怎么走担保？", time: "14:33", isBot: true, isEnded: true, unreadCount: 0 },
    { id: "3", avatar: "C", name: "CryptoTrader", lastMessage: "可以先看看样品吗？", time: "昨天", isEnded: true, unreadCount: 5 },
  ])

  // 模拟聊天消息（包含多语言）
  const [messages] = useState<MultiLangMessage[]>([
    {
      id: "1",
      sender: "target",
      content: "I have high quality CC dumps, fresh daily. BTC/USDT accepted.",
      originalText: "I have high quality CC dumps, fresh daily. BTC/USDT accepted.",
      translatedText: "我有高质量的信用卡数据，每日更新。接受BTC/USDT支付。",
      time: "14:32",
    },
    {
      id: "2",
      sender: "bot",
      content: "老哥，量大怎么走担保？",
      originalText: "Bro, how do we handle escrow for bulk orders?",
      translatedText: "老哥，量大怎么走担保？",
      time: "14:33",
    },
    {
      id: "3",
      sender: "target",
      content: "We can use middleman for large orders. Min 500 pieces. Contact me on Telegram @creditking2024",
      originalText: "We can use middleman for large orders. Min 500 pieces. Contact me on Telegram @creditking2024",
      translatedText: "大单可以走担保。最低500条起。Telegram联系我 @creditking2024",
      time: "14:35",
    },
    {
      id: "4",
      sender: "bot",
      content: "价格怎么算？有没有样品测试？",
      originalText: "What's the price? Any samples for testing?",
      translatedText: "价格怎么算？有没有样品测试？",
      time: "14:36",
    },
    {
      id: "5",
      sender: "target",
      content: "USA fullz $15 each, EU $20. Sample pack 10 pieces $100. Quality guaranteed 80%+",
      originalText: "USA fullz $15 each, EU $20. Sample pack 10 pieces $100. Quality guaranteed 80%+",
      translatedText: "美国全套信息$15一条，欧洲$20。样品包10条$100。质量保证80%以上可用。",
      time: "14:38",
    },
  ])

  // IOC 数据
  const [iocItems, setIocItems] = useState<IOCItem[]>([
    { id: "1", type: "phone", value: "+1-555-0123", isManual: false },
    { id: "2", type: "domain", value: "creditking2024.cc", isManual: false },
    { id: "3", type: "email", value: "dumps@proton.me", isManual: true },
  ])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!inputMessage.trim()) return
    console.log("发送消息:", inputMessage)
    setInputMessage("")
  }

  // 结束当前会话
  const handleEndConversation = () => {
    setBotConversations(prev => prev.map(conv => 
      conv.id === selectedConvId ? { ...conv, isEnded: true } : conv
    ))
  }

  // 选择会话
  const handleSelectConversation = (convId: string) => {
    setSelectedConvId(convId)
    // 选择会话时清除未读数
    setBotConversations(prev => prev.map(conv => 
      conv.id === convId ? { ...conv, unreadCount: 0 } : conv
    ))
  }

  // 获取当前选中的会话
  const currentConversation = botConversations.find(c => c.id === selectedConvId)
  const isCurrentEnded = currentConversation?.isEnded || false

  const handleAddIOC = () => {
    const newId = `ioc-${Date.now()}`
    setIocItems(prev => [...prev, { id: newId, type: "", value: "", isManual: true }])
  }

  const handleDeleteIOC = (id: string) => {
    setIocItems(prev => prev.filter(item => item.id !== id))
  }

  const handleIOCTypeChange = (id: string, type: string) => {
    setIocItems(prev => prev.map(item => item.id === id ? { ...item, type } : item))
  }

  const handleIOCValueChange = (id: string, value: string) => {
    setIocItems(prev => prev.map(item => item.id === id ? { ...item, value } : item))
  }

  if (!clue) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[90vw] !w-[1200px] h-[85vh] p-0 gap-0 overflow-hidden" showCloseButton={false}>
        {/* 顶部导航栏 */}
        <div className="flex items-center justify-between px-5 py-3 border-b bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-medium text-sm">
              {clue.publisherId?.slice(0, 2).toUpperCase() || "TG"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{clue.publisherId || "shuadan_master#1234"}</span>
              </div>
              <div className="text-xs text-gray-500">
                {clue.channel || "Discord"} · 最后活跃 10分钟前
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-gray-700"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 主体内容区 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 左侧聊天区域 */}
          <div className="flex-1 flex flex-col">
            {/* 结束会话操作栏 */}
            <div className="px-4 py-2 border-b bg-white flex items-center justify-between">
              <div className="text-xs text-gray-500">
                当前会话：<span className="font-medium text-gray-700">{currentConversation?.name || "未选择"}</span>
                {isCurrentEnded && (
                  <Badge variant="outline" className="ml-2 text-[10px] text-gray-500 border-gray-300 bg-gray-100">
                    已结束
                  </Badge>
                )}
              </div>
              {!isCurrentEnded && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  onClick={handleEndConversation}
                >
                  <StopCircle className="w-3.5 h-3.5 mr-1" />
                  结束当前会话
                </Button>
              )}
            </div>
            
            {/* 聊天消息区 */}
            <ScrollArea className="flex-1 p-4 bg-gray-50" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "bot" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        msg.sender === "bot"
                          ? "bg-blue-500 text-white rounded-2xl rounded-br-sm"
                          : "bg-white border border-gray-200 text-gray-900 rounded-2xl rounded-bl-sm shadow-sm"
                      } px-4 py-3`}
                    >
                      {/* 多语言显示：原文(小字灰色) + 翻译(正常字体) */}
                      <div className="space-y-1.5">
                        <div className={`text-[11px] leading-relaxed ${
                          msg.sender === "bot" ? "text-blue-200" : "text-gray-400"
                        }`}>
                          {msg.originalText}
                        </div>
                        <div className="text-sm leading-relaxed">
                          {msg.translatedText}
                        </div>
                      </div>
                      <div
                        className={`text-[10px] mt-2 ${
                          msg.sender === "bot" ? "text-blue-300" : "text-gray-400"
                        }`}
                      >
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* 底部输入区 */}
            <div className="border-t bg-white p-4">
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
                    className="pr-24 h-11 text-sm"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSend}
                  className="h-11 px-5 bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* 右侧面板 */}
          <div className="w-[320px] shrink-0 flex flex-col border-l bg-white">
            {/* 上方：Bot 消息列表 */}
            <div className="flex-1 flex flex-col border-b overflow-hidden">
              <div className="px-4 py-3 border-b bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700">会话列表</h3>
              </div>
              <ScrollArea className="flex-1">
                <div className="divide-y">
                  {botConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                        selectedConvId === conv.id 
                          ? "bg-blue-50 border-l-2 border-l-blue-500" 
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0 ${
                        conv.isBot ? "bg-blue-500" : "bg-gradient-to-br from-purple-500 to-pink-500"
                      }`}>
                        {conv.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-sm text-gray-900 truncate">{conv.name}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {conv.unreadCount !== undefined && conv.unreadCount > 0 && (
                              <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-red-500 text-white text-[10px] font-medium flex items-center justify-center">
                                {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                              </span>
                            )}
                            <span className="text-xs text-gray-400">{conv.time}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-0.5">
                          {conv.isEnded ? (
                            <span className="text-gray-400">当前会话已结束</span>
                          ) : (
                            conv.lastMessage
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* 下方：IOC 提取 */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">关键证据（IOC）</h3>
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
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-2">
                  {iocItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                    >
                      <Select value={item.type} onValueChange={(val) => handleIOCTypeChange(item.id, val)}>
                        <SelectTrigger className="w-[100px] h-8 text-xs">
                          <SelectValue placeholder="IOC类型" />
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
                        placeholder="请输入具体值"
                        className="flex-1 h-8 text-xs"
                      />
                      {item.isManual && (
                        <Badge variant="outline" className="text-[10px] text-red-500 border-red-200 bg-red-50 shrink-0">
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
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
