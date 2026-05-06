// ====================================
// 线索跟进模块 - 类型定义
// Clue Followup Module - Type Definitions
// ====================================
// 此文件仅供线索跟进模块使用

export interface ChatMessage {
  id: string
  sender: "bot" | "target"
  content: string
  time: string
}

export interface IOC {
  type: string
  value: string
}

export interface FollowupClue {
  id: string
  captureTime: string
  customer: string
  industry: string
  original: string
  translation: string
  images: string[]
  publishTime: string
  channel: string
  publisherId: string
  sourceUrl: string
  sourceTitle: string
  relatedDomain: string
  isNewGang: boolean
  isNewContent: boolean
  riskScene: string
  riskTags: string[]
  status: "pending" | "following" | "ignored"
  operator?: string
  operationTime?: string
  ignoreReason?: string
  followStatus: "pending" | "following" | "messageFailed" | "messaged" | "connected"
  botId?: string
  chatMessages: ChatMessage[]
  reviewer: string
  reviewTime: string
  follower?: string // 跟进人
  followStartTime?: string // 开始跟进时间
  ignoreOperator?: string // 暂不关注操作人
  ignoreTime?: string // 暂不关注操作时间
  failReason?: string // 失败原因
  remarks?: string // 备注
  iocs?: IOC[] // 关键证据（IOC）
}

export interface ClueFollowupFilters {
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
  followupProgress: string
  channelOptions: string[]
  riskSceneOptions: string[]
}
