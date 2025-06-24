import { useState } from "react";

export default function EditableToBuyList({ items, setItems }) {
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Remove this from your list?");
    if (!confirmDelete) return;

    const res = await fetch("/api/to-buy", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setEditedName(currentName);
  };

  const handleSave = async (id) => {
    const res = await fetch("/api/to-buy", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: editedName }),
    });

    if (res.ok) {
      const updated = await res.json();
      setItems(items.map((item) => (item.id === id ? updated : item)));
      setEditingId(null);
    }
  };

  const handleMoveToInventory = async (item) => {
    const confirmMove = window.confirm(`Move "${item.name}" to inventory?`);
    if (!confirmMove) return;

    const res = await fetch("/api/move-to-inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: item.id,
        name: item.name,
        location: item.location,
      }),
    });

    if (res.ok) {
      setItems(items.filter((i) => i.id !== item.id));
    } else {
      alert("Failed to move item");
    }
  };

  return (
    <ul className="item-list">
      {items.map((item) => (
        <li key={item.id} className="item-card">
          {editingId === item.id ? (
            <>
              <input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
              <button onClick={() => handleSave(item.id)}>💾</button>
            </>
          ) : (
            <>
              <span>{item.name} (Qty: {item.quantity || 1})</span>


              <button onClick={() => handleEdit(item.id, item.name)}>✏️</button>
              <button onClick={() => handleMoveToInventory(item)}>✅</button>
              <button onClick={() => handleDelete(item.id)}>❌</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
