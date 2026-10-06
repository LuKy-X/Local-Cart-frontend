export function normalizeProduct(raw) {
  if (!raw) return null

  return {
    id: raw.id,
    name: raw.nama_produk,
    price: Number(raw.harga ?? 0),
    rating: Number(raw.average_rating ?? 0),
    reviewCount: Number(raw.total_ratings ?? 0),
    image: raw.foto || getPlaceholderImage(),
    stock: Number(raw.stok ?? 0),
    description: raw.deskripsi ?? '',
    category: raw.category ?? null,
    umkm: raw.umkm ?? null,
    isFavorite: false,
  }
}

function getPlaceholderImage() {
  return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
}
