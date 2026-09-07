export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'coming-soon'
export type Availability = StockStatus

export type ProductVariant = {
  id: string
  sku: string
  color: string
  colorCode: string
  size: string
  price: number
  stockStatus: StockStatus
  image: string
}

export type Variant = ProductVariant

export type ProductSpecification = {
  name: string
  value: string
}

export type DeliveryInfo = {
  estimatedDays: number
  freeShippingThreshold: number
  returnWindowDays: number
}

export type Product = {
  id: string
  sku: string
  slug: string
  name: string
  brand: string
  brandId: string
  category: string
  categoryId: string
  subcategory: string
  description: string
  price: number
  mrp: number
  /** Legacy Phase 1 alias retained for existing cards and pages. */
  discount: number
  discountPercentage: number
  currency: string
  rating: number
  reviewCount: number
  images: string[]
  thumbnail: string
  sizes: string[]
  colors: string[]
  variants: ProductVariant[]
  selectedVariant?: ProductVariant
  badges: string[]
  availability: Availability
  stockStatus: StockStatus
  tags: string[]
  pattern: string[]
  searchKeywords: string[]
  specifications: ProductSpecification[]
  delivery: DeliveryInfo
  createdAt: string
  updatedAt: string
}
