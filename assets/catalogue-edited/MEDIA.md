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

Este lote conserva el estilo anterior mediante edición no generativa: máscara BiRefNet-general-lite, RGB original, retoque moderado, fondo#F6E4DE,sombra y tipografía cursiva vino#793844. No se recrean flores ni partes que ya estaban cortadas. Tarjetas físicas adaptadas a Para mamá,con amor,con perspectiva y oclusiones; logotipos conservados. En la foto86 se retira el sobreimpreso promocional externo usando textura de la toma limpia del mismo producto. Las tomas de cada diseño mantienen la misma frase.26WebP a720/1120px,maestros1120×1400; todas las imágenes4:5. Maestros y máscaras en tmp/mothers-nov25,recetas en scripts/prepare-mothers-nov25.py y export-mothers-nov25.cjs. Para reproducir:Python3.12 con rembg[cpu]2.0.88,Pillow,numpy y OpenCV; Times Italic del sistema; U2NET_HOME apunta al modelo local. Ejecutar prepare con --segment si faltan máscaras,luego export con Sharp vía SHARP_MODULE. Manifiesto nov25-manifest.json y relación nov25-products.json. Sin cambios en portada,videos,Excel,Drive ni web principal.
