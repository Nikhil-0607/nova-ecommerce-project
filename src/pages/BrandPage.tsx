import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ProductListingPage from "./ProductListingPage"
import { brandService } from "../services/brandService"
import type { Brand } from "../types/brand"
import SEO from "../components/seo/SEO"

export default function BrandPage() {
  const { brandId = "" } = useParams()
  const [brand, setBrand] = useState<Brand>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)
    void brandService.getBrandById(brandId).then((result) => {
      if (active) setBrand(result)
    }).catch(() => {
      if (active) setError(true)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [brandId])

  if (loading) return <><SEO title="Loading brand | NOVA" description="Loading brand details." robots="noindex,follow" /><section className="section container"><div className="empty">Loading brand…</div></section></>
  if (error) return <><SEO title="Brand unavailable | NOVA" description="This brand is temporarily unavailable." robots="noindex,follow" /><section className="section container"><div className="empty" role="alert"><h1>Unable to load brand</h1><p>Please try again shortly.</p></div></section></>
  if (!brand) return <><SEO title="Brand not found | NOVA" description="This brand is not available." robots="noindex,follow" /><section className="section container"><div className="empty"><h1>Brand not found</h1><p>This brand is not available.</p></div></section></>

  return (
    <>
      <SEO
        title={`${brand.name} | NOVA`}
        description={brand.description || `Shop ${brand.name} fashion and lifestyle products at NOVA.`}
        canonicalPath={`/brand/${brand.slug}`}
      />
      <section className="brand-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(17,17,15,.78), rgba(17,17,15,.18)), url(${brand.banner})` }}>
        <div className="container brand-hero-content">
          <div className="brand-logo brand-logo-large" aria-hidden="true">{brand.logo}</div>
          <div><span className="eyebrow">BRAND</span><h1>{brand.name}</h1><p>{brand.description}</p><strong>{brand.productCount ?? 0} products</strong></div>
        </div>
      </section>
      <ProductListingPage brand={brand.id} />
    </>
  )
}
