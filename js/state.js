window.state = {
  users: [], todos: [], posts: [], comments: [],
  createdUsers: JSON.parse(localStorage.getItem('spa.createdUsers') || '[]'),
  createdTodos: JSON.parse(localStorage.getItem('spa.createdTodos') || '[]'),
  loading: true
};

function saveCreatedUsers() { localStorage.setItem('spa.createdUsers', JSON.stringify(state.createdUsers)); }
function saveCreatedTodos() { localStorage.setItem('spa.createdTodos', JSON.stringify(state.createdTodos)); }

function mergedUsers(){ return [...state.createdUsers, ...state.users]; }
    function mergedTodos(){ return [...state.createdTodos, ...state.todos]; }
async function fetchAll() {
  state.loading = true;
  try {
    const [u,t,p,c] = await Promise.all([
      fetch('https://jsonplaceholder.typicode.com/users').then(r=>r.json()),
      fetch('https://jsonplaceholder.typicode.com/todos').then(r=>r.json()),
      fetch('https://jsonplaceholder.typicode.com/posts').then(r=>r.json()),
      fetch('https://jsonplaceholder.typicode.com/comments').then(r=>r.json())
    ]);
    state.users = u;
    state.todos = t;
    state.posts = p;
    state.comments = c;
  } catch(e){ console.error(e); }
  state.loading = false;
  router();
}
