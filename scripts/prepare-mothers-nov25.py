"""Original-pixel editing for the November 25 catalogue additions.
Dependencies: Pillow, numpy, OpenCV. Segmentation PNGs are supplied by rembg.
Coordinates refer to a 600 x 800 inspection copy, then scale to native pixels.
"""
import json, hashlib, sys
from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageOps, ImageDraw, ImageFont, ImageFilter, ImageEnhance
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'tmp/mothers-nov25/masters'
OUT.mkdir(parents=True,exist_ok=True)
FONT='C:/Windows/Fonts/timesi.ttf'
BG='#F6E4DE'; INK='#793844'
CARDS={
86:[(368,538),(493,602),(365,664),(247,603)],
87:[(329,233),(429,251),(413,319),(312,299)],
88:[(355,143),(486,122),(498,201),(364,220)],
89:[(397,444),(475,491),(390,582),(310,532)],
90:[(344,250),(456,261),(447,309),(335,299)],
91:[(210,348),(276,316),(312,382),(240,414)],
92:[(275,179),(342,196),(323,292),(248,273)],
93:[(254,212),(335,204),(341,264),(257,270)],
94:[(278,169),(341,193),(323,282),(253,258)],
96:[(161,532),(211,576),(176,599),(125,557)],
97:[(196,362),(253,335),(274,386),(220,411)]
}
PHRASES=['Feliz día, mamá.','Te amo, mamá.','Eres la mejor mamá.']

if '--segment' in sys.argv:
    from rembg import new_session, remove
    from concurrent.futures import ThreadPoolExecutor
    segmentation_dir=ROOT/'tmp/mothers-nov25/cutouts'
    segmentation_dir.mkdir(parents=True,exist_ok=True)
    session=new_session('birefnet-general-lite')
    def segment(number):
        target=segmentation_dir/f'{number}.png'
        if target.exists():return
        original=ImageOps.exif_transpose(Image.open(ROOT/f'assets/catalogue-originals/nov25/photo-{number}.jpg')).convert('RGB')
        alpha=remove(original,session=session,only_mask=True)
        original.putalpha(alpha);original.save(target)
    with ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(segment,range(85,98)))

def card_overlay(original, number):
    if number not in CARDS:return original
    w,h=original.size
    paper=Image.new('RGBA',(500,300),'#FAF0EB');d=ImageDraw.Draw(paper)
    d.rectangle((11,11,488,288),outline='#BFA39E',width=3)
    f=ImageFont.truetype(FONT,65)
    for text,y in [('Para mamá,',65),('con amor',150)]:
        box=d.textbbox((0,0),text,font=f);d.text(((500-(box[2]-box[0]))/2,y),text,font=f,fill=INK)
    points=np.array([(x*w/600,y*h/800) for x,y in CARDS[number]],dtype=np.float32)
    matrix=cv2.getPerspectiveTransform(np.float32([[0,0],[499,0],[499,299],[0,299]]),points)
    layer=cv2.warpPerspective(np.array(paper),matrix,(w,h),flags=cv2.INTER_CUBIC)
    base=np.array(original.convert('RGB'));hsv=cv2.cvtColor(base,cv2.COLOR_RGB2HSV)
    # Preserve the actual petals, stems and leaves that pass in front of the card.
    protected=((hsv[:,:,0]>110)&(hsv[:,:,1]>85)&(hsv[:,:,2]>80))|((hsv[:,:,0]<10)&(hsv[:,:,1]>160)&(hsv[:,:,2]>130))|((hsv[:,:,0]>30)&(hsv[:,:,0]<105)&(hsv[:,:,1]>35))
    if number in [86,89,96]:protected[:]=False
    occlusions={91:[[(220,390),(250,380),(270,357),(305,350),(324,365),(320,430),(215,430)]],97:[[(254,360),(281,353),(301,380),(284,410),(251,401)]]}
    occlusion=np.zeros((h,w),np.uint8)
    for polygon in occlusions.get(number,[]):cv2.fillPoly(occlusion,[np.int32([(x*w/600,y*h/800) for x,y in polygon])],255)
    protected|=occlusion>0
    layer[protected,3]=0
    result=original.convert('RGBA');result.alpha_composite(Image.fromarray(layer))
    return result.convert('RGB')

