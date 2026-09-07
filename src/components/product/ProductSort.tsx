import { SORT_OPTIONS } from "../../hooks/useUrlSort"
import type { SortValue } from "../../types/catalog"

type ProductSortProps = {
  value: SortValue
  onChange: (value: SortValue) => void
}

export default function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <label className="product-sort">
      <span>Sort by</span>
      <select value={value} onChange={(event) => onChange(event.target.value as SortValue)} aria-label="Sort products">
        {SORT_OPTIONS.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}
