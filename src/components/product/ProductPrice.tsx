type ProductPriceProps = {
  price: number
  mrp: number
  discountPercentage: number
  currency?: string
}

const currencySymbols: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
}

export default function ProductPrice({
  price,
  mrp,
  discountPercentage,
  currency = "INR",
}: ProductPriceProps) {
  const symbol = currencySymbols[currency] ?? currency

  return (
    <div className="price-row">
      <strong>{symbol}{price.toLocaleString()}</strong>
      {mrp > price && <s>{symbol}{mrp.toLocaleString()}</s>}
      {discountPercentage > 0 && <em>{discountPercentage}% OFF</em>}
    </div>
  )
}
