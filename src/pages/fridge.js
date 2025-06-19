import { useEffect, useState } from 'react';

export default function FridgePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/items?location=fridge')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <h1>Fridge Inventory</h1>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              {item.name} (Qty: {item.quantity})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
