import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import type { SortValue } from "../types/catalog"

export const SORT_OPTIONS: Array<{ value: SortValue; label: string }> = [
  { value: "recommended", label: "Recommended" },
  { value: "popularity", label: "Popularity" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "discount", label: "Discount" },
]

const values = new Set<SortValue>(SORT_OPTIONS.map((option) => option.value))

export function parseSort(value: string | null): SortValue {
  return value && values.has(value as SortValue) ? value as SortValue : "recommended"
}

export function useUrlSort() {
  const [searchParams, setSearchParams] = useSearchParams()
  const sort = useMemo(() => parseSort(searchParams.get("sort")), [searchParams])
  const setSort = useCallback((nextSort: SortValue) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (nextSort === "recommended") next.delete("sort")
      else next.set("sort", nextSort)
      next.delete("page")
      return next
    })
  }, [setSearchParams])
  return { sort, setSort }
}
