# Mariny · Catálogo Día de las Madres

Catálogo temporal en la rama catalogo-dia-madres del repositorio ElKavin05/MARINY. La web principal pertenece a main y al proyecto Cloudflare mariny. Este catálogo se publica como proyecto independiente mariny-catalogo-madres, salida dist/, sin compilación.

## Edición
Ejecutar python -m http.server 5212 --bind 127.0.0.1 --directory dist y abrir http://127.0.0.1:5212/.
Los productos se editan en dist/products.json. price es null mientras el precio no esté confirmado. Para establecerlo, usar un número con el precio unitario en dólares, por ejemplo 35. Las tarjetas y consultas mostrarán el precio desde ese archivo. Mantener los códigos existentes al editar descripciones o fotos. Tras cambiar productos.json, subir a catalogo-dia-madres y verificar el nuevo despliegue.

Cada consulta es individual, incluye código, nombre, descripción, cantidad, precio y enlace de referencia al arreglo. WhatsApp50764609658 confirmado por Kevin. No se envían mensajes automáticamente ni se guardan datos personales. Las cantidades no representan existencias.

## Material recibido y revisión
Archivo ZIP suministrado por Kevin el 19/11/2026, con 84 fotos distintas y 2 videos. Originales conservados en assets/catalogue-originals y nombres originales en sources.json. Las fotos 14/15, 41/42 y 49/50se agruparon como tomas alternativas. Resultado81 productos que contabilizan84 imágenes. Los códigos conservan el índice de la primera foto.

Descripciones editoriales basadas en lo visible. Precio y disponibilidad por confirmar en todos los productos, incluso en referencias promocionales antiguas. Fotografías 9 y 68conservan texto de origen. No se deducen medidas ni cantidades de tallos.
WebP720 px para tarjetas y hasta1400 px para ampliación. Todo se conserva completo con object-fit:contain. Logo transparente original de Mariny ajustado al área útil. Baskervville y DM Sans autoalojadas con licencia OFL.

Videos H.264/AAC de 2,733 y 14,63 segundos, aproximadamente0,5 y 2,7 MB. FFmpeg cut.py aplicado a duración completa mediante copia sin pérdida y faststart. Se conservan proporción, rotación y audio. Pósteres sin marca de tiempo. Los videos usan controles, playsinline y preload=none.

## Verificación y publicación
tmp/catalogue-qa.cjs revisa320/390/768/1440 px,81 tarjetas, imágenes, filtros, visor con teclado, cantidades y81 mensajes individuales sin enviarlos. Capturas en tmp/catalogue-hero-*.png, catalogue-grid-*.png y catalogue-videos-*.png.
La publicación requiere push a catalogo-dia-madres. Confirmar commit y estado success en Cloudflare. El sitio principal está vinculado a main con vistas previas de otras ramas desactivadas.

## Retirada de campaña
Al terminar la campaña, eliminar el proyecto Cloudflare mariny-catalogo-madres o sustituirlo por un aviso de cierre, según indique Kevin. Conservar la rama y los originales como archivo. Esa acción requiere un encargo de retirada.

Actualización floral del 19/11/2026: fondo crema con estampado tenue de rosas rojas generado con ImageGen, rosas vectoriales que abren y cierran sus pétalos en portada y márgenes, y balanceo del arreglo con estrellas y órbitas. Movimiento CSS pausado fuera de vista y en pestañas ocultas, con respeto por movimiento reducido. Fuentes y prompt en assets/catalogue-design/MEDIA.md. Verificación en tmp/floral-qa.cjs y capturas tmp/floral-*.png.


## Fotografías editadas · 20/11/2026
Las 84 fotografías de los 81 arreglos tienen fondo rosa empolvado y una frase en cursiva vino, alternada por código. Las tomas del mismo producto comparten frase. Archivos web en dist/catalogue/edited, asignados desde products.json; procedencia, prompt y manifiesto en assets/catalogue-edited/. Originales recibidos conservados. JPG para entrega en outputs/mothers-photo-edits/jpg y carpeta de Drive «Mariny · Catálogo Día de las Madres · Imágenes editadas». Tarjetas en proporción 4:5, sin recortar el texto ni el producto; ampliaciones conservan la composición completa.
