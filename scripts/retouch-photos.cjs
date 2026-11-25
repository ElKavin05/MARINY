// Deterministic photographic correction. No generated pixels, crops or object edits.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const root = path.resolve(__dirname, '..');
const adjustments = {
  'cena-prenupcial': [1.055, 1.025, -1.5],
  'cumpleanos-floral': [1.055, 1.025, -1.5],
  'detalle-floral-mama': [1.015, 1.015, -1],
  'evento-01': [1.10, 1.025, -1.5],
  'evento-02': [1.025, 1.025, -1.5],
  'evento-03': [1.045, 1.025, -1.5],
  'evento-05': [1.025, 1.02, -1],
  'evento-06': [1.08, 1.025, -1.5],
  'evento-07': [1.045, 1.025, -1.5],
  'evento-08': [1.02, 1.02, -1],
  'evento-12': [1.01, 1.01, -1],
  'eventos-corporativos': [1.025, 1.02, -1]
};
const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
(async () => {
  const output = path.join(root, 'dist/assets/retouched');
  fs.mkdirSync(output, { recursive: true });
  const records = [];
  for (const [name, [gamma, gain, offset]] of Object.entries(adjustments)) {
    const source = `assets/originals/${name.replace('evento-', '')}.jpg`;
    const input = fs.readFileSync(path.join(root, source));
    const before = await sharp(input).metadata();
    const target = `dist/assets/retouched/${name}.webp`;
    // Preserve native resolution and geometry; gentle tonal lift and edge sharpening.
    await sharp(input).rotate().toColourspace('srgb')
      .gamma(gamma).linear(gain, offset)
      .sharpen({ sigma: 0.8, m1: 0.55, m2: 1.2, x1: 3, y2: 5, y3: 7 })
      .webp({ quality: 91, effort: 6, smartSubsample: true })
      .toFile(path.join(root, target));
    const result = fs.readFileSync(path.join(root, target));
    const after = await sharp(result).metadata();
    if (after.width !== before.width || after.height !== before.height) {
      throw new Error(`Unexpected geometry change: ${name}`);
    }
    records.push({ source, target, sourceSha256: hash(input), outputSha256: hash(result),
      width: after.width, height: after.height, bytes: result.length, gamma, gain, offset });
  }
  fs.writeFileSync(path.join(root, 'assets/photo-retouch.json'), JSON.stringify({
    date: '2026-11-25', method: 'Non-generative tonal correction and restrained sharpening from originals',
    heroExcluded: true, photos: records
  }, null, 2) + '\n');
  console.log(`${records.length} photographs; ${records.reduce((sum, p) => sum + p.bytes, 0)} bytes. Originals and hero unchanged.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
