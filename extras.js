// Detalles «pro» que comparten las páginas: menú rápido Ctrl+K, copiar el correo, hora de Berlín en vivo.
(() => {
  'use strict';
  const CORREO = 'juanjcol66@gmail.com';
  const enPortafolio = !!document.getElementById('projects');
  const a = (hash) => (enPortafolio ? hash : './' + hash);
  const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  /* ---------- aviso corto abajo («Copied!») ---------- */
  const aviso = document.createElement('div');
  aviso.className = 'aviso'; aviso.setAttribute('role', 'status'); aviso.setAttribute('aria-live', 'polite');
  document.body.appendChild(aviso);
  let tAviso;
  function avisar(txt) { aviso.textContent = txt; aviso.classList.add('ver'); clearTimeout(tAviso); tAviso = setTimeout(() => aviso.classList.remove('ver'), 1800); }

  /* ---------- copiar el correo ---------- */
  async function copiarCorreo() {
    try { await navigator.clipboard.writeText(CORREO); }
    catch {   // navegadores viejos o sin permiso: el método de siempre
      const t = document.createElement('textarea'); t.value = CORREO; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch {} t.remove();
    }
    avisar('Email copied!');
  }
  document.querySelectorAll('[data-copiar-correo]').forEach((b) => b.addEventListener('click', copiarCorreo));

  /* ---------- hora de Berlín en vivo (pie de página) ---------- */
  const hora = document.getElementById('hora');
  if (hora) {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' });
    const pintar = () => { const t = fmt.format(new Date()); hora.textContent = t; hora.setAttribute('datetime', t); };
    pintar(); setInterval(pintar, 15000);
  }

  /* ---------- menú rápido (Ctrl+K / ⌘K) ---------- */
  const ICONOS = {
    ir: '<path d="M5 12h14M13 6l6 6-6 6"/>', copiar: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    abrir: '<path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>', correo: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  };
  const ACCIONES = [
    { t: 'Projects', g: 'Go to', i: 'ir', hacer: () => ir(a('#projects')) },
    { t: 'Now', g: 'Go to', i: 'ir', hacer: () => ir(a('#now')) },
    { t: 'About me', g: 'Go to', i: 'ir', hacer: () => ir(a('#about')) },
    { t: 'Contact', g: 'Go to', i: 'ir', hacer: () => ir(a('#contact')) },
    { t: 'Orbyte case study', g: 'Go to', i: 'ir', hacer: () => { location.href = 'orbyte.html'; } },
    { t: 'Copy email address', g: 'Actions', i: 'copiar', hacer: copiarCorreo },
    { t: 'Write me an email', g: 'Actions', i: 'correo', hacer: () => window.open('https://mail.google.com/mail/?view=cm&to=' + CORREO, '_blank', 'noopener') },
    { t: 'Open GitHub', g: 'Links', i: 'abrir', hacer: () => window.open('https://github.com/kolmme', '_blank', 'noopener') },
    { t: 'Open LinkedIn', g: 'Links', i: 'abrir', hacer: () => window.open('https://www.linkedin.com/in/juan-colmenares-b959063a8/', '_blank', 'noopener') },
  ];
  function ir(destino) {
    if (destino.startsWith('#')) { const el = document.querySelector(destino); if (el) el.scrollIntoView(); history.replaceState(null, '', destino); }
    else location.href = destino;
  }
  const fondo = document.createElement('div');
  fondo.className = 'paleta-fondo'; fondo.hidden = true;
  fondo.innerHTML = `<div class="paleta" role="dialog" aria-modal="true" aria-label="Quick menu">
    <div class="paleta-buscar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input type="text" placeholder="Type a command or search…" aria-label="Search commands" aria-controls="paleta-lista" aria-autocomplete="list" autocomplete="off" spellcheck="false">
      <kbd>Esc</kbd></div>
    <ul class="paleta-lista" id="paleta-lista" role="listbox"></ul></div>`;
  document.body.appendChild(fondo);
  const entrada = fondo.querySelector('input'), lista = fondo.querySelector('ul');
  let visibles = [], elegido = 0, antesDeAbrir = null;
  function pintarLista() {
    const q = entrada.value.trim().toLowerCase();
    visibles = ACCIONES.filter((x) => !q || (x.t + ' ' + x.g).toLowerCase().includes(q));
    elegido = Math.min(elegido, Math.max(0, visibles.length - 1));
    let grupo = '';
    lista.innerHTML = visibles.length ? visibles.map((x, k) => {
      const cab = x.g !== grupo ? `<li class="paleta-grupo" role="presentation">${x.g}</li>` : '';
      grupo = x.g;
      return cab + `<li role="option" id="op${k}" data-k="${k}" aria-selected="${k === elegido}" class="${k === elegido ? 'on' : ''}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[x.i]}</svg>${x.t}</li>`;
    }).join('') : '<li class="paleta-vacio" role="presentation">No results</li>';
    entrada.setAttribute('aria-activedescendant', visibles.length ? 'op' + elegido : '');
    const on = lista.querySelector('.on'); if (on) on.scrollIntoView({ block: 'nearest' });
  }
  function abrir() {
    antesDeAbrir = document.activeElement;
    fondo.hidden = false; entrada.value = ''; elegido = 0; pintarLista();
    requestAnimationFrame(() => { fondo.classList.add('ver'); entrada.focus(); });
  }
  function cerrar() {
    fondo.classList.remove('ver');
    setTimeout(() => { fondo.hidden = true; }, 160);
    if (antesDeAbrir && antesDeAbrir.focus) antesDeAbrir.focus();
  }
  function ejecutar(k) { const x = visibles[k]; if (!x) return; cerrar(); setTimeout(x.hacer, 60); }
  entrada.addEventListener('input', () => { elegido = 0; pintarLista(); });
  entrada.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); elegido = (elegido + 1) % Math.max(1, visibles.length); pintarLista(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); elegido = (elegido - 1 + visibles.length) % Math.max(1, visibles.length); pintarLista(); }
    else if (e.key === 'Enter') { e.preventDefault(); ejecutar(elegido); }
    else if (e.key === 'Tab') e.preventDefault();   // el foco se queda en la cajita mientras está abierta
  });
  lista.addEventListener('click', (e) => { const li = e.target.closest('[data-k]'); if (li) ejecutar(+li.dataset.k); });
  lista.addEventListener('mousemove', (e) => { const li = e.target.closest('[data-k]'); if (li && +li.dataset.k !== elegido) { elegido = +li.dataset.k; pintarLista(); } });
  fondo.addEventListener('click', (e) => { if (e.target === fondo) cerrar(); });
  addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (fondo.hidden) abrir(); else cerrar(); }
    else if (e.key === 'Escape' && !fondo.hidden) cerrar();
  });
  document.querySelectorAll('[data-paleta]').forEach((b) => {
    b.querySelector('kbd').textContent = mac ? '⌘K' : 'Ctrl K';
    b.setAttribute('aria-label', 'Open quick menu (' + (mac ? '⌘K' : 'Ctrl+K') + ')');
    b.addEventListener('click', abrir);
  });
})();
