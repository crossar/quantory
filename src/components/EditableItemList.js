import { useState } from "react";

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

  const diffInMs = expires - today;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return diffInDays >= 0 && diffInDays <= 3;
}

export default function EditableItemList({ items, setItems }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    quantity: "",
    expiresAt: "",
  });

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditData({
      name: item.name,
      quantity: item.quantity,
      expiresAt: item.expiresAt ? item.expiresAt.split("T")[0] : "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ name: "", quantity: "", expiresAt: "" });
  };

  const handleEdit = async (id) => {
    const res = await fetch("/api/edit-item", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...editData }),
    });

    if (res.ok) {
      const updatedItem = await res.json();
      setItems(items.map((item) => (item.id === id ? updatedItem : item)));
      cancelEdit();
    } else {
      alert("Failed to update item");
    }
  };

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
    <div className="item-list">
      {items.map((item) => {
        const isExpiringSoon = isExpiringSoonLocal(item.expiresAt);

        return (
          <div
            key={item.id}
            className={`item-card ${isExpiringSoon ? "expiring" : ""}`}
          >
            {editingId === item.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEdit(item.id);
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  value={editData.quantity}
                  onChange={(e) =>
                    setEditData({ ...editData, quantity: e.target.value })
                  }
                  required
                />
                <input
                  type="date"
                  value={editData.expiresAt}
                  onChange={(e) =>
                    setEditData({ ...editData, expiresAt: e.target.value })
                  }
                />
                <div
                  style={{
                    marginTop: "0.5rem",
                    display: "flex",
                    gap: "0.5rem",
                  }}
                >
                  <button type="submit">Save</button>
                  <button type="button" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <span>{item.name}</span>
                  <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                    Qty: {item.quantity} | Expires:{" "}
                    {item.expiresAt
                      ? `${formatDateLocal(item.expiresAt)} ${
                          isExpiringSoon ? "⚠️" : ""
                        }`
                      : "—"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => startEdit(item)}>Edit</button>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
