import type { GangProfile, GangAccount, GangGroup, RelatedClue, ClueStatistics, RelatedGroup, RelatedAdmin, RelatedIOC, RelatedFile, RelatedAccount, HighFreqWord, ActiveHotspot } from "./types"

export const mockGangProfiles: GangProfile[] = [
  {
    id: "GANG001",
    name: "暗影联盟",
    type: "account",
    aliases: ["黑卡联盟", "暗影数据", "ShadowData"],
    followingCount: 342,
    followersCount: 12800,
    phone: "138****5678",
    registerTime: "2024-03-15",
    lastActive: "2025-01-20 14:35:22",
    sourceChannel: "Telegram",
    bio: "专注高端礼品卡及CVV数据交易，诚信经营，量大从优，私聊报价。",
    riskScenes: [
      { name: "用户侧恶意退款风险", count: 5 },
      { name: "平台活动福利薅取风险", count: 3 },
      { name: "订单号相关风险", count: 2 },
    ],
  } as GangAccount,
  {
    id: "GANG002",
    name: "黑鸟小组",
    type: "account",
    aliases: ["BlackBird", "黑鸟数据"],
    followingCount: 128,
    followersCount: 5600,
    phone: "159****3421",
    registerTime: "2023-11-20",
    lastActive: "2025-01-19 09:12:45",
    sourceChannel: "暗网论坛",
    bio: "提供各类验证码接收服务，支持批量注册，自动化API对接。",
    riskScenes: [
      { name: "账号注册", count: 4 },
      { name: "验证码平台", count: 2 },
      { name: "API滥用", count: 3 },
    ],
  } as GangAccount,
  {
    id: "GANG003",
    name: "鬼灵网络",
    type: "group",
    groupNumber: "GRP003891",
    description: "鬼灵网络是一个活跃的WhatsApp群组，主要涉及刷单刷量和虚假评论等黑产活动。",
    memberCount: 2340,
    firstMonitorTime: "2024-05-10 08:30:00",
    lastActive: "2025-01-18 16:42:10",
    sourceChannel: "WhatsApp",
    riskScenes: [
      { name: "刷单刷量", count: 6 },
      { name: "虚假评论", count: 4 },
      { name: "商户欺诈", count: 1 },
    ],
  } as GangGroup,
  {
    id: "GANG004",
    name: "验证码工厂",
    type: "group",
    groupNumber: "GRP004562",
    description: "专业验证码接收与分发平台，提供全球手机号验证码服务。",
    memberCount: 1890,
    firstMonitorTime: "2024-02-28 14:00:00",
    lastActive: "2025-01-17 11:28:33",
    sourceChannel: "Telegram",
    riskScenes: [
      { name: "验证码服务", count: 3 },
      { name: "接码平台", count: 2 },
      { name: "虐用号码", count: 1 },
    ],
  } as GangGroup,
  {
    id: "GANG005",
    name: "数据矿工",
    type: "account",
    aliases: ["DataMiner", "矿工数据站"],
    followingCount: 89,
    followersCount: 3200,
    phone: "186****7890",
    registerTime: "2024-06-01",
    lastActive: "2025-01-16 20:15:08",
    sourceChannel: "Telegram",
    bio: "专业数据采集与分析，提供各平台用户数据，支持定制化需求。",
    riskScenes: [
      { name: "数据爬取", count: 4 },
      { name: "隐私泄露", count: 3 },
      { name: "API滥用", count: 2 },
    ],
  } as GangAccount,
  {
    id: "GANG006",
    name: "礼品卡交易群",
    type: "group",
    groupNumber: "GRP001491",
    description: "礼品卡交易群是一个活跃的Telegram群组，主要涉及黑产交易和信息交换活动。",
    memberCount: 1256,
    firstMonitorTime: "2024-06-15 10:30:00",
    lastActive: "2025-01-20 14:00:00",
    sourceChannel: "Telegram",
    riskScenes: [
      { name: "礼品卡相关风险", count: 2 },
      { name: "用户侧盗刷商品风险", count: 2 },
    ],
  } as GangGroup,
  {
    id: "GANG007",
    name: "夜行者联盟",
    type: "account",
    aliases: ["NightWalker", "夜行数据"],
    followingCount: 210,
    followersCount: 8900,
    phone: "177****4523",
    registerTime: "2023-09-12",
    lastActive: "2025-01-15 22:05:17",
    sourceChannel: "Discord",
    bio: "提供各类社工库查询服务，数据实时更新，价格公道。",
    riskScenes: [
      { name: "社工库查询", count: 5 },
      { name: "隐私泄露", count: 4 },
      { name: "身份冒用", count: 2 },
    ],
  } as GangAccount,
]

