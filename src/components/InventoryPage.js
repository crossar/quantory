import { useEffect, useState } from 'react';
import EditableItemList from './EditableItemList';
import AddItemForm from './AddItemForm';
import BottomNav from './BottomNav';

export default function InventoryPage({ title, location }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`/api/items?location=${location}`)
      .then(res => res.json())
      .then(data => setItems(data));
  }, [location]);

  return (
    <>
      <div className="container">
        <h1>{title}</h1>
        <AddItemForm location={location} onItemAdded={(item) => setItems(prev => [...prev, item])} />
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
