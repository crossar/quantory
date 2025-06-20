import { useEffect, useState } from 'react';
import BottomNav from '../components/BottomNav';
import AddItemForm from '../components/AddItemForm';
import { deleteItemWithConfirm } from '../utils/deleteItemWithConfirm';

export default function PantryPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/items?location=pantry')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const handleDelete = (id) => {
    deleteItemWithConfirm(id, setItems);
  };

  return (
    <>
      <div className="container">
        <h1>Pantry Inventory</h1>
        <AddItemForm location="pantry" onItemAdded={(item) => setItems(prev => [...prev, item])} />
        <ul className="item-list">
          {items.map(item => (
            <li key={item.id} className="item-card">
              <span>{item.name} (Qty: {item.quantity})</span>
              <button onClick={() => handleDelete(item.id)}>❌</button>
            </li>
          ))}
        </ul>
      </div>
      <BottomNav />
    </>
  );
}