export const mockRelatedClues: Record<string, RelatedClue[]> = {
  GANG001: [
    { id: "TH10234567", title: "【紧急出售】某知名平台高级账号批量出售，账号已实名认证，信誉良好，可用于各类业务...", product: "产品", status: "pendingFollowup", riskScene: "礼品卡相关风险", channel: "暗网论坛", publishTime: "2025-01-20 12:00" },
    { id: "TH20456789", title: "最新CVV数据，覆盖多个主流平台，成功率95%以上，支持试刷，量大优惠，有需要私...", product: "产品", status: "following", riskScene: "用户侧盗刷商品风险", channel: "Telegram", publishTime: "2025-01-18 09:30" },
    { id: "TH30567890", title: "长期高价回收各类礼品卡，支持即时结算。", product: "产品", status: "pendingFollowup", riskScene: "礼品卡相关风险", channel: "WhatsApp", publishTime: "2025-01-15 14:20" },
    { id: "TH40678901", title: "专业API接口破解，支持多平台。", product: "产品", status: "followEnded", riskScene: "API滥用风险", channel: "暗网论坛", publishTime: "2025-01-12 10:15" },
    { id: "TH50789012", title: "最新信用卡数据，高成功率。", product: "产品", status: "pendingFollowup", riskScene: "用户侧盗刷商品风险", channel: "Telegram", publishTime: "2025-01-10 08:45" },
    { id: "TH60890123", title: "批量注册各平台账号，全自动流程，日产千号，价格低廉，支持定制需求...", product: "产品", status: "eventCreated", riskScene: "账号批量注册", channel: "暗网论坛", publishTime: "2025-01-08 16:30" },
  ],
  GANG002: [
    { id: "TH70123456", title: "提供全球手机号验证码接收服务，覆盖200+国家地区，支持批量调用...", product: "产品", status: "pendingReview", riskScene: "账号注册", channel: "暗网论坛", publishTime: "2025-01-19 10:00" },
    { id: "TH80234567", title: "自动化注册工具更新，新增反检测模块，突破主流平台风控...", product: "产品", status: "following", riskScene: "验证码平台", channel: "Telegram", publishTime: "2025-01-17 14:30" },
    { id: "TH90345678", title: "API接口调用频率优化方案，绕过限流策略。", product: "产品", status: "ignored", riskScene: "API滥用", channel: "暗网论坛", publishTime: "2025-01-14 09:15" },
  ],
  GANG003: [
    { id: "TH11234567", title: "刷单团队招募，日结佣金，无需押金，提供操作培训...", product: "产品", status: "pendingReview", riskScene: "刷单刷量", channel: "WhatsApp", publishTime: "2025-01-18 11:00" },
    { id: "TH12345678", title: "专业好评服务，真实买家账号，不掉评，支持多平台...", product: "产品", status: "pendingFollowup", riskScene: "虚假评论", channel: "WhatsApp", publishTime: "2025-01-16 15:20" },
    { id: "TH13456789", title: "大量刷单任务发布，佣金丰厚，长期合作优先。", product: "产品", status: "following", riskScene: "刷单刷量", channel: "Telegram", publishTime: "2025-01-13 08:40" },
    { id: "TH14567890", title: "伪造商户资质全套服务，快速通过平台审核。", product: "产品", status: "eventCreated", riskScene: "商户欺诈", channel: "暗网论坛", publishTime: "2025-01-10 12:00" },
  ],
  GANG004: [
    { id: "TH15678901", title: "验证码平台系统升级，新增语音验证码接收功能...", product: "产品", status: "pendingReview", riskScene: "验证码服务", channel: "Telegram", publishTime: "2025-01-17 09:00" },
    { id: "TH16789012", title: "接码平台稳定运行中，支持短信和语音验证。", product: "产品", status: "followEnded", riskScene: "接码平台", channel: "Telegram", publishTime: "2025-01-12 16:45" },
  ],
  GANG005: [
    { id: "TH17890123", title: "全网数据采集服务，支持定制化爬取，交付格式可选...", product: "产品", status: "pendingReview", riskScene: "数据爬取", channel: "Telegram", publishTime: "2025-01-16 10:30" },
    { id: "TH18901234", title: "出售某平台用户数据库，含手机号、邮箱、地址等信息...", product: "产品", status: "following", riskScene: "隐私泄露", channel: "暗网论坛", publishTime: "2025-01-14 14:00" },
    { id: "TH19012345", title: "API接口扫描工具，自动发现未授权端点。", product: "产品", status: "pendingFollowup", riskScene: "API滥用", channel: "Telegram", publishTime: "2025-01-11 08:20" },
  ],
  GANG006: [
    { id: "TH20123456", title: "大量低价礼品卡出售，支持验卡后交易，担保交易...", product: "产品", status: "pendingReview", riskScene: "礼品卡相关风险", channel: "Telegram", publishTime: "2025-01-20 09:00" },
    { id: "TH21234567", title: "盗刷商品变现渠道分享，高价回收各类实物商品...", product: "产品", status: "following", riskScene: "用户侧盗刷商品风险", channel: "Telegram", publishTime: "2025-01-18 14:30" },
    { id: "TH22345678", title: "礼品卡余额查询与转移工具发布。", product: "产品", status: "pendingFollowup", riskScene: "礼品卡相关风险", channel: "暗网论坛", publishTime: "2025-01-15 11:00" },
    { id: "TH23456789", title: "新一批盗刷订单处理中，需要物流代收合作...", product: "产品", status: "eventCreated", riskScene: "用户侧盗刷商品风险", channel: "Telegram", publishTime: "2025-01-12 16:00" },
    { id: "TH24567890", title: "礼品卡交易平台日常更新通知。", product: "产品", status: "ignored", riskScene: "礼品卡相关风险", channel: "WhatsApp", publishTime: "2025-01-09 10:20" },
  ],
  GANG007: [
    { id: "TH25678901", title: "社工库数据更新，新增某省份户籍信息，支持模糊查询...", product: "产品", status: "pendingReview", riskScene: "社工库查询", channel: "Discord", publishTime: "2025-01-15 18:00" },
    { id: "TH26789012", title: "出售大量泄露的用户账号密码组合，支持撞库验证...", product: "产品", status: "following", riskScene: "隐私泄露", channel: "Discord", publishTime: "2025-01-13 09:45" },
    { id: "TH27890123", title: "伪造身份证件和银行卡信息服务。", product: "产品", status: "followEnded", riskScene: "身份冒用", channel: "暗网论坛", publishTime: "2025-01-10 14:30" },
    { id: "TH28901234", title: "社工库查询服务价格调整通知，老客户享优惠...", product: "产品", status: "pendingFollowup", riskScene: "社工库查询", channel: "Discord", publishTime: "2025-01-08 11:15" },
  ],
}

