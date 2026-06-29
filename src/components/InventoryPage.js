import { useEffect, useState } from "react";
import { useUser } from "@/components/UserContext";
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
  const { user, status } = useUser();

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch(`/api/items?location=${location}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("Items API returned non-array:", data);
          setItems([]);
          return;
        }
        const sorted = [...data].sort((a, b) => {
          const aDate = a.expiresAt ? new Date(a.expiresAt) : Infinity;
          const bDate = b.expiresAt ? new Date(b.expiresAt) : Infinity;
          return aDate - bDate;
        });
        setItems(sorted);
      })
      .catch((err) => {
        console.error("Failed to fetch items:", err);
        setItems([]);
      });
  }, [location, status, user?.id]);

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
