import { useEffect, useState } from "react";
import { useUser } from "@/components/UserContext";

function formatDateLocal(dateStr) {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("T")[0].split("-");
  return new Date(year, month - 1, day).toLocaleDateString();
}

function isExpiringSoonLocal(dateStr) {
  if (!dateStr) return false;

  const [year, month, day] = dateStr.split("T")[0].split("-");
  const expires = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffInDays = (expires - today) / (1000 * 60 * 60 * 24);
  return diffInDays >= 0 && diffInDays <= 3;
}

export default function ExpiringSoonPage() {
  const [items, setItems] = useState([]);
  const { status } = useUser();

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/items?expiring=true")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("Items API returned non-array:", data);
          setItems([]);
          return;
        }
        const expiringSoon = data
          .filter((item) => isExpiringSoonLocal(item.expiresAt))
          .sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt));

        setItems(expiringSoon);
      })
      .catch((err) => {
        console.error("Failed to fetch expiring items:", err);
        setItems([]);
      });
  }, [status]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?",
    );
    if (!confirmDelete) return;

    const res = await fetch("/api/delete-item", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setItems(items.filter((item) => item.id !== id));
    } else {
      alert("Failed to delete item");
    }
  };

  return (
    <div className="container">
      <h1>Expiring Soon (Next 3 Days)</h1>
      {items.length === 0 ? (
        <p>No items expiring soon.</p>
      ) : (
        <ul className="item-list">
          {items.map((item) => (
            <li key={item.id} className="item-card">
              <span>
                {item.name} (Qty: {item.quantity}) — expires on{" "}
                <strong>{formatDateLocal(item.expiresAt)}</strong>
              </span>
              <button onClick={() => handleDelete(item.id)}>❌</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
