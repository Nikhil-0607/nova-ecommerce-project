export type Product = {
  id: string
  sku: string
  name: string
  brand: string
  category: string
  subcategory: string
  price: number
  mrp: number
  discount: number
  rating: number
  reviewCount: number
  images: string[]
  sizes: string[]
  colors: string[]
  availability: 'in-stock' | 'low-stock' | 'out-of-stock'
  badges: string[]
  description: string
}
