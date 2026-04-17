"use client"

import { useLanguage } from "@/contexts/language-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChatPanel } from "./chat-panel"
import type { Clue } from "@/lib/mock-data"
import { ExternalLink, ImageIcon } from "lucide-react"

interface FollowupDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clue: Clue | null
  onIgnore?: () => void
  onCreateEvent?: () => void
}

export function FollowupDetailDialog({ open, onOpenChange, clue, onIgnore, onCreateEvent }: FollowupDetailDialogProps) {
  const { t } = useLanguage()

  if (!clue) return null

  const handleSendMessage = (message: string) => {
    console.log("[v0] Sending message:", message)
    // In real app: send message via API
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{clue.id}</span>
            <Badge variant="outline">{clue.customer}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Clue Details */}
          <div className="overflow-auto pr-2 space-y-4">
            {/* Basic Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">基础信息</h4>
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="w-20 text-muted-foreground shrink-0">{t("review.original")}:</span>
                  <span className="flex-1">{clue.original}</span>
                </div>
                {clue.translation && (
                  <div className="flex">
                    <span className="w-20 text-muted-foreground shrink-0">{t("review.translation")}:</span>
                    <span className="flex-1">{clue.translation}</span>
                  </div>
                )}
                {clue.images.length > 0 && (
                  <div className="flex">
                    <span className="w-20 text-muted-foreground shrink-0">{t("review.images")}:</span>
                    <div className="flex gap-2">
                      {clue.images.map((img, idx) => (
                        <div key={idx} className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Source Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">来源信息</h4>
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="w-20 text-muted-foreground shrink-0">{t("review.publishTime")}:</span>
                  <span>{clue.publishTime}</span>
                </div>
                <div className="flex">
                  <span className="w-20 text-muted-foreground shrink-0">{t("review.channel")}:</span>
                  <Badge variant="secondary">{clue.channel}</Badge>
                </div>
                <div className="flex">
                  <span className="w-20 text-muted-foreground shrink-0">{t("review.publisherId")}:</span>
                  <span className="font-mono">{clue.publisherId}</span>
                </div>
                {clue.sourceUrl && (
                  <div className="flex">
                    <span className="w-20 text-muted-foreground shrink-0">{t("review.sourceUrl")}:</span>
                    <a
                      href={clue.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {clue.sourceTitle || "查看来源"}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">风险分析</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{t("review.riskScene")}:</span>
                  <Badge>{clue.riskScene}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{t("review.newOldGang")}:</span>
                  <Badge variant={clue.isNewGang ? "default" : "outline"}>
                    {clue.isNewGang ? t("review.newGang") : t("review.oldGang")}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{t("review.newOldContent")}:</span>
                  <Badge variant={clue.isNewContent ? "default" : "outline"}>
                    {clue.isNewContent ? t("review.newContent") : t("review.oldContent")}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {clue.riskTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviewer Info */}
            {clue.reviewer && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3">审核信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="w-20 text-muted-foreground shrink-0">{t("followup.reviewer")}:</span>
                    <span>{clue.reviewer}</span>
                  </div>
                  <div className="flex">
                    <span className="w-20 text-muted-foreground shrink-0">{t("followup.reviewTime")}:</span>
                    <span>{clue.reviewTime}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Chat Panel */}
          <div className="h-full">
            <ChatPanel
              messages={clue.chatMessages || []}
              botId={clue.botId}
              onSendMessage={handleSendMessage}
              disabled={clue.followStatus === "pending" || clue.followStatus === "messageFailed"}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={onIgnore}>
            {t("review.ignore")}
          </Button>
          <Button onClick={onCreateEvent}>{t("review.createEvent")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