export function getClueStatistics(profileId: string): ClueStatistics {
  const clues = mockRelatedClues[profileId] || []
  return {
    total: clues.length,
    pendingReview: clues.filter((c) => c.status === "pendingReview").length,
    ignored: clues.filter((c) => c.status === "ignored").length,
    pendingFollowup: clues.filter((c) => c.status === "pendingFollowup").length,
    following: clues.filter((c) => c.status === "following").length,
    followEnded: clues.filter((c) => c.status === "followEnded").length,
    eventCreated: clues.filter((c) => c.status === "eventCreated").length,
  }
}

export const mockRelatedGroups: Record<string, RelatedGroup[]> = {
  GANG001: [
    { id: "GRP001", name: "礼品卡交易群", memberCount: 1256 },
    { id: "GRP002", name: "CVV数据共享", memberCount: 856 },
    { id: "GRP003", name: "黑产交流群", memberCount: 432 },
  ],
  GANG002: [
    { id: "GRP004", name: "验证码互助群", memberCount: 678 },
    { id: "GRP005", name: "批量注册交流", memberCount: 345 },
  ],
  GANG005: [
    { id: "GRP006", name: "数据采集技术群", memberCount: 1120 },
  ],
  GANG007: [
    { id: "GRP007", name: "社工资源共享", memberCount: 2100 },
    { id: "GRP008", name: "数据查询服务", memberCount: 890 },
  ],
}

