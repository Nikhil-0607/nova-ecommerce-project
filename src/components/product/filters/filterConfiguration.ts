import type { FilterConfiguration } from "./FilterSidebar"
import type { Product } from "../../../types/product"

const uniqueOptions = (products: Product[], values: Array<{ value: string; label: string }>) => {
  const counts = new Map<string, number>()
  products.forEach((product) => {
    values.forEach(({ value }) => {
      if (value && (
        product.brandId === value ||
        product.colors.includes(value) ||
        product.sizes.includes(value) ||
        product.pattern.includes(value) ||
        product.tags.includes(value) ||
        product.specifications.some((specification) => `${specification.name} ${specification.value}`.toLowerCase().includes(value.toLowerCase()))
      )) counts.set(value, (counts.get(value) ?? 0) + 1)
    })
  })
  return values.map(({ value, label }) => ({ value, label, count: counts.get(value) ?? 0 })).filter((option) => option.count > 0)
}

export function getFilterConfigurations(category: string | undefined, products: Product[]): FilterConfiguration[] {
  const isBeauty = category === "beauty"
  const isFootwear = category === "footwear"
  const isApparel = ["men", "women", "kids"].includes(category ?? "")
  const configurations: FilterConfiguration[] = [
    {
      key: "brand",
      label: "Brand",
      options: uniqueOptions(products, [...new Map(products.map((product) => [product.brandId, { value: product.brandId, label: product.brand }])).values()]),
    },
    {
      key: "color",
      label: isBeauty ? "Shade / Color" : "Color",
      options: uniqueOptions(products, [...new Set(products.flatMap((product) => product.colors))].map((value) => ({ value, label: value }))),
    },
  ]
  configurations.push({
    key: "pattern",
    label: "Pattern",
    options: uniqueOptions(products, [...new Set(products.flatMap((product) => product.pattern))].map((value) => ({ value, label: value }))),
  })
  if (isApparel || isFootwear) {
    configurations.push({
      key: "size",
      label: "Size",
      options: uniqueOptions(products, [...new Set(products.flatMap((product) => product.sizes))].map((value) => ({ value, label: value }))),
    })
  }
  if (isApparel) configurations.push({ key: "fit", label: "Fit", options: uniqueOptions(products, ["Regular", "Relaxed", "Slim", "Oversized"].map((value) => ({ value, label: value }))) })
  if (isFootwear) configurations.push({ key: "occasion", label: "Occasion", options: uniqueOptions(products, ["Everyday", "Training", "Formal", "Outdoor"].map((value) => ({ value, label: value }))) })
  configurations.push({ key: "material", label: "Material", options: uniqueOptions(products, ["Cotton", "Linen", "Leather", "Wool", "Ceramic", "Botanical"].map((value) => ({ value, label: value }))) })
  return configurations
}
