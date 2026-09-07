import type { Category } from '../types/category'

const image = (query: string) =>
  `https://images.unsplash.com/${query}?auto=format&fit=crop&w=1200&q=80`

const department = (
  id: string,
  name: string,
  description: string,
  imageId: string,
  children: Array<[string, string, string]>,
  featured = true,
): Category => ({
  id,
  name,
  slug: id,
  description,
  image: image(imageId),
  parentId: null,
  children: children.map(([childId, childName, childDescription]) => ({
    id: childId,
    name: childName,
    slug: childId,
    description: childDescription,
    image: image(imageId),
    parentId: id,
    children: [],
    productCount: 3,
    featured: false,
  })),
  productCount: 14,
  featured,
})

export const categories: Category[] = [
  department('men', 'Men', 'Modern essentials and considered tailoring for every day.', 'photo-1617137968427-85924c800a22', [
    ['men-shirts', 'Shirts', 'Relaxed, formal and resort shirts.'],
    ['men-tshirts', 'T-Shirts', 'Everyday jersey staples and elevated tees.'],
    ['men-trousers', 'Trousers', 'Tailored, relaxed and utility trousers.'],
    ['men-jackets', 'Jackets', 'Layering pieces for changing seasons.'],
  ]),
  department('women', 'Women', 'Elevated silhouettes, occasionwear and everyday dressing.', 'photo-1483985988355-763728e1935b', [
    ['women-dresses', 'Dresses', 'Day-to-night dresses and occasion pieces.'],
    ['women-tops', 'Tops', 'Polished blouses, shirts and easy tops.'],
    ['women-trousers', 'Trousers', 'Contemporary trousers and denim.'],
    ['women-knitwear', 'Knitwear', 'Soft layers and refined knit separates.'],
  ]),
  department('kids', 'Kids', 'Comfort-first clothing made for curious young lives.', 'photo-1503454537195-1dcabb73ffb9', [
    ['kids-boys', 'Boys', 'Playful and practical boyswear.'],
    ['kids-girls', 'Girls', 'Colourful everyday girlswear.'],
    ['kids-sets', 'Co-ord Sets', 'Easy matching sets for busy days.'],
    ['kids-outerwear', 'Outerwear', 'Light layers for little explorers.'],
  ]),
  department('home', 'Home', 'Thoughtful objects and textiles for a warmer home.', 'photo-1616486338812-3dadae4b4ace', [
    ['home-decor', 'Decor', 'Finishing touches for considered spaces.'],
    ['home-bedding', 'Bedding', 'Soft textures for restful rooms.'],
    ['home-kitchen', 'Kitchen & Dining', 'Useful pieces for gathering and hosting.'],
    ['home-fragrance', 'Home Fragrance', 'Candles and scents for every room.'],
  ]),
  department('beauty', 'Beauty', 'Daily rituals, fragrance and self-care essentials.', 'photo-1522335789203-aabd1fc54bc9', [
    ['beauty-skincare', 'Skincare', 'Gentle, effective skincare rituals.'],
    ['beauty-makeup', 'Makeup', 'Modern colour and complexion essentials.'],
    ['beauty-fragrance', 'Fragrance', 'Signature scents for every mood.'],
    ['beauty-body', 'Bath & Body', 'Nourishing care from head to toe.'],
  ]),
  department('footwear', 'Footwear', 'Shoes designed for movement, comfort and style.', 'photo-1542291026-7eec264c27ff', [
    ['footwear-sneakers', 'Sneakers', 'Everyday trainers and performance pairs.'],
    ['footwear-boots', 'Boots', 'Structured boots for every season.'],
    ['footwear-sandals', 'Sandals', 'Light, easy footwear for warmer days.'],
    ['footwear-formal', 'Formal Shoes', 'Polished footwear for occasions.'],
  ]),
  department('accessories', 'Accessories', 'The details that complete a considered wardrobe.', 'photo-1584917865442-de89df76afd3', [
    ['accessories-bags', 'Bags', 'Totes, crossbody bags and carryalls.'],
    ['accessories-watches', 'Watches', 'Minimal and classic timepieces.'],
    ['accessories-jewellery', 'Jewellery', 'Everyday pieces with lasting appeal.'],
    ['accessories-belts', 'Belts & Wallets', 'Useful leather and vegan accessories.'],
  ]),
  department('sports', 'Sports', 'Technical essentials for training, recovery and play.', 'photo-1517836357463-d25dfeac3438', [
    ['sports-training', 'Training', 'Performance layers for every workout.'],
    ['sports-running', 'Running', 'Lightweight gear for your next kilometre.'],
    ['sports-yoga', 'Yoga', 'Flexible pieces for mindful movement.'],
    ['sports-equipment', 'Equipment', 'Practical accessories for active days.'],
  ]),
]

export const categoryList: Category[] = categories.flatMap((category) => [
  category,
  ...category.children,
])
