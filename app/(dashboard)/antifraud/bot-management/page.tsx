"use client"

import { BotManagementTable } from "@/components/bot-management/bot-management-table"

export default function BotManagementPage() {
  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <BotManagementTable />
      </div>
    </div>
  )
}
