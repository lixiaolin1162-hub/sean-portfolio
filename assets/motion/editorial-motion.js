const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const groups = [
    ['#work .motion-section-title', 'feature-title', 0, 0],
    ['.motion-section-title:not(#work .motion-section-title)', 'chapter-title', 0, 0],
    ['.brand-title, .work-title, .case-chapter > h2, .career-details > h2, #contact > h2', 'headline', 120, 0],
    ['.case-intro', 'copy', 185, 0],
    ['.brand-grid', 'brand-wall', 220, 0],
    ['.work-entry', 'project', 245, 135],
    ['.case-points > div, .contact-grid > div', 'note', 135, 80],
    ['.case-metrics > div', 'metric', 180, 110],
    ['.case-figures.is-wide .case-figure, .case-figure.is-wide, .career-portrait', 'wide-image', 135, 0],
    ['.case-figures:not(.is-wide) .case-figure:not(.is-wide)', 'image', 120, 115],
    ['.case-swatch', 'swatch', 135, 0],
  ];

  const entrances = new Map();
  const counters = new Set();
  let frame = 0;

  for (const [selector, kind, lead, stagger] of groups) {
    for (const target of document.querySelectorAll(selector)) {
      const number = kind === 'metric' ? target.querySelector('.count-up') : null;
      const index = stagger ? [...target.parentElement.children].indexOf(target) : 0;
      const delay = lead + Math.min(index, 3) * stagger;
      entrances.set(target, { kind, delay, number, initial: true, belowFold: false });
    }
  }

  const observer = new IntersectionObserver((entries) => {
    const viewportEdge = window.innerHeight;
    for (const { target, isIntersecting, boundingClientRect } of entries) {
      const entrance = entrances.get(target);
      if (entrance.initial) {
        entrance.initial = false;
        entrance.belowFold = boundingClientRect.top >= viewportEdge;
        if (entrance.belowFold) {
          target.dataset.motionKind = entrance.kind;
          target.style.setProperty('--motion-delay', entrance.delay + 'ms');
        } else if (!entrance.number) {
          observer.unobserve(target);
          continue;
        }
      }
      if (!isIntersecting && boundingClientRect.bottom > 0) continue;
      observer.unobserve(target);
      const { delay, belowFold, number } = entrance;
      if (!isIntersecting) {
        finish(target);
        continue;
      }
      if (belowFold) target.setAttribute('data-motion-play', '');
      if (number) startCount(number, belowFold ? delay + 210 : 90);
    }
  }, { rootMargin: '0px 0px -10% 0px' });

  function finish(target) {
    target.removeAttribute('data-motion-kind');
    target.removeAttribute('data-motion-play');
    target.style.removeProperty('--motion-delay');
  }

  function endCount(counter) {
    counter.output.remove();
    counter.number.classList.remove('is-counting');
    counters.delete(counter);
  }

  function tick(now) {
    frame = 0;
    for (const counter of counters) {
      const progress = (now - counter.start) / 1280;
      if (progress < 0) continue;
      if (progress >= 1) {
        endCount(counter);
        continue;
      }
      counter.number.classList.add('is-counting');
      const eased = 1 - (1 - progress) ** 2.65;
      const next = Math.min(counter.value - counter.step, Math.floor(counter.value * eased / counter.step) * counter.step);
      const text = counter.formatter.format(Math.max(0, next));
      if (counter.output.textContent !== text) counter.output.textContent = text;
    }
    if (counters.size) frame = requestAnimationFrame(tick);
  }

  function startCount(number, delay) {
    const finalText = number.firstElementChild.textContent.trim();
    const value = Number(finalText.replaceAll(',', ''));
    const decimals = finalText.split('.')[1]?.length ?? 0;
    const output = document.createElement('span');
    output.setAttribute('aria-hidden', 'true');
    output.className = 'count-up-output';
    number.append(output);
    counters.add({
      number, output, value, step: 10 ** -decimals,
      formatter: new Intl.NumberFormat('en-US', {
        useGrouping: finalText.includes(','),
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
      start: performance.now() + delay,
    });
    if (!frame) frame = requestAnimationFrame(tick);
  }

  for (const target of entrances.keys()) observer.observe(target);

  document.addEventListener('animationend', ({ target }) => {
    if (target.hasAttribute('data-motion-play')) finish(target);
    if (target.matches('.hero h1 > span:last-child > span')) {
      document.documentElement.classList.remove('opening');
    }
  });
  document.addEventListener('focusin', ({ target }) => {
    const pending = target.closest('[data-motion-kind]');
    if (pending) {
      observer.unobserve(pending);
      finish(pending);
    }
  });
  reduceMotion.addEventListener('change', ({ matches }) => {
    if (!matches) return;
    document.documentElement.classList.remove('opening');
    observer.disconnect();
    for (const target of entrances.keys()) finish(target);
    cancelAnimationFrame(frame);
    frame = 0;
    for (const counter of counters) endCount(counter);
  });
}
