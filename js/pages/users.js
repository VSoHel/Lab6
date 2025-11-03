function renderUsersPage(parts) {
  const root = document.getElementById('app');
  root.innerHTML = '';
  const { input } = renderHeader(parts, handleSearch);

  const container = el('div');
  const addCard = el('div', { class: 'card' });
  addCard.appendChild(el('h3', {}, 'Добавить пользователя'));
  const form = el('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get('name').trim();
    const email = fd.get('email').trim();
    const phone = fd.get('phone').trim();
    if (!name || !email) {
      alert('Введите имя и email');
      return;
    }
    const id = Date.now();
    const newUser = { id, name, email, phone, created: true };
    state.createdUsers.push(newUser);
    saveCreatedUsers();
    form.reset();
    renderUsersPage(parts);
  });
  form.appendChild(
    el('div', { class: 'grid-2' },
      el('div', { class: 'row' }, el('input', { attrs: { name: 'name', placeholder: 'Имя' } })),
      el('div', { class: 'row' }, el('input', { attrs: { name: 'email', placeholder: 'Email' } }))
    )
  );
  form.appendChild(el('div', { class: 'row' }, el('input', { attrs: { name: 'phone', placeholder: 'Телефон (опционально)' } })));
  form.appendChild(el('div', { style: 'display:flex;gap:8px' },
    el('button', {}, 'Добавить'),
    el('button', { class: 'ghost', attrs: { type: 'reset' } }, 'Очистить')
  ));
  addCard.appendChild(form);
  container.appendChild(addCard);

  const listCard = el('div', { class: 'card' });
  listCard.appendChild(el('h3', {}, 'Пользователи'));
  const listWrap = el('div', { class: 'list' });

  function buildList(filterText = '') {
    listWrap.innerHTML = '';
    const q = filterText.trim().toLowerCase();
    const allUsers = mergedUsers();
    const filtered =
      q === ''
        ? allUsers
        : allUsers.filter(
            (u) =>
              (u.name && u.name.toLowerCase().includes(q)) ||
              (u.email && u.email.toLowerCase().includes(q))
          );
    if (filtered.length === 0)
      listWrap.appendChild(el('div', {}, 'Ничего не найдено.'));
    filtered.forEach((u) => {
      const item = el('div', { class: 'item' });
      const left = el('div', { class: 'item-left' });
      left.appendChild(el('div', { class: 'item-title' }, u.name || '—'));
      left.appendChild(
        el('div', { class: 'meta' }, u.email || '', u.phone ? ' · ' + u.phone : '')
      );
      left.appendChild(el('div', { class: 'tags' }, el('span', { class: 'tag' }, 'id: ' + u.id)));
      item.appendChild(left);

      const right = el('div', {});
      const btnPosts = el('button', { class: 'ghost', on: { click: () => { location.hash = '#users#posts'; window.scrollTo(0, 0); } } }, 'Посты');
      const btnTodos = el('button', { class: 'ghost', on: { click: () => { location.hash = '#users#todos'; window.scrollTo(0, 0); } } }, 'Todos');
      right.appendChild(btnPosts);
      right.appendChild(el('div', { style: 'height:8px' }));
      right.appendChild(btnTodos);

      if (u.created) {
        const del = el('button', {
          class: 'danger',
          on: {
            click: () => {
              if (!confirm('Удалить созданного пользователя?')) return;
              state.createdUsers = state.createdUsers.filter((x) => x.id !== u.id);
              saveCreatedUsers();
              renderUsersPage(parts);
            },
          },
        }, 'Удалить');
        right.appendChild(el('div', { style: 'height:8px' }));
        right.appendChild(del);
      }

      item.appendChild(right);
      listWrap.appendChild(item);
    });
  }

  buildList('');
  listCard.appendChild(listWrap);
  container.appendChild(listCard);
  root.appendChild(container);

  function handleSearch(q) {
    buildList(q);
  }

  const headerSearchInput = document.querySelector('#app input[type="search"]');
  if (headerSearchInput) {
    headerSearchInput.value = '';
    headerSearchInput.removeEventListener('input', headerSearchInput._bound);
    headerSearchInput._bound = debounce((e) => handleSearch(e.target.value), 300);
    headerSearchInput.addEventListener('input', headerSearchInput._bound);
  }
}
