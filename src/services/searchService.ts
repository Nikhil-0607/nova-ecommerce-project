import { brandService } from "./brandService"
import { categoryService } from "./categoryService"
import { productService } from "./productService"
import type { ProductQuery } from "./productService"
import type {
  RecentSearch,
  SearchQuery,
  SearchSuggestionGroup,
  TrendingSearch,
} from "../types/catalog"
import type { Product } from "../types/product"

const wait = (ms = 160) => new Promise((resolve) => setTimeout(resolve, ms))
const storageKey = "nova-recent-searches"
const maxRecentSearches = 6
const trendingSearches: TrendingSearch[] = [
  { query: "linen shirt", label: "Linen shirts" },
  { query: "everyday sneakers", label: "Everyday sneakers" },
  { query: "new season dresses", label: "New season dresses" },
  { query: "home decor", label: "Home decor" },
]

function readRecentSearches(): RecentSearch[] {
  try {
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is RecentSearch =>
      typeof item === "object" && item !== null &&
      typeof (item as Record<string, unknown>).query === "string" &&
      typeof (item as Record<string, unknown>).searchedAt === "string",
    )
  } catch {
    return []
  }
}

function writeRecentSearches(searches: RecentSearch[]) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(searches))
  } catch {
    // Storage can be unavailable in private browsing or restricted environments.
  }
}

export const searchService = {
  async searchProducts(query: SearchQuery, params: Omit<ProductQuery, "query"> = {}): Promise<Product[]> {
    await wait()
    return productService.getProducts({ ...params, query: query.query })
  },
  async getSuggestions(query: string): Promise<SearchSuggestionGroup[]> {
    await wait()
    const needle = query.trim().toLowerCase()
    if (!needle) return []
    const [products, categories, brands] = await Promise.all([
      productService.search(needle),
      categoryService.getCategories(),
      brandService.getBrands(),
    ])
    const productSuggestions = products.slice(0, 5).map((product) => ({
      id: product.id,
      label: product.name,
      subtitle: product.brand,
      type: "product" as const,
      productId: product.id,
      route: `/product/${product.id}`,
    }))
    const categorySuggestions = categories.filter((category) =>
      `${category.name} ${category.description}`.toLowerCase().includes(needle),
    ).slice(0, 3).map((category) => ({
      id: category.id,
      label: category.name,
      type: "category" as const,
      route: `/products/${category.slug}`,
    }))
    const brandSuggestions = brands.filter((brand) =>
      `${brand.name} ${brand.description}`.toLowerCase().includes(needle),
    ).slice(0, 3).map((brand) => ({
      id: brand.id,
      label: brand.name,
      type: "brand" as const,
      route: `/brand/${brand.slug}`,
    }))
    const suggestionGroups: SearchSuggestionGroup[] = [
      { type: "product", label: "Products", suggestions: productSuggestions },
      { type: "category", label: "Categories", suggestions: categorySuggestions },
      { type: "brand", label: "Brands", suggestions: brandSuggestions },
    ]
    return suggestionGroups.filter((group) => group.suggestions.length > 0)
  },
  async getRecentSearches(): Promise<RecentSearch[]> {
    await wait(40)
    return readRecentSearches()
  },
  async saveRecentSearch(query: string): Promise<void> {
    await wait(40)
    const normalized = query.trim()
    if (!normalized) return
    const searches = readRecentSearches().filter((item) => item.query.toLowerCase() !== normalized.toLowerCase())
    writeRecentSearches([{ query: normalized, searchedAt: new Date().toISOString() }, ...searches].slice(0, maxRecentSearches))
  },
  async removeRecentSearch(query: string): Promise<void> {
    await wait(40)
    writeRecentSearches(readRecentSearches().filter((item) => item.query.toLowerCase() !== query.toLowerCase()))
  },
  async clearRecentSearches(): Promise<void> {
    await wait(40)
    writeRecentSearches([])
  },
  async getTrendingSearches(): Promise<TrendingSearch[]> {
    await wait(40)
    return trendingSearches
  },
}
