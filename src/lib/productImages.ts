// Map of high quality artisan imagery for Lumbung Kopi dan Roti products
export const PRODUCT_IMAGE_MAP: Record<string, string> = {
  // Kopi
  'KOP-001': 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=450&q=80', // Espresso
  'KOP-002': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=450&q=80', // Americano
  'KOP-003': 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=450&q=80', // Kopi Susu Lumbung
  'KOP-004': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=450&q=80', // Cappuccino
  'KOP-005': 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=450&q=80', // Caffe Latte

  // Non Kopi
  'NKP-001': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=450&q=80', // Matcha Latte
  'NKP-002': 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=450&q=80', // Cokelat Panas
  'NKP-003': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=450&q=80', // Teh Tarik

  // Roti
  'ROT-001': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=450&q=80', // Croissant Mentega
  'ROT-002': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=450&q=80', // Roti Pisang Cokelat
  'ROT-003': 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=450&q=80', // Roti Sobek Keju
  'ROT-004': 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=450&q=80', // Donat Gula Halus

  // Snack
  'SNK-001': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=450&q=80', // Cookies Oat Madu
  'SNK-002': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=450&q=80', // Banana Cake Slice

  // Kemasan
  'KMS-001': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=450&q=80', // Kopi Susu Botol 1 L
  'KMS-002': 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=450&q=80', // Biji Kopi Lumbung 250 g
  'KMS-003': 'https://images.unsplash.com/photo-1570784332176-fdd73da66f03?auto=format&fit=crop&w=450&q=80', // Tumbler Lumbung 450 ml
};

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  kopi: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=450&q=80',
  non_kopi: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=450&q=80',
  roti: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=450&q=80',
  snack: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=450&q=80',
  kemasan: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=450&q=80',
};

export function getProductImageUrl(sku: string, kategori?: string): string {
  if (PRODUCT_IMAGE_MAP[sku]) {
    return PRODUCT_IMAGE_MAP[sku];
  }
  if (kategori && CATEGORY_FALLBACK_IMAGES[kategori]) {
    return CATEGORY_FALLBACK_IMAGES[kategori];
  }
  return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=450&q=80';
}

export function getProductImageByName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('espresso')) return PRODUCT_IMAGE_MAP['KOP-001'];
  if (lower.includes('americano')) return PRODUCT_IMAGE_MAP['KOP-002'];
  if (lower.includes('kopi susu')) return PRODUCT_IMAGE_MAP['KOP-003'];
  if (lower.includes('cappuccino')) return PRODUCT_IMAGE_MAP['KOP-004'];
  if (lower.includes('latte') && !lower.includes('matcha')) return PRODUCT_IMAGE_MAP['KOP-005'];
  if (lower.includes('matcha')) return PRODUCT_IMAGE_MAP['NKP-001'];
  if (lower.includes('cokelat')) return PRODUCT_IMAGE_MAP['NKP-002'];
  if (lower.includes('teh')) return PRODUCT_IMAGE_MAP['NKP-003'];
  if (lower.includes('croissant')) return PRODUCT_IMAGE_MAP['ROT-001'];
  if (lower.includes('pisang')) return PRODUCT_IMAGE_MAP['ROT-002'];
  if (lower.includes('sobek') || lower.includes('keju')) return PRODUCT_IMAGE_MAP['ROT-003'];
  if (lower.includes('donat')) return PRODUCT_IMAGE_MAP['ROT-004'];
  if (lower.includes('cookie')) return PRODUCT_IMAGE_MAP['SNK-001'];
  if (lower.includes('banana') || lower.includes('cake')) return PRODUCT_IMAGE_MAP['SNK-002'];
  if (lower.includes('botol')) return PRODUCT_IMAGE_MAP['KMS-001'];
  if (lower.includes('biji')) return PRODUCT_IMAGE_MAP['KMS-002'];
  if (lower.includes('tumbler')) return PRODUCT_IMAGE_MAP['KMS-003'];
  return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=450&q=80';
}
