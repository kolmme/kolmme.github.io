// Lo que comparten el portafolio y la página de Orbyte: menú fijo, aparecer al bajar, luz del cursor. (Solo en inglés.)
(() => {
  'use strict';
  const raiz = document.documentElement;
  raiz.classList.add('js');
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.Portafolio = { quieto };

  /* ---------- menú fijo y sección activa ---------- */
  const barra = document.querySelector('.barra');
  const pintarBarra = () => barra && barra.classList.toggle('solida', scrollY > 40);
  addEventListener('scroll', pintarBarra, { passive: true }); pintarBarra();
  const enlaces = [...document.querySelectorAll('.barra .nav[href^="#"]')];
  const secciones = enlaces.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (secciones.length) {
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) enlaces.forEach((a) => a.classList.toggle('activa', a.getAttribute('href') === '#' + e.target.id)); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secciones.forEach((s) => obs.observe(s));
  }

  /* ---------- aparecer al bajar ---------- */
  const revela = document.querySelectorAll('.revela');
  if (quieto || !('IntersectionObserver' in window)) revela.forEach((el) => el.classList.add('visible'));
  else {
    const obs = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }), { threshold: 0.12 });
    revela.forEach((el) => obs.observe(el));
  }

  /* ---------- luz y anillo que siguen al cursor; botones magnéticos ---------- */
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    raiz.style.setProperty('--mx', e.clientX + 'px'); raiz.style.setProperty('--my', e.clientY + 'px');
    document.body.classList.add('cursor');
  });
  document.addEventListener('mouseleave', () => document.body.classList.remove('cursor'));
  if (!quieto) document.querySelectorAll('.iman').forEach((b) => {
    b.addEventListener('mousemove', (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.4}px)`;
    });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });

  /* ---------- videos: si la persona pidió menos movimiento, quietos en su primera imagen ---------- */
  if (quieto) document.querySelectorAll('video[autoplay]').forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });
})();
