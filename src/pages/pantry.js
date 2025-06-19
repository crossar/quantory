// /pages/pantry.js
import { useEffect, useState } from 'react';

export default function PantryPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/items?location=pantry')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <h1>Pantry Inventory</h1>
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
