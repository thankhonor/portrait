"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "zh" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    // Navigation
    "nav.platform": "AI引擎运营平台",
    "nav.antifraud": "业务反欺诈",
    "nav.overview": "概览统计",
    "nav.clueReview": "线索审核",
    "nav.clueFollowup": "线索跟进",
    "nav.eventCenter": "事件中心",
    "nav.configManagement": "配置管理",
    "nav.botManagement": "Bot 管理",
    "nav.followSessions": "跟进会话",
    "nav.gangProfile": "黑产画像",
    "nav.logout": "退出登录",

    // Common
    "common.search": "搜索",
    "common.filter": "筛选",
    "common.reset": "重置",
    "common.confirm": "确认",
    "common.cancel": "取消",
    "common.submit": "提交",
    "common.edit": "编辑",
    "common.delete": "删除",
    "common.view": "查看",
    "common.export": "导出",
    "common.import": "导入",
    "common.total": "共",
    "common.items": "条记录",
    "common.page": "第",
    "common.perPage": "每页",
    "common.goto": "前往",
    "common.operation": "操作",
    "common.status": "状态",
    "common.time": "时间",
    "common.operator": "操作人",
    "common.operationTime": "操作时间",
    "common.batchOperation": "批量操作",
    "common.manualEntry": "手工录入",
    "common.confirmAction": "确认操作",
    "common.confirmBatchMessage": "确定要对选中的 {count} 条线索执行 {action} 操作吗？",
    "common.pageUnit": "页",

    // Clue Review
    "review.followup": "跟进",
    "review.ignore": "暂不关注",
    "review.createEvent": "生成事件",
    "review.pending": "待审核",
    "review.followed": "待跟进",
    "review.ignored": "暂不关注",
    "review.eventCreated": "已生成事件",
    "review.clueId": "线索ID",
    "review.captureTime": "捕获时间",
    "review.customer": "客户",
    "review.original": "线索原文",
    "review.translation": "翻译",
    "review.images": "图片",
    "review.publishTime": "发布时间",
    "review.channel": "发布渠道",
    "review.publisherId": "发布人ID",
    "review.sourceUrl": "来源URL",
    "review.sourceTitle": "来源标题",
    "review.relatedDomain": "关联域名",
    "review.newOldGang": "新老团伙",
    "review.newOldContent": "新老内容",
    "review.riskScene": "风险场景",
    "review.riskTags": "风险标签",
    "review.ignoreReason": "暂不关注原因",
    "review.ignoreReasonPlaceholder": "请填写暂不关注原因",
    "review.newGang": "新团伙",
    "review.oldGang": "老团伙",
    "review.newContent": "新内容",
    "review.oldContent": "老内容",
    "review.chineseTranslation": "中文翻译",
    "review.originalText": "原文",
    "review.imagePreview": "图片预览:",
    "review.chineseTranslationLabel": "中文翻译:",
    "review.ocrResult": "OCR识别结果:",
    "review.goToOriginal": "前往原网页",
  },
  en: {
    // Navigation
    "nav.platform": "AI Engine Platform",
    "nav.antifraud": "Anti-Fraud",
    "nav.overview": "Overview",
    "nav.clueReview": "Clue Review",
    "nav.clueFollowup": "Clue Follow-up",
    "nav.eventCenter": "Event Center",
    "nav.configManagement": "Config Management",
    "nav.botManagement": "Bot Management",
    "nav.followSessions": "Follow Sessions",
    "nav.gangProfile": "Gang Profile",
    "nav.logout": "Logout",

    // Common
    "common.search": "Search",
    "common.filter": "Filter",
    "common.reset": "Reset",
    "common.confirm": "Confirm",
    "common.cancel": "Cancel",
    "common.submit": "Submit",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.view": "View",
    "common.export": "Export",
    "common.import": "Import",
    "common.total": "Total",
    "common.items": "records",
    "common.page": "Page",
    "common.perPage": "Per page",
    "common.goto": "Go to",
    "common.operation": "Operation",
    "common.status": "Status",
    "common.time": "Time",
    "common.operator": "Operator",
    "common.operationTime": "Operation Time",
    "common.batchOperation": "Batch Operation",
    "common.manualEntry": "Manual Entry",
    "common.confirmAction": "Confirm Action",
    "common.confirmBatchMessage": 'Are you sure you want to perform "{action}" on {count} selected clues?',
    "common.pageUnit": "",

    // Clue Review
    "review.followup": "Follow up",
    "review.ignore": "Ignore",
    "review.createEvent": "Create Event",
    "review.pending": "Pending Review",
    "review.followed": "Pending Follow-up",
    "review.ignored": "Ignored",
    "review.eventCreated": "Event Created",
    "review.clueId": "Clue ID",
    "review.captureTime": "Capture Time",
    "review.customer": "Customer",
    "review.original": "Original Content",
    "review.translation": "Translation",
    "review.images": "Images",
    "review.publishTime": "Publish Time",
    "review.channel": "Channel",
    "review.publisherId": "Publisher ID",
    "review.sourceUrl": "Source URL",
    "review.sourceTitle": "Source Title",
    "review.relatedDomain": "Related Domain",
    "review.newOldGang": "Gang Type",
    "review.newOldContent": "Content Type",
    "review.riskScene": "Risk Scene",
    "review.riskTags": "Risk Tags",
    "review.ignoreReason": "Ignore Reason",
    "review.ignoreReasonPlaceholder": "Please enter the reason for ignoring",
    "review.newGang": "New Gang",
    "review.oldGang": "Old Gang",
    "review.newContent": "New Content",
    "review.oldContent": "Old Content",
    "review.chineseTranslation": "Chinese Translation",
    "review.originalText": "Original Text",
    "review.imagePreview": "Image Preview:",
    "review.chineseTranslationLabel": "Chinese Translation:",
    "review.ocrResult": "OCR Result:",
    "review.goToOriginal": "Go to Original",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("zh")

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[language][key] || key
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v))
      })
    }
    return text
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
