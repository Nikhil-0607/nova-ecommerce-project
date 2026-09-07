import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import type { ProductFilterParams } from "../types/catalog"
import type { StockStatus } from "../types/product"
import { emptyProductFilters } from "../services/productFilterService"

const splitValues = (value: string | null): string[] =>
  value ? value.split(",").map((item) => item.trim()).filter(Boolean) : []

const parseNumber = (value: string | null): number | undefined => {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const parseBoundedNumber = (value: string | null, min: number, max: number): number | undefined => {
  const parsed = parseNumber(value)
  return parsed !== undefined && parsed >= min && parsed <= max ? parsed : undefined
}

export function parseUrlFilters(params: URLSearchParams): ProductFilterParams {
  const filters = emptyProductFilters()
  const min = parseNumber(params.get("minPrice"))
  const max = parseNumber(params.get("maxPrice"))
  const validMin = min !== undefined && min >= 0 ? min : undefined
  const validMax = max !== undefined && max >= 0 ? max : undefined
  const price = validMin !== undefined || validMax !== undefined
    ? validMin !== undefined && validMax !== undefined && validMin > validMax
      ? { min: validMax, max: validMin }
      : { min: validMin, max: validMax }
    : undefined
  const rating = parseBoundedNumber(params.get("rating"), 1, 5)
  const discount = parseBoundedNumber(params.get("discount"), 0, 100)

  return {
    ...filters,
    category: params.get("category") ?? undefined,
    brand: splitValues(params.get("brand")),
    color: splitValues(params.get("color")),
    size: splitValues(params.get("size")),
    availability: splitValues(params.get("availability")) as StockStatus[],
    fit: splitValues(params.get("fit")),
    material: splitValues(params.get("material")),
    pattern: splitValues(params.get("pattern")),
    occasion: splitValues(params.get("occasion")),
    price,
    rating,
    discount,
  }
}

const setListParam = (params: URLSearchParams, key: string, values: string[]) => {
  if (values.length > 0) params.set(key, values.join(","))
  else params.delete(key)
}

export function serializeUrlFilters(filters: ProductFilterParams, current: URLSearchParams): URLSearchParams {
  const params = new URLSearchParams(current)
  const listKeys: Array<keyof ProductFilterParams> = [
    "brand", "color", "size", "availability", "fit", "material", "pattern", "occasion",
  ]
  listKeys.forEach((key) => setListParam(params, key, filters[key] as string[]))

  if (filters.price?.min !== undefined) params.set("minPrice", String(filters.price.min))
  else params.delete("minPrice")
  if (filters.price?.max !== undefined) params.set("maxPrice", String(filters.price.max))
  else params.delete("maxPrice")
  if (filters.rating !== undefined) params.set("rating", String(filters.rating))
  else params.delete("rating")
  if (filters.discount !== undefined) params.set("discount", String(filters.discount))
  else params.delete("discount")
  if (filters.category) params.set("category", filters.category)
  else params.delete("category")
  return params
}

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseUrlFilters(searchParams), [searchParams])
  const setFilters = useCallback((nextFilters: ProductFilterParams) => {
    setSearchParams((current) => {
      const next = serializeUrlFilters(nextFilters, current)
      next.delete("page")
      return next
    })
  }, [setSearchParams])
  const clearFilters = useCallback(() => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      ;["category", "brand", "color", "size", "availability", "fit", "material", "pattern", "occasion",
        "minPrice", "maxPrice", "rating", "discount", "page"].forEach((key) => next.delete(key))
      return next
    })
  }, [setSearchParams])

  return { filters, setFilters, clearFilters }
}
