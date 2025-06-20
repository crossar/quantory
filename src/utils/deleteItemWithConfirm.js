export async function deleteItemWithConfirm(id, setItems) {
  const confirmDelete = window.confirm('Are you sure you want to delete this item?');
  if (!confirmDelete) return;

  const res = await fetch('/api/delete-item', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });

  if (res.ok) {
    setItems(prev => prev.filter(item => item.id !== id));
  } else {
    alert('Failed to delete item');
  }
}
