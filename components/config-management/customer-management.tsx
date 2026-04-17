"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, History, X } from "lucide-react"
import { MessageToast } from "@/components/shared/message-toast"
import {
  getCustomerConfig,
  addCustomer,
  removeCustomer,
  renameCustomer,
  getOperationHistory,
  type CustomerOperationHistory,
} from "@/lib/modules/config-management/customer-config"

export function CustomerManagement() {
  const [customers, setCustomers] = useState<string[]>([])
  const [operationHistory, setOperationHistory] = useState<CustomerOperationHistory[]>([])

  // 新增客户弹窗
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newCustomerName, setNewCustomerName] = useState("")
  const [addDescription, setAddDescription] = useState("")

  // 重命名弹窗
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [renameTarget, setRenameTarget] = useState("")
  const [newName, setNewName] = useState("")
  const [renameDescription, setRenameDescription] = useState("")

  // 删除确认弹窗
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState("")
  const [deleteDescription, setDeleteDescription] = useState("")

  // 历史记录弹窗
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)

  // Toast
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; message: string; visible: boolean }>({
    type: "success",
    message: "",
    visible: false,
  })

  const showMessage = (type: "success" | "error", message: string) => {
    setToastMessage({ type, message, visible: true })
    setTimeout(() => setToastMessage((prev) => ({ ...prev, visible: false })), 3000)
  }

  // 加载数据
  const loadData = () => {
    const config = getCustomerConfig()
    setCustomers(config.customers)
    setOperationHistory(config.operationHistory)
  }

  useEffect(() => {
    loadData()
  }, [])

  // 添加客户
  const handleAddCustomer = () => {
    if (!newCustomerName.trim()) {
      showMessage("error", "请输入客户名称")
      return
    }
    if (!addDescription.trim()) {
      showMessage("error", "请输入改动说明")
      return
    }

    const success = addCustomer(newCustomerName.trim().toUpperCase(), addDescription.trim(), "zhangsan@threathunter.cn")
    if (success) {
      showMessage("success", `客户"${newCustomerName.trim().toUpperCase()}"添加成功`)
      loadData()
      setAddDialogOpen(false)
      setNewCustomerName("")
      setAddDescription("")
    } else {
      showMessage("error", "客户已存在")
    }
  }

  // 打开重命名弹窗
  const openRenameDialog = (customer: string) => {
    setRenameTarget(customer)
    setNewName(customer)
    setRenameDescription("")
    setRenameDialogOpen(true)
  }

  // 确认重命名
  const handleRename = () => {
    if (!newName.trim()) {
      showMessage("error", "请输入新名称")
      return
    }
    if (!renameDescription.trim()) {
      showMessage("error", "请输入改动说明")
      return
    }

    const success = renameCustomer(renameTarget, newName.trim().toUpperCase(), renameDescription.trim(), "zhangsan@threathunter.cn")
    if (success) {
      showMessage("success", `客户"${renameTarget}"已重命名为"${newName.trim().toUpperCase()}"`)
      loadData()
      setRenameDialogOpen(false)
      setRenameTarget("")
      setNewName("")
      setRenameDescription("")
    } else {
      showMessage("error", "重命名失败，新名称可能已存在")
    }
  }

  // 打开删除确认弹窗
  const openDeleteDialog = (customer: string) => {
    setDeleteTarget(customer)
    setDeleteDescription("")
    setDeleteDialogOpen(true)
  }

  // 确认删除
  const handleDelete = () => {
    if (!deleteDescription.trim()) {
      showMessage("error", "请输入改动说明")
      return
    }

    const success = removeCustomer(deleteTarget, deleteDescription.trim(), "zhangsan@threathunter.cn")
    if (success) {
      showMessage("success", `客户"${deleteTarget}"已移除`)
      loadData()
      setDeleteDialogOpen(false)
      setDeleteTarget("")
      setDeleteDescription("")
    } else {
      showMessage("error", "移除失败")
    }
  }

  // 获取操作类型显示文本
  const getOperationTypeText = (type: string) => {
    switch (type) {
      case "add":
        return "新增"
      case "remove":
        return "移除"
      case "rename":
        return "重命名"
      default:
        return type
    }
  }

  // 获取操作类型Badge样式
  const getOperationTypeBadge = (type: string) => {
    switch (type) {
      case "add":
        return "bg-green-50 text-green-600 border-green-200"
      case "remove":
        return "bg-red-50 text-red-600 border-red-200"
      case "rename":
        return "bg-blue-50 text-blue-600 border-blue-200"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      <MessageToast
        type={toastMessage.type}
        message={toastMessage.message}
        visible={toastMessage.visible}
        onClose={() => setToastMessage((prev) => ({ ...prev, visible: false }))}
      />

      {/* 操作按钮 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          共 {customers.length} 个客户
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setHistoryDialogOpen(true)}>
            <History className="w-4 h-4 mr-1" />
            查看历史操作
          </Button>
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            新增客户
          </Button>
        </div>
      </div>

      {/* 客户列表 */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">序号</TableHead>
              <TableHead>客户名称</TableHead>
              <TableHead className="w-[150px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={customer}>
                <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                <TableCell className="font-medium">{customer}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-gray-500 hover:text-blue-600"
                      onClick={() => openRenameDialog(customer)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-gray-500 hover:text-red-600"
                      onClick={() => openDeleteDialog(customer)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 新增客户弹窗 */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增客户</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                客户名称 <span className="text-red-500">*</span>
              </label>
              <Input
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                placeholder="请输入客户名称"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                改动说明 <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={addDescription}
                onChange={(e) => setAddDescription(e.target.value)}
                placeholder="请输入改动说明"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddCustomer}>
              确认添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 重命名弹窗 */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>重命名客户</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">原名称</label>
              <div className="p-2 bg-muted/50 rounded text-sm">{renameTarget}</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                新名称 <span className="text-red-500">*</span>
              </label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="请输入新名称"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                改动说明 <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={renameDescription}
                onChange={(e) => setRenameDescription(e.target.value)}
                placeholder="请输入改动说明"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleRename}>
              确认重命名
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>移除客户</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-sm">
              确定要移除客户 <span className="font-medium text-red-600">{deleteTarget}</span> 吗？
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                改动说明 <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={deleteDescription}
                onChange={(e) => setDeleteDescription(e.target.value)}
                placeholder="请输入改动说明"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              确认移除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 历史操作记录弹窗 */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>历史操作记录</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto max-h-[60vh]">
            {operationHistory.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                暂无操作记录
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">操作类型</TableHead>
                    <TableHead>客户名称</TableHead>
                    <TableHead>改动说明</TableHead>
                    <TableHead className="w-[150px]">操作人</TableHead>
                    <TableHead className="w-[180px]">操作时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operationHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Badge variant="outline" className={getOperationTypeBadge(record.operationType)}>
                          {getOperationTypeText(record.operationType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.operationType === "rename" ? (
                          <span>
                            {record.oldName} <span className="text-muted-foreground">→</span> {record.customerName}
                          </span>
                        ) : (
                          record.customerName
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{record.description}</TableCell>
                      <TableCell className="text-muted-foreground">{record.operator}</TableCell>
                      <TableCell className="text-muted-foreground">{record.operationTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
