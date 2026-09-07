export type Category = {
  id: string
  name: string
  slug: string
  description: string
  image: string
  parentId: string | null
  children: Category[]
  productCount: number
  featured: boolean
}
