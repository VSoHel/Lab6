function parseHash() {
  const raw = location.hash || '#users';
  const parts = raw.split('#').filter(Boolean);
  return parts.length ? parts : ['users'];
}

function router() {
  const parts = parseHash();
  const main = parts[0];

  if(main === 'users' && parts.length === 1) renderUsersPage(parts);
  else if(main === 'users' && parts[1] === 'todos') renderTodosPage(parts);
  else if(main === 'users' && parts[1] === 'posts' && parts.length === 2) renderPostsPage(parts);
  else if(main === 'users' && parts[1] === 'posts' && parts[2] === 'comments') renderCommentsPage(parts);
  else location.hash = '#users';
}
