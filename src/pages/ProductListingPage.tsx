import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useParams, useSearchParams } from "react-router-dom"
import ProductGrid from "../components/product/ProductGrid"
import { ProductGridSkeleton } from "../components/common/Skeleton"
import Drawer from "../components/common/Drawer"
import { categoryService } from "../services/categoryService"
import { productService, type ProductQuery } from "../services/productService"
import type { Product } from "../types/product"
import { filterProducts } from "../services/productFilterService"
import { useUrlFilters } from "../hooks/useUrlFilters"
import FilterChips from "../components/product/filters/FilterChips"
import FilterSidebar from "../components/product/filters/FilterSidebar"
import { getFilterConfigurations } from "../components/product/filters/filterConfiguration"
import ProductSort from "../components/product/ProductSort"
import ProductPagination from "../components/product/ProductPagination"
import { useUrlSort } from "../hooks/useUrlSort"
import { useUrlPagination } from "../hooks/useUrlPagination"
import { sortProducts } from "../services/productSortService"
import { paginateProducts } from "../services/paginationService"
import { searchService } from "../services/searchService"
import SEO from "../components/seo/SEO"
import type { Category } from "../types/category"

export type ProductListingPageProps = {
  category?: string
  subcategory?: string
  brand?: string
  searchQuery?: string
  filters?: Record<string, string[]>
  sort?: string
  pagination?: { page: number; pageSize: number }
}

export default function ProductListingPage({
  category: categoryOverride,
  subcategory: subcategoryOverride,
  brand,
  searchQuery,
}: ProductListingPageProps = {}) {
  const { categoryId, subcategoryId } = useParams()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const category = categoryOverride ?? categoryId
  const subcategory = subcategoryOverride ?? subcategoryId
  const activeSearchQuery = searchQuery ?? searchParams.get("q") ?? undefined
  const [items, setItems] = useState<Product[]>([])
  const [title, setTitle] = useState(category ? category.toUpperCase() : "ALL PRODUCTS")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [invalidCategory, setInvalidCategory] = useState(false)
  const [categoryData, setCategoryData] = useState<Category>()
  const [subcategoryData, setSubcategoryData] = useState<Category>()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const filterTriggerRef = useRef<HTMLButtonElement>(null)
  const wasDrawerOpen = useRef(false)
  const { filters, setFilters, clearFilters } = useUrlFilters()
  const { sort, setSort } = useUrlSort()
  const { page, setPage } = useUrlPagination()
  const filteredItems = useMemo(() => filterProducts(items, filters), [filters, items])
  const sortedItems = useMemo(() => sortProducts(filteredItems, sort), [filteredItems, sort])
  const paginatedItems = useMemo(() => paginateProducts(sortedItems, page, 24), [page, sortedItems])
  const filterConfigurations = useMemo(() => getFilterConfigurations(category, items), [category, items])

  useEffect(() => {
    if (!drawerOpen && wasDrawerOpen.current) filterTriggerRef.current?.focus()
    wasDrawerOpen.current = drawerOpen
  }, [drawerOpen])

  useEffect(() => {
    if (!loading && page !== paginatedItems.page) setPage(paginatedItems.page)
  }, [loading, page, paginatedItems.page, setPage])

  useEffect(() => {
    let active = true
    const loadProducts = async () => {
      setLoading(true)
      setError(null)
      setInvalidCategory(false)
      setCategoryData(undefined)
      setSubcategoryData(undefined)

      try {
        if (category) {
          const resolvedCategory = await categoryService.getCategoryBySlug(category)
          if (!resolvedCategory) {
            if (active) {
              setItems([])
              setInvalidCategory(true)
              setTitle(category.replaceAll("-", " ").toUpperCase())
            }
            return
          }
          if (active) setTitle(resolvedCategory.name)
          if (active) {
            setCategoryData(resolvedCategory)
            setSubcategoryData(resolvedCategory.children.find((child) =>
              child.slug === subcategory ||
              child.id === subcategory ||
              child.slug.endsWith(`-${subcategory}`),
            ))
          }
        } else if (active) {
          setTitle(activeSearchQuery ? `SEARCH: ${activeSearchQuery}` : "ALL PRODUCTS")
        }

        const query: ProductQuery = {
          categoryId: category,
          subcategoryId: subcategory,
          brandId: brand,
          query: searchQuery,
        }
        const result = activeSearchQuery
          ? await searchService.searchProducts({ query: activeSearchQuery }, query)
          : await productService.getProducts(query)
        if (active) setItems(result)
      } catch {
        if (active) setError("We couldn't load this collection. Please try again.")
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadProducts()
    return () => {
      active = false
    }
  }, [activeSearchQuery, brand, category, searchQuery, subcategory])

  return (
    <section className="section container">
      {!brand && <SEO
        title={activeSearchQuery
          ? `Search results for "${activeSearchQuery}" | NOVA`
          : invalidCategory
            ? "Collection not found | NOVA"
            : error
              ? "Collection unavailable | NOVA"
              : subcategoryData
                ? `${subcategoryData.name} | ${categoryData?.name ?? "NOVA"} | NOVA`
                : categoryData
                  ? `${categoryData.name} | NOVA`
                  : "All Products | NOVA"}
        description={activeSearchQuery
          ? `Explore NOVA search results for ${activeSearchQuery}.`
          : subcategoryData?.description || categoryData?.description || "Shop fashion, beauty, home and lifestyle products at NOVA."}
        canonicalPath={location.pathname || "/products"}
        robots={activeSearchQuery || invalidCategory || Boolean(error) ? "noindex,follow" : "index,follow"}
      />}
      <div className="breadcrumb">Home / {title}</div>
      <div className="listing-head">
        <div>
          <span className="eyebrow">COLLECTION</span>
          <h1>{title}</h1>
          {!loading && !error && !invalidCategory && <p>{paginatedItems.total} products</p>}
        </div>
        {!loading && !error && !invalidCategory && <ProductSort value={sort} onChange={setSort} />}
      </div>
      {!loading && !error && !invalidCategory && <FilterChips filters={filters} onChange={setFilters} onClear={clearFilters} />}
      {!loading && !error && !invalidCategory && <button ref={filterTriggerRef} type="button" className="btn filter-trigger" onClick={() => setDrawerOpen(true)}>FILTERS</button>}
      {loading && <ProductGridSkeleton />}
      {!loading && <div className="listing-content">
        {!error && !invalidCategory && <FilterSidebar products={items} filters={filters} configurations={filterConfigurations} onChange={setFilters} onClear={clearFilters} />}
        <div className="listing-results">
          {error && (
            <div className="empty error-state" role="alert">
              <h2>Something went wrong</h2>
              <p>{error}</p>
            </div>
          )}
          {!error && (invalidCategory || filteredItems.length === 0) && (
            <div className="empty">
              <h2>{invalidCategory ? "Collection not found" : "No products match these filters"}</h2>
              <p>{invalidCategory ? "This collection is not available yet." : "Try removing a filter to see more products."}</p>
              {!invalidCategory && <button type="button" className="btn" onClick={clearFilters}>CLEAR ALL FILTERS</button>}
            </div>
          )}
          {!error && !invalidCategory && paginatedItems.total > 0 && (
            <>
              <ProductGrid products={paginatedItems.products} />
              <ProductPagination {...paginatedItems} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>}
      <Drawer open={drawerOpen} label="Product filters" onClose={() => setDrawerOpen(false)}>
        <FilterSidebar mobile products={items} filters={filters} configurations={filterConfigurations} onChange={setFilters} onClear={clearFilters} onApply={() => setDrawerOpen(false)} />
      </Drawer>
    </section>
  )
}