export const mockRelatedAdmins: Record<string, RelatedAdmin[]> = {
  GANG003: [
    { id: "ADM001", name: "鬼灵主管", role: "群主" },
    { id: "ADM002", name: "影子助手", role: "管理员" },
    { id: "ADM003", name: "数据搬运工", role: "管理员" },
  ],
  GANG004: [
    { id: "ADM004", name: "码王", role: "群主" },
    { id: "ADM005", name: "接码小助手", role: "管理员" },
  ],
  GANG006: [
    { id: "ADM006", name: "卡商老王", role: "群主" },
    { id: "ADM007", name: "交易客服", role: "管理员" },
    { id: "ADM008", name: "审核员小李", role: "管理员" },
  ],
}

export const mockRelatedIOCs: Record<string, RelatedIOC[]> = {
  GANG001: [
    { id: "IOC001", type: "IP", value: "185.234.xx.xx", firstSeen: "2024-12-10", lastSeen: "2025-01-20" },
    { id: "IOC002", type: "域名", value: "creditking2024.cc", firstSeen: "2024-11-05", lastSeen: "2025-01-18" },
    { id: "IOC003", type: "邮箱", value: "dumps@proton.me", firstSeen: "2024-10-15", lastSeen: "2025-01-15" },
  ],
  GANG002: [
    { id: "IOC004", type: "IP", value: "91.215.xx.xx", firstSeen: "2024-09-20", lastSeen: "2025-01-19" },
    { id: "IOC005", type: "手机号", value: "+86-159****3421", firstSeen: "2024-11-20", lastSeen: "2025-01-17" },
  ],
  GANG003: [
    { id: "IOC006", type: "域名", value: "ghostnet-shop.xyz", firstSeen: "2024-06-01", lastSeen: "2025-01-18" },
    { id: "IOC007", type: "邮箱", value: "ghost_admin@tutanota.com", firstSeen: "2024-07-12", lastSeen: "2025-01-16" },
    { id: "IOC008", type: "Hash", value: "a3f2b8c1d4e5...9f0a", firstSeen: "2024-08-20", lastSeen: "2025-01-10" },
  ],
  GANG005: [
    { id: "IOC009", type: "IP", value: "45.132.xx.xx", firstSeen: "2024-07-15", lastSeen: "2025-01-16" },
    { id: "IOC010", type: "域名", value: "dataminer-api.net", firstSeen: "2024-08-01", lastSeen: "2025-01-14" },
  ],
  GANG006: [
    { id: "IOC011", type: "手机号", value: "+1-555-0123", firstSeen: "2024-06-20", lastSeen: "2025-01-20" },
    { id: "IOC012", type: "邮箱", value: "giftcard_trade@pm.me", firstSeen: "2024-07-05", lastSeen: "2025-01-18" },
    { id: "IOC013", type: "IP", value: "103.75.xx.xx", firstSeen: "2024-09-10", lastSeen: "2025-01-15" },
  ],
  GANG007: [
    { id: "IOC014", type: "域名", value: "nightwalker-db.onion", firstSeen: "2023-10-01", lastSeen: "2025-01-15" },
    { id: "IOC015", type: "邮箱", value: "nw_service@proton.me", firstSeen: "2023-11-15", lastSeen: "2025-01-13" },
  ],
}

