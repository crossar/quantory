import { useState } from "react";

/** Safe localStorage reader so mobile/PWA quirks don’t break things */
function getUserSafe() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function EditableToBuyList({ items, setItems }) {
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedQty, setEditedQty] = useState("1");

  const handleEditToggle = (item) => {
    if (editingId === item.id) {
      handleSave(item.id);
    } else {
      setEditingId(item.id);
      setEditedName(item.name);
      setEditedQty(String(item.quantity ?? 1));
    }
  };

  const handleSave = async (id) => {
    const user = getUserSafe();
    if (!user?.id) {
      alert("You must be logged in to edit items.");
      return;
    }

    const res = await fetch("/api/to-buy", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name: editedName,
        quantity: Math.max(1, parseInt(editedQty || "1", 10)),
        userId: user.id,
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setItems(items.map((item) => (item.id === id ? updated : item)));
      setEditingId(null);
    } else {
      alert("Failed to save changes");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Remove this from your list?");
    if (!confirmDelete) return;

    const user = getUserSafe();
    if (!user?.id) {
      alert("You must be logged in to delete items.");
      return;
    }

    const res = await fetch("/api/to-buy", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId: user.id }),
    });

    if (res.ok) {
      setItems(items.filter((item) => item.id !== id));
    } else {
      alert("Failed to delete item");
    }
  };

  const handleMoveToInventory = async (item) => {
    const confirmMove = window.confirm(`Move "${item.name}" to inventory?`);
    if (!confirmMove) return;

    const user = getUserSafe();
    if (!user?.id) {
      alert("You must be logged in to move items.");
      return;
    }

    const res = await fetch("/api/move-to-inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: item.id,
        userId: user.id,
        name: item.name,
        quantity: item.quantity || 1,
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
        <li
          key={item.id}
          className="item-card-row"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
            width: "100%",
          }}
        >
          {editingId === item.id ? (
            <>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  gap: "0.5rem",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  style={{ flex: 1, minWidth: "140px", padding: "0.4rem" }}
                />
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={editedQty}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "") return setEditedQty("");
                    if (/^\d+$/.test(v)) setEditedQty(v);
                  }}
                  onBlur={() => {
                    if (editedQty === "" || Number(editedQty) < 1)
                      setEditedQty("1");
                  }}
                  style={{
                    width: "40px",
                    padding: "0.3rem",
                    textAlign: "center",
                  }}
                />
              </div>

              <div
                className="btn-group-inline"
                style={{
                  display: "flex",
                  gap: "0.3rem",
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() => handleEditToggle(item)}
                  className="edit-btn"
                  title="Save"
                >
                  💾
                </button>
                <button
                  onClick={() => handleMoveToInventory(item)}
                  className="move-btn"
                >
                  ✅
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="delete-btn"
                >
                  ❌
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ flex: 1 }}>
                <span className="item-name">
                  <strong>{item.name}</strong> &nbsp; Qty: {item.quantity || 1}
                </span>
                <div
                  className="item-location"
                  style={{ fontSize: "0.85rem", color: "#a33" }}
                >
                  📍 {item.location?.toLowerCase()}
                </div>
              </div>

              <div
                className="btn-group-inline"
                style={{ display: "flex", gap: "0.3rem" }}
              >
                <button
                  onClick={() => handleEditToggle(item)}
                  className="edit-btn"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleMoveToInventory(item)}
                  className="move-btn"
                >
                  ✅
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="delete-btn"
                >
                  ❌
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
