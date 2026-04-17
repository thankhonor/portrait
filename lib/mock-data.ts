// Mock data for clues
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
  // Follow-up specific fields
  followStatus?: "pending" | "following" | "messageFailed" | "messaged" | "connected"
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

export interface Event {
  id: string
  clue: Clue
  eventId: string
  creator: string
  createTime: string
  fraudTargets: string[]
  businessScenes: string[]
  fraudMethods: string[]
  riskSummary: string
  attachments: string[]
  status: "pending" | "published"
  operator?: string
  operationTime?: string
  hasFeedback?: boolean
}

// Generate mock clues
export const mockClues: Clue[] = [
  {
    id: "CLU-2024122501",
    captureTime: "2024-12-25 08:32:15",
    customer: "AMAZON",
    industry: "电商",
    original:
      "出售银行卡四件套，身份证+银行卡+U盾+手机卡，支持各大银行，量大从优，长期合作优惠更多。联系TG: @card_seller_888",
    translation: "",
    images: ["/bank-card-fraud-evidence.jpg"],
    publishTime: "2024-12-25 06:15:22",
    channel: "Telegram",
    publisherId: "@card_seller_888",
    sourceUrl: "https://t.me/darkmarket_channel/12345",
    sourceTitle: "暗网市场频道",
    relatedDomain: "amazon.com",
    isNewGang: true,
    isNewContent: true,
    riskScene: "账号盗用",
    riskTags: ["银行卡买卖", "四件套", "身份信息泄露"],
    status: "pending",
  },
  {
    id: "CLU-2024122502",
    captureTime: "2024-12-25 09:15:43",
    customer: "TIKTOKSHOP",
    industry: "电商",
    original: "专业刷单团队，日入500+，无需押金，工资日结。新人培训免费，老手直接上岗。私聊详谈 @shuadan_master",
    translation: "",
    images: [],
    publishTime: "2024-12-25 07:30:11",
    channel: "Discord",
    publisherId: "shuadan_master#1234",
    sourceUrl: "https://discord.gg/abcd1234",
    sourceTitle: "兼职交流群",
    relatedDomain: "tiktok.com",
    isNewGang: false,
    isNewContent: false,
    riskScene: "提供礼品卡交易服务",
    riskTags: ["刷单", "虚假交易", "佣金诈骗"],
    status: "pending",
  },
  {
    id: "CLU-2024122503",
    captureTime: "2024-12-25 10:22:08",
    customer: "SHEIN",
    industry: "电商",
    original:
      "High quality credit card dumps, CVV full info available. Fresh data daily updated. BTC/USDT accepted. Contact: creditking@proton.me",
    translation: "高质量信用卡转储，CVV完整信息可用。每日更新新鲜数据。接受BTC/USDT付款。联系：creditking@proton.me",
    images: ["/credit-card-data-screenshot.jpg", "/payment-proof.jpg"],
    publishTime: "2024-12-25 08:45:30",
    channel: "暗网论坛",
    publisherId: "CreditKing2024",
    sourceUrl: "http://darkforum.onion/thread/98765",
    sourceTitle: "Carding Forum - Premium Section",
    relatedDomain: "shein.com",
    isNewGang: true,
    isNewContent: true,
    riskScene: "信息窃取",
    riskTags: ["信用卡盗刷", "CVV交易", "数据泄露"],
    status: "pending",
  },
  {
    id: "CLU-2024122504",
    captureTime: "2024-12-25 11:08:55",
    customer: "ALIEXPRESS",
    industry: "电商",
    original: "代办车险理赔，无需出险现场，全程线上操作。成功率95%以上，手续费仅收赔付金额10%。微信：fake_claim_888",
    translation: "",
    images: [],
    publishTime: "2024-12-25 09:20:17",
    channel: "微信群",
    publisherId: "fake_claim_888",
    sourceUrl: "",
    sourceTitle: "车友交流群",
    relatedDomain: "aliexpress.com",
    isNewGang: false,
    isNewContent: true,
    riskScene: "虚假交易",
    riskTags: ["保险欺诈", "虚假理赔", "骗保"],
    status: "pending",
  },
  {
    id: "CLU-2024122505",
    captureTime: "2024-12-25 12:35:22",
    customer: "LAZADA",
    industry: "电商",
    original: "收购各银行内部员工数据，客户信息、账户余额等，价格面议。数据越全越新，价格越高。TG: @data_buyer_pro",
    translation: "",
    images: [],
    publishTime: "2024-12-25 10:50:40",
    channel: "Telegram",
    publisherId: "@data_buyer_pro",
    sourceUrl: "https://t.me/data_market/5678",
    sourceTitle: "数据交易频道",
    relatedDomain: "lazada.com",
    isNewGang: true,
    isNewContent: true,
    riskScene: "信息窃取",
    riskTags: ["内部数据", "客户信息", "数据买卖"],
    status: "pending",
  },
  {
    id: "CLU-2024122506",
    captureTime: "2024-12-25 13:18:30",
    customer: "VINTED",
    industry: "电商",
    original: "内幕消息，下周必涨股票，跟着操作稳赚不赔。入群费888，回本后再收20%分成。QQ群：123456789",
    translation: "",
    images: [],
    publishTime: "2024-12-25 11:30:00",
    channel: "QQ群",
    publisherId: "stock_master_666",
    sourceUrl: "",
    sourceTitle: "股票交流群",
    relatedDomain: "vinted.com",
    isNewGang: false,
    isNewContent: true,
    riskScene: "虚假交易",
    riskTags: ["荐股诈骗", "投资诈骗", "虚假信息"],
    status: "pending",
  },
  {
    id: "CLU-2024122507",
    captureTime: "2024-12-25 14:05:12",
    customer: "TIKTOK",
    industry: "社交",
    original: "代下单服务，各大电商平台均可，利用内部优惠券，商品五折起。微信：cheap_buy_888",
    translation: "",
    images: [],
    publishTime: "2024-12-25 12:20:45",
    channel: "微信群",
    publisherId: "cheap_buy_888",
    sourceUrl: "",
    sourceTitle: "省钱购物群",
    relatedDomain: "tiktok.com",
    isNewGang: true,
    isNewContent: false,
    riskScene: "提供礼品卡交易服务",
    riskTags: ["优惠券滥用", "代下单", "薅羊毛"],
    status: "pending",
  },
  {
    id: "CLU-2024122508",
    captureTime: "2024-12-25 15:22:08",
    customer: "ICBU",
    industry: "B2B",
    original: "出售支付通道，费率0.3%起，T+0结算，支持各类业务。长期稳定，欢迎咨询。TG: @payment_channel",
    translation: "",
    images: [],
    publishTime: "2024-12-25 13:45:30",
    channel: "Twitter",
    publisherId: "@loan_service_pro",
    sourceUrl: "https://twitter.com/loan_service_pro/status/123",
    sourceTitle: "贷款服务推广",
    relatedDomain: "alibaba.com",
    isNewGang: false,
    isNewContent: true,
    riskScene: "虚假交易",
    riskTags: ["贷款诈骗", "虚假广告", "非法金融"],
    status: "pending",
  },
  {
    id: "CLU-2024122509",
    captureTime: "2024-12-25 16:10:45",
    customer: "AMAZON",
    industry: "电商",
    original: "代办社保、医保报销，各类发票均可处理。成功率高，价格优惠。微信：insurance_agent_666",
    translation: "",
    images: [],
    publishTime: "2024-12-25 15:20:15",
    channel: "微信群",
    publisherId: "insurance_agent_666",
    sourceUrl: "",
    sourceTitle: "保险理赔群",
    relatedDomain: "amazon.com",
    isNewGang: false,
    isNewContent: false,
    riskScene: "虚假交易",
    riskTags: ["保险欺诈", "发票造假", "骗保"],
    status: "pending",
  },
  {
    id: "CLU-2024122510",
    captureTime: "2024-12-25 17:05:33",
    customer: "TIKTOKSHOP",
    industry: "电商",
    original: "出售支付通道，费率0.3%起，T+0结算，支持各类业务。长期稳定，欢迎咨询。TG: @payment_channel",
    translation: "",
    images: [],
    publishTime: "2024-12-25 14:30:20",
    channel: "Telegram",
    publisherId: "@payment_channel",
    sourceUrl: "https://t.me/payment_services/789",
    sourceTitle: "支付服务频道",
    relatedDomain: "tiktok.com",
    isNewGang: true,
    isNewContent: true,
    riskScene: "资金盗取",
    riskTags: ["非法支付通道", "洗钱", "资金转移"],
    status: "pending",
  },
  {
    id: "CLU-2024122511",
    captureTime: "2024-12-25 18:30:22",
    customer: "SHEIN",
    industry: "电商",
    original: "收购企业对公账户，价格面议，长期合作优先。要求：正规注册公司，账户状态正常。TG: @corp_account_buy",
    translation: "",
    images: [],
    publishTime: "2024-12-25 16:45:10",
    channel: "Telegram",
    publisherId: "@corp_account_buy",
    sourceUrl: "https://t.me/account_market/456",
    sourceTitle: "账户交易频道",
    relatedDomain: "shein.com",
    isNewGang: true,
    isNewContent: true,
    riskScene: "账号盗用",
    riskTags: ["对公账户买卖", "洗钱", "企业账户"],
    status: "pending",
  },
]

