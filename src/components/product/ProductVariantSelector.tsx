import type { Product, ProductVariant } from "../../types/product"

type ProductVariantSelectorProps = {
  product: Product
  selectedVariant?: ProductVariant
  onSelect: (variant: ProductVariant) => void
}

export default function ProductVariantSelector({ product, selectedVariant, onSelect }: ProductVariantSelectorProps) {
  const colors = [...new Map(product.variants.map((variant) => [variant.color, variant])).values()]
  const sizes = [...new Set(product.variants.map((variant) => variant.size))]
  const selectedColor = selectedVariant?.color
  const selectedSize = selectedVariant?.size
  const choose = (color: string, size: string) => {
    const variant = product.variants.find((item) => item.color === color && item.size === size)
    if (variant) onSelect(variant)
  }

  return (
    <div className="variant-selector">
      {colors.length > 0 && <fieldset>
        <legend>Color{selectedColor ? `: ${selectedColor}` : ""}</legend>
        <div className="variant-colors">
          {colors.map((variant) => {
            const unavailable = !sizes.some((size) => product.variants.some((item) => item.color === variant.color && item.size === size && item.stockStatus !== "out-of-stock"))
            return <button type="button" className={`variant-color ${selectedColor === variant.color ? "active" : ""}`} disabled={unavailable} onClick={() => choose(variant.color, selectedSize && product.variants.some((item) => item.color === variant.color && item.size === selectedSize) ? selectedSize : sizes[0])} aria-label={`${variant.color}${unavailable ? ", unavailable" : ""}`} aria-pressed={selectedColor === variant.color}><span style={{ backgroundColor: variant.colorCode }} />{variant.color}</button>
          })}
        </div>
      </fieldset>}
      {sizes.length > 0 && <fieldset>
        <legend>Size{selectedSize ? `: ${selectedSize}` : ""}</legend>
        <div className="sizes">
          {sizes.map((size) => {
            const variant = selectedColor ? product.variants.find((item) => item.color === selectedColor && item.size === size) : undefined
            const unavailable = selectedColor ? !variant || variant.stockStatus === "out-of-stock" : !product.variants.some((item) => item.size === size && item.stockStatus !== "out-of-stock")
            return <button type="button" className={selectedSize === size ? "active" : ""} disabled={unavailable} onClick={() => choose(selectedColor ?? colors[0]?.color ?? "", size)} key={size} aria-label={`Size ${size}${unavailable ? ", unavailable" : ""}`} aria-pressed={selectedSize === size}>{size}</button>
          })}
        </div>
      </fieldset>}
    </div>
  )
}
