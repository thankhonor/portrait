"use client"

// ====================================
// 线索审核模块 - 页面组件
// Clue Review Module - Page Component
// ====================================
// 此文件仅供线索审核模块使用
// 修改此文件不会影响其他模块

import { useState } from "react"
import { Pagination } from "@/components/layout/pagination"
import { ClueReviewFilters } from "@/components/clue-review/clue-review-filters"
import { ClueReviewTable } from "@/components/clue-review/clue-review-table"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { Clue } from "@/lib/modules/clue-review/types"
import { clueReviewMockClues } from "@/lib/modules/clue-review/data"

const CURRENT_USER = "zhangsan@threathunter.cn"

const getShortUsername = (email: string) => email.split("@")[0]

export default function ClueReviewPage() {
  const { t } = useLanguage()
  const [clues, setClues] = useState<Clue[]>(
    clueReviewMockClues.map((c) => ({ ...c, followStatus: c.followStatus || "pending" })),
  )
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [batchAction, setBatchAction] = useState<"followup" | "ignore" | "createEvent" | "restoreReview" | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedClues = clues.slice(startIndex, endIndex)

  const handleFollowup = (clue: Clue) => {
    console.log("[v0] Follow up clue:", clue.id)
  }

  const handleIgnore = (clue: Clue, reason: string) => {
    const now = new Date()
    const operationTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`

    setClues((prev) =>
      prev.map((c) =>
        c.id === clue.id
          ? {
              ...c,
              followStatus: "ignored" as const,
              status: "ignored" as const,
              ignoreReason: reason,
              operator: getShortUsername(CURRENT_USER),
              operationTime: operationTime,
            }
          : c,
      ),
    )
  }

  const handleCreateEvent = (clue: Clue) => {
    console.log("[v0] Create event from clue:", clue.id)
  }

  const handleRestoreReview = (clue: Clue) => {
    const now = new Date()
    const operationTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`

    setClues((prev) =>
      prev.map((c) =>
        c.id === clue.id
          ? {
              ...c,
              followStatus: "pending" as const,
              status: "pending" as const,
              ignoreReason: undefined,
              operator: getShortUsername(CURRENT_USER),
              operationTime: operationTime,
            }
          : c,
      ),
    )
  }

  const handleBatchActionSelect = (action: "followup" | "ignore" | "createEvent" | "restoreReview") => {
    setBatchAction(action)
    setShowConfirmDialog(true)
  }

  const handleConfirmBatchAction = () => {
    const now = new Date()
    const operationTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`

    if (batchAction === "ignore") {
      setClues((prev) =>
        prev.map((c) =>
          selectedIds.includes(c.id)
            ? {
                ...c,
                followStatus: "ignored" as const,
                status: "ignored" as const,
                operator: getShortUsername(CURRENT_USER),
                operationTime: operationTime,
              }
            : c,
        ),
      )
    }
    if (batchAction === "restoreReview") {
      setClues((prev) =>
        prev.map((c) =>
          selectedIds.includes(c.id)
            ? {
                ...c,
                followStatus: "pending" as const,
                status: "pending" as const,
                ignoreReason: undefined,
                operator: getShortUsername(CURRENT_USER),
                operationTime: operationTime,
              }
            : c,
        ),
      )
    }
    setShowConfirmDialog(false)
    setBatchAction(null)
    setSelectedIds([])
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const getActionLabel = () => {
    switch (batchAction) {
      case "followup":
        return t("review.followup")
      case "ignore":
        return t("review.ignore")
      case "createEvent":
        return t("review.createEvent")
      case "restoreReview":
        return "恢复审核"
      default:
        return ""
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden min-h-0">
      <ClueReviewFilters />

      <div className="flex-1 min-h-0 overflow-hidden mt-3">
        <ClueReviewTable
          clues={paginatedClues}
          selectedIds={selectedIds}
          onSelectChange={setSelectedIds}
          onFollowup={handleFollowup}
          onIgnore={handleIgnore}
          onCreateEvent={handleCreateEvent}
          onBatchAction={handleBatchActionSelect}
          onRestoreReview={handleRestoreReview}
          totalCount={clues.length}
        />
      </div>

      <div className="flex-shrink-0 mx-[-24px] px-6">
        <Pagination
          total={clues.length}
          current={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("common.confirmAction")}</DialogTitle>
            <DialogDescription>
              {t("common.confirmBatchMessage", {
                action: getActionLabel(),
                count: selectedIds.length,
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleConfirmBatchAction}>{t("common.confirm")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