export const mockRelatedFiles: Record<string, RelatedFile[]> = {
  GANG001: [
    { id: "FILE001", name: "交易记录_202501.csv", type: "CSV", fileCategory: "数据", size: "2.3 MB", uploadTime: "2025-01-20 10:30", source: "来源群聊: 来源于发布内容" },
    { id: "FILE002", name: "客户名单.xlsx", type: "Excel", fileCategory: "文档", size: "1.1 MB", uploadTime: "2025-01-18 14:20", source: "来源群聊: 来源于发布内容" },
    { id: "FILE003", name: "聊天截图_01.png", type: "PNG", fileCategory: "图片", size: "856 KB", uploadTime: "2025-01-15 09:10", source: "来源群聊: 来源于发布内容" },
    { id: "FILE004", name: "CVV数据样本.txt", type: "TXT", fileCategory: "文档", size: "45 KB", uploadTime: "2025-01-12 16:00", source: "来源群聊: 来源于发布内容" },
    { id: "FILE005", name: "交易流水截图.png", type: "PNG", fileCategory: "图片", size: "3.7 MB", uploadTime: "2025-01-10 11:30", source: "来源群聊: 来源于发布内容" },
    { id: "FILE006", name: "账户信息截图.jpg", type: "JPG", fileCategory: "图片", size: "520 KB", uploadTime: "2025-01-08 15:45", source: "来源群聊: 来源于发布内容" },
    { id: "FILE007", name: "关联IP列表.json", type: "JSON", fileCategory: "数据", size: "12 KB", uploadTime: "2025-01-05 08:20", source: "来源群聊: 来源于发布内容" },
  ],
  GANG002: [
    { id: "FILE008", name: "验证码截图.png", type: "PNG", fileCategory: "图片", size: "1.2 MB", uploadTime: "2025-01-19 09:00", source: "来源群聊: 来源于发布内容" },
    { id: "FILE009", name: "注册账号清单.xlsx", type: "Excel", fileCategory: "文档", size: "2.1 MB", uploadTime: "2025-01-17 14:30", source: "来源群聊: 来源于发布内容" },
    { id: "FILE010", name: "API调用记录.json", type: "JSON", fileCategory: "数据", size: "1.8 MB", uploadTime: "2025-01-14 10:15", source: "来源群聊: 来源于发布内容" },
  ],
  GANG003: [
    { id: "FILE011", name: "刷单任务截图.png", type: "PNG", fileCategory: "图片", size: "780 KB", uploadTime: "2025-01-18 11:00", source: "来源群聊: 来源于发布内容" },
    { id: "FILE012", name: "虚假评论模板.docx", type: "Word", fileCategory: "文档", size: "320 KB", uploadTime: "2025-01-16 15:20", source: "来源群聊: 来源于发布内容" },
  ],
  GANG005: [
    { id: "FILE013", name: "爬取数据样本.csv", type: "CSV", fileCategory: "数据", size: "15.2 MB", uploadTime: "2025-01-16 10:30", source: "来源群聊: 来源于发布内容" },
    { id: "FILE014", name: "用户画像截图.png", type: "PNG", fileCategory: "图片", size: "4.3 MB", uploadTime: "2025-01-14 14:00", source: "来源群聊: 来源于发布内容" },
    { id: "FILE015", name: "采集脚本.py", type: "Python", fileCategory: "代码", size: "28 KB", uploadTime: "2025-01-11 08:20", source: "来源群聊: 来源于发布内容" },
    { id: "FILE016", name: "数据清洗报告截图.jpg", type: "JPG", fileCategory: "图片", size: "1.5 MB", uploadTime: "2025-01-09 16:40", source: "来源群聊: 来源于发布内容" },
  ],
  GANG006: [
    { id: "FILE017", name: "礼品卡交易截图.png", type: "PNG", fileCategory: "图片", size: "5.6 MB", uploadTime: "2025-01-20 09:00", source: "来源群聊: 来源于发布内容" },
    { id: "FILE018", name: "群成员列表.xlsx", type: "Excel", fileCategory: "文档", size: "890 KB", uploadTime: "2025-01-18 14:30", source: "来源群聊: 来源于发布内容" },
    { id: "FILE019", name: "交易聊天截图.jpg", type: "JPG", fileCategory: "图片", size: "2.3 MB", uploadTime: "2025-01-15 11:00", source: "来源群聊: 来源于发布内容" },
  ],
}

