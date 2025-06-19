import { useEffect, useState } from 'react';

export default function ToBuyPage() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    fetch('/api/to-buy')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const res = await fetch('/api/add-to-buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItem }),
    });

    if (res.ok) {
      const added = await res.json();
      setItems([added, ...items]);
      setNewItem('');
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch('/api/delete-to-buy', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div>
      <h1>🛒 To Buy</h1>
      <form onSubmit={handleAdd} style={{ marginBottom: '1rem' }}>
        <input
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          placeholder="Enter item..."
        />
        <button type="submit">Add</button>
      </form>
      {items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              {item.name}{' '}
              <button onClick={() => handleDelete(item.id)}>❌</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
