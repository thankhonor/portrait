"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface MultiSelectRiskSceneProps {
  value: string[]
  onChange: (value: string[]) => void
  options: string[]
  placeholder?: string
}

export function MultiSelectRiskScene({
  value,
  onChange,
  options,
  placeholder = "风险场景",
}: MultiSelectRiskSceneProps) {
  const [open, setOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const toggleOption = (option: string) => {
    const newValue = value.includes(option) ? value.filter((v) => v !== option) : [...value, option]
    onChange(newValue)
  }

  const getDisplayValue = () => {
    if (value.length === 0) return null
    if (value.length === 1) return value[0]
    return `已选 ${value.length} 项`
  }

  const handleClearClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange([])
    setOpen(false)
  }

  const displayValue = getDisplayValue()

  return (
    <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-[180px] h-10 justify-between font-normal rounded-lg shadow-xs hover:bg-gray-100/50",
              value.length > 0 ? "border-blue-400 bg-blue-50/50" : "border-border",
            )}
          >
            <span className={cn("truncate", value.length === 0 && "text-muted-foreground")}>
              {displayValue || placeholder}
            </span>
            {value.length > 0 && isHovered ? (
              <div onClick={handleClearClick} className="ml-auto shrink-0 cursor-pointer">
                <XCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </div>
            ) : (
              <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-2" align="start">
          <div className="space-y-1">
            {options.map((option) => (
              <div
                key={option}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => toggleOption(option)}
              >
                <Checkbox checked={value.includes(option)} className="pointer-events-none" />
                <span className="text-sm">{option}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 mt-2 border-t flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 h-7 px-2"
              onClick={() => onChange([])}
            >
              清空
            </Button>
            <Button size="sm" className="h-7 px-3" onClick={() => setOpen(false)}>
              确定
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
