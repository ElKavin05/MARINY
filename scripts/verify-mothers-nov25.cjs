const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const sharp=require(process.env.SHARP_MODULE||'sharp');
(async()=>{
 const baseline=JSON.parse(execFileSync('git',['show','5e0e6c9:dist/products.json'],{encoding:'utf8'}));
 const products=JSON.parse(fs.readFileSync('dist/products.json','utf8'));
 const manifest=JSON.parse(fs.readFileSync('assets/catalogue-edited/manifest.json','utf8'));
 const sources=JSON.parse(fs.readFileSync('assets/catalogue-edited/nov25-sources.json','utf8'));
 assert.deepEqual(products.slice(8),baseline);
 assert.equal(products.length,89);assert.equal(products.reduce((n,p)=>n+p.images.length,0),97);
 const currentBaseline=JSON.parse(execFileSync('git',['show','9bf5400:dist/products.json'],{encoding:'utf8'}));
 assert.deepEqual(products,currentBaseline,'Image-only correction must preserve all product data');
 const additions=manifest.filter(m=>m.sourceIndex>=85);
 assert.equal(additions.filter(m=>m.cardsRemoved).length,11);
 assert.ok(additions.every(m=>!Object.hasOwn(m,'cardsAdapted')));
 assert.equal(manifest.length,97);assert.equal(new Set(manifest.map(m=>m.sourceIndex)).size,97);
 for(const [i,p]of products.slice(0,8).entries()){assert.equal(p.id,`MAD-${String(i+85).padStart(3,'0')}`);assert.equal(p.price,null);assert.equal(p.category,'Arreglos en base');}
 let bytes=0;
 for(const p of products.slice(0,8)){const phrases=new Set();for(const image of p.images){
  const edit=manifest.find(e=>e.sourceIndex===image.sourceIndex);assert.equal(edit.productId,p.id);assert.equal(edit.review,'approved');phrases.add(edit.phrase);
  for(const f of [image.src,image.full]){const b=fs.readFileSync('dist/'+f);bytes+=b.length;assert.ok(b.length<600000);const metadata=await sharp(b).metadata();assert.equal(metadata.width/metadata.height,.8);await sharp(b).resize(20,25).raw().toBuffer();}
 }assert.equal(phrases.size,1);}
 assert.equal(products[1].images[2].sourceIndex,96);assert.ok(products[1].images[2].caption.includes('canasta de primer plano'));
 for(const item of sources){assert.equal(crypto.createHash('sha256').update(fs.readFileSync(item.original)).digest('hex'),item.sha256);}
 console.log(`PASS:8 new designs first,81 previous products identical,89 products/97 photos,13 originals intact,26 WebP decoded(${bytes}bytes).`);
})().catch(e=>{console.error(e);process.exitCode=1;});
