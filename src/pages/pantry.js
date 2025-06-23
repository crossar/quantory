import { useEffect, useState } from 'react';
import BottomNav from '../components/BottomNav';
import AddItemForm from '../components/AddItemForm';
import EditableItemList from '../components/EditableItemList';

export default function PantryPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/items?location=pantry')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  return (
    <>
      <div className="container">
        <h1>Pantry Inventory</h1>
        <AddItemForm location="pantry" onItemAdded={(item) => setItems(prev => [...prev, item])} />
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
