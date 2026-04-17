// Bot 订阅服务类型
export type SubscriptionType = "normal" | "premium"

// Bot 使用分类
export type UsageCategory = "has_send" | "started_only" | "never_used"

// Bot 发送成功率分类
export type SuccessRateCategory = "full" | "partial" | "zero"

// Bot 状态类型
export type BotStatus = "available" | "unavailable"

// Bot 不可用原因类型
export type UnavailableReason = 
  | "in_progress"      // 进行中
  | "cooling_down"     // 冷却中
  | "chat_limit"       // 到达私聊数限制
  | "rate_limited"     // 被限流
  | "banned"           // 被封禁

// 人设标签类型
export type PersonaTag = 
  | "海外小白买家"
  | "寻找上游的代理"
  | "同行交流"
  | "技术宅"
  | "资深玩家"
  | "新手入行"

// Bot 信息接口
export interface BotInfo {
  id: string
  tgAvatar: string
  tgId: string
  tgUsername: string
  registrationDays: number
  followingCount: number
  followersCount: number
  boundPhone: string
  boundProxyIp: string
  personaTags: PersonaTag[]
  subscriptionType: SubscriptionType

  // 群组/频道数据
  joinedGroupCount: number       // 加入群组数
  joinedChannelCount: number     // 加入频道数
  createdChannelCount: number    // 创建频道数
  channelSubscriberCount: number // 频道订阅数

  // 风控数据
  todayPrivateChatCount: number
  totalConnectionCount: number
  historyRestrictionCount: number
  
  // 使用分类
  usageCategory: UsageCategory

  // 发送成功率分类
  successRateCategory?: SuccessRateCategory

  // 状态
  status: BotStatus
  unavailableReason?: UnavailableReason
  cooldownEndTime?: Date // 冷却结束时间
}

// 状态显示配置
export const statusConfig: Record<BotStatus, { label: string; color: string }> = {
  available: { label: "可用", color: "text-green-600 bg-green-50 border-green-200" },
  unavailable: { label: "不可用", color: "text-red-600 bg-red-50 border-red-200" },
}

// 不可用原因显示配置
export const unavailableReasonConfig: Record<UnavailableReason, { label: string; color: string }> = {
  in_progress: { label: "进行中", color: "text-blue-600 bg-blue-50" },
  cooling_down: { label: "冷却中", color: "text-orange-600 bg-orange-50" },
  chat_limit: { label: "到达私聊数限制", color: "text-yellow-600 bg-yellow-50" },
  rate_limited: { label: "被限流", color: "text-purple-600 bg-purple-50" },
  banned: { label: "被封禁", color: "text-red-600 bg-red-50" },
}

// Bot 总体概括数据
export interface BotSummary {
  totalBots: number
  botsWithLogs: number
  botsWithSendAttempts: number
  botsStartedOnly: number
  botsNeverUsed: number
  successRate100: { count: number; percent: number }
  partialSuccess: { count: number; percent: number }
  successRate0: { count: number; percent: number }
  totalErrors: number
  errorCategories: number
  topErrors: { category: string; count: number; botCount: number }[]
}

// Bot 会话记录
export interface BotSession {
  id: string
  target: string          // 会话目标（用户/群组）
  startTime: string       // 会话开始时间
  endTime?: string        // 会话结束时间
  endReason: string       // 结束原因："正常结束" 或 异常原因
  duration?: string       // 会话耗时
  messageCount?: number   // 发送消息条数
}

// 订阅服务显示配置
export const subscriptionConfig: Record<SubscriptionType, { label: string; color: string }> = {
  normal: { label: "普通号", color: "text-gray-600 bg-gray-50 border-gray-200" },
  premium: { label: "会员号", color: "text-amber-600 bg-amber-50 border-amber-200" },
}

// 人设标签颜色配置
export const personaTagColors: Record<PersonaTag, string> = {
  "海外小白买家": "bg-blue-100 text-blue-700 border-blue-200",
  "寻找上游的代理": "bg-purple-100 text-purple-700 border-purple-200",
  "同行交流": "bg-green-100 text-green-700 border-green-200",
  "技术宅": "bg-gray-100 text-gray-700 border-gray-200",
  "资深玩家": "bg-amber-100 text-amber-700 border-amber-200",
  "新手入行": "bg-pink-100 text-pink-700 border-pink-200",
}
