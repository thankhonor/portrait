// ====================================
// 线索审核模块 - 类型定义
// Clue Review Module - Type Definitions
// ====================================
// 此文件仅供线索审核模块使用

export interface Clue {
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
  status: "pending" | "followed" | "ignored" | "eventCreated"
  operator?: string
  operationTime?: string
  ignoreReason?: string
  followStatus?: "pending" | "following" | "messageFailed" | "messaged" | "connected" | "ignored"
  botId?: string
  chatMessages?: ChatMessage[]
  reviewer?: string
  reviewTime?: string
}

export interface ChatMessage {
  id: string
  sender: "bot" | "target"
  content: string
  time: string
}
