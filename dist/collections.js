(() => {
  'use strict';
  const shell = document.querySelector('#colecciones');
  if (!shell) return;
  const grids = { floral: document.querySelector('#floral-collection'), events: document.querySelector('#event-collection') };
  const counts = { floral: 0, events: 0 };
  const more = { floral: document.querySelector('#floral-more'), events: document.querySelector('#event-more') };
  const dialog = document.querySelector('#collection-dialog');
  const image = dialog.querySelector('img');
  const title = dialog.querySelector('h3');
  const caption = dialog.querySelector('figcaption');
  const position = dialog.querySelector('[data-collection-position]');
  const inquiry = dialog.querySelector('[data-collection-inquiry]');
  const imageStatus = dialog.querySelector('.collection-dialog-image-status');
  let data, pending, slides = [], slideIndex = 0, trigger;
  const urlFor = item => {
    const reference = new URL(`#${item.id}`, location.href);
    reference.search = '';
    return `https://wa.me/50764609658?text=${encodeURIComponent(`Hola, Mariny Events. Me gustaría consultar este arreglo floral.\nCódigo: ${item.id}\nArreglo: ${item.name}\nReferencia: ${reference.href}\n¿Podrían indicarme el precio y la disponibilidad?`)}`;
  };
  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }
  function showSlide() {
    const current = slides[slideIndex];
    imageStatus.textContent = 'Cargando fotografía…';
    image.alt = current.alt;
    image.src = current.full;
    title.textContent = current.name;
    caption.textContent = current.description || '';
    position.textContent = `${slideIndex + 1} / ${slides.length}`;
    dialog.querySelectorAll('[data-collection-direction]').forEach(b => b.disabled = slides.length < 2);
  }
  image.addEventListener('load', () => { imageStatus.textContent = ''; });
  image.addEventListener('error', () => { imageStatus.textContent = 'No se pudo cargar la foto. Usa las flechas para continuar o vuelve a abrirla.'; });
  function openPhoto(item, type, button) {
    trigger = button;
    slides = type === 'floral'
      ? item.images.map(photo => ({ ...photo, name: `${item.id} · ${item.name}`, description: item.description }))
      : data.events.map(event => ({ ...event.image, name: event.name, description: event.description }));
    slideIndex = type === 'floral' ? 0 : data.events.indexOf(item);
    inquiry.hidden = type !== 'floral';
    if (type === 'floral') inquiry.href = urlFor(item);
    showSlide();
    dialog.showModal();
  }
  function card(item, type) {
    const article = node('article', `collection-card${type === 'events' ? ' collection-event' : ''}`);
    article.id = item.id;
    const photo = type === 'floral' ? item.images[0] : item.image;
    const button = node('button', 'collection-photo');
    button.type = 'button';
    button.setAttribute('aria-label', `Ampliar ${type === 'floral' ? `${item.id} · ` : ''}${item.name}`);
    const img = node('img');
    Object.assign(img, { src: photo.thumb, alt: photo.alt, width: photo.width, height: photo.height, loading: 'lazy', decoding: 'async' });
    const zoom = node('span', 'collection-zoom', '+');
    zoom.setAttribute('aria-hidden', 'true');
    button.append(img, zoom);
    button.addEventListener('click', () => openPhoto(item, type, button));
    const meta = node('div', 'collection-meta');
    meta.append(node('h3', '', item.name));
    if (type === 'floral') meta.append(node('small', '', item.id));
    article.append(button, meta, node('p', '', item.description));
    if (type === 'floral') {
      const link = node('a', 'collection-consult', 'Consultar este arreglo');
      Object.assign(link, { href: urlFor(item), target: '_blank', rel: 'noopener noreferrer' });
      link.setAttribute('aria-label', `Consultar arreglo ${item.id}, ${item.name} por WhatsApp`);
      const arrow = node('span', '', '↗'); arrow.setAttribute('aria-hidden', 'true');
      link.append(arrow);
      article.append(link);
    }
    return article;
  }
  function reveal(type, amount, focus = false) {
    const items = data[type];
    const next = items.slice(counts[type], counts[type] + amount).map(item => card(item, type));
    grids[type].append(...next);
    counts[type] += next.length;
    const label = type === 'floral' ? 'arreglos' : 'fotografías';
    document.querySelector(`#${type === 'floral' ? 'floral' : 'event'}-status`).textContent = `${counts[type]} de ${items.length} ${label}`;
    more[type].hidden = counts[type] >= items.length;
    if (focus && next[0]) next[0].querySelector('button').focus({ preventScroll: true });
  }
  Object.keys(more).forEach(type => more[type].addEventListener('click', () => reveal(type, 9, true)));
  function followHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!/^FL-\d{3}$/.test(id) || !data) return;
    const index = data.floral.findIndex(item => item.id === id);
    if (index < 0) return;
    if (index >= counts.floral) reveal('floral', Math.ceil((index + 1 - counts.floral) / 9) * 9);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' }));
  }
  function setupVideos() {
    const track = document.querySelector('#collection-videos');
    const previous = document.querySelector('#clip-previous'), next = document.querySelector('#clip-next');
    for (const [index, clip] of data.videos.entries()) {
      const figure = node('figure', 'collection-video');
      const stage = node('div', 'collection-video-stage');
      const video = node('video');
      Object.assign(video, { poster: clip.poster, preload: 'none', playsInline: true });
      video.setAttribute('aria-label', clip.name);
      const play = node('button', 'collection-play', '▶ Ver video');
      play.type = 'button'; play.setAttribute('aria-label', `Reproducir ${clip.name}`);
      const status = node('p', 'collection-video-status'); status.setAttribute('role', 'status');
      play.addEventListener('click', () => {
        video.src = clip.src; video.controls = true;
        play.hidden = true;
        video.play().then(() => video.focus()).catch(() => { play.hidden = false; status.textContent = 'No se pudo iniciar. Inténtalo de nuevo.'; });
      });
      video.addEventListener('play', () => { track.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); }); status.textContent = ''; });
      video.addEventListener('error', () => { status.textContent = 'No se pudo cargar el video. Inténtalo de nuevo.'; play.hidden = false; });
      stage.append(video, play);
      figure.append(stage, node('figcaption', '', clip.name), node('p', 'clip-duration', clip.duration < 1 ? 'Menos de 1 segundo' : `${Math.round(clip.duration)} segundos`), status);
      figure.dataset.clip = index;
      track.append(figure);
    }
    const videos = [...track.querySelectorAll('video')];
    function updateTrack() {
      const box = track.getBoundingClientRect();
      videos.forEach(video => { const r = video.getBoundingClientRect(); if (r.left < box.left - 2 || r.right > box.right + 2) video.pause(); });
      previous.disabled = track.scrollLeft < 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      const stride = track.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
      const first = Math.round(track.scrollLeft / stride) + 1;
      const visible = Math.max(1, Math.round((track.clientWidth + parseFloat(getComputedStyle(track).columnGap)) / stride));
      document.querySelector('#clip-position').textContent = `${first}–${Math.min(data.videos.length, first + visible - 1)} de ${data.videos.length}`;
    }
    for (const [button, direction] of [[previous, -1], [next, 1]]) button.addEventListener('click', () => {
      videos.forEach(video => video.pause());
      const stride = track.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
      track.scrollBy({ left: direction * stride, behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth' });
    });
    track.addEventListener('scroll', updateTrack, { passive: true });
    new ResizeObserver(updateTrack).observe(track);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) entry.target.pause(); }), { threshold: 0 });
    videos.forEach(video => observer.observe(video));
    document.addEventListener('visibilitychange', () => { if (document.hidden) videos.forEach(video => video.pause()); });
    updateTrack();
  }
  async function load() {
    if (data) return;
    if (pending) return pending;
    pending = (async () => {
      try {
        const response = await fetch('collections.json?v=1');
        if (!response.ok) throw new Error('Colecciones no disponibles');
        const result = await response.json();
        if (!Array.isArray(result.floral) || !Array.isArray(result.events) || !Array.isArray(result.videos)) throw new Error('Datos incompletos');
        data = result;
        shell.querySelector('.collection-loading').hidden = true;
        shell.querySelector('.collection-retry').hidden = true;
        reveal('floral', 3); reveal('events', 3); setupVideos(); followHash();
      } catch (_) {
        shell.querySelector('.collection-loading').textContent = 'No pudimos cargar las colecciones. Puedes intentarlo de nuevo.';
        shell.querySelector('.collection-retry').hidden = false;
      } finally { pending = null; }
    })();
    return pending;
  }
  shell.querySelector('.collection-retry').addEventListener('click', load);
  dialog.querySelector('[data-collection-close]').addEventListener('click', () => dialog.close());
  const move = direction => { slideIndex = (slideIndex + direction + slides.length) % slides.length; showSlide(); };
  dialog.querySelectorAll('[data-collection-direction]').forEach(button => button.addEventListener('click', () => move(Number(button.dataset.collectionDirection))));
  dialog.addEventListener('keydown', event => {
    if (['ArrowRight', 'ArrowLeft'].includes(event.key)) { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
    if (event.key === 'Tab') {
      const controls = [...dialog.querySelectorAll('button:not(:disabled),a[href]')].filter(element => element.getClientRects().length);
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  dialog.addEventListener('close', () => { image.removeAttribute('src'); trigger?.focus({ preventScroll: true }); });
  window.addEventListener('hashchange', () => { if (/^#FL-\d{3}$/.test(location.hash)) load().then(followHash); });
  if (/^#FL-\d{3}$/.test(location.hash)) load();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { load(); observer.disconnect(); } }, { rootMargin: '350px' });
    observer.observe(shell);
  } else load();
})();
