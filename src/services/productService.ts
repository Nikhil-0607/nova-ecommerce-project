import { products } from '../mock/products'
import type { Product } from '../types/product'

const wait = (ms = 180) => new Promise((r) => setTimeout(r, ms))

export type ProductQuery = {
  categoryId?: string
  subcategoryId?: string
  brandId?: string
  query?: string
  limit?: number
  offset?: number
}

const matchesQuery = (product: Product, query: ProductQuery): boolean => {
  const needle = query.query?.trim().toLowerCase()
  const searchable = [
    product.name,
    product.brand,
    product.category,
    product.categoryId,
    product.subcategory,
    ...product.tags,
    ...product.searchKeywords,
  ].join(' ').toLowerCase()

  return (!query.categoryId || product.categoryId === query.categoryId) &&
    (!query.subcategoryId ||
      product.subcategory === query.subcategoryId ||
      product.subcategory.endsWith(`-${query.subcategoryId}`)) &&
    (!query.brandId || product.brandId === query.brandId) &&
    (!needle || searchable.includes(needle))
}

export const productService = {
  async getAll(): Promise<Product[]> { await wait(); return products },
  async getById(id: string): Promise<Product | undefined> { await wait(); return products.find(p => p.id === id || p.slug === id) },
  async byCategory(category: string): Promise<Product[]> {
    await wait()
    const normalized = category.toLowerCase()
    return products.filter(p => p.category.toLowerCase() === normalized || p.categoryId.toLowerCase() === normalized)
  },
  async search(q: string): Promise<Product[]> {
    await wait()
    return products.filter((product) => matchesQuery(product, { query: q }))
  },
  async getProducts(query: ProductQuery = {}): Promise<Product[]> {
    await wait()
    const filtered = products.filter((product) => matchesQuery(product, query))
    const start = query.offset ?? 0
    const end = query.limit === undefined ? undefined : start + query.limit
    return filtered.slice(start, end)
  },
  async getProductById(id: string): Promise<Product | undefined> {
    await wait()
    return products.find((product) => product.id === id || product.slug === id)
  },
}
