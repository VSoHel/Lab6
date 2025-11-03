// utils.js — глобальные утилиты
function el(tag, opts, ...children) {
  const node = document.createElement(tag);
  opts = opts || {};
  if (opts.class) node.className = opts.class;
  if (opts.html) node.innerHTML = opts.html;
  if (opts.attrs) for (const k in opts.attrs) node.setAttribute(k, opts.attrs[k]);
  if (opts.on) for (const k in opts.on) node.addEventListener(k, opts.on[k]);
  if (opts.text) node.appendChild(document.createTextNode(opts.text));
  for (const c of children) {
    if (c == null) continue;
    if (typeof c === 'string' || typeof c === 'number') node.appendChild(document.createTextNode(c));
    else if (c instanceof Node) node.appendChild(c);
  }
  return node;
}

function debounce(fn, wait = 250) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function buildBreadcrumbs(parts) {
  const wrap = el('div', { class: 'breadcrumbs' });
  parts.forEach((p, i) => {
    const href = '#' + parts.slice(0, i + 1).join('#');
    const crumb = el('span', {
      class: 'crumb' + (i === parts.length - 1 ? ' active' : ''),
      on: { click: () => { location.hash = href; } }
    }, p);
    wrap.appendChild(crumb);
    if (i < parts.length - 1) wrap.appendChild(el('span', {}, '›'));
  });
  return wrap;
}

function renderHeader(parts, onSearch) {
  const root = document.getElementById('app');
  const header = el('div', { class: 'card' });

  const left = el('div', { class: 'brand' },
    el('div', { class: 'logo' }, 'SP'),
    el('div', {},
      el('h1', {}, 'JSONPlaceholder SPA'),
      el('div', { class: 'muted' }, 'users · todos · posts · comments')
    )
  );

  const right = el('div', { style: 'display:flex;gap:8px;align-items:center;' },
    buildBreadcrumbs(parts)
  );

  header.appendChild(el('div', { style: 'display:flex;justify-content:space-between;align-items:center;' }, left, right));
  root.appendChild(header);

  const controls = el('div', { class: 'card controls' });
  const searchDiv = el('div', { class: 'search' });
  const input = el('input', { attrs: { type: 'search', placeholder: 'Поиск...' } });
  input.addEventListener('input', debounce(e => onSearch(e.target.value), 300));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') onSearch(e.target.value); });
  searchDiv.appendChild(input);
  controls.appendChild(searchDiv);
  root.appendChild(controls);

  return { input };
}

// глобально
window.el = el;
window.debounce = debounce;
window.buildBreadcrumbs = buildBreadcrumbs;
window.renderHeader = renderHeader;