export const mockRelatedAccounts: Record<string, RelatedAccount[]> = {
  GANG003: [
    { id: "GANG001", name: "暗影联盟", role: "核心成员" },
    { id: "GANG005", name: "数据矿工", role: "数据供应商" },
  ],
  GANG004: [
    { id: "GANG002", name: "黑鸟小组", role: "技术支持" },
  ],
  GANG006: [
    { id: "GANG001", name: "暗影联盟", role: "群主" },
    { id: "GANG005", name: "数据矿工", role: "成员" },
    { id: "GANG007", name: "夜行者联盟", role: "成员" },
  ],
}

export const mockHighFreqWords: Record<string, HighFreqWord[]> = {
  GANG001: [
    { word: "礼品卡", count: 156 },
    { word: "CVV", count: 134 },
    { word: "代付", count: 98 },
    { word: "批量", count: 87 },
    { word: "Telegram", count: 76 },
  ],
  GANG002: [
    { word: "验证码", count: 203 },
    { word: "批量注册", count: 145 },
    { word: "API", count: 112 },
    { word: "自动化", count: 89 },
    { word: "接码", count: 67 },
  ],
  GANG003: [
    { word: "刷单", count: 178 },
    { word: "好评", count: 142 },
    { word: "佣金", count: 95 },
    { word: "商户", count: 81 },
    { word: "WhatsApp", count: 63 },
  ],
  GANG004: [
    { word: "验证码", count: 245 },
    { word: "手机号", count: 167 },
    { word: "接码", count: 134 },
    { word: "平台", count: 98 },
    { word: "批量", count: 76 },
  ],
  GANG005: [
    { word: "数据", count: 312 },
    { word: "爬虫", count: 198 },
    { word: "API", count: 156 },
    { word: "用户画像", count: 89 },
    { word: "采集", count: 72 },
  ],
  GANG006: [
    { word: "礼品卡", count: 189 },
    { word: "交易", count: 156 },
    { word: "折扣", count: 112 },
    { word: "批量", count: 94 },
    { word: "Telegram", count: 67 },
  ],
  GANG007: [
    { word: "社工库", count: 267 },
    { word: "查询", count: 198 },
    { word: "身份", count: 145 },
    { word: "数据库", count: 112 },
    { word: "Discord", count: 78 },
  ],
}

export const mockActiveHotspots: Record<string, ActiveHotspot[]> = {
  GANG001: [
    { location: "深圳", country: "中国", count: 45, percentage: 35 },
    { location: "东莞", country: "中国", count: 32, percentage: 25 },
    { location: "广州", country: "中国", count: 28, percentage: 22 },
  ],
  GANG002: [
    { location: "北京", country: "中国", count: 56, percentage: 38 },
    { location: "上海", country: "中国", count: 41, percentage: 28 },
    { location: "杭州", country: "中国", count: 23, percentage: 16 },
  ],
  GANG003: [
    { location: "曼谷", country: "泰国", count: 67, percentage: 42 },
    { location: "金边", country: "柬埔寨", count: 38, percentage: 24 },
    { location: "马尼拉", country: "菲律宾", count: 25, percentage: 16 },
  ],
  GANG004: [
    { location: "成都", country: "中国", count: 43, percentage: 32 },
    { location: "重庆", country: "中国", count: 35, percentage: 26 },
    { location: "武汉", country: "中国", count: 28, percentage: 21 },
  ],
  GANG005: [
    { location: "上海", country: "中国", count: 52, percentage: 36 },
    { location: "深圳", country: "中国", count: 39, percentage: 27 },
    { location: "北京", country: "中国", count: 30, percentage: 21 },
  ],
  GANG006: [
    { location: "深圳", country: "中国", count: 48, percentage: 34 },
    { location: "香港", country: "中国", count: 36, percentage: 25 },
    { location: "广州", country: "中国", count: 29, percentage: 20 },
  ],
  GANG007: [
    { location: "莫斯科", country: "俄罗斯", count: 41, percentage: 31 },
    { location: "圣彼得堡", country: "俄罗斯", count: 33, percentage: 25 },
    { location: "基辅", country: "乌克兰", count: 27, percentage: 20 },
  ],
}
