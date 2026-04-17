// ====================================
// 配置管理模块 - 客户配置
// Config Management Module - Customer Config
// ====================================

export interface CustomerOperationHistory {
  id: string
  operationType: "add" | "remove" | "rename"
  customerName: string
  oldName?: string // 用于重命名操作
  description: string
  operator: string
  operationTime: string
}

export interface CustomerConfig {
  customers: string[]
  operationHistory: CustomerOperationHistory[]
}

const CUSTOMER_CONFIG_STORAGE_KEY = "customer-config"

// 默认客户列表
const defaultCustomers = ["AMAZON", "TIKTOKSHOP", "TIKTOK", "SHEIN", "ICBU", "ALIEXPRESS", "LAZADA", "VINTED"]

// 获取客户配置
export function getCustomerConfig(): CustomerConfig {
  if (typeof window === "undefined") {
    return { customers: defaultCustomers, operationHistory: [] }
  }
  
  const saved = localStorage.getItem(CUSTOMER_CONFIG_STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return { customers: defaultCustomers, operationHistory: [] }
    }
  }
  return { customers: defaultCustomers, operationHistory: [] }
}

// 保存客户配置
export function saveCustomerConfig(config: CustomerConfig): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(CUSTOMER_CONFIG_STORAGE_KEY, JSON.stringify(config))
  }
}

// 获取客户列表
export function getCustomerList(): string[] {
  return getCustomerConfig().customers
}

// 添加客户
export function addCustomer(customerName: string, description: string, operator: string): boolean {
  const config = getCustomerConfig()
  if (config.customers.includes(customerName)) {
    return false // 客户已存在
  }
  
  config.customers.push(customerName)
  config.operationHistory.unshift({
    id: `op-${Date.now()}`,
    operationType: "add",
    customerName,
    description,
    operator,
    operationTime: new Date().toLocaleString("zh-CN"),
  })
  
  saveCustomerConfig(config)
  return true
}

// 移除客户
export function removeCustomer(customerName: string, description: string, operator: string): boolean {
  const config = getCustomerConfig()
  const index = config.customers.indexOf(customerName)
  if (index === -1) {
    return false // 客户不存在
  }
  
  config.customers.splice(index, 1)
  config.operationHistory.unshift({
    id: `op-${Date.now()}`,
    operationType: "remove",
    customerName,
    description,
    operator,
    operationTime: new Date().toLocaleString("zh-CN"),
  })
  
  saveCustomerConfig(config)
  return true
}

// 重命名客户
export function renameCustomer(oldName: string, newName: string, description: string, operator: string): boolean {
  const config = getCustomerConfig()
  const index = config.customers.indexOf(oldName)
  if (index === -1) {
    return false // 客户不存在
  }
  if (config.customers.includes(newName)) {
    return false // 新名称已存在
  }
  
  config.customers[index] = newName
  config.operationHistory.unshift({
    id: `op-${Date.now()}`,
    operationType: "rename",
    customerName: newName,
    oldName,
    description,
    operator,
    operationTime: new Date().toLocaleString("zh-CN"),
  })
  
  saveCustomerConfig(config)
  return true
}

// 获取操作历史
export function getOperationHistory(): CustomerOperationHistory[] {
  return getCustomerConfig().operationHistory
}
