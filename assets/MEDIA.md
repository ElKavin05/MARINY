# Recursos de marca y arte

Fecha: 2026-11-18.

- `dist/assets/mariny-logo-original.png`: copia exacta del adjunto de Kevin `codex-clipboard-334632e6-d04a-40a5-baf9-20eb29671f40.png`. No se regeneraron el monograma, el nombre ni el lema. CSS oculta márgenes exteriores para mostrarlo más grande.
- `floral-art-generated.png`: interpretación artística generada de `originals/03.jpg`, por solicitud del usuario. Grafito y tinta monocromática, sin el entorno doméstico. No es una fotografía documental del resultado de un evento. Derivado web: `dist/assets/floral-art.webp`, aproximadamente 249 KiB. La foto original se conserva en galería.
- Fotografías de portafolio: selección de Instagram documentada en `sources.json`. Conservan sus colores reales; la paleta monocromática se aplica a la interfaz y al arte de portada.

El arte se creó con la herramienta de imágenes integrada. Movimiento implementado como composición HTML/SVG/CSS, sin biblioteca adicional ni video descargable.

- `floral-watercolor-generated.png`: nueva interpretación a color de `originals/03.jpg`, con rosas amarillas y rosadas y espigas moradas. Solicitud de Kevin del 18/11/2026. Sustituye el grafito solo en portada; la versión anterior se conserva como recurso. Derivado `dist/assets/floral-watercolor.webp`, 260380 bytes.
- Threads: enlace recibido directamente de Kevin el 18/11/2026: https://www.threads.com/@mariny_events?xmt=AQG0RxkNsq3cD6iypnVjvHlg-7yuKcerME_Zqgi21lKFFMw. Se usa la URL canónica sin el parámetro de seguimiento.

- `dist/assets/mariny-logo-transparent.png`: extracción de fondo mediante herramienta de imágenes integrada, a partir del logo original. Versión activa en cabecera y pie, 18/11/2026. PNG RGBA; comprobación en canvas: 1 481 483 píxeles totalmente transparentes, 0 píxeles blancos opacos y esquina con alfa 0. Monograma, nombre y lema revisados visualmente. El original permanece intacto.

19/11/2026, tres fotos adjuntadas por Kevin para sustituir categorías:
- 1000327108.jpg → originals/cumpleanos-floral.jpg → dist/assets/cumpleanos-floral.webp. Mesa con flores, velas y letras de globos de cumpleaños. Categoría Cumpleaños, también filtro Con globos.
- 1000327183.jpg → originals/eventos-corporativos.jpg → dist/assets/eventos-corporativos.webp. Salón con mesas blancas y centros florales altos, asignado por el usuario a Eventos corporativos.
- 1000327123.jpg → originals/detalle-floral-mama.jpg → dist/assets/detalle-floral-mama.webp. Caja floral con dedicatoria a mamá. Categoría Detalles y momentos especiales.
Originales conservados. Versiones WebP optimizadas sin transformación artística; recorte visual adaptable mediante CSS. Sustituidas las tarjetas y las entradas correspondientes de galería (ids6,11,3). No se reemplazaron los originales de la acuarela ni las fotografías de la sección Esencia.
