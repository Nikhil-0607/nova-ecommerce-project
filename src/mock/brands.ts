import type { Brand } from '../types/brand'

const banner = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`

export const brands: Brand[] = [
  { id: 'aurora', name: 'Aurora', slug: 'aurora', logo: 'AU', banner: banner('photo-1490481651871-ab68de25d43d'), description: 'Quiet luxury and versatile essentials for modern wardrobes.', featured: true, popular: true, new: false },
  { id: 'vela', name: 'Vela', slug: 'vela', logo: 'VE', banner: banner('photo-1485230895905-ec40ba36b9bc'), description: 'Confident womenswear built around fluid silhouettes and colour.', featured: true, popular: true, new: false },
  { id: 'north-and-co', name: 'North & Co.', slug: 'north-and-co', logo: 'NC', banner: banner('photo-1529139574466-a303027c1d8b'), description: 'Reliable footwear and outdoor-inspired essentials.', featured: true, popular: true, new: false },
  { id: 'serein', name: 'Serein', slug: 'serein', logo: 'SE', banner: banner('photo-1496747611176-843222e1e57c'), description: 'Modern occasion dressing with a softer point of view.', featured: true, popular: true, new: false },
  { id: 'mono-studio', name: 'Mono Studio', slug: 'mono-studio', logo: 'MS', banner: banner('photo-1521572163474-6864f9cf17ab'), description: 'Minimal jersey staples designed for repeat wear.', featured: false, popular: true, new: false },
  { id: 'noma', name: 'Noma', slug: 'noma', logo: 'NO', banner: banner('photo-1553062407-98eeb64c6a62'), description: 'Functional bags and accessories for life in motion.', featured: false, popular: true, new: false },
  { id: 'aster', name: 'Aster', slug: 'aster', logo: 'AS', banner: banner('photo-1524805444758-089113d48a6d'), description: 'Timeless watches and jewellery with a clean finish.', featured: false, popular: true, new: false },
  { id: 'mysa', name: 'Mysa', slug: 'mysa', logo: 'MY', banner: banner('photo-1485968579580-b6d095142e6e'), description: 'Soft knitwear and comfortable layers for slow days.', featured: false, popular: false, new: true },
  { id: 'eden', name: 'Eden', slug: 'eden', logo: 'ED', banner: banner('photo-1594035910387-fea47794261f'), description: 'Botanical beauty and fragrance inspired by nature.', featured: false, popular: true, new: false },
  { id: 'casa-nova', name: 'Casa Nova', slug: 'casa-nova', logo: 'CN', banner: banner('photo-1618221195710-dd6b41faaea6'), description: 'Warm, tactile objects for a more personal home.', featured: true, popular: false, new: false },
  { id: 'stride', name: 'Stride', slug: 'stride', logo: 'ST', banner: banner('photo-1517836357463-d25dfeac3438'), description: 'Technical sportswear for training and everyday movement.', featured: true, popular: false, new: true },
  { id: 'little-lark', name: 'Little Lark', slug: 'little-lark', logo: 'LL', banner: banner('photo-1519457431-44ccd64a579b'), description: 'Playful, durable clothing for growing explorers.', featured: true, popular: false, new: true },
]
