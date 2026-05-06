"use client"

import type React from "react"

// ====================================
// 线索跟进模块 - 生成事件抽屉组件
// Clue Followup Module - Generate Event Drawer Component
// ====================================

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Check, Upload, X, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { FollowupClue, IOC } from "@/lib/modules/clue-followup/types"

interface GenerateEventDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clue: FollowupClue | null
  onSuccess?: () => void
}

// 风险场景选项
const riskSceneOptions = ["账号盗用", "虚假交易", "提供礼品卡交易服务", "信息窃取", "资金盗取", "身份冒用", "其他"]

// 风险标签选项
const riskTagOptions = [
  "银行卡买卖",
  "四件套",
  "身份信息泄露",
  "刷单",
  "虚假交易",
  "佣金诈骗",
  "信用卡盗刷",
  "CVV交易",
  "数据泄露",
]

// IOC 类型选项及解释
const iocTypeDescriptions: Record<string, string> = {
  "订单号": "用户下单后系统生成的唯一标识编号，用于追踪订单状态、物流、售后等全流程",
  "物流单号": "包裹发货后由快递公司分配的追踪编号，可用于查询运输轨迹和签收状态",
  "退货ID": "用户发起退货/退款申请后系统生成的唯一标识，关联退货商品、原因、金额等信息",
  "优惠券": "平台或商家发放的抵扣凭证，包含金额、使用条件、有效期等信息，用于订单金额减免",
  "会员昵称": "用户在平台设置的个性化名称，用于社交互动、评论展示等公开场景",
  "用户账号ID": "系统为用户分配的内部唯一标识，通常不对外公开，用于关联用户所有行为数据",
  "用户昵称": "用户自主设定的公开显示名称，用于社交互动、评论展示等场景",
  "邮箱": "用户注册或绑定的电子邮箱地址，常用于登录、接收订单通知、营销邮件等",
  "手机号": "用户绑定的手机号码，用于登录、身份验证、接收短信通知等",
  "身份证号": "用户的个人身份证明号码，通常在实名认证、跨境清关、退税费等场景下收集",
  "商品ID": "平台为每个商品分配的内部唯一标识，用于商品信息检索、库存管理、订单关联等",
  "ASIN号": "Amazon Standard Identification Number，亚马逊平台的标准商品编号，用于唯一标识一个商品",
  "SKU号": "Stock Keeping Unit，库存量单位，用于区分同一商品的不同规格（如颜色、尺寸、版本）",
  "营销分享链接": "用户或达人用于推广商品的专属链接/代码，可用于追踪推广效果并计算佣金",
  "商户名称": "入驻平台的商家或品牌的官方名称，用于区分不同卖家的商品和服务",
  "直播间ID": "直播间的唯一标识编号，用于关联直播场次、互动数据、商品链接等",
  "主播账号ID": "进行直播带货的主播所绑定的账户唯一标识，用于关联主播的销售业绩和粉丝数据",
  "卡号": "用户的银行卡号或礼品卡号，用于支付、退款或余额充值等资金操作",
  "兑换码": "由平台或商家生成的数字/字母串，可用于兑换商品、优惠券、虚拟物品等",
  "钱包账户ID": "用户在平台内置钱包中的账户唯一标识，用于管理余额、交易流水、提现等",
  "申诉ID": "用户对订单、账号封禁等结果不满并发起申诉后，系统生成的唯一工单编号",
  "客户咨询ID": "用户联系客服时系统生成的咨询工单编号，用于追踪问题处理进度和历史记录",
  "收件地址": "用户填写的收货详细信息（包含姓名、电话、省市区、街道门牌号等），用于包裹配送",
  "验证码": "通过短信、邮件或APP发送的一次性数字/字母码，用于登录验证、修改密码、确认操作等安全场景",
  "其他联系方式": "除邮箱、手机号外的其他联系途径，如社交媒体账号、即时通讯ID等",
  "暗网地址": "隐藏服务网络上的地址或链接，常用于非法交易、信息买卖等违法活动",
  "诈骗类型": "诈骗行为的分类标签，如身份冒用、虚假交易、钓鱼欺诈等",
  "接受支付": "骗子或黑产接受的支付方式，如加密货币、转账、第三方支付等",
  "出售类型": "黑产出售的商品或服务类别，如个人信息、虚拟物品、非法工具等",
  "售卖类型": "同'出售类型'，指非法销售的商品或服务的分类",
  "来自频道": "线索或风险信息的发现渠道，如Telegram群组、Discord服务器、暗网论坛、微信群等具体来源",
}

