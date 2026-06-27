/**
 * One-time migration: public/images/* → webp on R2.
 * Writes data/image-map.json for seed.ts
 *
 * Usage: npx tsx scripts/migrate-images-to-r2.ts
 */
import fs from 'fs'
import path from 'path'
import { uploadImageWebp } from '../src/lib/storage'

const IMAGES_DIR = path.join(__dirname, '../public/images')
const MAP_FILE = path.join(__dirname, '../data/image-map.json')

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('No public/images directory found')
    process.exit(1)
  }

  const files = fs.readdirSync(IMAGES_DIR).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  const map: Record<string, string> = {}

  for (const file of files) {
    const localPath = `/images/${file}`
    const buffer = fs.readFileSync(path.join(IMAGES_DIR, file))
    const baseName = file.replace(/\.[^.]+$/, '')
    const key = `images/${baseName}.webp`

    const url = await uploadImageWebp(buffer, key)
    map[localPath] = url
    console.info(`${localPath} → ${url}`)
  }

  fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2))
  console.info(`Done. ${files.length} images uploaded. Map: ${MAP_FILE}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
