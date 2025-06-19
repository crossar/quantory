import { useEffect, useState } from 'react';
import ItemListPage from '../components/ItemListPage';

export default function FridgePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/items?location=fridge')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const handleDelete = async (id) => {
    await fetch('/api/items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setItems(items.filter(i => i.id !== id));
  };

  return <ItemListPage title="Fridge Inventory" items={items} onDelete={handleDelete} />;
}
