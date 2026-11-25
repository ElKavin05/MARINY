const whatsappNumber = '50764609658';
const generalMessage = 'Hola, Mariny Events. Me gustaría consultar sobre la decoración de un evento.';
const whatsappUrl = message => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
document.querySelectorAll('[data-whatsapp]').forEach(link => {
  link.href = whatsappUrl(generalMessage);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

const form = document.querySelector('#event-form');
const occasion = document.querySelector('#occasion');
document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => { occasion.value = link.dataset.service; });
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const fields = form.elements;
  const lines = ['Hola, Mariny Events. Me gustaría consultar una decoración.', `Ocasión: ${fields.occasion.value}.`];
  if (fields.date.value) {
    const [year,month,day] = fields.date.value.split('-');
    lines.push(`Fecha tentativa: ${day}/${month}/${year}.`);
  }
  if (fields.guests.value) lines.push(`Invitados estimados: ${fields.guests.value}.`);
  if (fields.location.value.trim()) lines.push(`Lugar: ${fields.location.value.trim()}.`);
  if (fields.idea.value.trim()) lines.push(`Mi idea: ${fields.idea.value.trim()}`);
  lines.push('¿Podemos conversar sobre disponibilidad y una propuesta?');
  window.open(whatsappUrl(lines.join('\n')), '_blank', 'noopener,noreferrer');
});

const photographs = [
  {
    "id": 8,
    "categories": [
      "Bodas y compromisos"
    ],
    "title": "Flores para dar el sí",
    "alt": "Panel iluminado con arreglos florales para una boda",
    "description": "Una entrada con flores y luz para acompañar el comienzo de su celebración."
  },
  {
    "id": 1,
    "categories": [
      "Bodas y compromisos"
    ],
    "title": "El comienzo de una historia",
    "alt": "Ceremonia de boda con telas blancas y flores a ambos lados",
    "description": "Las flores y las telas enmarcan un momento para recordar juntos."
  },
  {
    "id": 6,
    "categories": [
      "Eventos corporativos"
    ],
    "title": "Flores para recibir a tus invitados",
    "alt": "Salón con mesas vestidas de blanco, centros florales altos y detalles dorados",
    "description": "Un salón preparado con flores blancas, mesas y detalles dorados para acompañar un encuentro especial.",
    "src": "assets/retouched/eventos-corporativos.webp"
  },
  {
    "id": 5,
    "categories": [
      "Despedidas y celebraciones prenupciales"
    ],
    "title": "Una mesa para celebrar a la novia",
    "alt": "Mesa larga para celebración prenupcial con flores blancas, velas, copas verdes y detalles dorados",
    "description": "Flores blancas, velas, copas verdes y detalles dorados en una mesa preparada para compartir una celebración prenupcial.",
    "src": "assets/retouched/cena-prenupcial.webp"
  },
  {
    "id": 3,
    "categories": [
      "Detalles y momentos especiales"
    ],
    "title": "Un detalle para mamá",
    "alt": "Caja floral Mariny con tulipanes rosados, rosas amarillas y espejo con dedicatoria para mamá",
    "description": "Un detalle floral para mamá con tulipanes, rosas, lazos y una dedicatoria que dice lo que sientes.",
    "src": "assets/retouched/detalle-floral-mama.webp"
  },
  {
    "id": 7,
    "categories": [
      "Despedidas y celebraciones prenupciales",
      "Detalles y momentos especiales"
    ],
    "title": "El encanto de lo sencillo",
    "alt": "Rosas rojas en un florero de cristal sobre una mesa",
    "description": "Un toque floral para una mesa especial. Una idea para una cena, una despedida o una sorpresa preparada con cariño."
  },
  {
    "id": 11,
    "categories": [
      "Cumpleaños"
    ],
    "title": "Un cumpleaños entre flores",
    "alt": "Mesa de cumpleaños con flores rosadas, velas y letras Happy Birthday al fondo",
    "description": "Flores rosadas, velas y una mesa preparada con cariño para celebrar un cumpleaños. Las letras con globos acompañan el montaje floral.",
    "src": "assets/retouched/cumpleanos-floral.webp",
    "balloons": true
  },
  {
    "id": 12,
    "categories": [
      "Cumpleaños"
    ],
    "balloons": true,
    "title": "Un cumpleaños lleno de color",
    "alt": "Montaje de cumpleaños con globos de colores y flores",
    "description": "Los globos también pueden acompañar una ocasión: una propuesta alegre para quien disfruta celebrar con color."
  },
  {
    "id": 2,
    "categories": [
      "Detalles y momentos especiales"
    ],
    "balloons": true,
    "title": "Una ocasión especial",
    "alt": "Decoración con globos azules, blancos y dorados y panel con flores",
    "description": "Flores y globos reunidos en un montaje para una fecha importante en familia."
  }
];
const grid = document.querySelector('#gallery-grid');
const dialog = document.querySelector('#photo-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogTitle = document.querySelector('#photo-title');
const position = document.querySelector('#photo-position');
let activePhotos = photographs;
let photoIndex = 0;
let galleryTrigger;
const photoSrc = photo => photo.src || `assets/retouched/evento-${String(photo.id).padStart(2,'0')}.webp`;
function showPhoto() {
  const photo = activePhotos[photoIndex];
  dialogImage.src = photoSrc(photo);
  dialogImage.alt = photo.alt;
  dialogTitle.textContent = photo.title;
  position.textContent = `${photoIndex+1} de ${activePhotos.length}`;
}
function movePhoto(direction) {
  photoIndex = (photoIndex + direction + activePhotos.length) % activePhotos.length;
  showPhoto();
}
function renderGallery(category = 'Todos') {
  activePhotos = category === 'Todos' ? photographs : photographs.filter(photo => category === 'Con globos' ? photo.balloons : photo.categories.includes(category));
  grid.replaceChildren(...activePhotos.map((photo,index) => {
    const button = document.createElement('button');
    button.className = 'gallery-card';
    button.type = 'button';
    button.setAttribute('aria-label', `Ampliar ${photo.title.toLowerCase()}`);
    button.innerHTML = `<div class="gallery-image"><img src="${photoSrc(photo)}" width="540" height="720" loading="lazy" alt="${photo.alt}"></div><div class="gallery-caption"><span>${photo.title}</span><span aria-hidden="true">↗</span></div><p class="gallery-description">${photo.description}</p><span class="photo-action">Ver fotografía <span aria-hidden="true">+</span></span>`;
    button.addEventListener('click', () => {
      photoIndex = index;
      galleryTrigger = button;
      showPhoto();
      dialog.showModal();
    });
    return button;
  }));
  document.querySelector('#gallery-status').textContent = `${activePhotos.length} trabajos. ${category}.`;
}
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
    renderGallery(button.dataset.filter);
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { dialogImage.removeAttribute('src'); galleryTrigger?.focus(); });
dialog.addEventListener('keydown', event => {
  if(event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    movePhoto(event.key === 'ArrowRight' ? 1 : -1);
  }
});
document.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => movePhoto(Number(button.dataset.direction))));
renderGallery();

