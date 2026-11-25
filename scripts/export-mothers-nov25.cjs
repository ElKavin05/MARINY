const fs=require('node:fs');
const path=require('node:path');
const sharp=require(process.env.SHARP_MODULE||'sharp');
const root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8').replace(/^\uFEFF/,''));
(async()=>{
  const additions=read('assets/catalogue-edited/nov25-products.json');
  const edits=read('assets/catalogue-edited/nov25-manifest.json');
  const originals=read('dist/products.json').filter(p=>Number(p.id.slice(4))<=84);
  if(originals.length!==81)throw Error('Unexpected existing product count');
  const newProducts=[];
  for(const product of additions){
    const images=[];
    for(const edit of edits.filter(e=>e.productId===product.id)){
      let src=`catalogue/edited/${product.id}-toma-${edit.take}.webp`;
      let full=`catalogue/edited/${product.id}-toma-${edit.take}-full.webp`;
      if(product.useOriginal){
        src=full=`catalogue/original/${product.id}.jpg`;
        fs.mkdirSync(path.join(root,'dist/catalogue/original'),{recursive:true});
        fs.copyFileSync(path.join(root,edit.original),path.join(root,'dist',src));
      }else{
      const master=path.join(root,'tmp/mothers-nov25/masters',edit.fileName);
      await sharp(master).resize({width:720,withoutEnlargement:true}).webp({quality:88,effort:6}).toFile(path.join(root,'dist',src));
      await sharp(master).webp({quality:91,effort:6}).toFile(path.join(root,'dist',full));
      }
      const image={src,full,sourceIndex:edit.sourceIndex,alt:edit.caption||`${product.name}. ${product.description}`};
      if(edit.caption)image.caption=edit.caption;
      images.push(image);
      edit.src=src;edit.full=full;edit.review='approved';
    }
    newProducts.push({id:product.id,name:product.name,description:product.description,category:'Arreglos en base',price:null,images});
  }
  fs.writeFileSync(path.join(root,'dist/products.json'),JSON.stringify([...newProducts,...originals],null,2)+'\n');
  fs.writeFileSync(path.join(root,'assets/catalogue-edited/nov25-manifest.json'),JSON.stringify(edits,null,2)+'\n');
  const oldManifest=read('assets/catalogue-edited/manifest.json').filter(e=>Number(e.productId.slice(4))<=84);
  fs.writeFileSync(path.join(root,'assets/catalogue-edited/manifest.json'),JSON.stringify([...edits,...oldManifest],null,2)+'\n');
  console.log('89 products,97 photographs;8 new designs first;24 optimized WebP files and one unmodified original JPEG.');
})().catch(e=>{console.error(e);process.exitCode=1;});
