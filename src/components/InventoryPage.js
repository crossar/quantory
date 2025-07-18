import { useEffect, useState } from "react";
import EditableItemList from "./EditableItemList";
import AddItemForm from "./AddItemForm";
import BottomNav from "./BottomNav";

function sortByExpiry(items) {
  return [...items].sort((a, b) => {
    const aDate = a.expiresAt ? new Date(a.expiresAt) : Infinity;
    const bDate = b.expiresAt ? new Date(b.expiresAt) : Infinity;
    return aDate - bDate;
  });
}

export default function InventoryPage({ title, location }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    fetch(`/api/items?location=${location}&userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => {
          const aDate = a.expiresAt ? new Date(a.expiresAt) : Infinity;
          const bDate = b.expiresAt ? new Date(b.expiresAt) : Infinity;
          return aDate - bDate;
        });
        setItems(sorted);
      });
  }, [location]);

  return (
    <>
      <div className="container">
        <h1>{title}</h1>
        <AddItemForm
          location={location}
          onItemAdded={(newItem) =>
            setItems((prev) => sortByExpiry([...prev, newItem]))
          }
        />

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
