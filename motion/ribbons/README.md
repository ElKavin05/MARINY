# Bordes de olas · Mariny

Fuente editable HyperFrames, 960×64 px, 6 segundos, 24 fps. GSAP local con licencia conservada. Un ciclo desplaza el patrón SVG 320 px con velocidad constante; las fases inicial/final coinciden. Sin texto ni audio dentro del video.

Validar con `hyperframes check`; exportar desde esta carpeta con `hyperframes render --format webm --crf 20 --fps 24 --workers 1 -o ../../dist/assets/ribbon-wave.webm`.

La web reutiliza el mismo archivo transparente en ambos bordes, con el inferior invertido. El centro negro y la frase HTML permanecen fijos. SVG estático para accesibilidad, ahorro de datos o navegador sin VP9. Recurso 255925 bytes; carga al entrar en pantalla. QA 2026-11-25: check sin errores/avisos y cinco anchuras de navegador.
