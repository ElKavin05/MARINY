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

19/11/2026: foto1000327104.jpg adjuntada por Kevin para categoría prenupcial. Original assets/originals/cena-prenupcial.jpg, versión optimizada dist/assets/cena-prenupcial.webp. Sustituida tarjeta y entrada galería id5, categoría Despedidas y celebraciones prenupciales. Retirada asignación corporativa anterior por ser esta foto explícitamente prenupcial.


Actualización 25/11/2026: las cuatro franjas mantienen una sola frase fija, con bordes superior e inferior ondulantes. Recurso alfa VP9 WebM de 6 s, 960×64, 24 fps (255925 bytes), creado con GSAP y HyperFrames; fuente editable en motion/ribbons y fallback SVG. Reproducción automática solo visible, sin controles; pausa técnica fuera de pantalla, pestaña oculta, ahorro de datos y movimiento reducido. La segunda tarjeta es «Celebraciones nupciales», con descripción de recepción y CTA vinculado a la opción existente «Bodas y compromisos». Las demás categorías se conservan.


25/11/2026 · Retoque fotográfico sin regenerar aprobado por Kevin. Doce fotos únicas debajo de portada: cinco tarjetas, nueve entradas de galería y fotos de La esencia comparten las versiones en dist/assets/retouched/. Corrección tonal y enfoque moderados desde los JPEG originales, sin recorte, cambio de geometría, sustitución de objetos ni IA generativa. Resolución nativa conservada; WebP calidad91; total2523730 bytes, carga diferida existente. Originales, recursos anteriores y portada intactos (SHA-256 y HTML de hero comprobados). Recetas y hashes en assets/photo-retouch.json; script reproducible scripts/retouch-photos.cjs con Sharp (SHARP_MODULE permite localizar instalación). La prueba generativa se descartó y no está en los activos publicados.
