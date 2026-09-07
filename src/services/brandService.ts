import { brands } from '../mock/brands'
import type { Brand } from '../types/brand'
import { productService } from './productService'

const wait = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

export const brandService = {
  async getBrands(): Promise<Brand[]> {
    await wait()
    const products = await productService.getAll()
    return brands.map((brand) => ({
      ...brand,
      productCount: products.filter((product) => product.brandId === brand.id).length,
    }))
  },
  async getBrandById(idOrSlug: string): Promise<Brand | undefined> {
    await wait()
    const brand = brands.find((item) => item.id === idOrSlug || item.slug === idOrSlug)
    if (!brand) return undefined
    const products = await productService.getAll()
    return { ...brand, productCount: products.filter((product) => product.brandId === brand.id).length }
  },
  async getBrandBySlug(slug: string): Promise<Brand | undefined> {
    return this.getBrandById(slug)
  },
  async searchBrands(query: string): Promise<Brand[]> {
    const allBrands = await this.getBrands()
    const needle = query.trim().toLowerCase()
    return needle ? allBrands.filter((brand) => `${brand.name} ${brand.description}`.toLowerCase().includes(needle)) : allBrands
  },
  async getBrandProductCount(brandId: string): Promise<number> {
    const brand = await this.getBrandById(brandId)
    return brand?.productCount ?? 0
  },
  async getProductsByBrand(brandId: string, params?: Parameters<typeof productService.getProducts>[0]) {
    const brand = await this.getBrandById(brandId)
    if (!brand) return []
    return productService.getProducts({ ...params, brandId: brand.id })
  },
}
