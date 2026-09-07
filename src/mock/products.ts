import type { Product, ProductVariant, StockStatus } from '../types/product'

type ProductSeed = {
  categoryId: string
  subcategories: string[]
  brandId: string
  brand: string
  names: string[]
  basePrice: number
  image: string
  sizes: string[]
  colors: Array<[string, string]>
  tags: string[]
}

const seeds: ProductSeed[] = [
  { categoryId: 'men', subcategories: ['men-shirts', 'men-tshirts', 'men-trousers', 'men-jackets'], brandId: 'aurora', brand: 'Aurora', names: ['Relaxed Linen Shirt', 'Oxford Cotton Shirt', 'Brushed Overshirt', 'Tailored Poplin Shirt', 'Merino Polo', 'Everyday Pique Tee', 'Washed Heavyweight Tee', 'Textured Resort Shirt', 'Pleated Tapered Trouser', 'Cotton Chino', 'Relaxed Corduroy Trouser', 'Utility Field Jacket', 'Lightweight Harrington', 'Wool Blend Blazer'], basePrice: 1699, image: 'photo-1603252109303-2751441dd157', sizes: ['S', 'M', 'L', 'XL'], colors: [['Navy', '#1f3048'], ['Stone', '#c9bca8'], ['Olive', '#69735c']], tags: ['modern essentials', 'smart casual'] },
  { categoryId: 'women', subcategories: ['women-dresses', 'women-tops', 'women-trousers', 'women-knitwear'], brandId: 'vela', brand: 'Vela', names: ['Fluid Midi Dress', 'Satin Slip Dress', 'Gathered Day Dress', 'Tailored Shirt Dress', 'Ribbed Square-Neck Top', 'Silk Blend Blouse', 'Draped Jersey Top', 'Cropped Poplin Shirt', 'Wide-Leg Tailored Trouser', 'High-Rise Straight Jean', 'Fluid Pleat Trouser', 'Soft Merino Cardigan', 'Boucle Crewneck Knit', 'Fine Gauge Polo'], basePrice: 2199, image: 'photo-1594633312681-425c7b97ccd1', sizes: ['XS', 'S', 'M', 'L'], colors: [['Black', '#191817'], ['Ivory', '#f3eee5'], ['Terracotta', '#b85f4b']], tags: ['new season', 'occasion edit'] },
  { categoryId: 'kids', subcategories: ['kids-boys', 'kids-girls', 'kids-sets', 'kids-outerwear'], brandId: 'little-lark', brand: 'Little Lark', names: ['Colour Block Hoodie', 'Printed Weekend Tee', 'Soft Cargo Jogger', 'Corduroy Shirt Jacket', 'Ruffle Sundress', 'Embroidered Tulle Top', 'Rainbow Legging', 'Denim Pinafore', 'Dino Lounge Set', 'Striped Summer Set', 'Explorer Utility Set', 'Cloud Fleece Set', 'Quilted Rain Jacket', 'Packable Puffer Vest'], basePrice: 799, image: 'photo-1503454537195-1dcabb73ffb9', sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'], colors: [['Sky', '#9dc6d8'], ['Coral', '#e98372'], ['Cobalt', '#3e5d9a']], tags: ['kids', 'play-ready'] },
  { categoryId: 'home', subcategories: ['home-decor', 'home-bedding', 'home-kitchen', 'home-fragrance'], brandId: 'casa-nova', brand: 'Casa Nova', names: ['Textured Cotton Throw', 'Handblown Glass Vase', 'Linen Cushion Cover', 'Ceramic Sculptural Bowl', 'Washed Cotton Duvet Set', 'Waffle Bedspread', 'Linen Stripe Sheet Set', 'Velvet Accent Cushion', 'Stoneware Dinner Set', 'Acacia Serving Board', 'Stackable Glass Tumblers', 'Sandalwood Candle', 'Cedar & Fig Diffuser', 'Amber Room Spray'], basePrice: 899, image: 'photo-1583845112203-454c2254ed5b', sizes: ['Small', 'Medium', 'Large'], colors: [['Natural', '#d8c9b4'], ['Charcoal', '#4e4c48'], ['Sage', '#a9b29a']], tags: ['home', 'slow living'] },
  { categoryId: 'beauty', subcategories: ['beauty-skincare', 'beauty-makeup', 'beauty-fragrance', 'beauty-body'], brandId: 'eden', brand: 'Eden', names: ['Botanical Body Mist', 'Daily Barrier Cream', 'Vitamin C Brightening Serum', 'Calming Gel Cleanser', 'Rosewater Face Mist', 'Soft Blur Skin Tint', 'Satin Lip Colour', 'Cream Eye Tint', 'White Tea Eau de Parfum', 'Cedarwood Cologne', 'Neroli Hair & Body Mist', 'Nourishing Hand Balm', 'Coconut Body Polish', 'Overnight Recovery Mask'], basePrice: 599, image: 'photo-1596462502278-27bfdc403348', sizes: ['30 ml', '50 ml', '100 ml'], colors: [['Clear', '#e8e0d5'], ['Rose', '#d7a19b'], ['Warm', '#ba8064']], tags: ['beauty', 'vegan formula'] },
  { categoryId: 'footwear', subcategories: ['footwear-sneakers', 'footwear-boots', 'footwear-sandals', 'footwear-formal'], brandId: 'north-and-co', brand: 'North & Co.', names: ['Court Classic Sneakers', 'Cloud Knit Runner', 'Leather Court Trainer', 'Retro Canvas Sneaker', 'Lug Sole Chelsea Boot', 'Suede Desert Boot', 'Weatherproof Hiker Boot', 'Minimal Chelsea Boot', 'Leather Slide Sandal', 'Crossover Sport Sandal', 'Woven Everyday Sandal', 'Leather Derby Shoe', 'Polished Penny Loafer', 'Suede Monk Strap'], basePrice: 1999, image: 'photo-1542291026-7eec264c27ff', sizes: ['6', '7', '8', '9', '10'], colors: [['White', '#f8f7f3'], ['Black', '#202020'], ['Tan', '#a9764d']], tags: ['footwear', 'all-day comfort'] },
  { categoryId: 'accessories', subcategories: ['accessories-bags', 'accessories-watches', 'accessories-jewellery', 'accessories-belts'], brandId: 'noma', brand: 'Noma', names: ['Structured Everyday Tote', 'Soft Crescent Crossbody', 'Canvas Weekender Bag', 'Mini Leather Satchel', 'Minimal Dial Watch', 'Classic Mesh Watch', 'Slim Rectangle Watch', 'Solar Field Watch', 'Hammered Hoop Earrings', 'Layered Chain Necklace', 'Slim Signet Ring', 'Beaded Pendant', 'Leather Keeper Belt', 'Pebbled Card Wallet'], basePrice: 1099, image: 'photo-1584917865442-de89df76afd3', sizes: ['One Size'], colors: [['Black', '#171717'], ['Tan', '#a9764d'], ['Gold', '#c6a15b']], tags: ['accessories', 'everyday carry'] },
  { categoryId: 'sports', subcategories: ['sports-training', 'sports-running', 'sports-yoga', 'sports-equipment'], brandId: 'stride', brand: 'Stride', names: ['Performance Training Tee', 'Breathable Run Tank', 'Core Compression Short', 'Lightweight Track Pant', 'Reflective Running Jacket', 'Cushioned Tempo Short', 'Four-Way Stretch Legging', 'Seamless Studio Bra', 'Studio Ribbed Legging', 'Move Easy Yoga Top', 'Insulated Steel Bottle', 'Resistance Band Set', 'Training Grip Gloves', 'Everyday Gym Duffel'], basePrice: 899, image: 'photo-1517836357463-d25dfeac3438', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: [['Black', '#171717'], ['Graphite', '#53585d'], ['Electric Blue', '#3f76bc']], tags: ['sports', 'performance'] },
]

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const imageUrl = (id: string, index: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80&sig=${index}`

const makeVariants = (
  productId: string,
  sku: string,
  price: number,
  colors: Array<[string, string]>,
  sizes: string[],
  image: string,
): ProductVariant[] =>
  colors.slice(0, 2).flatMap(([color, colorCode], colorIndex) =>
    sizes.slice(0, 3).map((size, sizeIndex) => ({
      id: `${productId}-v${colorIndex + 1}${sizeIndex + 1}`,
      sku: `${sku}-${colorIndex + 1}${sizeIndex + 1}`,
      color,
      colorCode,
      size,
      price,
      stockStatus: colorIndex === 1 && sizeIndex === 2 ? 'low-stock' : 'in-stock',
      image,
    })),
  )

const makeProduct = (seed: ProductSeed, index: number): Product => {
  const name = seed.names[index]
  const productId = `nv-${seed.categoryId}-${String(index + 1).padStart(3, '0')}`
  const sku = `NOVA-${seed.categoryId.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(3, '0')}`
  const price = seed.basePrice + (index % 5) * 180 + Math.floor(index / 5) * 75
  const mrp = price + 500 + (index % 3) * 250
  const discountPercentage = Math.round((1 - price / mrp) * 100)
  const image = imageUrl(seed.image, index + 1)
  const stockStatus: StockStatus = index % 17 === 0 ? 'coming-soon' : index % 11 === 0 ? 'out-of-stock' : index % 5 === 0 ? 'low-stock' : 'in-stock'
  const patternByCategory: Record<string, string[]> = {
    men: ['Solid', 'Stripe', 'Checked'],
    women: ['Solid', 'Floral', 'Abstract'],
    kids: ['Graphic', 'Stripe', 'Colour Block'],
    home: ['Textured', 'Solid', 'Geometric'],
    beauty: ['Solid'],
    footwear: ['Solid', 'Color Block'],
    accessories: ['Solid', 'Woven'],
    sports: ['Solid', 'Graphic', 'Color Block'],
  }
  const pattern = patternByCategory[seed.categoryId] ?? ['Solid']

  return {
    id: productId,
    sku,
    slug: `${slugify(name)}-${seed.categoryId}-${index + 1}`,
    name,
    brand: seed.brand,
    brandId: seed.brandId,
    category: seed.categoryId,
    categoryId: seed.categoryId,
    subcategory: seed.subcategories[index % seed.subcategories.length],
    description: `${name} by ${seed.brand}, thoughtfully designed with considered materials and everyday versatility.`,
    price,
    mrp,
    discount: discountPercentage,
    discountPercentage,
    currency: 'INR',
    rating: Number((4.1 + (index % 8) / 10).toFixed(1)),
    reviewCount: 48 + index * 23,
    images: [image, image],
    thumbnail: image,
    sizes: seed.sizes,
    colors: seed.colors.map(([color]) => color),
    variants: makeVariants(productId, sku, price, seed.colors, seed.sizes, image),
    badges: index % 5 === 0 ? ['NEW'] : index % 3 === 0 ? ['BESTSELLER'] : [],
    availability: stockStatus,
    stockStatus,
    tags: seed.tags,
    pattern: [pattern[index % pattern.length]],
    searchKeywords: [name, seed.brand, seed.categoryId, ...seed.tags, ...pattern[index % pattern.length].split(' ')],
    specifications: [
      { name: 'Material', value: seed.categoryId === 'beauty' ? 'Dermatologically tested formula' : 'Premium everyday construction' },
      { name: 'Care', value: seed.categoryId === 'home' ? 'Wipe clean with a soft cloth' : 'Refer to care label' },
    ],
    delivery: { estimatedDays: seed.categoryId === 'beauty' ? 3 : 4, freeShippingThreshold: 999, returnWindowDays: 14 },
    createdAt: `2026-08-${String((index % 9) + 1).padStart(2, '0')}T09:00:00.000Z`,
    updatedAt: '2026-09-01T09:00:00.000Z',
  }
}

export const products: Product[] = seeds.flatMap((seed) =>
  seed.names.map((_, index) => makeProduct(seed, index)),
)
