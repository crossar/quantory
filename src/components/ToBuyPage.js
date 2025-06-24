import { useEffect, useState } from 'react';
import EditableToBuyList from './EditableToBuyList';

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

    const res = await fetch('/api/to-buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItem }),
    });

    if (res.ok) {
      const item = await res.json();
      setItems(prev => [...prev, item]);
      setNewItem('');
    } else {
      alert('Failed to add item');
    }
  };

  return (
    <div className="container">
      <h1>To Buy List</h1>

      <form onSubmit={handleAdd} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Add item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button type="submit">➕</button>
      </form>

      {items.length === 0 ? (
        <p>No items in your list.</p>
      ) : (
        <EditableToBuyList items={items} setItems={setItems} />
      )}
    </div>
  );
}
