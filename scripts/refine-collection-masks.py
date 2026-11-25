"""Hand-reviewed mask corrections. Coordinates reference a 600 x 800 preview.
Only alpha is edited; RGB pixels remain from the supplied photographs.
"""
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'tmp/collections/refined'
OUT.mkdir(parents=True,exist_ok=True)
REMOVE={
  20:[[(0,0),(600,0),(600,200),(0,200)]],
  64:[[(360,535),(600,525),(600,800),(360,800)]],
  65:[[(405,482),(600,460),(600,550),(490,526),(438,510)]],
  70:[[(488,602),(600,600),(600,690),(472,650)],[(480,560),(600,555),(600,620),(475,620)]],
  71:[[(535,400),(600,380),(600,550),(480,550),(500,447)]],
  72:[[(380,460),(600,455),(600,555),(360,530),(350,505)]],
  103:[[(0,370),(105,480),(195,510),(208,470),(193,562),(0,600)],[(285,465),(260,487),(253,525),(245,553),(298,565),(315,470)]],
  104:[[(0,475),(240,475),(240,590),(0,620)],[(340,508),(315,520),(310,555),(350,560)]],
  146:[[(542,490),(600,480),(600,800),(540,800)]],
  171:[[(0,690),(600,690),(600,800),(0,800)]],
  174:[[(375,450),(600,430),(600,800),(340,800),(340,620),(365,600)],[(0,624),(600,624),(600,800),(0,800)]],
}
for group in json.loads((ROOT/'scripts/collection-curation.json').read_text())['floralGroups']:
 for number in group['sources']:
  image=Image.open(ROOT/f'tmp/collections/cutouts/{number:03}.png').convert('RGBA')
  w,h=image.size
  alpha=image.getchannel('A')
  draw=ImageDraw.Draw(alpha)
  for polygon in REMOVE.get(number,[]):draw.polygon([(round(x*w/600),round(y*h/800)) for x,y in polygon],fill=0)
  if number==21:
   keep=Image.new('L',(w,h));d=ImageDraw.Draw(keep)
   for poly in [[(0,0),(600,0),(600,480),(0,480)],[(214,475),(375,475),(379,569),(348,594),(247,594),(215,566)],[(285,495),(272,570),(245,625),(242,657),(250,667),(262,645),(278,587),(300,530)],[(315,510),(340,527),(345,574),(324,620),(327,651),(343,642),(357,595),(357,528)]]:
    d.polygon([(round(x*w/600),round(y*h/800)) for x,y in poly],fill=255)
   import PIL.ImageChops
   alpha=PIL.ImageChops.multiply(alpha,keep)
  if number==27:
   # Mirror is part of the gift; retain its interior, including the original lettering.
   d=ImageDraw.Draw(alpha);d.ellipse((round(.257*w),round(.004*h),round(.746*w),round(.443*h)),fill=255)
  if number==159:
   keep=Image.new('L',(w,h));d=ImageDraw.Draw(keep)
   poly=[(0,0),(600,0),(600,475),(425,475),(380,520),(380,665),(352,684),(235,684),(218,665),(240,520),(190,478),(0,478)]
   d.polygon([(round(x*w/600),round(y*h/800)) for x,y in poly],fill=255)
   import PIL.ImageChops
   alpha=PIL.ImageChops.multiply(alpha,keep)
  # Reapply the mask to original RGB; restored regions never use zeroed model RGB.
  from PIL import ImageOps
  image=ImageOps.exif_transpose(Image.open(ROOT/f'assets/collections-originals/{number:03}.jpg')).convert('RGBA')
  image.putalpha(alpha)
  image.save(OUT/f'{number:03}.png')
print('Refined original-pixel masks complete.')