// Generate mock follow-up clues
export const mockFollowupClues: Clue[] = [
  {
    ...mockClues[0],
    id: "CLU-2024122401",
    status: "followed",
    followStatus: "connected",
    botId: "BOT-TG-001",
    reviewer: "lisi@threathunter.cn",
    reviewTime: "2024-12-24 14:30:00",
    chatMessages: [
      { id: "1", sender: "bot", content: "您好，请问银行卡四件套怎么购买？", time: "2024-12-24 15:00:00" },
      { id: "2", sender: "target", content: "一套800，量大可优惠，需要几套？", time: "2024-12-24 15:05:22" },
      { id: "3", sender: "bot", content: "先要两套试试，都是哪些银行的？", time: "2024-12-24 15:10:15" },
      { id: "4", sender: "target", content: "工农建招都有，你要什么银行的？", time: "2024-12-24 15:12:30" },
    ],
  },
  {
    ...mockClues[1],
    id: "CLU-2024122402",
    status: "followed",
    followStatus: "messaged",
    botId: "BOT-DC-002",
    reviewer: "wangwu@threathunter.cn",
    reviewTime: "2024-12-24 16:20:00",
    chatMessages: [
      { id: "1", sender: "bot", content: "你好，看到你们招刷单的，怎么操作？", time: "2024-12-24 17:00:00" },
    ],
  },
  {
    ...mockClues[2],
    id: "CLU-2024122403",
    status: "followed",
    followStatus: "pending",
    reviewer: "zhaoliu@threathunter.cn",
    reviewTime: "2024-12-24 18:45:00",
    chatMessages: [],
  },
  {
    ...mockClues[3],
    id: "CLU-2024122404",
    status: "followed",
    followStatus: "following",
    botId: "BOT-WX-003",
    reviewer: "zhangsan@threathunter.cn",
    reviewTime: "2024-12-24 09:15:00",
    chatMessages: [{ id: "1", sender: "bot", content: "你好，车险理赔怎么弄？", time: "2024-12-24 09:30:00" }],
  },
  {
    ...mockClues[4],
    id: "CLU-2024122405",
    status: "followed",
    followStatus: "messageFailed",
    botId: "BOT-TG-004",
    reviewer: "lisi@threathunter.cn",
    reviewTime: "2024-12-24 10:00:00",
    chatMessages: [],
  },
  {
    ...mockClues[5],
    id: "CLU-2024122406",
    status: "followed",
    followStatus: "connected",
    botId: "BOT-QQ-001",
    reviewer: "wangwu@threathunter.cn",
    reviewTime: "2024-12-24 11:30:00",
    chatMessages: [
      { id: "1", sender: "bot", content: "入群需要什么条件？", time: "2024-12-24 12:00:00" },
      { id: "2", sender: "target", content: "入群费888，交钱就能进", time: "2024-12-24 12:05:00" },
    ],
  },
  {
    ...mockClues[6],
    id: "CLU-2024122407",
    status: "followed",
    followStatus: "messaged",
    botId: "BOT-WX-004",
    reviewer: "zhaoliu@threathunter.cn",
    reviewTime: "2024-12-24 13:00:00",
    chatMessages: [{ id: "1", sender: "bot", content: "代下单服务怎么收费？", time: "2024-12-24 13:30:00" }],
  },
  {
    ...mockClues[7],
    id: "CLU-2024122408",
    status: "followed",
    followStatus: "pending",
    reviewer: "zhangsan@threathunter.cn",
    reviewTime: "2024-12-24 14:00:00",
    chatMessages: [],
  },
  {
    ...mockClues[8],
    id: "CLU-2024122409",
    status: "followed",
    followStatus: "connected",
    botId: "BOT-WX-005",
    reviewer: "lisi@threathunter.cn",
    reviewTime: "2024-12-24 15:30:00",
    chatMessages: [
      { id: "1", sender: "bot", content: "医保报销需要哪些材料？", time: "2024-12-24 16:00:00" },
      { id: "2", sender: "target", content: "发票和病历就行，其他我们搞定", time: "2024-12-24 16:10:00" },
    ],
  },
  {
    ...mockClues[9],
    id: "CLU-2024122410",
    status: "followed",
    followStatus: "following",
    botId: "BOT-TG-005",
    reviewer: "wangwu@threathunter.cn",
    reviewTime: "2024-12-24 17:00:00",
    chatMessages: [{ id: "1", sender: "bot", content: "支付通道费率多少？", time: "2024-12-24 17:30:00" }],
  },
  {
    ...mockClues[10],
    id: "CLU-2024122411",
    captureTime: "2024-12-24 19:00:00",
    status: "followed",
    followStatus: "pending",
    reviewer: "zhangsan@threathunter.cn",
    reviewTime: "2024-12-24 19:30:00",
    chatMessages: [],
  },
  {
    ...mockClues[1],
    id: "CLU-2024122412",
    captureTime: "2024-12-24 20:00:00",
    status: "followed",
    followStatus: "connected",
    botId: "BOT-DC-003",
    reviewer: "lisi@threathunter.cn",
    reviewTime: "2024-12-24 20:30:00",
    chatMessages: [
      { id: "1", sender: "bot", content: "新人怎么入门？", time: "2024-12-24 21:00:00" },
      { id: "2", sender: "target", content: "加群培训，学会了就能上岗", time: "2024-12-24 21:05:00" },
    ],
  },
  {
    ...mockClues[2],
    id: "CLU-2024122413",
    captureTime: "2024-12-24 21:00:00",
    status: "followed",
    followStatus: "messageFailed",
    botId: "BOT-EMAIL-001",
    reviewer: "wangwu@threathunter.cn",
    reviewTime: "2024-12-24 21:30:00",
    chatMessages: [],
  },
  {
    ...mockClues[3],
    id: "CLU-2024122414",
    captureTime: "2024-12-24 22:00:00",
    status: "followed",
    followStatus: "following",
    botId: "BOT-WX-006",
    reviewer: "zhaoliu@threathunter.cn",
    reviewTime: "2024-12-24 22:30:00",
    chatMessages: [{ id: "1", sender: "bot", content: "理赔成功率真有那么高吗？", time: "2024-12-24 23:00:00" }],
  },
]

