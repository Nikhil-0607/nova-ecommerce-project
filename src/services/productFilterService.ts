import type { ProductFilterParams } from "../types/catalog"
import type { Product } from "../types/product"

const includesValue = (values: string[], candidate: string) =>
  values.length === 0 || values.some((value) => value.toLowerCase() === candidate.toLowerCase())

const productText = (product: Product) => [
  product.description,
  ...product.tags,
  ...product.specifications.flatMap((specification) => [specification.name, specification.value]),
].join(" ").toLowerCase()

export const filterProducts = (products: Product[], filters: ProductFilterParams): Product[] =>
  products.filter((product) => {
    const text = productText(product)
    const priceMatches = (!filters.price?.min || product.price >= filters.price.min) &&
      (!filters.price?.max || product.price <= filters.price.max)
    const discountMatches = !filters.discount || product.discountPercentage >= filters.discount
    const ratingMatches = !filters.rating || product.rating >= filters.rating
    const availabilityMatches = filters.availability.length === 0 || filters.availability.includes(product.stockStatus)
    const colorsMatch = filters.color.length === 0 || product.colors.some((color) => includesValue(filters.color, color))
    const sizesMatch = filters.size.length === 0 || product.sizes.some((size) => includesValue(filters.size, size))
    const patternsMatch = filters.pattern.length === 0 || product.pattern.some((pattern) => includesValue(filters.pattern, pattern))
    const searchableMatches = (values: string[]) =>
      values.length === 0 || values.some((value) => text.includes(value.toLowerCase()))

    return priceMatches &&
      discountMatches &&
      ratingMatches &&
      availabilityMatches &&
      (!filters.category || product.categoryId === filters.category || product.category === filters.category) &&
      (filters.brand.length === 0 || filters.brand.includes(product.brandId)) &&
      colorsMatch &&
      sizesMatch &&
      patternsMatch &&
      searchableMatches(filters.fit) &&
      searchableMatches(filters.material) &&
      searchableMatches(filters.pattern) &&
      searchableMatches(filters.occasion)
  })

export const emptyProductFilters = (): ProductFilterParams => ({
  brand: [],
  color: [],
  size: [],
  availability: [],
  fit: [],
  material: [],
  pattern: [],
  occasion: [],
})
