import { useEffect, useState } from 'react';

export default function PantryPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/items?location=pantry')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this item?');
    if (!confirm) return;

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

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <h1>Pantry Inventory</h1>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              {item.name} (Qty: {item.quantity}){' '}
              <button onClick={() => handleDelete(item.id)}>❌</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
