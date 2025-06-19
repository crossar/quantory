import { useEffect, useState } from 'react';
import BottomNav from '../components/BottomNav';
import ItemListPage from '../components/ItemListPage';

export default function MedicinePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/items?location=medicine')
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
      <ItemListPage title="Medicine Inventory" items={items} onDelete={handleDelete} />
      <BottomNav />
    </>
  );
}
