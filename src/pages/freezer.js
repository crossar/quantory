import { useEffect, useState } from 'react';
import BottomNav from '../components/BottomNav';
import AddItemForm from '../components/AddItemForm';
import EditableItemList from '../components/EditableItemList';

export default function FreezerPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/items?location=freezer')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  return (
    <>
      <div className="container">
        <h1>Freezer Inventory</h1>
        <AddItemForm location="freezer" onItemAdded={(item) => setItems(prev => [...prev, item])} />
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <EditableItemList items={items} setItems={setItems} />
        )}
      </div>
      <BottomNav />
    </>
  );
}
