export type ProfileType = "account" | "group"

export interface RiskSceneTag {
  name: string
  count: number
}

export interface GangAccount {
  id: string
  name: string
  type: "account"
  aliases: string[]
  followingCount: number
  followersCount: number
  phone: string
  registerTime: string
  lastActive: string
  sourceChannel: string
  bio: string
  riskScenes: RiskSceneTag[]
}

export interface GangGroup {
  id: string
  name: string
  type: "group"
  groupNumber: string
  description: string
  memberCount: number
  firstMonitorTime: string
  lastActive: string
  sourceChannel: string
  riskScenes: RiskSceneTag[]
}

export type GangProfile = GangAccount | GangGroup

export type ClueStatus = "pendingReview" | "ignored" | "pendingFollowup" | "following" | "followEnded" | "eventCreated"

export interface RelatedClue {
  id: string
  title: string
  product: string
  status: ClueStatus
  riskScene: string
  channel: string
  publishTime: string
}

export interface ClueStatistics {
  total: number
  pendingReview: number
  ignored: number
  pendingFollowup: number
  following: number
  followEnded: number
  eventCreated: number
}

export interface RelatedGroup {
  id: string
  name: string
  memberCount: number
}

export interface RelatedAdmin {
  id: string
  name: string
  role: string
}

export interface RelatedIOC {
  id: string
  type: "IP" | "域名" | "邮箱" | "手机号" | "Hash"
  value: string
  firstSeen: string
  lastSeen: string
}

export interface RelatedFile {
  id: string
  name: string
  type: string
  fileCategory: "图片" | "文档" | "代码" | "数据"
  size: string
  uploadTime: string
  source: string
}

export interface RelatedAccount {
  id: string
  name: string
  role: string
}

export interface HighFreqWord {
  word: string
  count: number
}

export interface ActiveHotspot {
  location: string
  country: string
  count: number
  percentage: number
}
