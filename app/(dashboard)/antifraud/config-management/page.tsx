"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { CustomerManagement } from "@/components/config-management/customer-management"

const tabs = [
  { id: "scene-tags", label: "场景标签管理" },
  { id: "views", label: "视图管理" },
  { id: "customers", label: "客户管理" },
  { id: "channels", label: "渠道管理" },
]

export default function ConfigManagementPage() {
  const [activeTab, setActiveTab] = useState("customers")

  return (
    <div className="p-6 space-y-6">
      {/* 标签页导航 */}
      <div className="border-b">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 标签页内容 */}
      <div className="bg-white rounded-lg border p-6">
        {activeTab === "customers" && <CustomerManagement />}
        
        {activeTab === "scene-tags" && (
          <div className="text-center text-muted-foreground py-12">
            场景标签管理功能暂未实现
          </div>
        )}
        
        {activeTab === "views" && (
          <div className="text-center text-muted-foreground py-12">
            视图管理功能暂未实现
          </div>
        )}
        
        {activeTab === "channels" && (
          <div className="text-center text-muted-foreground py-12">
            渠道管理功能暂未实现
          </div>
        )}
      </div>
    </div>
  )
}
