import { useCallback, useEffect, useState } from "react"
import { productService } from "../services/productService"
import { recentlyViewedService } from "../services/recentlyViewedService"
import type { Product } from "../types/product"

export function useRecentlyViewed(excludeProductId?: string) {
  const [products, setProducts] = useState<Product[]>([])

  const loadProducts = useCallback(async () => {
    const entries = recentlyViewedService.getRecentlyViewed()
    const resolved = await Promise.all(entries.map((entry) => productService.getProductById(entry.productId)))
    setProducts(resolved.filter((product): product is Product =>
      product !== undefined && product.id !== excludeProductId,
    ))
  }, [excludeProductId])

  useEffect(() => {
    void loadProducts()
  }, [loadProducts])

  const addViewedProduct = useCallback(async (productId: string) => {
    recentlyViewedService.addRecentlyViewed(productId)
    await loadProducts()
  }, [loadProducts])

  const removeViewedProduct = useCallback(async (productId: string) => {
    recentlyViewedService.removeRecentlyViewed(productId)
    await loadProducts()
  }, [loadProducts])

  const clearViewedProducts = useCallback(() => {
    recentlyViewedService.clearRecentlyViewed()
    setProducts([])
  }, [])

  return { products, addViewedProduct, removeViewedProduct, clearViewedProducts }
}