const iocTypeOptions = Object.keys(iocTypeDescriptions)

export function GenerateEventDrawer({ open, onOpenChange, clue, onSuccess }: GenerateEventDrawerProps) {
  const [activeTab, setActiveTab] = useState<"new" | "merge">("new")

  // 风险信息表单状态
  const [isNewGang, setIsNewGang] = useState<"new" | "old">("new")
  const [isNewContent, setIsNewContent] = useState<"new" | "old">("new")
  const [riskScene, setRiskScene] = useState("")
  const [selectedRiskTags, setSelectedRiskTags] = useState<string[]>([])
  const [riskSummary, setRiskSummary] = useState("")
  const [eventTitle, setEventTitle] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [iocs, setIocs] = useState<IOC[]>([])

  const [riskInfoExpanded, setRiskInfoExpanded] = useState(true)
  const [mergeEventsExpanded, setMergeEventsExpanded] = useState(true)
  const [basicInfoExpanded, setBasicInfoExpanded] = useState(false)
  const [flowInfoExpanded, setFlowInfoExpanded] = useState(false)

  // 初始化表单数据
  useEffect(() => {
    if (clue) {
      setIsNewGang(clue.isNewGang ? "new" : "old")
      setIsNewContent(clue.isNewContent ? "new" : "old")
      setRiskScene(clue.riskScene || "")
      setSelectedRiskTags(clue.riskTags || [])
      setIocs(clue.iocs || [])
    }
  }, [clue])

  useEffect(() => {
    if (open) {
      setRiskInfoExpanded(true)
      setMergeEventsExpanded(true)
      setBasicInfoExpanded(false)
      setFlowInfoExpanded(false)
    }
  }, [open])

  // 重置表单
  const handleReset = () => {
    setIsNewGang("new")
    setIsNewContent("new")
    setRiskScene("")
    setSelectedRiskTags([])
    setRiskSummary("")
    setEventTitle("")
    setAttachments([])
    setIocs([])
  }

  // 取消
  const handleCancel = () => {
    onOpenChange(false)
  }

  // 确认生成事件
  const handleConfirm = () => {
    onOpenChange(false)
    toast.success("该条线索已成功生成事件")
    onSuccess?.()
  }

  // 切换风险标签
  const toggleRiskTag = (tag: string) => {
    setSelectedRiskTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files || [])])
    }
  }

  // 删除附件
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  // 添加IOC记录
  const addIOC = () => {
    setIocs((prev) => [...prev, { type: "", value: "" }])
  }

  // 更新IOC记录
  const updateIOC = (index: number, field: "type" | "value", value: string) => {
    setIocs((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  // 删除IOC记录
  const removeIOC = (index: number) => {
    setIocs((prev) => prev.filter((_, i) => i !== index))
  }

  if (!clue) return null

  // 模拟上次事件同步时间
  const lastSyncTime = "2025-12-29 12:20:45"
  const daysSinceSync = 28

  // 流转信息步骤
  const flowSteps = [
    {
      title: "捕获",
      completed: true,
      info: `捕获时间: ${clue.captureTime}`,
    },
    {
      title: "审核通过",
      completed: true,
      info: `审核人: ${clue.reviewer}`,
      subInfo: `审核时间: ${clue.reviewTime}`,
    },
    {
      title: "跟进中",
      completed: clue.status === "following" || clue.status === "ignored",
      current: clue.status === "following",
      info: clue.follower ? `跟进人: ${clue.follower}` : undefined,
      subInfo: clue.followStartTime ? `开始跟进时间: ${clue.followStartTime}` : undefined,
    },
    {
      title: "生成事件",
      completed: false,
      current: false,
    },
  ]

  const BasicInfoTable = () => (
    <table className="w-full">
      <thead>
        <tr className="border-b bg-muted/30">
          <th className="text-left py-2 px-4 font-medium text-sm w-28">线索ID</th>
          <th className="text-left py-2 px-4 font-medium text-sm w-24">客户</th>
          <th className="text-left py-2 px-4 font-medium text-sm">线索原文</th>
          <th className="text-left py-2 px-4 font-medium text-sm w-20">图片内容</th>
          <th className="text-left py-2 px-4 font-medium text-sm w-36">来源信息</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-3 px-4 text-sm text-primary align-top">{clue.id}</td>
          <td className="py-3 px-4 text-sm align-top">{clue.customer}</td>
          <td className="py-3 px-4 text-sm align-top">
            <div className="max-w-[200px]">
              <p className="line-clamp-3">{clue.original}</p>
              <button className="text-primary text-xs mt-1 hover:underline">查看详情</button>
            </div>
          </td>
          <td className="py-3 px-4 align-top">
            {clue.images.length > 0 ? (
              <img
                src={clue.images[0] || "/placeholder.svg"}
                alt="图片内容"
                className="w-16 h-12 object-cover rounded"
              />
            ) : (
              <span className="text-sm text-muted-foreground">无</span>
            )}
          </td>
          <td className="py-3 px-4 text-xs align-top space-y-1">
            <p>
              <span className="text-muted-foreground">发布时间:</span> {clue.publishTime}
            </p>
            <p>
              <span className="text-muted-foreground">发布渠道:</span> {clue.channel}
            </p>
            <p>
              <span className="text-muted-foreground">发布人:</span> {clue.publisherId}
            </p>
            <p>
              <span className="text-muted-foreground">平台/来源:</span> {clue.channel}
            </p>
            <p>
              <span className="text-muted-foreground">群组/板块:</span> {clue.sourceTitle}
            </p>
            <p>
              <span className="text-muted-foreground">域名:</span> {clue.relatedDomain}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  )

  const FlowInfoContent = () => (
    <div className="relative">
      <div className="flex items-start justify-between">
        {flowSteps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative z-10 flex-1">
            {/* 连接线 */}
            {index < flowSteps.length - 1 && (
              <div
                className={cn(
                  "absolute top-4 left-1/2 w-full h-0.5",
                  step.completed ? "bg-primary" : "bg-muted-foreground/30",
                )}
              />
            )}
            {/* 圆圈 */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 relative bg-background",
                step.completed
                  ? "bg-primary border-primary text-primary-foreground"
                  : step.current
                    ? "border-primary text-primary"
                    : "border-muted-foreground/30 text-muted-foreground",
              )}
            >
              {step.completed ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            {/* 标题 */}
            <span
              className={cn(
                "mt-2 text-sm font-medium",
                step.completed || step.current ? "text-primary" : "text-muted-foreground",
              )}
            >
              {step.title}
            </span>
            {/* 详细信息 */}
            {step.info && <span className="text-xs text-muted-foreground mt-1">{step.info}</span>}
            {step.subInfo && <span className="text-xs text-primary">{step.subInfo}</span>}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[850px] sm:max-w-[850px] p-0 flex flex-col h-full">
        {/* 上部分：标题和提示 */}
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle className="text-lg font-semibold">生成事件【{clue.customer}】</SheetTitle>
          <p className="text-sm mt-2">
            <span className="text-red-500">*</span>
            <span className="text-red-500 ml-1">
              该客户上次事件同步时间为：{lastSyncTime}，距离上次同步时间：{daysSinceSync}天，建议生成新事件。
            </span>
          </p>
        </SheetHeader>

        {/* 中部分：标签页内容 */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="flex border-b-0">
            <button
              className={cn(
                "flex-1 py-3 px-4 text-sm font-medium transition-colors rounded-t-lg border border-b-0",
                activeTab === "new"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50",
              )}
              onClick={() => setActiveTab("new")}
            >
              生成新事件
            </button>
            <button
              className={cn(
                "flex-1 py-3 px-4 text-sm font-medium transition-colors rounded-t-lg border border-b-0 -ml-px",
                activeTab === "merge"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50",
              )}
              onClick={() => setActiveTab("merge")}
            >
              合并老事件
            </button>
          </div>

          <div className="border border-t-0 rounded-b-lg">
            {/* 生成新事件 */}
            {activeTab === "new" && (
              <div>
                {/* 风险信息 - 与标签页连接 */}
                <div className="border-b">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 bg-background hover:bg-muted/30 transition-colors"
                    onClick={() => setRiskInfoExpanded(!riskInfoExpanded)}
                  >
                    <span className="font-medium">风险信息</span>
                    {riskInfoExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {riskInfoExpanded && (
                    <div className="p-4 space-y-4 border-t">
                      {/* 新老团伙 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>新老团伙</Label>
                          <Select value={isNewGang} onValueChange={(v) => setIsNewGang(v as "new" | "old")}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">新团伙</SelectItem>
                              <SelectItem value="old">老团伙</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* 新老内容 */}
                        <div className="space-y-2">
                          <Label>新老内容</Label>
                          <Select value={isNewContent} onValueChange={(v) => setIsNewContent(v as "new" | "old")}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">新内容</SelectItem>
                              <SelectItem value="old">老内容</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* 风险场景 */}
                      <div className="space-y-2">
                        <Label>风险场景</Label>
                        <Select value={riskScene} onValueChange={setRiskScene}>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择风险场景" />
                          </SelectTrigger>
                          <SelectContent>
                            {riskSceneOptions.map((scene) => (
                              <SelectItem key={scene} value={scene}>
                                {scene}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 风险标签 */}
                      <div className="space-y-2">
                        <Label>风险标签</Label>
                        <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[80px]">
                          {riskTagOptions.map((tag) => (
                            <Badge
                              key={tag}
                              variant={selectedRiskTags.includes(tag) ? "default" : "outline"}
                              className={cn(
                                "cursor-pointer transition-colors",
                                selectedRiskTags.includes(tag)
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted",
                              )}
                              onClick={() => toggleRiskTag(tag)}
                            >
                              {tag}
                              {selectedRiskTags.includes(tag) && <Check className="w-3 h-3 ml-1" />}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* 风险概要 */}
                      <div className="space-y-2">
                        <Label>风险概要</Label>
                        <Textarea
                          placeholder="请输入风险概要"
                          value={riskSummary}
                          onChange={(e) => setRiskSummary(e.target.value)}
                          rows={3}
                        />
                      </div>

                      {/* 事件标题 */}
                      <div className="space-y-2">
                        <Label>事件标题</Label>
                        <Input
                          placeholder="请输入事件标题"
                          value={eventTitle}
                          onChange={(e) => setEventTitle(e.target.value)}
                        />
                      </div>

                      {/* 附件上传 */}
                      <div className="space-y-2">
                        <Label>附件上传</Label>
                        <div className="border rounded-md p-3">
                          <input type="file" id="file-upload" className="hidden" multiple onChange={handleFileUpload} />
                          <label
                            htmlFor="file-upload"
                            className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <Upload className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">点击或拖拽文件上传</span>
                          </label>
                          {attachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {attachments.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                  <span className="text-sm truncate">{file.name}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => removeAttachment(index)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 关键证据（IOC） */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>关键证据（IOC）</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1"
                            onClick={addIOC}
                          >
                            <Plus className="w-4 h-4" />
                            新增
                          </Button>
                        </div>
                        {iocs.length > 0 && (
                          <div className="border rounded-md overflow-hidden">
                            <div className="divide-y">
                              {iocs.map((ioc, index) => (
                                <div key={index} className="p-3 flex gap-3 items-end bg-background hover:bg-muted/30 transition-colors">
                                  <div className="flex-1 flex gap-0">
                                    <div className="flex-1">
                                      <Select value={ioc.type} onValueChange={(value) => updateIOC(index, "type", value)}>
                                        <SelectTrigger className="text-sm rounded-r-none" title={ioc.type ? iocTypeDescriptions[ioc.type] : "选择类型"}>
                                          <SelectValue placeholder="选择类型" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {iocTypeOptions.map((type) => (
                                            <SelectItem key={type} value={type} title={iocTypeDescriptions[type]}>
                                              <div className="flex flex-col gap-1">
                                                <div>{type}</div>
                                              </div>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <Input
                                      placeholder="输入对应值"
                                      value={ioc.value}
                                      onChange={(e) => updateIOC(index, "value", e.target.value)}
                                      className="text-sm rounded-l-none flex-1 border-l-0"
                                    />
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                    onClick={() => removeIOC(index)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {iocs.length === 0 && (
                          <div className="border border-dashed rounded-md p-4 text-center">
                            <p className="text-sm text-muted-foreground">点击"新增"按钮添加关键证据</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-b">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted/70 transition-colors"
                    onClick={() => setBasicInfoExpanded(!basicInfoExpanded)}
                  >
                    <span className="font-medium text-muted-foreground">基本信息</span>
                    {basicInfoExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  {basicInfoExpanded && (
                    <div className="bg-muted/30">
                      <BasicInfoTable />
                    </div>
                  )}
                </div>

                <div>
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted/70 transition-colors"
                    onClick={() => setFlowInfoExpanded(!flowInfoExpanded)}
                  >
                    <span className="font-medium text-muted-foreground">流转信息</span>
                    {flowInfoExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  {flowInfoExpanded && (
                    <div className="p-4 bg-muted/30">
                      <FlowInfoContent />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 合并老事件 */}
            {activeTab === "merge" && (
              <div>
                <div className="border-b">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 bg-background hover:bg-muted/30 transition-colors"
                    onClick={() => setMergeEventsExpanded(!mergeEventsExpanded)}
                  >
                    <span className="font-medium">可合并的老事件</span>
                    {mergeEventsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {mergeEventsExpanded && (
                    <div className="border-t">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/30">
                            <th className="text-left py-2 px-4 font-medium text-sm w-8"></th>
                            <th className="text-left py-2 px-4 font-medium text-sm">事件ID</th>
                            <th className="text-left py-2 px-4 font-medium text-sm">事件标题</th>
                            <th className="text-left py-2 px-4 font-medium text-sm">创建时间</th>
                            <th className="text-left py-2 px-4 font-medium text-sm">状态</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                              暂无可合并的老事件
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="border-b">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted/70 transition-colors"
                    onClick={() => setBasicInfoExpanded(!basicInfoExpanded)}
                  >
                    <span className="font-medium text-muted-foreground">基本信息</span>
                    {basicInfoExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  {basicInfoExpanded && (
                    <div className="bg-muted/30">
                      <BasicInfoTable />
                    </div>
                  )}
                </div>

                <div>
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted/70 transition-colors"
                    onClick={() => setFlowInfoExpanded(!flowInfoExpanded)}
                  >
                    <span className="font-medium text-muted-foreground">流转信息</span>
                    {flowInfoExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  {flowInfoExpanded && (
                    <div className="p-4 bg-muted/30">
                      <FlowInfoContent />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 下部分：操作按钮 */}
        <SheetFooter className="px-6 py-4 border-t shrink-0">
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              取消
            </Button>
            <Button onClick={handleConfirm}>确认</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
