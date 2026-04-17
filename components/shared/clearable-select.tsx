"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ClearableSelectProps {
  value: string
  onValueChange: (value: string) => void
  onClear: () => void
  placeholder: string
  options: { value: string; label: string }[]
  className?: string
  disabled?: boolean
  hasValue?: boolean
}

export function ClearableSelect({
  value,
  onValueChange,
  onClear,
  placeholder,
  options,
  className,
  disabled = false,
  hasValue = false,
}: ClearableSelectProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const showValue = hasValue || !!value

  const handleClearPointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClear()
    setOpen(false)
  }

  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      open={open}
      onOpenChange={setOpen}
    >
      <SelectPrimitive.Trigger
        className={cn(
          "border-input data-[placeholder]:text-muted-foreground flex h-10 w-[220px] items-center justify-between gap-2 rounded-lg border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50",
          showValue ? "border-blue-400 bg-blue-50/50" : "border-border",
          "hover:bg-gray-100/50 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        {showValue && isHovered && !disabled ? (
          <div
            onPointerDown={handleClearPointerDown}
            className="flex items-center justify-center cursor-pointer shrink-0"
          >
            <XCircle className="size-4 text-gray-400 hover:text-gray-600" />
          </div>
        ) : (
          <SelectPrimitive.Icon asChild>
            <ChevronDownIcon className="size-4 opacity-50 shrink-0" />
          </SelectPrimitive.Icon>
        )}
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
          position="popper"
        >
          <SelectPrimitive.Viewport className="p-1 h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-foreground hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100"
              >
                <span className="absolute right-2 flex size-3.5 items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <CheckIcon className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </span>
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
