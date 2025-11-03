function renderCommentsPage(parts) {
    const root = document.getElementById('app');
    root.innerHTML = '';
    const { input } = renderHeader(parts, handleSearch);
  
    const container = el('div');
  
    const listCard = el('div', { class: 'card' });
    listCard.appendChild(el('h3', {}, 'Комментарии'));
    const listWrap = el('div', { class: 'list' });
  
    function buildList(filterText = '') {
      listWrap.innerHTML = '';
      const q = filterText.trim().toLowerCase();
      const all = state.comments || [];
      const filtered =
        q === ''
          ? all
          : all.filter(
              (c) =>
                (c.name && c.name.toLowerCase().includes(q)) ||
                (c.body && c.body.toLowerCase().includes(q))
            );
      if (filtered.length === 0)
        listWrap.appendChild(el('div', {}, 'Ничего не найдено.'));
      filtered.slice(0, 200).forEach((c) => {
        const item = el('div', { class: 'item' });
        const left = el('div', { class: 'item-left' });
        left.appendChild(el('div', { class: 'item-title' }, c.name));
        left.appendChild(
          el('div', { class: 'meta' }, (c.body || '').slice(0, 160) + (c.body && c.body.length > 160 ? '…' : ''))
        );
        left.appendChild(
          el('div', { class: 'tags' },
            el('span', { class: 'tag' }, 'postId: ' + c.postId),
            el('span', { class: 'tag' }, 'email: ' + c.email)
          )
        );
        item.appendChild(left);
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
  