const API_BASE = 'notes-backend-teal.vercel.app/api'; // Proxy or backend base URL in Vercel
// const LOCAL_API_BASE = 'http://localhost:3000/api'; // Local backend URL

async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

async function fetchNotes(token) {
  const res = await fetch(`${API_BASE}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Fetch notes failed');
  return res.json();
}

async function createNote(token, note) {
  const res = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(note),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Create note failed');
  }
  return res.json();
}

async function editNote(token, id, updatedNote) {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(updatedNote),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Edit note failed');
  }
  return res.json();
}

async function deleteNote(token, id) {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Delete note failed');
  return res.json();
}

async function upgradeTenant(token, slug) {
  const res = await fetch(`${API_BASE}/tenants/${slug}/upgrade`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Upgrade failed');
  return res.json();
}

export { login, fetchNotes, createNote, editNote, deleteNote, upgradeTenant };
