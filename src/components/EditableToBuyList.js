import { useState } from 'react';

export default function EditableToBuyList({ items, setItems }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Remove this from your list?');
    if (!confirmDelete) return;

    const res = await fetch('/api/to-buy', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditValue(item.name);
  };

  const handleSave = async (id) => {
    const res = await fetch('/api/to-buy', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: editValue }),
    });

    if (res.ok) {
      setItems(items.map(item => item.id === id ? { ...item, name: editValue } : item));
      setEditingId(null);
    } else {
      alert('Failed to update item');
    }
  };

  return (
    <ul className="item-list">
      {items.map(item => (
        <li key={item.id} className="item-card">
          {editingId === item.id ? (
            <>
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
              <button onClick={() => handleSave(item.id)}>💾</button>
            </>
          ) : (
            <>
              <span>{item.name}</span>
              <div>
                <button onClick={() => handleEdit(item)}>✏️</button>
                <button onClick={() => handleDelete(item.id)}>❌</button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
