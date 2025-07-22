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
  const diffInDays = (expires - today) / (1000 * 60 * 60 * 24);
  return diffInDays >= 0 && diffInDays <= 3;
}

function isExpiredLocal(dateStr) {
  if (!dateStr) return false;
  const [year, month, day] = dateStr.split("T")[0].split("-");
  const expires = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return expires < today;
}

export default function EditableItemList({ items, setItems }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    quantity: "",
    expiresAt: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const expiredItems = filteredItems.filter((item) =>
    isExpiredLocal(item.expiresAt)
  );
  const expiringSoonItems = filteredItems.filter(
    (item) =>
      !isExpiredLocal(item.expiresAt) && isExpiringSoonLocal(item.expiresAt)
  );
  const goodItems = filteredItems.filter(
    (item) =>
      !isExpiredLocal(item.expiresAt) && !isExpiringSoonLocal(item.expiresAt)
  );

  const locationColors = {
    fridge: "#00bcd4",
    freezer: "#3f51b5",
    pantry: "#4caf50",
    storage: "#795548",
  };

  const renderItem = (item) => {
    const isExpiringSoon = isExpiringSoonLocal(item.expiresAt);
    const isExpired = isExpiredLocal(item.expiresAt);
    const isLowStock = item.quantity <= 1;
    const locationColor = locationColors[item.location] || "#aaa";

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
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
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
              style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}
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
              <span>
                {item.name} {isLowStock ? "⚠️ Low Stock" : ""}
                <span
                  style={{
                    marginLeft: "0.5rem",
                    background: locationColor,
                    borderRadius: "6px",
                    padding: "2px 6px",
                    fontSize: "0.75rem",
                    color: "white",
                  }}
                >
                  {item.location}
                </span>
              </span>
              <p
                style={{
                  fontSize: "0.85rem",
                  marginTop: "4px",
                  color: isExpired ? "red" : "inherit",
                }}
              >
                Qty: {item.quantity} | Expires:{" "}
                {item.expiresAt
                  ? `${formatDateLocal(item.expiresAt)} ${
                      isExpired ? "❌ Expired" : isExpiringSoon ? "⚠️" : ""
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
  };

  return (
    <div className="item-list">
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
      </div>

      {expiredItems.length > 0 && (
        <>
          <h3 style={{ color: "red", marginBottom: "0.5rem" }}>Expired</h3>
          {expiredItems.map(renderItem)}
        </>
      )}

      {expiringSoonItems.length > 0 && (
        <>
          <h3 style={{ color: "orange", margin: "1rem 0 0.5rem" }}>
            Expiring Soon
          </h3>
          {expiringSoonItems.map(renderItem)}
        </>
      )}

      {goodItems.length > 0 && (
        <>
          <h3 style={{ color: "green", margin: "1rem 0 0.5rem" }}>Good</h3>
          {goodItems.map(renderItem)}
        </>
      )}
    </div>
  );
}
