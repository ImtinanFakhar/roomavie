import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

// Extract the photographs from the supplied design, without retaining its UI.
const source = process.argv[2];
if (!source) throw new Error('Pass the path to the reference PNG.');
const metadata = await sharp(source).metadata();
const scale = metadata.width / 941;
const crops = {
  hero: [379, 114, 562, 346],
  apartment: [45, 474, 160, 122],
  lounge: [221, 474, 160, 122],
  bedroom: [395, 474, 156, 122],
  entryway: [565, 474, 160, 122],
  seasonal: [739, 474, 160, 122],
  'living-room': [66, 691, 262, 146],
  'gallery-wall': [352, 691, 248, 146],
  'small-entryway': [624, 691, 254, 146],
  'cozy-bedroom': [66, 967, 262, 146],
  'black-wall': [352, 967, 248, 146],
  'fall-decor': [624, 967, 254, 146],
  shelving: [284, 1266, 109, 99],
  'budget-decor': [408, 1266, 108, 99],
  'cozy-corner': [531, 1266, 110, 99],
  'neutral-bedroom': [656, 1266, 110, 99],
  'fall-inspiration': [782, 1266, 111, 99],
  newsletter: [0, 1439, 289, 139],
};
await mkdir('src/assets/images', { recursive: true });
for (const [name, [left, top, width, height]] of Object.entries(crops)) {
  await sharp(source).extract({ left: Math.round(left * scale), top: Math.round(top * scale), width: Math.round(width * scale), height: Math.round(height * scale) }).png().toFile(`src/assets/images/${name}.png`);
}
console.log(`Extracted ${Object.keys(crops).length} photographs from ${metadata.width} × ${metadata.height} reference.`);
