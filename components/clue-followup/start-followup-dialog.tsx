"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Pencil, Check, X, Smile, Paperclip } from "lucide-react"
import type { FollowupClue } from "@/lib/modules/clue-followup/types"

interface StartFollowupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clue: FollowupClue | null
  onConfirm?: (clue: FollowupClue, message: string) => void
}

// AI 推荐话术数据 - 包含多语言翻译
const aiSuggestions = [
  { id: 1, en: "Bro, how do we handle escrow for bulk orders?", zh: "老哥，量大怎么走担保？", es: "Hermano, ¿cómo manejamos el depósito en garantía para pedidos al por mayor?", fr: "Mec, comment gérons-nous l'escrow pour les commandes en gros?", de: "Bruder, wie handhaben wir die Kaution für Großbestellungen?", ja: "兄貴、大量注文のエスクロー処理はどうしますか？", ru: "Брат, как мы обрабатываем условное депонирование для оптовых заказов?" },
  { id: 2, en: "Got any fresh stuff? What's the price?", zh: "有没有最新的料？价格怎么算？", es: "¿Tienes algo nuevo? ¿Cuál es el precio?", fr: "As-tu du nouveau? Quel est le prix?", de: "Hast du etwas Neues? Was ist der Preis?", ja: "新しいものはありますか？価格はいくらですか？", ru: "Есть ли что-то новое? Какая цена?" },
  { id: 3, en: "A friend referred me, can I check samples first?", zh: "朋友介绍来的，能先看看样品吗？", es: "Un amigo me recomendó, ¿puedo verificar muestras primero?", fr: "Un ami m'a recommandé, puis-je d'abord vérifier les échantillons?", de: "Ein Freund hat mich empfohlen, kann ich erste Muster überprüfen?", ja: "友人に紹介されたのですが、サンプルを確認できますか？", ru: "Друг меня рекомендовал, могу ли я сначала проверить образцы?" },
  { id: 4, en: "Hey, what platform do you guys use?", zh: "哥，你们这边走什么平台？", es: "Oye, ¿qué plataforma usan ustedes?", fr: "Salut, quelle plateforme utilisez-vous?", de: "Hey, welche Plattform benutzt ihr?", ja: "ちょっと、あなたたちはどのプラットフォームを使っていますか？", ru: "Эй, какую платформу вы используете?" },
  { id: 5, en: "Your stuff looks good, how can we work together?", zh: "看你发的东西不错，怎么合作？", es: "Tus cosas se ven bien, ¿cómo podemos trabajar juntos?", fr: "Tes trucs ont l'air bien, comment pouvons-nous travailler ensemble?", de: "Deine Sachen sehen gut aus, wie können wir zusammenarbeiten?", ja: "あなたの商品は良く見えますが、どのように協力できますか？", ru: "Ваши вещи выглядят хорошо, как мы можем сотрудничать?" },
]

const moreSuggestions = [
  { id: 6, en: "Bro, got any stable supply?", zh: "兄弟，有没有稳定的货源？", es: "Hermano, ¿tienes suministro estable?", fr: "Mec, tu as un approvisionnement stable?", de: "Bruder, hast du eine stabile Versorgung?", ja: "兄貴、安定した供給がありますか？", ru: "Брат, у тебя есть стабильное предложение?" },
  { id: 7, en: "Looking for a long-term partner, any channels?", zh: "想找个长期合作的，有渠道吗？", es: "Buscando un socio a largo plazo, ¿hay canales?", fr: "À la recherche d'un partenaire à long terme, des canaux?", de: "Suche nach langfristigem Partner, gibt es Kanäle?", ja: "長期的なパートナーを探しています、チャネルはありますか？", ru: "Ищу долгосрочного партнера, есть ли каналы?" },
  { id: 8, en: "How does the deal work? What escrow?", zh: "这个怎么交易？走什么担保？", es: "¿Cómo funciona el trato? ¿Qué depósito en garantía?", fr: "Comment marche l'affaire? Quel escrow?", de: "Wie funktioniert der Deal? Was Kaution?", ja: "取引はどのように機能しますか？何のエスクロー？", ru: "Как работает сделка? Какой условный депозит?" },
  { id: 9, en: "Got a referral from someone, want to learn more", zh: "有同行推荐，想了解一下", es: "Tengo una referencia de alguien, quiero aprender más", fr: "J'ai une référence de quelqu'un, je veux en savoir plus", de: "Ich habe eine Referenz von jemandem, ich möchte mehr erfahren", ja: "誰かから紹介されました、もっと詳しく知りたいです", ru: "У меня есть рекомендация от кого-то, я хочу узнать больше" },
  { id: 10, en: "New to this, looking for guidance", zh: "新手入行，求带求指导", es: "Nuevo en esto, buscando orientación", fr: "Nouveau à cela, cherchant des conseils", de: "Neu darin, Anleitung suchen", ja: "これは新しいです、ガイダンスを求めています", ru: "Новичок в этом, ищу руководство" },
]

