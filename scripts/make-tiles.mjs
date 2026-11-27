// Turns every JPEG or TIFF in scans/ into static IIIF (level 0)
// zoom tiles in public/iiif/

// Run with: npm run tiles
import sharp from 'sharp';
import path from 'node:path';
import { readdir, rm, mkdir, readFile, writeFile } from 'node:fs/promises';

const SCANS = 'scans';
const OUT = 'public/iiif';

// Placeholder base URL written into info.json. The viewer replaces it
// with the real address at runtime.
const BASE_ID = 'https://example.org/iiif';
// Extra whole-image sizes for thumbnails and pages
const SIZES = [400, 1200];

await mkdir(OUT, { recursive: true });
const files = (await readdir(SCANS)).filter((f) => /\.(jpe?g|tiff?)$/i.test(f));

for (const file of files) {
  const name = path.parse(file).name; // neg-01.jpg -> neg-01
  const dir = path.join(OUT, name);
  await rm(dir, {recursive: true, force: true });

  // Zoom tiles + info.json
  await sharp(path.join(SCANS, file))
    .tile({size: 512, layout: 'iiif3', id: BASE_ID })
    .toFile(dir);

  // Whole-image sizes (skip any larger than the original, to avoid upscaling)
  const { width: origWidth } = await sharp(path.join(SCANS, file)).metadata();
  const sizes = SIZES.filter((w) => w <= origWidth);
  for (const width of sizes) {
    const sizeDir = path.join(dir, 'full', `${width},`, '0');
    await mkdir(sizeDir, {recursive: true});
    await sharp(path.join(SCANS, file))
      .resize({ width })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(sizeDir, 'default.jpg'));

  }

  // List the sizes in info.json so IIIF viewers know they exist
  const infoPath = path.join(dir, 'info.json');
  const info = JSON.parse(await readFile(infoPath, 'utf8'));
  const { width, height } = info;
  info.sizes = sizes.map((w) => ({ width: w, height: Math.round((height * w) / width) }));
  await writeFile(infoPath, JSON.stringify(info, null, 2));

  console.log(`✓ ${name}: ${width}×${height}`);
}
console.log(`Done: ${files.length} images tiled into ${OUT}/`);