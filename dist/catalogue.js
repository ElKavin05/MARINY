const productsContainer = document.querySelector('#products');
const counter = document.querySelector('#result-count');
const errorNotice = document.querySelector('#load-error');
const gallery = document.querySelector('#gallery');
const galleryPhoto = document.querySelector('#gallery-photo');
const galleryTitle = document.querySelector('#gallery-title');
const galleryCaption = document.querySelector('#gallery-caption-note');
const position = document.querySelector('#gallery-position');
const previous = document.querySelector('#previous-photo');
const next = document.querySelector('#next-photo');
const number = '50764609658';
let products = [];
let currentProduct;
let photoIndex = 0;
let returnFocus;
let activeCategory = 'Todos';

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;'}[char]));
}
function priceLabel(product) {
  return Number.isFinite(product.price) && product.price >= 0
    ? '$' + product.price.toFixed(2)
    : 'Precio por confirmar';
}
function applyCategory() {
  let shown = 0;
  for (const card of productsContainer.children) {
    card.hidden = activeCategory !== 'Todos' && card.dataset.category !== activeCategory;
    if (!card.hidden) shown++;
  }
  counter.textContent = shown + (shown === 1 ? ' arreglo' : ' arreglos');
}
async function loadProducts() {
  errorNotice.hidden = true;
  counter.textContent = 'Cargando arreglos…';
  try {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error('No se pudo cargar el catálogo.');
    products = await response.json();
    productsContainer.innerHTML = products.map((product, index) => {
      const image = product.images[0];
      return `<article class="card" data-id="${escapeHtml(product.id)}" data-category="${escapeHtml(product.category)}">
        ${index % 9 === 0 ? '<span class="bloom-slot card-rose" data-bloom-rose aria-hidden="true"></span>' : ''}
        <button class="photo-button" type="button" data-gallery="${escapeHtml(product.id)}" aria-label="Ver fotografías de ${escapeHtml(product.name)}">
          <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" width="720" height="900" loading="lazy" decoding="async">
          <span class="zoom-label">${product.images.length > 1 ? product.images.length + ' fotografías · ' : ''}Ampliar ↗</span>
        </button>
        <p class="product-code">${escapeHtml(product.id)}</p><h3>${escapeHtml(product.name)}</h3>
        <p class="description">${escapeHtml(product.description)}</p>
        <form class="purchase" data-product="${escapeHtml(product.id)}">
          <p class="price">${priceLabel(product)}</p>
          <div class="quantity-row"><label for="qty-${product.id}">Cantidad de arreglos</label><input id="qty-${product.id}" name="quantity" type="number" min="1" step="1" value="1" required inputmode="numeric"></div>
          <button type="submit" class="button">Consultar este arreglo <span aria-hidden="true">↗</span></button>
        </form>
      </article>`;
    }).join('');
    installRoses();
    applyCategory();
  } catch (error) {
    counter.textContent = 'Catálogo temporalmente no disponible.';
    errorNotice.hidden = false;
  }
}
document.querySelector('#retry').addEventListener('click', loadProducts);
for (const button of document.querySelectorAll('[data-filter]')) {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    applyCategory();
  });
}
productsContainer.addEventListener('input', event => {
  if (event.target.name === 'quantity') event.target.setCustomValidity('');
});
productsContainer.addEventListener('submit', event => {
  const form = event.target.closest('.purchase');
  if (!form) return;
  event.preventDefault();
  const quantity = Number(form.elements.quantity.value);
  form.elements.quantity.setCustomValidity(Number.isSafeInteger(quantity) && quantity > 0 ? '' : 'Elige una cantidad entera mayor que cero.');
  if (!form.reportValidity()) return;
  const product = products.find(item => item.id === form.dataset.product);
  const lines = [
    'Hola, Mariny. Quisiera solicitar un arreglo del catálogo del Día de las Madres.',
    'Código: ' + product.id,
    'Arreglo: ' + product.name,
    'Descripción: ' + product.description,
    'Cantidad: ' + quantity,
    'Precio unitario: ' + priceLabel(product),
    'Referencia: ' + new URL(product.images[0].full, location.href).href,
    '¿Podrías confirmarme precio, disponibilidad y opciones de entrega o retiro?'
  ];
  window.open('https://wa.me/' + number + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener,noreferrer');
});
function renderGalleryPhoto() {
  const image = currentProduct.images[photoIndex];
  galleryPhoto.src = image.full;
  galleryPhoto.alt = image.alt;
  galleryTitle.textContent = currentProduct.name;
  galleryCaption.textContent = image.caption || '';
  galleryCaption.hidden = !image.caption;
  position.textContent = 'Foto ' + (photoIndex + 1) + ' de ' + currentProduct.images.length;
  previous.disabled = currentProduct.images.length < 2;
  next.disabled = currentProduct.images.length < 2;
}
productsContainer.addEventListener('click', event => {
  const trigger = event.target.closest('[data-gallery]');
  if (!trigger) return;
  currentProduct = products.find(item => item.id === trigger.dataset.gallery);
  photoIndex = 0;
  returnFocus = trigger;
  renderGalleryPhoto();
  gallery.showModal();
});
function changePhoto(delta) {
  photoIndex = (photoIndex + delta + currentProduct.images.length) % currentProduct.images.length;
  renderGalleryPhoto();
}
previous.addEventListener('click', () => changePhoto(-1));
next.addEventListener('click', () => changePhoto(1));
document.querySelector('#close-gallery').addEventListener('click', () => gallery.close());
gallery.addEventListener('close', () => returnFocus?.focus());
gallery.addEventListener('click', event => {
  if (event.target !== gallery) return;
  const box = gallery.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) gallery.close();
});
gallery.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    changePhoto(event.key === 'ArrowLeft' ? -1 : 1);
  }
});