// Generate mock events
export const mockEvents: Event[] = [
  {
    id: "EVT-001",
    clue: mockClues[0],
    eventId: "EVT-2024122401",
    creator: "zhangsan@threathunter.cn",
    createTime: "2024-12-24 10:30:00",
    fraudTargets: ["个人用户", "企业客户"],
    businessScenes: ["开户", "转账"],
    fraudMethods: ["银行卡买卖", "身份冒用"],
    riskSummary:
      "发现Telegram频道存在大量银行卡四件套出售信息，涉及多家银行。黑产团伙通过收购实名银行卡进行洗钱、电信诈骗等违法活动。建议加强开户审核，对异常账户进行监控。",
    attachments: ["evidence_01.png", "chat_record.pdf"],
    status: "pending",
  },
  {
    id: "EVT-002",
    clue: mockClues[2],
    eventId: "EVT-2024122302",
    creator: "lisi@threathunter.cn",
    createTime: "2024-12-23 15:20:00",
    fraudTargets: ["持卡用户"],
    businessScenes: ["在线支付", "POS消费"],
    fraudMethods: ["信用卡盗刷", "CVV交易"],
    riskSummary:
      "暗网论坛发现信用卡数据交易信息，攻击者声称拥有大量有效CVV数据。数据来源可能为商户端泄露或钓鱼攻击获取。建议通知受影响用户更换卡片，加强交易监控。",
    attachments: ["dark_forum_screenshot.png"],
    status: "published",
    operator: "lisi@threathunter.cn",
    operationTime: "2024-12-23 16:00:00",
    hasFeedback: true,
  },
]

