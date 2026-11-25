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


## Colecciones permanentes · 25/11/2026

Se añaden tres secciones después de Nuestro trabajo, manteniendo portada, galería actual y catálogo temporal independientes. Fuente: carpeta Drive 1HqHW3ZqqnVKtHqY4IfXcXAYn--37mC8N, 193 JPEG y 6 MP4. Inventario completo en assets/collections-inventory.json; procedencia y SHA-256 en assets/collections-originals/sources.json. Se contabilizan199archivos:47fotos florales en43productos,144fotos de eventos,6videos,1duplicado exacto(88/63) y1foto personal sin producto(178), excluida. Originales descargados se conservan localmente e ignorados por Git; el material excluido no se publica.

Arreglos FL-001…FL-043, nombres y descripciones visuales sin tarifas ni medidas inventadas. Consulta individual a50764609658 con código,nombre y enlace permanente a tarjeta; sin cantidades ni carrito. Galería adicional independiente y visor propio con teclado,Escape,retorno de foco. Ambas secciones empiezan con3tarjetas y añaden9por clic; no se instancian ni descargan fotos ocultas. Colecciones se cargan cerca del bloque; estados de error y reintento disponibles. Enlace directo a producto expande el lote correspondiente.

Retoque no generativo: máscara BiRefNet-general-lite mediante rembg2.0.88, refinamiento manual de alfa y reutilización del RGB original; no se recrean flores ni texto. Fondo#F3F3F1, sombra discreta y encuadre completo4:5. Eventos mantienen su ambiente con corrección tonal/enfoque suave.382WebP(720px/tamaño ampliación),58456988bytes antes del último ajuste menor de máscara; ningún WebP supera1MB. Revisados47recortes y las193fuentes.

Videos:6MP4H.264/AAC, audio y duración conservados; cinco rotaciones internas respetadas. Cinco transcodificados con máximo30fps,CRF26,techo1200k,preset slow y audio copiado; el clip0,37s conserva streams con faststart. Total17173270bytes frente a25768471bytes originales. Pósteres estáticos, controles manuales,carga al pulsar,reproducción única,pausa al salir de vista/cambiar de tarjeta/ocultar pestaña. Carrusel3/2/1tarjetas según anchura.

Interfaz: dist/collections.css,dist/collections.js y dist/collections.json. Curación editable:scripts/collection-curation.json; preparación reproducible:scripts/cutout-collections.py,refine-collection-masks.py,build-collections.cjs,prepare-collection-videos.py. Máscaras y entorno aislado en tmp/collections, sin incluir modelos o dependencias en publicación. Ver scripts/verify-collections.cjs y QA.md. Para regenerar: restaurar originales de Drive según manifiesto,Python3.12 con rembg[cpu]==2.0.88/Pillow y Sharp; definir SHARP_MODULE si no está en node_modules y FFMPEG/FFPROBE si no están en PATH. U2NET_HOME permite alojar el modelo fuera del sistema. Ejecutar recorte,refinamiento,videos --dry-run y ejecución,build y verify; no sobrescribir fuentes. --reuse-events/--reuse-floral reutilizan derivados ya verificados; --refresh-floral=números regenera máscaras cambiadas.
