"use client"

import { CheckCircle, XCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface MessageToastProps {
  type: "success" | "error"
  message: string
  visible: boolean
  onClose: () => void
}

export function MessageToast({ type, message, visible, onClose }: MessageToastProps) {
  if (!visible) return null

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-md border min-w-[300px] max-w-[500px] shadow-lg animate-in fade-in slide-in-from-top-2 duration-300",
        type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800",
      )}
    >
      {type === "success" ? (
        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
      )}
      <span className="flex-1 text-sm">{message}</span>
      <button
        onClick={onClose}
        className={cn(
          "flex-shrink-0 p-0.5 rounded hover:bg-opacity-20",
          type === "success" ? "hover:bg-green-500" : "hover:bg-red-500",
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
