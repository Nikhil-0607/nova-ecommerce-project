import type { Product } from '../types/product'

const seed = [
  ['Aurora','Relaxed Linen Shirt','men','Shirts',1899,2599,'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80'],
  ['Vela','Tailored Wide-Leg Trousers','women','Trousers',2299,3199,'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80'],
  ['North & Co.','Court Classic Sneakers','footwear','Sneakers',2799,3999,'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'],
  ['Serein','Fluid Midi Dress','women','Dresses',2599,3699,'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80'],
  ['Mono Studio','Essential Oversized Tee','men','T-Shirts',999,1499,'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'],
  ['Noma','Structured Everyday Tote','accessories','Bags',2199,2999,'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80'],
  ['Aster','Minimal Dial Watch','accessories','Watches',3499,4999,'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80'],
  ['Mysa','Soft Knit Co-ord','women','Co-ords',2899,3999,'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80'],
  ['Eden','Botanical Body Mist','beauty','Fragrance',799,1099,'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80'],
  ['Casa Nova','Textured Cotton Throw','home','Decor',1399,1999,'https://images.unsplash.com/photo-1583845112203-454c2254ed5b?auto=format&fit=crop&w=900&q=80']
]

export const products: Product[] = Array.from({ length: 36 }, (_, i) => {
  const s = seed[i % seed.length]
  const price = Number(s[4]) + (i % 4) * 120
  const mrp = Number(s[5]) + (i % 4) * 150
  return {
    id: `nv-${1001 + i}`,
    sku: `NOVA-${String(1001 + i)}`,
    brand: String(s[0]),
    name: `${String(s[1])}${i >= seed.length ? ` — ${['Sand','Noir','Olive','Ivory'][i % 4]}` : ''}`,
    category: String(s[2]),
    subcategory: String(s[3]),
    price, mrp,
    discount: Math.round((1 - price / mrp) * 100),
    rating: Number((4.1 + (i % 8) / 10).toFixed(1)),
    reviewCount: 84 + i * 17,
    images: [String(s[6]), String(s[6])],
    sizes: ['XS','S','M','L','XL'],
    colors: ['Black','Ivory','Olive'],
    availability: i % 9 === 0 ? 'low-stock' : 'in-stock',
    badges: i % 3 === 0 ? ['NEW'] : i % 4 === 0 ? ['BESTSELLER'] : [],
    description: 'A refined NOVA essential designed with premium materials, clean lines and everyday versatility.'
  }
})
