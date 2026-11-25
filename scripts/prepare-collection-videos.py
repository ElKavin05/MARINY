"""Probe, plan and optimize source clips. --dry-run emits commands without encoding."""
import json, os, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
FFMPEG = os.environ.get('FFMPEG', 'ffmpeg')
FFPROBE = os.environ.get('FFPROBE', 'ffprobe')
source = json.loads((ROOT / 'assets/collections-originals/sources.json').read_text(encoding='utf-8-sig'))
out = ROOT / 'dist/assets/collections/videos'
out.mkdir(parents=True, exist_ok=True)
records = []
names = ['Entre flores y detalles', 'Una mesa para compartir', 'Flores que enmarcan', 'Pequeños detalles de mesa', 'Un jardín de flores', 'Una mesa para recordar']
for index, file in enumerate(f for f in source['files'] if f['type'] == 'video/mp4'):
    original = ROOT / 'assets/collections-originals' / file['file']
    def probe(path):
        return json.loads(subprocess.check_output([FFPROBE, '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)]))
    before = probe(original)
    duration = float(before['format']['duration'])
    target = out / f'clip-{index + 1:02}.mp4'
    command = [FFMPEG, '-y', '-v', 'error', '-i', str(original), '-map', '0:v:0', '-map', '0:a?']
    if duration < 1:
        command += ['-c', 'copy']
    else:
        command += ['-vf', 'fps=30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-maxrate', '1200k', '-bufsize', '2400k', '-pix_fmt', 'yuv420p', '-c:a', 'copy']
    command += ['-movflags', '+faststart', str(target)]
    if '--dry-run' in sys.argv:
        print(json.dumps({'source': file['file'], 'duration': duration, 'command': command}))
        continue
    subprocess.run(command, check=True)
    after = probe(target)
    if target.stat().st_size > original.stat().st_size:
        subprocess.run([FFMPEG, '-y', '-v', 'error', '-i', str(original), '-map', '0', '-c', 'copy', '-movflags', '+faststart', str(target)], check=True)
        after = probe(target)
    if abs(float(after['format']['duration']) - duration) > .1:
        raise ValueError(f'Duration mismatch: {original}')
    poster = out / f'clip-{index + 1:02}.jpg'
    subprocess.run([FFMPEG, '-y', '-v', 'error', '-ss', str(min(.5, duration / 3)), '-i', str(target), '-frames:v', '1', '-vf', 'scale=600:-2', '-q:v', '3', str(poster)], check=True)
    video = next(s for s in after['streams'] if s['codec_type'] == 'video')
    records.append({'id': f'VI-{index + 1:03}', 'source': file['index'], 'name': names[index], 'src': f'assets/collections/videos/{target.name}', 'poster': f'assets/collections/videos/{poster.name}', 'duration': duration, 'width': video['width'], 'height': video['height'], 'originalBytes': original.stat().st_size, 'bytes': target.stat().st_size, 'rotation': [s.get('rotation') for s in video.get('side_data_list', []) if 'rotation' in s]})
    print(f'Video {index + 1}: {original.stat().st_size} -> {target.stat().st_size}', flush=True)
if '--dry-run' not in sys.argv:
    (ROOT / 'tmp/collections/videos.json').write_text(json.dumps(records, indent=2), encoding='utf-8')

