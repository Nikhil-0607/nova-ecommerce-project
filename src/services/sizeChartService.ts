export type SizeChartRow = {
  size: string
  chest: string
  waist: string
  hip: string
}

const apparelChart: SizeChartRow[] = [
  { size: "XS", chest: "32–34", waist: "26–28", hip: "34–36" },
  { size: "S", chest: "34–36", waist: "28–30", hip: "36–38" },
  { size: "M", chest: "36–38", waist: "30–32", hip: "38–40" },
  { size: "L", chest: "38–40", waist: "32–34", hip: "40–42" },
  { size: "XL", chest: "40–42", waist: "34–36", hip: "42–44" },
]

export function getSizeChart(categoryId: string): SizeChartRow[] | undefined {
  return ["men", "women", "kids"].includes(categoryId) ? apparelChart : undefined
}
