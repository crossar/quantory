import { useEffect, useState } from 'react';
import BottomNav from '../components/BottomNav';

export default function ToBuyPage() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetch('/api/to-buy')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const addItem = async () => {
    if (!input.trim()) return;

    const res = await fetch('/api/to-buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: input.trim() }),
    });

    if (res.ok) {
      const newItem = await res.json();
      setItems([...items, newItem]);
      setInput('');
    } else {
      alert('Failed to add item');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Remove this from your list?');
    if (!confirm) return;

    const res = await fetch('/api/to-buy', {
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
    <>
      <div className="container">
        <h1>🛒 To Buy</h1>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Enter item..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button onClick={addItem}>Add</button>
        </div>

        {items.length === 0 ? (
          <p>No items in your list.</p>
        ) : (
          <ul className="item-list">
            {items.map(item => (
              <li key={item.id} className="item-card">
                <span>{item.name}</span>
                <button onClick={() => handleDelete(item.id)}>❌</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <BottomNav />
    </>
  );
}
