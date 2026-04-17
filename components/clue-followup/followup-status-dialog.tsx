"use client"

// ====================================
// 线索跟进模块 - 跟进进度选择弹窗
// Clue Followup Module - Followup Status Selection Dialog
// ====================================

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MessageCircleX, MessageCircle, UserCheck } from "lucide-react"

interface FollowupStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectStatus: (status: "messageFailed" | "messaged" | "connected") => void
}

export function FollowupStatusDialog({ open, onOpenChange, onSelectStatus }: FollowupStatusDialogProps) {
  const handleSelectStatus = (status: "messageFailed" | "messaged" | "connected") => {
    onSelectStatus(status)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>选择跟进进度</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          <Button
            variant="outline"
            className="w-full justify-start h-12 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 bg-transparent"
            onClick={() => handleSelectStatus("messageFailed")}
          >
            <MessageCircleX className="w-5 h-5 mr-3" />
            留言失败
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start h-12 text-blue-500 border-blue-200 hover:bg-blue-50 hover:text-blue-600 bg-transparent"
            onClick={() => handleSelectStatus("messaged")}
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            已留言
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start h-12 text-green-500 border-green-200 hover:bg-green-50 hover:text-green-600 bg-transparent"
            onClick={() => handleSelectStatus("connected")}
          >
            <UserCheck className="w-5 h-5 mr-3" />
            已建联
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
