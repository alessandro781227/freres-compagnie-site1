/* Galerie photos sans dépendance externe : fonctionnement tactile + clavier.
   Tous les liens restent de simples fichiers ouvrables sans JavaScript. */
(() => {
  const dialog = document.getElementById('photo-viewer');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const photo = dialog.querySelector('.photo-viewer-image');
  const caption = dialog.querySelector('.photo-viewer-caption');
  const prev = dialog.querySelector('.photo-viewer-prev');
  const next = dialog.querySelector('.photo-viewer-next');
  const close = dialog.querySelector('.photo-viewer-close');
  const photoLinks = [...document.querySelectorAll('a[data-gallery]')];
  let current = [];
  let selected = 0;
  let touchStartX = null;

  const render = () => {
    if (!current.length) return;
    const link = current[selected];
    const source = link.querySelector('img');
    photo.src = link.href;
    photo.alt = source ? source.alt : 'Photographie du chantier';
    caption.textContent = photo.alt + ' · ' + (selected + 1) + ' / ' + current.length;
    prev.hidden = next.hidden = current.length <= 1;
  };
  const move = (step) => {
    if (current.length <= 1) return;
    selected = (selected + step + current.length) % current.length;
    render();
  };

  photoLinks.forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const gallery = link.dataset.gallery;
    current = photoLinks.filter(item => item.dataset.gallery === gallery);
    selected = current.indexOf(link);
    if (selected < 0) return;
    event.preventDefault();
    render();
    if (!dialog.open) dialog.showModal();
  }));

  close.addEventListener('click', () => dialog.close());
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  });
  photo.addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0]?.screenX ?? null;
  }, {passive:true});
  photo.addEventListener('touchend', event => {
    if (touchStartX === null) return;
    const dx = (event.changedTouches[0]?.screenX ?? touchStartX) - touchStartX;
    if (Math.abs(dx) > 55) move(dx > 0 ? -1 : 1);
    touchStartX = null;
  }, {passive:true});
  dialog.addEventListener('close', () => {
    photo.removeAttribute('src');
    current = [];
  });
})();
