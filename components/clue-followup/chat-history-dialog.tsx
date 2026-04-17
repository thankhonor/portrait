"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, User } from "lucide-react"

interface ChatMessage {
  id: string
  sender: "bot" | "user"
  content: string
  time: string
}

interface ChatHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clueId: string
  messages?: ChatMessage[]
}

export function ChatHistoryDialog({ open, onOpenChange, clueId, messages }: ChatHistoryDialogProps) {
  // 模拟聊天记录数据
  const defaultMessages: ChatMessage[] = [
    { id: "1", sender: "bot", content: "您好，我是AI助手，请问有什么可以帮助您的？", time: "2024-12-25 10:00:00" },
    { id: "2", sender: "user", content: "你好，我想了解一下你们的服务", time: "2024-12-25 10:01:23" },
    {
      id: "3",
      sender: "bot",
      content: "好的，我们提供多种服务，包括信息查询、业务办理等。请问您具体想了解哪方面？",
      time: "2024-12-25 10:01:45",
    },
    { id: "4", sender: "user", content: "我想咨询一下账户相关的问题", time: "2024-12-25 10:02:30" },
    {
      id: "5",
      sender: "bot",
      content: "好的，请问您遇到了什么账户问题？我会尽力帮您解答。",
      time: "2024-12-25 10:02:50",
    },
  ]

  const chatMessages = messages || defaultMessages

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            聊天记录
            <span className="text-sm font-normal text-muted-foreground ml-2">线索ID: {clueId}</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {chatMessages.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">暂无聊天记录</div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`flex items-start gap-2 max-w-[80%] ${msg.sender === "bot" ? "" : "flex-row-reverse"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.sender === "bot" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {msg.sender === "bot" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        msg.sender === "bot" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${msg.sender === "bot" ? "text-muted-foreground" : "text-primary-foreground/70"}`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
