"""Non-generative subject masks, using rembg 2.0.88 / BiRefNet-general-lite.
Run in the isolated media environment. Originals are never rewritten.
"""
import json
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from PIL import Image, ImageOps
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'tmp/collections/cutouts'
OUT.mkdir(parents=True, exist_ok=True)
curation = json.loads((ROOT / 'scripts/collection-curation.json').read_text(encoding='utf-8'))
session = new_session('birefnet-general-lite')

def process(number):
    target = OUT / f'{number:03}.png'
    if target.exists():
        return number
    original = ImageOps.exif_transpose(Image.open(ROOT / f'assets/collections-originals/{number:03}.jpg')).convert('RGB')
    result = remove(original, session=session, alpha_matting=False)
    rgba = np.array(result)
    alpha = rgba[:, :, 3].astype(float)
    # Clear low-probability background haze, retain smooth edges and thin stems.
    rgba[:, :, 3] = np.clip((alpha - 25) * 255 / 210, 0, 255).astype('uint8')
    Image.fromarray(rgba).save(target)
    print(f'Cutout {number}', flush=True)
    return number

numbers = [n for group in curation['floralGroups'] for n in group['sources']]
with ThreadPoolExecutor(max_workers=2) as pool:
    list(pool.map(process, numbers))
print(f'Complete: {len(numbers)} source photographs', flush=True)
