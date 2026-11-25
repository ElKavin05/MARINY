# Fotografías del catálogo · Día de las Madres

Edición solicitada por Kevin el 20/11/2026. Se conservan los originales en `assets/catalogue-originals/`.

## Tratamiento

Edición individual con ImageGen integrado: retirar el entorno, mantener el arreglo y sus accesorios, colocar fondo rosa empolvado aproximado `#F6E4DE`, sombra suave y una frase en cursiva vino `#793844`. Referencia de color y composición proporcionada por Kevin en este chat. No se utiliza la referencia como producto ni se copian sus arreglos.

Frases alternadas por orden de producto: «Feliz día, mamá», «Te amo, mamá», «Eres la mejor mamá». Las tomas alternativas conservan la misma frase. Una foto original por imagen terminada; si el original contiene varios arreglos, se conservan juntos.

## Archivos y trazabilidad

`manifest.json` relaciona cada código, toma, foto original, frase y versiones web. JPG para Drive y originales de las ediciones en `outputs/mothers-photo-edits/`. Las fuentes recibidas no se sobrescriben. Conversión y optimización con Sharp; las modificaciones visuales se realizan con ImageGen.

## Prompt base

Edit the supplied product photograph, not create a different bouquet. Isolate ONLY the exact floral arrangement and all its attached wrapping, vase/base/basket, ribbons, leaves, decorative cards and balloons. Preserve flower types, colors, number, relative placement, camera angle and real details as closely as possible. Remove the entire surrounding room, furniture, people/hands, table, outdoor scenery, screenshot UI and promotional layout outside the product. Do not invent missing/cropped parts or add flowers, ribbons or accessories. Place it on a clean pale dusty blush background #F6E4DE, very subtle studio light and soft contact shadow. Portrait 4:5 composition with comfortable margins. Keep the visible product large and fully inside frame; do not crop more of it. Leave a clean top margin for ONE small elegant italic calligraphic dark wine #793844 caption, centered, exact text: PHRASE. Caption must not overlap product. No other new lettering, border, logo, decorations, collage or extra products. Existing lettering physically attached to product stays unchanged. Realistic faithful catalogue background replacement, no stylized repainting.

PHRASE se sustituye por la frase asignada. Se añaden instrucciones puntuales para fotos con varios arreglos, publicidad externa o accesorios particulares. Revisión visual comparada con la fuente antes de publicar.


## Nuevos arreglos · 25/11/2026

Ocho diseños MAD-085…MAD-092 añadidos al inicio, sin renumerar ni modificar los81productos existentes. Total89productos y97fotografías.13originales recibidos por Kevin, identificados en nov25-sources.json(SHA-256). Se conservan localmente en assets/catalogue-originals/nov25/; no se sobrescriben ni se publican en bruto. La foto conjunta es la tercera toma de MAD-086, con aclaración visible de que la consulta corresponde a la canasta de primer plano. Precios null y categoría Arreglos en base; cantidades y mensajes de WhatsApp conservados.

El 25/11/2026 Kevin pidió retirar las tarjetas físicas «Para mamá, con amor» y aumentar ligeramente la nitidez. Se eliminó su composición de la receta. Las tres tomas de la canasta se retocan con textura fotográfica de la misma canasta; ocho tomas utilizan reparaciones locales de ImageGen integrado, recortadas y conservadas en assets/catalogue-edited/card-removal/. Solo esas zonas sustituyen los píxeles tapados por las tarjetas; el resto procede del original. El fondo rosa, las frases cursivas superiores y la composición se conservan. Enfoque moderado: UnsharpMask radio0.9/85%/umbral2. Los originales permanecen intactos. La eliminación localizada incluye reconstrucción de zonas ocultas, por lo que esta corrección ya no se describe como un proceso enteramente no generativo. Las reparaciones y sus posiciones quedan en patches.json; prepare-mothers-nov25.py y export-mothers-nov25.cjs reproducen los26WebP.89productos/97fotos; datos, portada, videos y84fotografías anteriores sin cambios.


25/11/2026, excepción MAD-088 «Jardín en rosa»: por petición expresa de Kevin, usar la fotografía original sin ninguna edición, con fondo, tarjeta y encuadre originales. Publicada como catalogue/original/MAD-088.jpg; copia JPEG idéntica por bytes a assets/catalogue-originals/nov25/photo-88.jpg(278099bytes,1200×1600). useOriginal:true impide volver a aplicar recorte, frase o eliminación de tarjeta al reproducir el lote. Solo cambian src/full de esa fotografía; resto de productos e imágenes activos intactos.
