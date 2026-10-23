// Deterministic cropping explicitly requested by the user. Never inpaint fabric.
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
const root = '.local/suit-replacement'
const pages = JSON.parse((await readFile(`${root}/ocr.json`, 'utf8')).replace(/^\uFEFF/, ''))
const report = []
for (const p of pages) {
  const filename = `${p.slug}/${String(p.page).padStart(3, '0')}.jpg`
  const image = await loadImage(`${root}/${filename}`)
  const w = image.width, h = image.height
  // Exclude the supplier's footer and the sign at the left of the mannequin.
  const topOverrides = {
    'fio-indiano/002.jpg': .14, 'fio-indiano/003.jpg': .15,
    'poliviscose/030.jpg': .15,
    'poliviscose/022.jpg': .17, 'poliviscose/023.jpg': .17, 'poliviscose/028.jpg': .22,
    'poliviscose/031.jpg': .17, 'poliviscose/032.jpg': .17, 'poliviscose/033.jpg': .17,
    'poliviscose/034.jpg': .22, 'poliviscose/037.jpg': .17, 'poliviscose/042.jpg': .17,
    'poliviscose/048.jpg': .17, 'poliviscose/049.jpg': .22,
    'poliviscose-com-regulagem/002.jpg': .17, 'poliviscose-com-regulagem/004.jpg': .17,
    'poliviscose-com-regulagem/005.jpg': .17, 'poliviscose-com-regulagem/008.jpg': .23,
    'poliviscose-com-regulagem/009.jpg': .17, 'poliviscose-com-regulagem/010.jpg': .23,
    'poliviscose-com-regulagem/012.jpg': .23,
  }
  const bottomOverrides = { 'microfibra/048.jpg': .75, 'microfibra/055.jpg': .79, 'microfibra/056.jpg': .74, 'microfibra/059.jpg': .73 }
  const roi = { x: Math.round(w * .17), right: Math.round(w * .97),
    y: Math.round(h * (topOverrides[filename] || .055)), bottom: Math.round(h * (bottomOverrides[filename] || .82)) }
  const obstacles = p.boxes.map(b => ({ x: Math.max(roi.x, b.x - 35), right: Math.min(roi.right, b.right + 35),
    y: Math.max(roi.y, b.y - 35), bottom: Math.min(roi.bottom, b.bottom + 35) }))
    .filter(b => b.x < b.right && b.y < b.bottom)
  const xs = [...new Set([roi.x, roi.right, ...obstacles.flatMap(b => [b.x, b.right])])].sort((a, b) => a - b)
  let best = null
  for (const left of xs) for (const right of xs) {
    if (right - left < w * .5) continue
    const blocks = obstacles.filter(b => b.x < right && b.right > left).sort((a,b) => a.y-b.y)
    let top = roi.y
    for (const block of [...blocks, { y: roi.bottom, bottom: roi.bottom }]) {
      const height = block.y - top, width = right - left
      if (height >= h * .28 && width / height <= 1.65) {
        const score = width * height
        if (!best || score > best.score) best = { x: left, y: top, width, height, score }
      }
      top = Math.max(top, block.bottom)
    }
  }
  if (!best) throw new Error(`Recorte requer revisão manual: ${filename}`)
  const canvas = createCanvas(best.width, best.height)
  canvas.getContext('2d').drawImage(image, best.x, best.y, best.width, best.height, 0, 0, best.width, best.height)
  await mkdir(`${root}/clean/${p.slug}`, { recursive: true })
  await writeFile(`${root}/clean/${filename}`, canvas.toBuffer('image/jpeg', 92))
  report.push({ filename, crop: best })
}
await writeFile(`${root}/crop-report.json`, JSON.stringify(report, null, 2))
// Review sheets show every cleaned photo with its PDF page number.
for (let start = 0; start < report.length; start += 12) {
  const chunk = report.slice(start, start + 12)
  const canvas = createCanvas(1200, 1240), ctx = canvas.getContext('2d')
  ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height)
  for (const [i, p] of chunk.entries()) {
    const img = await loadImage(`${root}/clean/${p.filename}`)
    const x = (i % 4) * 300, y = Math.floor(i / 4) * 410
    ctx.fillStyle = 'black'; ctx.font = '15px Arial'; ctx.fillText(p.filename, x + 5, y + 18)
    const scale = Math.min(290 / img.width, 380 / img.height)
    ctx.drawImage(img, x + 5, y + 24, img.width * scale, img.height * scale)
  }
  await writeFile(`${root}/review-${String(start / 12 + 1).padStart(2,'0')}.jpg`, canvas.toBuffer('image/jpeg', 88))
}
console.log(`${report.length} fotos recortadas; folhas de revisão salvas.`)
