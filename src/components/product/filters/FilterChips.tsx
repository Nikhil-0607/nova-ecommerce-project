import type { ProductFilterParams } from "../../../types/catalog"

type FilterChipsProps = {
  filters: ProductFilterParams
  onChange: (filters: ProductFilterParams) => void
  onClear: () => void
}

export default function FilterChips({ filters, onChange, onClear }: FilterChipsProps) {
  const chips: Array<{ label: string; remove: () => void }> = []
  const listKeys: Array<keyof ProductFilterParams> = ["brand", "color", "size", "availability", "fit", "material", "pattern", "occasion"]
  listKeys.forEach((key) => (filters[key] as string[]).forEach((value) => chips.push({
    label: key === "size" ? `Size ${value}` : value,
    remove: () => onChange({ ...filters, [key]: (filters[key] as string[]).filter((item) => item !== value) }),
  })))
  if (filters.price) chips.push({ label: `₹${filters.price.min ?? 0}–₹${filters.price.max ?? "∞"}`, remove: () => onChange({ ...filters, price: undefined }) })
  if (filters.rating !== undefined) chips.push({ label: `${filters.rating}★+`, remove: () => onChange({ ...filters, rating: undefined }) })
  if (filters.discount !== undefined) chips.push({ label: `${filters.discount}% off+`, remove: () => onChange({ ...filters, discount: undefined }) })
  if (chips.length === 0) return null

  return <div className="filter-chips" aria-label="Active filters">
    {chips.map((chip) => <button type="button" className="filter-chip" key={chip.label} onClick={chip.remove}>{chip.label} ×</button>)}
    <button type="button" className="text-btn" onClick={onClear}>Clear All</button>
  </div>
}
