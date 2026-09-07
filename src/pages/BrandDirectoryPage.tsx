import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import BrandCard from "../components/brand/BrandCard"
import Skeleton from "../components/common/Skeleton"
import { useDebounce } from "../hooks/useDebounce"
import { brandService } from "../services/brandService"
import type { Brand } from "../types/brand"
import SEO from "../components/seo/SEO"

export default function BrandDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") ?? "")
  const debouncedQuery = useDebounce(query, 250)
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const filteredBrands = useMemo(() => brands, [brands])

  useEffect(() => {
    const next = new URLSearchParams(searchParams)
    if (debouncedQuery.trim()) next.set("q", debouncedQuery.trim())
    else next.delete("q")
    if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: true })
  }, [debouncedQuery, searchParams, setSearchParams])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    void brandService.searchBrands(debouncedQuery).then((result) => {
      if (active) setBrands(result)
    }).catch(() => {
      if (active) setError("We couldn't load the brand directory. Please try again.")
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [debouncedQuery])

  return (
    <section className="section container">
      <SEO title="Brands | NOVA" description="Explore the designers and lifestyle brands available at NOVA." canonicalPath="/brands" />
      <div className="brand-directory-head">
        <span className="eyebrow">THE NOVA EDIT</span>
        <h1>Our Brands</h1>
        <p>Discover the designers and labels shaping the NOVA point of view.</p>
        <label className="brand-search">
          <span className="sr-only">Search brands</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search brands" aria-label="Search brands" />
        </label>
      </div>
      {loading && <div className="brand-grid">{Array.from({ length: 6 }, (_, index) => <div className="brand-card" key={index}><Skeleton className="brand-skeleton" /></div>)}</div>}
      {!loading && error && <div className="empty" role="alert"><h2>Something went wrong</h2><p>{error}</p></div>}
      {!loading && !error && filteredBrands.length === 0 && <div className="empty"><h2>No brands found</h2><p>Try another brand name.</p></div>}
      {!loading && !error && filteredBrands.length > 0 && <div className="brand-grid">{filteredBrands.map((brand) => <BrandCard key={brand.id} brand={brand} />)}</div>}
    </section>
  )
}
