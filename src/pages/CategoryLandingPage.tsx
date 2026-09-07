import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import ProductListingPage from "./ProductListingPage"
import SEO from "../components/seo/SEO"
import { categoryService } from "../services/categoryService"
import type { Category } from "../types/category"

export default function CategoryLandingPage() {
  const { categoryId = "" } = useParams()
  const [category, setCategory] = useState<Category>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    void categoryService.getCategoryById(categoryId).then((result) => {
      if (active) setCategory(result)
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [categoryId])

  if (loading) return <><SEO title="Loading collection | NOVA" description="Loading collection details." robots="noindex,follow" /><section className="section container"><div className="empty">Loading collection…</div></section></>
  if (!category) return <><SEO title="Collection not found | NOVA" description="This collection is not available." robots="noindex,follow" /><section className="section container"><div className="empty"><h1>Collection not found</h1><p>This collection is not available yet.</p></div></section></>

  return <>
    <SEO title={`${category.name} | NOVA`} description={category.description} canonicalPath={`/category/${category.slug}`} />
    <section className="section container category-landing">
      <div className="breadcrumb">Home / {category.name}</div>
      <span className="eyebrow">COLLECTION</span>
      <h1>{category.name}</h1>
      <p>{category.description}</p>
      {category.children.length > 0 && <nav aria-label={`${category.name} subcategories`} className="category-subcategories">
        {category.children.map((child) => <Link key={child.id} to={`/category/${category.slug}/${child.slug}`}>{child.name}</Link>)}
      </nav>}
    </section>
    <ProductListingPage category={category.id} />
  </>
}
