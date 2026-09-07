import { useMemo, useState } from "react"
import type { FilterKey, ProductFilterParams } from "../../../types/catalog"
import type { Product, StockStatus } from "../../../types/product"

export type FilterOption = { value: string; label: string; count: number }

export type FilterConfiguration = {
  key: FilterKey
  label: string
  options: FilterOption[]
}

type FilterSidebarProps = {
  products: Product[]
  filters: ProductFilterParams
  configurations: FilterConfiguration[]
  onChange: (filters: ProductFilterParams) => void
  onClear: () => void
  mobile?: boolean
  onApply?: () => void
}

const toggle = (values: string[], value: string): string[] =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value]

export default function FilterSidebar({
  products,
  filters,
  configurations,
  onChange,
  onClear,
  mobile = false,
  onApply,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [minPrice, setMinPrice] = useState(filters.price?.min?.toString() ?? "")
  const [maxPrice, setMaxPrice] = useState(filters.price?.max?.toString() ?? "")

  const availabilityOptions = useMemo<FilterOption[]>(() => {
    const counts = new Map<StockStatus, number>()
    products.forEach((product) => counts.set(product.stockStatus, (counts.get(product.stockStatus) ?? 0) + 1))
    return (["in-stock", "low-stock", "out-of-stock", "coming-soon"] as StockStatus[]).map((value) => ({
      value,
      label: value.replaceAll("-", " "),
      count: counts.get(value) ?? 0,
    }))
  }, [products])

  const changeList = (key: FilterKey, value: string) =>
    onChange({ ...filters, [key]: toggle(filters[key] as string[], value) })

  const applyPrice = () => {
    const min = minPrice ? Number(minPrice) : undefined
    const max = maxPrice ? Number(maxPrice) : undefined
    onChange({ ...filters, price: min !== undefined || max !== undefined ? { min, max } : undefined })
  }

  return (
    <aside className={`filter-sidebar ${mobile ? "filter-sidebar-mobile" : ""}`} aria-label="Product filters">
      <div className="filter-heading">
        <h2>Filters</h2>
        <button type="button" className="text-btn" onClick={onClear}>Clear All</button>
      </div>
      <section className="filter-section">
        <button type="button" className="filter-section-toggle" aria-expanded="true">Price</button>
        <div className="price-inputs">
          <label>Min <input inputMode="numeric" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} onBlur={applyPrice} /></label>
          <label>Max <input inputMode="numeric" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} onBlur={applyPrice} /></label>
        </div>
      </section>
      <section className="filter-section">
        <label className="filter-select-label" htmlFor="rating-filter">Rating</label>
        <select id="rating-filter" value={filters.rating ?? ""} onChange={(event) => onChange({ ...filters, rating: event.target.value ? Number(event.target.value) : undefined })}>
          <option value="">Any rating</option>
          <option value="4">4★ and above</option>
          <option value="3">3★ and above</option>
        </select>
      </section>
      <section className="filter-section">
        <label className="filter-select-label" htmlFor="discount-filter">Discount</label>
        <select id="discount-filter" value={filters.discount ?? ""} onChange={(event) => onChange({ ...filters, discount: event.target.value ? Number(event.target.value) : undefined })}>
          <option value="">Any discount</option>
          <option value="10">10% and above</option>
          <option value="20">20% and above</option>
          <option value="30">30% and above</option>
        </select>
      </section>
      {[...configurations, { key: "availability" as FilterKey, label: "Availability", options: availabilityOptions }].map((configuration) => {
        const isOpen = openSections[configuration.key] ?? true
        const selected = filters[configuration.key] as string[]
        return (
          <section className="filter-section" key={configuration.key}>
            <button
              type="button"
              className="filter-section-toggle"
              aria-expanded={isOpen}
              onClick={() => setOpenSections((current) => ({ ...current, [configuration.key]: !isOpen }))}
            >
              {configuration.label}<span>{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && <div className="filter-options">
              {configuration.options.map((option) => (
                <label className="filter-option" key={option.value}>
                  <input type="checkbox" checked={selected.includes(option.value)} onChange={() => changeList(configuration.key, option.value)} />
                  <span>{option.label}</span><small>{option.count}</small>
                </label>
              ))}
            </div>}
          </section>
        )
      })}
      {mobile && <button type="button" className="btn full" onClick={onApply}>APPLY FILTERS</button>}
    </aside>
  )
}
