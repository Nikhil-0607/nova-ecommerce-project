import { products } from '../mock/products'
import type { Product } from '../types/product'

const wait = (ms = 180) => new Promise((r) => setTimeout(r, ms))
export const productService = {
  async getAll(): Promise<Product[]> { await wait(); return products },
  async getById(id: string): Promise<Product | undefined> { await wait(); return products.find(p => p.id === id) },
  async byCategory(category: string): Promise<Product[]> { await wait(); return products.filter(p => p.category.toLowerCase() === category.toLowerCase()) },
  async search(q: string): Promise<Product[]> {
    await wait()
    const needle = q.trim().toLowerCase()
    if (!needle) return products
    return products.filter(p => [p.name,p.brand,p.category,p.subcategory].some(v => v.toLowerCase().includes(needle)))
  }
}
