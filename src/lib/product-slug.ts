import path from 'path'

/** Derive a stable product slug from a legacy image path (buy.am / R2 key). */
export function productSlugFromImage(imagePath: string): string {
  const file = path.basename(imagePath)
  const withoutExt = file.replace(/\.(png|jpg|jpeg|webp)$/i, '')
  return withoutExt.replace(/-Photoroom$/i, '')
}
