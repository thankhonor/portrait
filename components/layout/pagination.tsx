"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  total: number
  current: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export function Pagination({ total, current, pageSize, onPageChange, onPageSizeChange }: PaginationProps) {
  const { t, language } = useLanguage()
  const totalPages = Math.ceil(total / pageSize)

  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, current - 2)
      const end = Math.min(totalPages, start + maxVisiblePages - 1)

      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    return pages
  }

  const pageNumbers = getPageNumbers()

  // Format the display text based on language
  const getInfoText = () => {
    if (language === "zh") {
      return `${t("common.total")} ${total} ${t("common.items")}，${t("common.page")} ${current}/${totalPages} ${t("common.pageUnit")}`
    }
    return `${t("common.total")} ${total} ${t("common.items")}, ${t("common.page")} ${current}/${totalPages}`
  }

  return (
    <div className="flex items-center justify-between py-2 px-2 border-t border-border">
      {/* Left: Total records and current page info */}
      <div className="text-sm text-muted-foreground">{getInfoText()}</div>

      <div className="flex items-center gap-4">
        {/* Page navigation */}
        <div className="flex items-center gap-1">
          {/* Previous button */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            disabled={current === 1}
            onClick={() => onPageChange(current - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Page number buttons */}
          {pageNumbers.map((page) => (
            <Button
              key={page}
              variant={current === page ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}

          {/* Next button */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            disabled={current === totalPages || totalPages === 0}
            onClick={() => onPageChange(current + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {onPageSizeChange && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{language === "zh" ? "每页显示" : "Items per page"}:</span>
            <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
              <SelectTrigger className="h-8 w-[85px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  )
}
