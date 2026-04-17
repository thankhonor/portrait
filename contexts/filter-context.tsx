"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface FilterState {
  searchText: string
  startDate: string
  endDate: string
  customer: string
  channel: string
  status: string
  gangType: string
  contentType: string
  riskScene: string
  riskTags: string[]
  isCollapsed: boolean
  followupProgress: string
}

interface FilterContextType {
  filters: FilterState
  setFilters: (filters: Partial<FilterState>) => void
  resetFilters: () => void
}

const defaultFilters: FilterState = {
  searchText: "",
  startDate: "",
  endDate: "",
  customer: "",
  channel: "",
  status: "",
  gangType: "",
  contentType: "",
  riskScene: "",
  riskTags: [],
  isCollapsed: false,
  followupProgress: "",
}

const FilterContext = createContext<FilterContextType>({
  filters: defaultFilters,
  setFilters: () => {},
  resetFilters: () => {},
})

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters)

  const setFilters = (newFilters: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFiltersState({ ...defaultFilters, isCollapsed: filters.isCollapsed })
  }

  return <FilterContext.Provider value={{ filters, setFilters, resetFilters }}>{children}</FilterContext.Provider>
}

export function useFilters() {
  return useContext(FilterContext)
}
