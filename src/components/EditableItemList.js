import { useState } from 'react';

export default function EditableItemList({ items, setItems }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', quantity: '', expiresAt: '' });

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (!confirmDelete) return;

    const res = await fetch('/api/delete-item', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setItems(items.filter(item => item.id !== id));
    } else {
      alert('Failed to delete item');
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      quantity: item.quantity,
      expiresAt: item.expiresAt ? item.expiresAt.substring(0, 10) : '',
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/edit-item', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, ...editForm }),
    });

    if (res.ok) {
      const updated = await res.json();
      setItems(items.map(item => (item.id === editingId ? updated : item)));
      setEditingId(null);
      setEditForm({ name: '', quantity: '', expiresAt: '' });
    } else {
      alert('Failed to update item');
    }
  };

  return (
    <ul className="item-list">
      {items.map(item => (
        <li key={item.id} className="item-card">
          {editingId === item.id ? (
            <form onSubmit={handleEditSubmit} style={{ width: '100%' }}>
              <input
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                placeholder="Item name"
              />
              <input
                name="quantity"
                type="number"
                value={editForm.quantity}
                onChange={handleEditChange}
                placeholder="Quantity"
              />
              <input
                name="expiresAt"
                type="date"
                value={editForm.expiresAt}
                onChange={handleEditChange}
              />
              <button type="submit">💾</button>
              <button type="button" onClick={() => setEditingId(null)}>❌</button>
            </form>
          ) : (
            <>
              <span>{item.name} (Qty: {item.quantity})</span>
              <div>
                <button onClick={() => handleEditClick(item)}>✏️</button>{' '}
                <button onClick={() => handleDelete(item.id)}>❌</button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