// Rosas vectoriales originales, con pétalos independientes para el ciclo de apertura.
const petalAngles = [-64, -32, 0, 32, 64];
const roseArtwork = `<svg class="bloom-rose" viewBox="0 0 120 155" focusable="false" aria-hidden="true">
  <path d="M60 71 C54 93 67 111 57 145" fill="none" stroke="#7f8d6d" stroke-width="2"/>
  <path d="M60 115 C39 117 30 105 25 98 C44 94 57 101 60 115Z" fill="#889c78"/>
  <path d="M61 102 C81 103 92 88 94 82 C76 83 64 89 61 102Z" fill="#7b916d"/>
  ${petalAngles.map((angle,index) => `<g transform="rotate(${angle} 60 75)"><g class="petal outer-petal" style="--petal-delay:${index * -.3}s"><path d="M60 77 C35 69 24 44 38 28 C51 16 76 35 60 77Z" fill="${['#9d3048','#c34357','#b92f46','#cf5263','#a82f45'][index]}"/><path d="M60 74 C49 58 42 41 43 30" fill="none" stroke="#ed9aa1" stroke-width=".8" opacity=".5"/></g></g>`).join('')}
  ${[-28,8,40].map((angle,index) => `<g transform="rotate(${angle} 60 73)"><g class="petal inner-petal" style="--petal-delay:${index * -.25}s"><path d="M60 77 C40 64 39 44 51 36 C66 30 78 50 60 77Z" fill="${['#b43149','#d45a6b','#9e283f'][index]}"/></g></g>`).join('')}
  <path class="rose-heart" d="M59 74 C46 64 48 51 58 48 C70 44 78 57 67 65 C62 69 53 62 59 57 C63 54 69 58 65 62" fill="#b52f47" stroke="#f0a5ac" stroke-width="1.1"/>
</svg>`;
const floralObserver = new IntersectionObserver(entries => {
  for (const entry of entries) entry.target.classList.toggle('motion-visible', entry.isIntersecting);
}, {rootMargin:'40px'});
function installRoses() {
  for (const slot of document.querySelectorAll('[data-bloom-rose]:not([data-rose-ready])')) {
    slot.innerHTML = roseArtwork;
    slot.dataset.roseReady = 'true';
    floralObserver.observe(slot);
  }
}
document.addEventListener('visibilitychange', () => {
  document.body.classList.toggle('floral-hidden', document.hidden);
});
for (const decoration of document.querySelectorAll('.hero-floral-stage')) floralObserver.observe(decoration);
installRoses();
loadProducts();
