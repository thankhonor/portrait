// ====================================
// 线索跟进模块 - 独立数据文件
// Clue Followup Module - Isolated Data File
// ====================================
// 此文件仅供线索跟进模块使用
// 修改此文件不会影响其他模块

import type { FollowupClue } from "@/lib/modules/clue-followup/types"

// 线索跟进页面的筛选选项
export const clueFollowupChannelOptions = ["Telegram", "Discord", "暗网论坛", "微信群", "QQ群", "Twitter", "其他"]

export const clueFollowupRiskSceneOptions = [
  "账号盗用",
  "虚假交易",
  "提供礼品卡交易服务",
  "信息窃取",
  "资金盗取",
  "身份冒用",
  "其他",
]

export const clueFollowupCustomerOptions = [
  "AMAZON",
  "TIKTOKSHOP",
  "TIKTOK",
  "SHEIN",
  "ICBU",
  "ALIEXPRESS",
  "LAZADA",
  "VINTED",
]

// 基础线索数据（用于生成跟进线索）
const baseClues = [
  {
    customer: "AMAZON",
    industry: "电商",
    original:
      "出售银行卡四件套，身份证+银行卡+U盾+手机卡，支持各大银行，量大从优，长期合作优惠更多。联系TG: @card_seller_888",
    translation: "",
    images: ["/bank-card-fraud-evidence.jpg"],
    channel: "Telegram",
    publisherId: "@card_seller_888",
    sourceUrl: "https://t.me/darkmarket_channel/12345",
    sourceTitle: "暗网市场频道",
    relatedDomain: "amazon.com",
    isNewGang: true,
    isNewContent: true,
    riskScene: "账号盗用",
    riskTags: ["银行卡买卖", "四件套", "身份信息泄露"],
  },
  {
    customer: "TIKTOKSHOP",
    industry: "电商",
    original: "专业刷单团队，日入500+，无需押金，工资日结。新人培训免费，老手直接上岗。私聊详谈 @shuadan_master",
    translation: "",
    images: [],
    channel: "Discord",
    publisherId: "shuadan_master#1234",
    sourceUrl: "https://discord.gg/abcd1234",
    sourceTitle: "兼职交流群",
    relatedDomain: "tiktok.com",
    isNewGang: false,
    isNewContent: false,
    riskScene: "提供礼品卡交易服务",
    riskTags: ["刷单", "虚假交易", "佣金诈骗"],
  },
  {
    customer: "SHEIN",
    industry: "电商",
    original: "High quality credit card dumps, CVV full info available. Fresh data daily updated. BTC/USDT accepted.",
    translation: "高质量信用卡转储，CVV完整信息可用。每日更新新鲜数据。接受BTC/USDT付款。",
    images: ["/credit-card-data-screenshot.jpg"],
    channel: "暗网论坛",
    publisherId: "CreditKing2024",
    sourceUrl: "http://darkforum.onion/thread/98765",
    sourceTitle: "Carding Forum - Premium Section",
    relatedDomain: "shein.com",
    isNewGang: true,
    isNewContent: true,
    riskScene: "信息窃取",
    riskTags: ["信用卡盗刷", "CVV交易", "数据泄露"],
  },
  {
    customer: "ALIEXPRESS",
    industry: "电商",
    original: "代办车险理赔，无需出险现场，全程线上操作。成功率95%以上，手续费仅收赔付金额10%。",
    translation: "",
    images: [],
    channel: "微信群",
    publisherId: "fake_claim_888",
    sourceUrl: "",
    sourceTitle: "车友交流群",
    relatedDomain: "aliexpress.com",
    isNewGang: false,
    isNewContent: true,
    riskScene: "虚假交易",
    riskTags: ["保险欺诈", "虚假理赔", "骗保"],
  },
  {
    customer: "LAZADA",
    industry: "电商",
    original: "收购各银行内部员工数据，客户信息、账户余额等，价格面议。",
    translation: "",
    images: [],
    channel: "Telegram",
    publisherId: "@data_buyer_pro",
    sourceUrl: "https://t.me/data_market/5678",
    sourceTitle: "数据交易频道",
    relatedDomain: "lazada.com",
    isNewGang: true,
    isNewContent: true,
    riskScene: "信息窃取",
    riskTags: ["内部数据", "客户信息", "数据买卖"],
  },
]