export function StartFollowupDialog({ open, onOpenChange, clue, onConfirm }: StartFollowupDialogProps) {
  const [targetNickname, setTargetNickname] = useState("喜羊羊")
  const [isEditingTarget, setIsEditingTarget] = useState(false)
  const [tempNickname, setTempNickname] = useState("")
  const [message, setMessage] = useState("")
  const [suggestions, setSuggestions] = useState(aiSuggestions)
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<number | null>(null)
  const [targetLanguage, setTargetLanguage] = useState("English")

  const handleStartEdit = () => {
    setTempNickname(targetNickname)
    setIsEditingTarget(true)
  }

  const handleConfirmEdit = () => {
    if (tempNickname.trim()) {
      setTargetNickname(tempNickname.trim())
    }
    setIsEditingTarget(false)
  }

  const handleCancelEdit = () => {
    setIsEditingTarget(false)
    setTempNickname("")
  }

  const handleSelectSuggestion = (suggestion: (typeof aiSuggestions)[0]) => {
    // 根据选中的目标语言填充相应的翻译
    let messageText = suggestion.en // 默认英文

    const languageMap: Record<string, keyof typeof suggestion> = {
      "English": "en",
      "Chinese": "zh",
      "Spanish": "es",
      "French": "fr",
      "German": "de",
      "Japanese": "ja",
      "Russian": "ru",
    }

    const langKey = languageMap[targetLanguage]
    if (langKey && langKey in suggestion) {
      messageText = suggestion[langKey] as string
    }

    setMessage(messageText)
    setSelectedSuggestionId(suggestion.id)
  }

  const handleRefreshSuggestions = () => {
    setSuggestions((prev) => (prev[0].id === 1 ? moreSuggestions : aiSuggestions))
    setSelectedSuggestionId(null)
  }

  const handleSend = () => {
    if (clue && message.trim() && onConfirm) {
      onConfirm(clue, message.trim())
    }
    setMessage("")
    setSelectedSuggestionId(null)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setMessage("")
    setSelectedSuggestionId(null)
    setIsEditingTarget(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-3xl">
        <DialogHeader>
          <DialogTitle>开始跟进</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 1. 双方信息展示区 - 左右布局 */}
          <div className="grid grid-cols-2 gap-3">
            {/* 左侧：目标黑产信息 */}
            <div className="flex flex-col gap-3 p-3 rounded-lg border bg-red-50/50 border-red-100">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-black">目标黑产</div>
                <p className="text-[11px] text-red-600 whitespace-nowrap shrink-0">注意：已和当前黑产成功建联会话5次</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold shrink-0">
                  {targetNickname.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    {isEditingTarget ? (
                      <>
                        <Input
                          value={tempNickname}
                          onChange={(e) => setTempNickname(e.target.value)}
                          className="flex-1 h-6 text-sm"
                          autoFocus
                          onKeyDown={(e) => e.key === "Enter" && handleConfirmEdit()}
                        />
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-green-600" onClick={handleConfirmEdit}>
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-500" onClick={handleCancelEdit}>
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-sm truncate">{targetNickname}</span>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 hover:text-blue-600 shrink-0" onClick={handleStartEdit}>
                          <Pencil className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：当前 Bot 信息 */}
            <div className="flex flex-col gap-3 p-3 rounded-lg border bg-slate-50 border-slate-200">
              <div className="text-xs font-medium text-slate-700">当前 Bot</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm truncate">Alex Crypto</span>
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-[10px] shrink-0">
                      海外小白买家
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. AI推荐话术区 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">AI 推荐话术</h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-muted-foreground gap-1 hover:text-blue-600"
                onClick={handleRefreshSuggestions}
              >
                <RefreshCw className="w-3 h-3" />
                换一批
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSelectSuggestion(s)}
                  className={`px-4 py-3 rounded-lg cursor-pointer transition-all ${
                    selectedSuggestionId === s.id
                      ? "bg-blue-500"
                      : "bg-gray-100 hover:bg-blue-100"
                  }`}
                  title={s.en}
                >
                  <div className={`text-sm whitespace-normal overflow-hidden text-ellipsis line-clamp-2 ${
                    selectedSuggestionId === s.id ? "text-white" : "text-gray-700"
                  }`}>
                    {s.zh}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. 目标语言选择 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">目标语言</label>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="选择目标语言" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English（英语）</SelectItem>
                <SelectItem value="Chinese">Chinese（中文）</SelectItem>
                <SelectItem value="Spanish">Spanish（西班牙语）</SelectItem>
                <SelectItem value="French">French（法语）</SelectItem>
                <SelectItem value="German">German（德语）</SelectItem>
                <SelectItem value="Japanese">Japanese（日语）</SelectItem>
                <SelectItem value="Russian">Russian（俄语）</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 4. 留言编辑区 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">留言内容</label>
            <div className="relative">
              <Textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  setSelectedSuggestionId(null)
                }}
                placeholder="输入留言内容，或点击上方推荐话术快速填充..."
                rows={4}
                className="resize-none pr-20"
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600">
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. 操作区 */}
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleSend} disabled={!message.trim()}>
            确认发送
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
