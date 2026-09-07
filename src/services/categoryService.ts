import { categories, categoryList } from '../mock/categories'
import type { Category } from '../types/category'
import { productService } from './productService'

const wait = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

const withProductCounts = async (items: Category[]): Promise<Category[]> => {
  const products = await productService.getAll()
  const countFor = (category: Category) => products.filter((product) =>
    product.categoryId === category.id || product.subcategory === category.id,
  ).length
  return items.map((category) => ({
    ...category,
    productCount: countFor(category),
    children: category.children.map((child) => ({ ...child, productCount: countFor(child) })),
  }))
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    await wait()
    return withProductCounts(categories)
  },
  async getCategoryById(id: string): Promise<Category | undefined> {
    await wait()
    const all = await withProductCounts(categoryList)
    return all.find((category) => category.id === id)
  },
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    await wait()
    const all = await withProductCounts(categoryList)
    return all.find((category) => category.slug === slug)
  },
  async getSubcategories(categoryId?: string): Promise<Category[]> {
    await wait()
    const all = await withProductCounts(categories)
    if (!categoryId) return all.flatMap((category) => category.children)
    return all.find((category) => category.id === categoryId)?.children ?? []
  },
}