export const clueFollowupMockClues: FollowupClue[] = [
  // 待跟进状态
  {
    ...baseClues[0],
    id: "CLU-2024122401",
    captureTime: "2024-12-24 09:15:43",
    publishTime: "2024-12-24 06:15:22",
    status: "pending",
    followStatus: "pending",
    botId: "BOT-TG-001",
    reviewer: "lisi",
    reviewTime: "2024-12-24 11:02:23",
    chatMessages: [],
    iocs: [
      { type: "用户昵称", value: "card_seller_888" },
      { type: "联系方式", value: "@card_seller_888" },
    ],
  },
  // 跟进中状态
  {
    ...baseClues[1],
    id: "CLU-2024122402",
    captureTime: "2024-12-24 09:15:43",
    publishTime: "2024-12-24 07:30:11",
    status: "following",
    followStatus: "messaged",
    botId: "BOT-DC-002",
    reviewer: "lisi",
    reviewTime: "2024-12-24 11:02:23",
    follower: "wangwu",
    followStartTime: "2024-12-25 12:21:38",
    chatMessages: [
      { id: "1", sender: "bot", content: "你好，看到你们招刷单的，怎么操作？", time: "2024-12-24 17:00:00" },
    ],
    iocs: [
      { type: "用户昵称", value: "shuadan_master" },
      { type: "其他联系方式", value: "shuadan_master#1234" },
    ],
  },
  // 暂不关注状态
  {
    ...baseClues[2],
    id: "CLU-2024122403",
    captureTime: "2024-12-24 09:15:43",
    publishTime: "2024-12-24 08:45:30",
    status: "ignored",
    followStatus: "pending",
    reviewer: "lisi",
    reviewTime: "2024-12-24 11:02:23",
    follower: "wangwu",
    followStartTime: "2024-12-25 12:21:38",
    ignoreOperator: "liliu",
    ignoreTime: "2024-12-29 16:21:11",
    ignoreReason: "未获取有效信息，黑产不回复",
    chatMessages: [],
    iocs: [
      { type: "用户昵称", value: "CreditKing2024" },
      { type: "暗网地址", value: "darkforum.onion" },
    ],
  },
  // 跟进中状态 - 已建联
  {
    ...baseClues[3],
    id: "CLU-2024122404",
    captureTime: "2024-12-24 09:15:43",
    publishTime: "2024-12-24 09:20:17",
    status: "following",
    followStatus: "connected",
    botId: "BOT-WX-003",
    reviewer: "lisi",
    reviewTime: "2024-12-24 11:02:23",
    follower: "zhangsan",
    followStartTime: "2024-12-25 14:30:00",
    chatMessages: [
      { id: "1", sender: "bot", content: "你好，车险理赔怎么弄？", time: "2024-12-24 09:30:00" },
      { id: "2", sender: "target", content: "发票和病历就行，其他我们搞定", time: "2024-12-24 09:35:00" },
    ],
    iocs: [
      { type: "用户昵称", value: "fake_claim_888" },
      { type: "诈骗类型", value: "保险理赔诈骗" },
    ],
  },
  // 待跟进状态
  {
    ...baseClues[4],
    id: "CLU-2024122405",
    captureTime: "2024-12-24 09:15:43",
    publishTime: "2024-12-24 10:50:40",
    status: "pending",
    followStatus: "pending",
    botId: "BOT-TG-004",
    reviewer: "lisi",
    reviewTime: "2024-12-24 11:02:23",
    chatMessages: [],
    iocs: [
      { type: "用户昵称", value: "data_buyer_pro" },
      { type: "其他联系方式", value: "@data_buyer_pro" },
    ],
  },
  // 跟进中状态 - 留言失败
  {
    ...baseClues[0],
    id: "CLU-2024122406",
    captureTime: "2024-12-24 09:15:43",
    publishTime: "2024-12-24 11:30:00",
    status: "following",
    followStatus: "messageFailed",
    botId: "BOT-QQ-001",
    reviewer: "lisi",
    reviewTime: "2024-12-24 11:02:23",
    follower: "wangwu",
    followStartTime: "2024-12-25 12:21:38",
    failReason: "对方账号已关闭私信功能，无法发送留言",
    chatMessages: [],
    iocs: [
      { type: "用户昵称", value: "card_seller_888" },
      { type: "售卖类型", value: "银行卡四件套" },
    ],
  },
  // 暂不关注状态
  {
    ...baseClues[1],
    id: "CLU-2024122407",
    captureTime: "2024-12-24 09:15:43",
    publishTime: "2024-12-24 12:20:45",
    status: "ignored",
    followStatus: "messaged",
    botId: "BOT-WX-004",
    reviewer: "lisi",
    reviewTime: "2024-12-24 11:02:23",
    follower: "zhaoliu",
    followStartTime: "2024-12-25 12:21:38",
    ignoreOperator: "admin",
    ignoreTime: "2024-12-30 09:00:00",
    ignoreReason: "重复线索，已合并到其他任务",
    chatMessages: [{ id: "1", sender: "bot", content: "代下单服务怎么收费？", time: "2024-12-24 13:30:00" }],
    iocs: [
      { type: "用户昵称", value: "shuadan_master" },
    ],
  },
  // 待跟进状态
  {
    ...baseClues[2],
    id: "CLU-2024122408",
    captureTime: "2024-12-24 09:15:43",
    publishTime: "2024-12-24 13:45:30",
    status: "pending",
    followStatus: "pending",
    reviewer: "lisi",
    reviewTime: "2024-12-24 11:02:23",
    chatMessages: [],
    iocs: [
      { type: "用户昵称", value: "CreditKing2024" },
      { type: "接受支付", value: "BTC/USDT" },
    ],
  },
  // 跟进中状态
  {
    ...baseClues[3],
    id: "CLU-2024122409",
    captureTime: "2024-12-24 09:15:43",
    publishTime: "2024-12-24 15:20:15",
    status: "following",
    followStatus: "connected",
    botId: "BOT-WX-005",
    reviewer: "lisi",
    reviewTime: "2024-12-24 11:02:23",
    follower: "lisi",
    followStartTime: "2024-12-25 12:21:38",
    chatMessages: [
      { id: "1", sender: "bot", content: "医保报销需要哪些材料？", time: "2024-12-24 16:00:00" },
      { id: "2", sender: "target", content: "发票和病历就行，其他我们搞定", time: "2024-12-24 16:10:00" },
    ],
    iocs: [
      { type: "用户昵称", value: "fake_claim_888" },
      { type: "诈骗类型", value: "医保诈骗" },
    ],
  },
  // 跟进中状态
  {
    ...baseClues[4],
    id: "CLU-2024122410",
    captureTime: "2024-12-24 09:15:43",
    publishTime: "2024-12-24 14:30:20",
    status: "following",
    followStatus: "following",
    botId: "BOT-TG-005",
    reviewer: "lisi",
    reviewTime: "2024-12-24 11:02:23",
    follower: "wangwu",
    followStartTime: "2024-12-25 12:21:38",
    chatMessages: [{ id: "1", sender: "bot", content: "支付通道费率多少？", time: "2024-12-24 17:30:00" }],
    iocs: [
      { type: "用户昵称", value: "data_buyer_pro" },
      { type: "出售类型", value: "内部员工数据" },
    ],
  },
]