const motionSurfaces = document.querySelectorAll('.floral-stage,.wave-divider,.brand,.dynamic-frame,.floating-contact,.floral-mark');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('motion-visible', entry.isIntersecting)), {rootMargin:'60px'});
  motionSurfaces.forEach(surface => observer.observe(surface));
}

document.querySelectorAll('.dynamic-frame').forEach(frame => {
  frame.insertAdjacentHTML('afterbegin', '<svg class="frame-trace" viewBox="0 0 500 500" preserveAspectRatio="none" aria-hidden="true"><rect x="1" y="1" width="498" height="498" rx="25" pathLength="100"/></svg><span class="frame-star" aria-hidden="true">✧</span>');
});

document.querySelectorAll('[data-location-city]').forEach(link => {
  link.href = whatsappUrl(`Hola, Mariny Events. Me gustaría consultar el punto de atención en ${link.dataset.locationCity} y coordinar una consulta sobre mi evento.`);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

// Each band keeps its wording fixed; only its two decorative edges play the same loop.
const ribbonVideos=[...document.querySelectorAll('.ribbon-video')];
const ribbonMotion=matchMedia('(prefers-reduced-motion:reduce)');
const visibleRibbons=new Set();
function updateRibbonMotion(){
  for(const video of ribbonVideos){
    const band=video.closest('.ribbon-wave'),edge=video.closest('.ribbon-edge');
    const allowed=visibleRibbons.has(band)&&!document.hidden&&!ribbonMotion.matches&&!navigator.connection?.saveData;
    if(!allowed||!video.canPlayType('video/webm; codecs="vp9"')){video.pause();edge.classList.remove('has-video');continue;}
    if(!video.getAttribute('src'))video.src=video.dataset.src;
    video.play().then(()=>{if(visibleRibbons.has(band)&&!document.hidden&&!ribbonMotion.matches)edge.classList.add('has-video');else updateRibbonMotion();}).catch(()=>edge.classList.remove('has-video'));
  }
}
for(const video of ribbonVideos)video.addEventListener('error',()=>video.closest('.ribbon-edge').classList.remove('has-video'));
ribbonMotion.addEventListener('change',updateRibbonMotion);
document.addEventListener('visibilitychange',updateRibbonMotion);
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)visibleRibbons.add(entry.target);else visibleRibbons.delete(entry.target);}updateRibbonMotion();});document.querySelectorAll('.ribbon-wave').forEach(band=>observer.observe(band));}
