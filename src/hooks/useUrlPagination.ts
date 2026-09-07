import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom"

const parsePage = (value: string | null): number => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

export function useUrlPagination() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = useMemo(() => parsePage(searchParams.get("page")), [searchParams])
  const setPage = useCallback((nextPage: number) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (nextPage <= 1) next.delete("page")
      else next.set("page", String(nextPage))
      return next
    })
  }, [setSearchParams])
  return { page, setPage }
}
