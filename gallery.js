const links = Array.from(document.querySelectorAll('[data-gallery] a'));
const dialog = document.querySelector('#lightbox');

if (links.length && typeof dialog?.showModal === 'function') {
  const image = dialog.querySelector('img');
  const position = dialog.querySelector('output');
  const previous = dialog.querySelector('[data-prev]');
  const next = dialog.querySelector('[data-next]');
  const close = dialog.querySelector('[data-close]');
  let selected = 0;
  let trigger;

  function show(index) {
    if (index < 0 || index >= links.length) return;
    selected = index;
    image.src = links[index].href;
    image.alt = links[index].querySelector('img').alt;
    position.textContent = (index + 1) + ' / ' + links.length;
    previous.disabled = index === 0;
    next.disabled = index === links.length - 1;
  }

  links.forEach((link, index) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      show(index);
      dialog.showModal();
      close.focus();
    });
  });
  previous.addEventListener('click', () => show(selected - 1));
  next.addEventListener('click', () => show(selected + 1));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => trigger?.focus());
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(selected + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
}
