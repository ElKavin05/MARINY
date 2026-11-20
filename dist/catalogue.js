const productsContainer = document.querySelector('#products');
const counter = document.querySelector('#result-count');
const errorNotice = document.querySelector('#load-error');
const gallery = document.querySelector('#gallery');
const galleryPhoto = document.querySelector('#gallery-photo');
const galleryTitle = document.querySelector('#gallery-title');
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
    productsContainer.innerHTML = products.map(product => {
      const image = product.images[0];
      return `<article class="card" data-id="${escapeHtml(product.id)}" data-category="${escapeHtml(product.category)}">
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
loadProducts();
