const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const read = path => JSON.parse(fs.readFileSync(path,'utf8').replace(/^\uFEFF/,''));
(async()=>{
  const data=read('dist/collections.json'), inventory=read('assets/collections-inventory.json'), sources=read('assets/collections-originals/sources.json');
  assert.equal(inventory.files.length,199);
  assert.equal(new Set(inventory.files.map(item=>item.source)).size,199);
  assert.equal(data.floral.length,43); assert.equal(data.events.length,144); assert.equal(data.videos.length,6);
  assert.equal(data.floral.reduce((count,item)=>count+item.images.length,0),47);
  data.floral.forEach((item,index)=>{assert.equal(item.id,`FL-${String(index+1).padStart(3,'0')}`);assert.ok(item.name&&item.description);assert.equal('price' in item,false);});
  for(const source of sources.files){const file=fs.readFileSync('assets/collections-originals/'+source.file);assert.equal(file.length,source.bytes);if(source.sha256)assert.equal(crypto.createHash('sha256').update(file).digest('hex'),source.sha256);}
  const files=new Set();
  for(const photo of [...data.floral.flatMap(item=>item.images),...data.events.map(item=>item.image)]){assert.ok(photo.alt);files.add(photo.thumb);files.add(photo.full);}
  let bytes=0;
  for(const file of files){const buffer=fs.readFileSync('dist/'+file);bytes+=buffer.length;assert.ok(buffer.length<1024*1024,file);await sharp(buffer).resize(24,24).raw().toBuffer();}
  for(const clip of data.videos){assert.ok(clip.duration>0);assert.ok(fs.statSync('dist/'+clip.src).size<25*1024*1024);await sharp('dist/'+clip.poster).resize(24,24).raw().toBuffer();}
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync('dist/assets/floral-watercolor.webp')).digest('hex'),'e4e1d1726b149b8f93c70585b08f1520c27ccc584eecbaf3a7bd0ec4125607ec');
  console.log(`PASS:199 sources accounted,43 products,47 floral photos,144 events,6 videos,${files.size} WebP decoded (${bytes} bytes),hero unchanged.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
