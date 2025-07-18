import { useEffect, useState } from "react";

function formatDateLocal(dateStr) {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("T")[0].split("-");
  return new Date(year, month - 1, day).toLocaleDateString();
}

export default function ExpiringSoonPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return;

    fetch(`/api/items?expiring=true&userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
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
