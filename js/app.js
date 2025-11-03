window.addEventListener('hashchange', router);
  window.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('app');
    root.innerHTML = '<div class="card"><h3>Загрузка данных…</h3></div>';
    fetchAll();
  });

