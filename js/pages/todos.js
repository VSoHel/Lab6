function renderTodosPage(parts) {
    const root = document.getElementById('app');
    root.innerHTML = '';
    const { input } = renderHeader(parts, handleSearch);
  
    const container = el('div');
  

    const addCard = el('div', { class: 'card' });
    addCard.appendChild(el('h3', {}, 'Добавить todo'));
    const form = el('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const title = fd.get('title').trim();
      const userId = Number(fd.get('userId'));
      if (!title) {
        alert('Введите title');
        return;
      }
      const id = Date.now();
      const newTodo = { userId, id, title, completed: false, created: true };
      state.createdTodos.push(newTodo);
      saveCreatedTodos();
      form.reset();
      renderTodosPage(parts);
    });
  
    const users = mergedUsers();
    const select = el('select', { attrs: { name: 'userId' } });
    users.forEach((u) => select.appendChild(el('option', { attrs: { value: u.id } }, u.name)));
    form.appendChild(
      el('div', { class: 'grid-2' },
        el('div', { class: 'row' }, select),
        el('div', { class: 'row' }, el('input', { attrs: { name: 'title', placeholder: 'Title' } }))
      )
    );
    form.appendChild(el('div', { style: 'display:flex;gap:8px' },
      el('button', {}, 'Добавить todo'),
      el('button', { class: 'ghost', attrs: { type: 'reset' } }, 'Очистить')
    ));
    addCard.appendChild(form);
    container.appendChild(addCard);
  
    const listCard = el('div', { class: 'card' });
    listCard.appendChild(el('h3', {}, 'Todos'));
    const listWrap = el('div', { class: 'list' });
  
    function buildList(filterText = '') {
      listWrap.innerHTML = '';
      const q = filterText.trim().toLowerCase();
      const allTodos = mergedTodos();
      const filtered =
        q === ''
          ? allTodos
          : allTodos.filter((t) => t.title && t.title.toLowerCase().includes(q));
      if (filtered.length === 0)
        listWrap.appendChild(el('div', {}, 'Ничего не найдено.'));
      filtered.slice(0, 200).forEach((t) => {
        const item = el('div', { class: 'item' });
        const left = el('div', { class: 'item-left' });
        left.appendChild(el('div', { class: 'item-title' }, t.title));
        const user = mergedUsers().find((u) => u.id === t.userId);
        left.appendChild(
          el('div', { class: 'meta' },
            'Пользователь: ' + (user ? user.name : 'id:' + t.userId) + (t.completed ? ' · выполнено' : ' · в работе')
          )
        );
        item.appendChild(left);
  
        const right = el('div', {});
        const toggle = el('button', {
          class: t.completed ? 'ghost' : '',
          on: {
            click: () => {
              t.completed = !t.completed;
              if (t.created) saveCreatedTodos();
              buildList(filterText);
            },
          },
        }, t.completed ? '✔' : '○');
        right.appendChild(toggle);
  
        if (t.created) {
          const del = el('button', {
            class: 'danger',
            on: {
              click: () => {
                if (!confirm('Удалить созданный todo?')) return;
                state.createdTodos = state.createdTodos.filter((x) => x.id !== t.id);
                saveCreatedTodos();
                buildList(filterText);
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
  