"use client"

// ====================================
// 线索跟进模块 - 页面组件
// Clue Followup Module - Page Component
// ====================================
// 此文件仅供线索跟进模块使用
// 修改此文件不会影响其他模块

import { useState } from "react"
import { Pagination } from "@/components/layout/pagination"
import { ClueFollowupFilters } from "@/components/clue-followup/clue-followup-filters"
import { ClueFollowupTable } from "@/components/clue-followup/clue-followup-table"
import { FollowupStatusDialog } from "@/components/clue-followup/followup-status-dialog"
import { GenerateEventDrawer } from "@/components/clue-followup/generate-event-drawer"
import { useLanguage } from "@/contexts/language-context"

import type { FollowupClue } from "@/lib/modules/clue-followup/types"
import { clueFollowupMockClues } from "@/lib/modules/clue-followup/data"

export default function ClueFollowupPage() {
  const { t } = useLanguage()
  const [clues, setClues] = useState<FollowupClue[]>(clueFollowupMockClues)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedClue, setSelectedClue] = useState<FollowupClue | null>(null)
  const [generateEventOpen, setGenerateEventOpen] = useState(false)
  const [eventClue, setEventClue] = useState<FollowupClue | null>(null)

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedClues = clues.slice(startIndex, endIndex)

  const handleStartFollow = (clue: FollowupClue) => {
    setSelectedClue(clue)
    setStatusDialogOpen(true)
  }

  const handleSelectFollowStatus = (followStatus: "messageFailed" | "messaged" | "connected") => {
    if (selectedClue) {
      setClues((prevClues) =>
        prevClues.map((c) => (c.id === selectedClue.id ? { ...c, status: "following" as const, followStatus } : c)),
      )
    }
  }

  const handleIgnore = (clue: FollowupClue, reason: string) => {
    setClues((prevClues) =>
      prevClues.map((c) => (c.id === clue.id ? { ...c, status: "ignored" as const, ignoreReason: reason } : c)),
    )
  }

  const handleCreateEvent = (clue: FollowupClue) => {
    setEventClue(clue)
    setGenerateEventOpen(true)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col h-full">
      <ClueFollowupFilters />

      {/* Part 4: Table - 使用独立的线索跟进表格组件 */}
      <div className="flex-1 overflow-auto mt-3">
        <ClueFollowupTable
          clues={paginatedClues}
          selectedIds={selectedIds}
          onSelectChange={setSelectedIds}
          onStartFollow={handleStartFollow}
          onIgnore={handleIgnore}
          onCreateEvent={handleCreateEvent}
          totalCount={clues.length}
        />
      </div>

      {/* Part 5: Pagination */}
      <Pagination
        total={clues.length}
        current={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />

      <FollowupStatusDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onSelectStatus={handleSelectFollowStatus}
      />

      <GenerateEventDrawer
        open={generateEventOpen}
        onOpenChange={setGenerateEventOpen}
        clue={eventClue}
        onSuccess={() => {
          // 可在此处理生成事件成功后的逻辑
        }}
      />
    </div>
  )
}