manifest=[]
groups=json.loads((ROOT/'assets/catalogue-edited/nov25-products.json').read_text(encoding='utf-8'))
for i,group in enumerate(groups):
 for take,number in enumerate(group['sources'],1):
    source=ROOT/f'assets/catalogue-originals/nov25/photo-{number}.jpg'
    original=ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    w,h=original.size
    if number==86:
        # Remove the external white promotional overlay by local photographic healing.
        base=np.array(original);mask=np.zeros((h,w),np.uint8)
        roi=base[round(.786*h):round(.858*h),round(.085*w):round(.91*w)]
        gray=cv2.cvtColor(roi,cv2.COLOR_RGB2GRAY)
        letters=(gray>190).astype('uint8')*255
        letters=cv2.dilate(letters,np.ones((7,7),np.uint8))
        mask[round(.786*h):round(.858*h),round(.085*w):round(.91*w)]=letters
        # Heal text-overlapped basket texture from the clean alternate view of this
        # very same basket, rather than synthesizing a new product surface.
        clean=np.array(Image.open(ROOT/'assets/catalogue-originals/nov25/photo-89.jpg').convert('RGB'))
        ch,cw=clean.shape[:2]
        a=np.float32([[215*cw/600,550*ch/800],[365*cw/600,550*ch/800],[365*cw/600,615*ch/800],[215*cw/600,615*ch/800]])
        b=np.float32([[145*w/600,627*h/800],[385*w/600,627*h/800],[385*w/600,691*h/800],[145*w/600,691*h/800]])
        transform=cv2.getPerspectiveTransform(a,b)
        texture=cv2.warpPerspective(clean,transform,(w,h))
        texture=np.clip(texture.astype(float)+28,0,255).astype('uint8')
        clone_mask=np.zeros((h,w),np.uint8)
        cv2.fillConvexPoly(clone_mask,b.astype('int32'),255)
        clone_mask=cv2.GaussianBlur(clone_mask,(19,19),0).astype(float)/255
        base=(texture*clone_mask[:,:,None]+base*(1-clone_mask[:,:,None])).astype('uint8')
        original=Image.fromarray(base)
    original=card_overlay(original,number)
    alpha=Image.open(ROOT/f'tmp/mothers-nov25/cutouts/{number}.png').getchannel('A')
    alpha=alpha.point(lambda value: max(0,min(255,round((value-22)*255/215))))
    draw=ImageDraw.Draw(alpha)
    if number==97:
        draw.rectangle((0,round(h*.905),w,h),fill=0)
        a=np.array(alpha);pixels=np.array(original);dark=pixels.max(axis=2)<130
        rows=np.arange(h)[:,None]>.85*h;a[dark&rows]=0;alpha=Image.fromarray(a)
    if number==96:
        draw.rectangle((0,round(h*.775),round(w*.49),h),fill=0)
        draw.rectangle((0,round(h*.82),w,h),fill=0)
    # Keep source RGB, with restrained tonal correction and sharpening only.
    original=ImageEnhance.Brightness(original).enhance({89:1.14,91:1.10,92:1.07,94:1.07}.get(number,1.045))
    original=ImageEnhance.Contrast(original).enhance(1.015)
    original=original.filter(ImageFilter.UnsharpMask(radius=.75,percent=45,threshold=3)).convert('RGBA')
    original.putalpha(alpha)
    bbox=alpha.point(lambda value:255 if value>65 else 0).getbbox()
    if not bbox:raise ValueError(number)
    product=original.crop(bbox)
    product.thumbnail((1010,1120),Image.Resampling.LANCZOS)
    canvas=Image.new('RGBA',(1120,1400),BG)
    shadow=Image.new('RGBA',canvas.size)
    sd=ImageDraw.Draw(shadow)
    bottom=205+(1120-product.height)//2+product.height
    spread=min(product.width*.31,230)
    sd.ellipse((560-spread,bottom-5,560+spread,bottom+18),fill=(90,50,55,24))
    shadow=shadow.filter(ImageFilter.GaussianBlur(12));canvas.alpha_composite(shadow)
    canvas.alpha_composite(product,((1120-product.width)//2,205+(1120-product.height)//2))
    d=ImageDraw.Draw(canvas);font=ImageFont.truetype(FONT,76)
    phrase=PHRASES[i%3];b=d.textbbox((0,0),phrase,font=font)
    d.text(((1120-(b[2]-b[0]))/2,46),phrase,font=font,fill=INK)
    path=OUT/f"{group['id']}-toma-{take}.png"
    canvas.convert('RGB').save(path)
    manifest.append({'productId':group['id'],'name':group['name'],'sourceIndex':number,'take':take,'phrase':phrase,'original':str(source.relative_to(ROOT)).replace('\\','/'),'caption':'Vista conjunta; la consulta corresponde a la canasta de primer plano.' if number==96 else None,'fileName':path.name,'method':'Original-pixel cutout, photographic retouch and non-generative typography composition','cardsAdapted':number in CARDS,'width':1120,'height':1400})
    print(number,group['id'],take,flush=True)
(ROOT/'assets/catalogue-edited/nov25-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