// Risk scene options
export const riskSceneOptions = [
  "账号盗用",
  "虚假交易",
  "提供礼品卡交易服务",
  "信息窃取",
  "资金盗取",
  "身份冒用",
  "其他",
]

// Risk tag options
export const riskTagOptions = [
  "银行卡买卖",
  "四件套",
  "身份信息泄露",
  "刷单",
  "虚假交易",
  "佣金诈骗",
  "信用卡盗刷",
  "CVV交易",
  "数据泄露",
  "保险欺诈",
  "虚假理赔",
  "骗保",
  "内部数据",
  "客户信息",
  "数据买卖",
  "荐股诈骗",
  "投资诈骗",
  "贷款诈骗",
  "虚假广告",
  "非法金融",
  "非法支付通道",
  "发票造假",
  "对公账户买卖",
]

// Channel options
export const channelOptions = ["Telegram", "Discord", "暗网论坛", "微信群", "QQ群", "Twitter", "其他"]

// Customer options
export const customerOptions = ["AMAZON", "TIKTOKSHOP", "TIKTOK", "SHEIN", "ICBU", "ALIEXPRESS", "LAZADA", "VINTED"]

// Fraud target options
export const fraudTargetOptions = ["个人用户", "企业客户", "持卡用户", "商户", "内部员工"]

// Business scene options
export const businessSceneOptions = ["开户", "转账", "在线支付", "POS消费", "贷款", "理赔", "交易"]

// Fraud method options
export const fraudMethodOptions = [
  "银行卡买卖",
  "身份冒用",
  "信用卡盗刷",
  "CVV交易",
  "刷单套利",
  "虚假理赔",
  "数据窃取",
  "钓鱼攻击",
  "贷款诈骗",
  "非法支付通道",
  "发票造假",
  "对公账户买卖",
]

// Industry options
export const industryOptions = ["金融", "电商", "支付", "保险", "证券", "互联网", "其他", "社交", "B2B"]
