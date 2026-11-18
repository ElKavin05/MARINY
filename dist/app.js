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
  {id:8,category:'Bodas',title:'Flores para dar el sí',alt:'Panel iluminado con arreglos florales para una boda'},
  {id:12,category:'Celebraciones',title:'Un cumpleaños lleno de color',alt:'Montaje de cumpleaños con globos de colores y flores'},
  {id:5,category:'Detalles',title:'La mesa también celebra',alt:'Servilleta con aro dorado, plato y copa verde sobre una mesa preparada'},
  {id:2,category:'Celebraciones',title:'Una ocasión especial',alt:'Decoración con globos azules, blancos y dorados y panel con flores'},
  {id:3,category:'Detalles',title:'Flores con personalidad',alt:'Arreglo de flores amarillas, rosadas, moradas y blancas'},
  {id:6,category:'Bodas',title:'Encuentros alrededor de la mesa',alt:'Mesa con velas, cristalería y flores blancas'},
  {id:7,category:'Detalles',title:'El encanto de lo sencillo',alt:'Rosas rojas en un florero de cristal sobre una mesa de celebración'},
  {id:1,category:'Bodas',title:'El comienzo de una historia',alt:'Ceremonia de boda con telas blancas y flores a ambos lados'},
  {id:11,category:'Celebraciones',title:'Una mesa para compartir',alt:'Mesa de celebración con flores blancas y amarillas y copas'},
];
const photographDescriptions = ["Una entrada que invita a vivir el gran día: flores y luz para acompañar ese primer momento de la celebración.", "Una idea llena de alegría, con globos y detalles que convierten un cumpleaños en un mundo propio.", "El encanto de sentarse a compartir: texturas, cristalería y pequeños detalles que hacen sentir bienvenidos a tus invitados.", "Un montaje para celebrar una fecha importante en familia, con una combinación de globos y flores que enmarca el momento.", "Flores que se encuentran en una composición con carácter. Una inspiración para llevar tu estilo a los detalles de tu evento.", "Una mesa que invita a quedarse: flores, velas y cristalería pensadas para acompañar la conversación.", "Un toque floral puede cambiar por completo una mesa. Los detalles sencillos también cuentan una historia.", "El entorno acompaña a quienes celebran. Una ceremonia donde las flores y las telas enmarcan un nuevo comienzo.", "Una mesa preparada para recibir, compartir y disfrutar. Cuéntanos cómo imaginas la de tu próxima celebración."];
const grid = document.querySelector('#gallery-grid');
const dialog = document.querySelector('#photo-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogTitle = document.querySelector('#photo-title');
const position = document.querySelector('#photo-position');
let activePhotos = photographs;
let photoIndex = 0;
let galleryTrigger;
const photoSrc = photo => `assets/evento-${String(photo.id).padStart(2,'0')}.webp`;
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
  activePhotos = category === 'Todos' ? photographs : photographs.filter(photo => photo.category === category);
  grid.replaceChildren(...activePhotos.map((photo,index) => {
    const button = document.createElement('button');
    button.className = 'gallery-card';
    button.type = 'button';
    button.setAttribute('aria-label', `Ampliar ${photo.title.toLowerCase()}`);
    button.innerHTML = `<div class="gallery-image"><img src="${photoSrc(photo)}" width="540" height="720" loading="lazy" alt="${photo.alt}"></div><div class="gallery-caption"><span>${photo.title}</span><span aria-hidden="true">↗</span></div><p class="gallery-description">${photographDescriptions[photographs.indexOf(photo)]}</p><span class="photo-action">Ver fotografía <span aria-hidden="true">+</span></span>`;
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

const motionToggle = document.querySelector('.motion-toggle');
motionToggle.addEventListener('click', () => {
  const paused = document.documentElement.classList.toggle('motion-paused');
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.setAttribute('aria-label', paused ? 'Reanudar las animaciones de la página' : 'Pausar las animaciones de la página');
  motionToggle.innerHTML = paused ? 'Reanudar animación <span aria-hidden="true">▷</span>' : 'Pausar animación <span aria-hidden="true">Ⅱ</span>';
});

document.querySelectorAll('.dynamic-frame').forEach(frame => {
  frame.insertAdjacentHTML('afterbegin', '<svg class="frame-trace" viewBox="0 0 500 500" preserveAspectRatio="none" aria-hidden="true"><rect x="1" y="1" width="498" height="498" rx="25" pathLength="100"/></svg><span class="frame-star" aria-hidden="true">✧</span>');
});

document.querySelectorAll('.ribbon-divider').forEach(ribbon => {
  const fallback = document.createElement('span');
  fallback.className = 'ribbon-static';
  fallback.setAttribute('aria-hidden','true');
  const start = document.createElement('span'); start.className='static-star'; start.textContent='✦';
  const phrase = document.createElement('span'); phrase.textContent=ribbon.getAttribute('aria-label');
  fallback.append(start, phrase, start.cloneNode(true)); ribbon.append(fallback);
});
