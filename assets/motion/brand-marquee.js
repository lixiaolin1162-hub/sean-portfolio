const marquee = document.querySelector('[data-brand-marquee]');
const grid = marquee.querySelector('.brand-grid');
const toggle = marquee.querySelector('.brand-motion');
const template = grid.querySelector('template');
let visible = false;

function setActivity() {
  marquee.toggleAttribute('data-motion-visible', visible && !document.hidden);
}

function mountLogos() {
  template.replaceWith(template.content);
  for (const track of marquee.querySelectorAll('.brand-track')) {
    const logos = track.querySelector('.brand-logos');
    const copy = logos.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    track.style.setProperty('--logo-count', logos.children.length);
    track.append(copy);
  }
  marquee.setAttribute('data-animated', '');
}

toggle.addEventListener('click', () => {
  const paused = marquee.toggleAttribute('data-paused');
  toggle.textContent = paused ? '继续滚动' : '暂停滚动';
});
toggle.hidden = false;

if ('IntersectionObserver' in window) {
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    setActivity();
  });
  const loader = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    loader.disconnect();
    mountLogos();
    visibility.observe(grid);
  }, { rootMargin: '160px 0px' });
  loader.observe(grid);
} else {
  mountLogos();
  visible = true;
  setActivity();
}
document.addEventListener('visibilitychange', setActivity);
