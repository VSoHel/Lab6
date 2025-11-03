function renderPostsPage(parts) {
    const root = document.getElementById('app');
    root.innerHTML = '';
    const { input } = renderHeader(parts, handleSearch);
  
    const container = el('div');
  
    const listCard = el('div', { class: 'card' });
    listCard.appendChild(el('h3', {}, 'Посты'));
    const listWrap = el('div', { class: 'list' });
  
    function buildList(filterText = '') {
      listWrap.innerHTML = '';
      const q = filterText.trim().toLowerCase();
      const all = state.posts || [];
      const filtered =
        q === ''
          ? all
          : all.filter(
              (p) =>
                (p.title && p.title.toLowerCase().includes(q)) ||
                (p.body && p.body.toLowerCase().includes(q))
            );
      if (filtered.length === 0)
        listWrap.appendChild(el('div', {}, 'Ничего не найдено.'));
      filtered.slice(0, 200).forEach((p) => {
        const item = el('div', { class: 'item' });
        const left = el('div', { class: 'item-left' });
        left.appendChild(el('div', { class: 'item-title' }, p.title));
        left.appendChild(
          el('div', { class: 'meta' }, (p.body || '').slice(0, 160) + (p.body && p.body.length > 160 ? '…' : ''))
        );
        left.appendChild(
          el('div', { class: 'tags' },
            el('span', { class: 'tag' }, 'postId: ' + p.id),
            el('span', { class: 'tag' }, 'userId: ' + p.userId)
          )
        );
        item.appendChild(left);
  
        const right = el('div', {});
        const btnComments = el('button', {
          class: 'ghost',
          on: {
            click: () => {
              location.hash = '#users#posts#comments';
              window.scrollTo(0, 0);
            },
          },
        }, 'Комментарии');
        right.appendChild(btnComments);
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
  