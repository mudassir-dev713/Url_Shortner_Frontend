export function getAnonymousId() {
  let id = localStorage.getItem('anon_id');

  if (!id) {
    id = crypto.randomUUID(); // Or use nanoid()
    localStorage.setItem('anon_id', id);
  }
  return id;
}
