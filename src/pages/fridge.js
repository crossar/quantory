import { useEffect, useState } from 'react';
import BottomNav from '../components/BottomNav';
import ItemListPage from '../components/ItemListPage';
import AddItemForm from '../components/AddItemForm';

export default function FridgePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/items?location=fridge')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const handleDelete = async (id) => {
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
    <>
      <div className="container">
        <h1>Fridge Inventory</h1>
        <AddItemForm location="fridge" onItemAdded={(item) => setItems(prev => [...prev, item])} />
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <ul className="item-list">
            {items.map(item => (
              <li key={item.id} className="item-card">
                <span>{item.name} (Qty: {item.quantity})</span>
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
