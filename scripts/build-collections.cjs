const fs = require('node:fs');
const path = require('node:path');
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const root = path.resolve(__dirname, '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''));
const source = read('assets/collections-originals/sources.json');
const curation = read('scripts/collection-curation.json');
const output = path.join(root, 'dist/assets/collections');
const bg = '#F3F3F1';
const allFloral = new Set(curation.floralGroups.flatMap(group => group.sources));
const skipped = new Map([...curation.excluded.map(item => [item.source, item.reason]), ...curation.duplicates.map(item => [item.source, `Duplicate of ${item.sameAs}`])]);
const reuseEvents = process.argv.includes('--reuse-events') && fs.existsSync(path.join(root,'dist/collections.json')) ? read('dist/collections.json').events : [];
const reuseFloral = process.argv.includes('--reuse-floral') && fs.existsSync(path.join(root,'dist/collections.json')) ? read('dist/collections.json').floral.flatMap(item => item.images) : [];
const refreshFloral = new Set((process.argv.find(arg => arg.startsWith('--refresh-floral=')) || '').split('=')[1]?.split(',').map(Number) || []);
const familyIds = {
  'Una mesa para compartir': [3,4,5,7,9,10,11,15,16,22,23,28,29,36,37,38,40,43,45,47,48,56,58,59,61,75,76,89,90,91,94,98,108,109,112,116,123,124,126,128,133,135,136,137,140,142,144,147,148,157,158,162,175,177,183,186,192,193],
  'Detalles para recibir': [1,2,6,8,30,33,34,35,39,44,46,51,53,54,55,57,78,83,84,85,96,97,105,106,110,111,114,115,117,118,120,121,139,179,180,181,184,187,189],
  'El comienzo de una historia': [62,63,93,99,100,102,107,143,166,188],
  'Flores que enmarcan un momento': [12,14,17,25,26,41,42,50,52,60,67,68,73,80,81,87,113,119,122,127,129,130,138,145,168,173,182,185,191],
  'Una celebración llena de color': [31,32,49,77,82,101,152]
};
function eventName(id) { return Object.keys(familyIds).find(name => familyIds[name].includes(id)) || 'Un momento para recordar'; }
async function writePhoto(buffer, prefix, alt, floral) {
  const meta = await sharp(buffer).metadata();
  const thumb = `assets/collections/${prefix}-720.webp`, full = `assets/collections/${prefix}-full.webp`;
  await sharp(buffer).resize({ width: 720, withoutEnlargement: true }).webp({ quality: 86, effort: 5, smartSubsample: true }).toFile(path.join(root, 'dist', thumb));
  await sharp(buffer).resize({ width: floral ? 1080 : 1400, height: floral ? 1350 : 2000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 90, effort: 5, smartSubsample: true }).toFile(path.join(root, 'dist', full));
  return { thumb, full, alt, width: meta.width, height: meta.height };
}
async function productPhoto(number) {
  let image = sharp(path.join(root, `tmp/collections/refined/${String(number).padStart(3, '0')}.png`));
  // The alpha comes only from segmentation of original pixels; no generative fill.
  const { data: alpha, info } = await image.clone().extractChannel('alpha').raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = 0, bottom = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (alpha[y * info.width + x] > 65) { left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); }
  if (right <= left || bottom <= top) throw new Error(`Empty mask ${number}`);
  const padding = 5;
  left = Math.max(0, left-padding); top = Math.max(0, top-padding); right = Math.min(info.width-1, right+padding); bottom = Math.min(info.height-1, bottom+padding);
  const cut = await image.extract({ left, top, width: right-left+1, height: bottom-top+1 }).resize({ width: 930, height: 1200, fit: 'inside', withoutEnlargement: true }).png().toBuffer();
  const dims = await sharp(cut).metadata();
  const x = Math.round((1080-dims.width)/2), y = Math.round((1350-dims.height)/2);
  const shadow = await sharp({ create: { width: 1080, height: 1350, channels: 4, background: '#00000000' } }).composite([{input:Buffer.from('<svg width="1080" height="1350"><ellipse cx="540" cy="1268" rx="230" ry="15" fill="#000" opacity=".09"/></svg>')}]).blur(14).png().toBuffer();
  return sharp({ create: { width: 1080, height: 1350, channels: 3, background: bg } }).composite([{ input: shadow }, { input: cut, left: x, top: y }]).flatten({ background: bg }).gamma(1.025).linear(1.012,-1).sharpen({sigma:.6,m1:.4,m2:.8}).png().toBuffer();
}
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const floral = [], events = [], inventory = [];
  for (const [index, group] of curation.floralGroups.entries()) {
    const id = `FL-${String(index+1).padStart(3,'0')}`, images = [];
    for (const number of group.sources) {
      const prior = !refreshFloral.has(number) && reuseFloral.find(photo => photo.thumb.includes(`floral-${String(number).padStart(3,'0')}-`));
      images.push(prior ? {...prior,alt:`${group.name}. ${group.description}`} : await writePhoto(await productPhoto(number), `floral-${String(number).padStart(3,'0')}`, `${group.name}. ${group.description}`, true));
      inventory.push({ source: number, category: 'floral', product: id });
    }
    floral.push({ id, name: group.name, description: group.description, images });
  }
  for (const file of source.files) {
    if (allFloral.has(file.index)) continue;
    if (skipped.has(file.index)) { inventory.push({source:file.index,category:'excluded',reason:skipped.get(file.index)}); continue; }
    if (file.type === 'video/mp4') { inventory.push({source:file.index,category:'video'}); continue; }
    const name = eventName(file.index);
    const prior = reuseEvents.find(item => item.id === `EV-${String(file.index).padStart(3,'0')}`);
    const image = prior ? prior.image : await writePhoto(await sharp(path.join(root,'assets/collections-originals',file.file)).rotate().gamma(1.035).linear(1.018,-1).sharpen({sigma:.65,m1:.45,m2:.9}).png().toBuffer(), `event-${String(file.index).padStart(3,'0')}`, `${name}: fotografía de una decoración de Mariny.`, false);
    events.push({id:`EV-${String(file.index).padStart(3,'0')}`,name,description:'Flores y detalles de una celebración Mariny. Abre la fotografía para descubrir el montaje completo.',image});
    inventory.push({source:file.index,category:'events'});
  }
  const videos = read('tmp/collections/videos.json');
  if (inventory.length !== source.files.length || new Set(inventory.map(x=>x.source)).size !== source.files.length) throw new Error('Incomplete source coverage');
  fs.writeFileSync(path.join(root,'dist/collections.json'), JSON.stringify({version:1,floral,events,videos},null,2)+'\n');
  fs.writeFileSync(path.join(root,'assets/collections-inventory.json'), JSON.stringify({date:'2026-11-25',folder:source.folder,counts:{sources:source.files.length,floralProducts:floral.length,floralPhotographs:allFloral.size,eventPhotographs:events.length,videos:videos.length,excluded:skipped.size},files:inventory.sort((a,b)=>a.source-b.source)},null,2)+'\n');
  console.log({floral:floral.length,floralImages:allFloral.size,events:events.length,videos:videos.length,accounted:inventory.length});
})().catch(error => { console.error(error);process.exitCode=1; });

