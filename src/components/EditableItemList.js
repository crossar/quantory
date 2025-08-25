import { useState } from "react";

function splitYMD(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
  return { y, m, d };
}

function dateFromYMD_UTC(dateStr) {
  const ymd = splitYMD(dateStr);
  if (!ymd) return null;
  const { y, m, d } = ymd;
  return new Date(Date.UTC(y, m - 1, d)); // midnight UTC
}

function formatYMDShort(dateStr) {
  const ymd = splitYMD(dateStr);
  if (!ymd) return "—";
  const { y, m, d } = ymd;
  const thisYear = new Date().getFullYear();
  return y === thisYear ? `${m}/${d}` : `${m}/${d}/${String(y).slice(-2)}`;
}

function formatDateShort(dateStr) {
  return formatYMDShort(dateStr);
}

function formatDateLocal(dateStr) {
  if (!dateStr) return "—";
  const ymd = splitYMD(dateStr);
  if (!ymd) return "—";
  const { y, m, d } = ymd;
  // Build as UTC so toLocaleDateString won't shift the day
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString();
}

function isExpiringSoonLocal(dateStr) {
  if (!dateStr) return false;
  const expires = dateFromYMD_UTC(dateStr);
  const now = new Date();
  const todayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const diffDays = (expires - todayUTC) / 86400000;
  return diffDays >= 0 && diffDays <= 3;
}

function isExpiredLocal(dateStr) {
  if (!dateStr) return false;
  const expires = dateFromYMD_UTC(dateStr);
  const now = new Date();
  const todayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  return expires < todayUTC;
}

export default function EditableItemList({ items, setItems }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    quantity: "",
    expiresAt: "",
  });
  const [sortOption, setSortOption] = useState("expires");
  const [searchQuery, setSearchQuery] = useState("");
  const [showExpired, setShowExpired] = useState(true);
  const [showExpiringSoon, setShowExpiringSoon] = useState(true);
  const [showGood, setShowGood] = useState(true);

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditData({
      name: item.name,
      quantity: String(item.quantity ?? ""),
      // keep YYYY-MM-DD (no TZ)
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
      body: JSON.stringify({
        id,
        ...editData,
        quantity: Number(editData.quantity || 0),
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems(items.map((i) => (i.id === id ? updated : i)));
      cancelEdit();
    } else alert("Failed to update item");
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    const res = await fetch("/api/delete-item", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setItems(items.filter((i) => i.id !== id));
    else alert("Failed to delete item");
  };

  const exportToCSV = () => {
    const headers = ["Name", "Quantity", "Expires At", "Location"];
    const rows = items.map((i) => [
      `"${i.name}"`,
      i.quantity,
      i.expiresAt ? formatDateLocal(i.expiresAt) : "—",
      i.location,
    ]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = "inventory.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortItems = (arr) => {
    const copy = [...arr];
    if (sortOption === "name")
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    if (sortOption === "quantity")
      return copy.sort((a, b) => (a.quantity || 0) - (b.quantity || 0));
    // expires (soonest first) — use UTC-safe constructor
    return copy.sort((a, b) => {
      const ax = a.expiresAt
        ? dateFromYMD_UTC(a.expiresAt)
        : new Date(8640000000000000);
      const bx = b.expiresAt
        ? dateFromYMD_UTC(b.expiresAt)
        : new Date(8640000000000000);
      return ax - bx;
    });
  };

  const expiredItems = sortItems(
    filtered.filter((i) => isExpiredLocal(i.expiresAt))
  );
  const soonItems = sortItems(
    filtered.filter(
      (i) => !isExpiredLocal(i.expiresAt) && isExpiringSoonLocal(i.expiresAt)
    )
  );
  const goodItems = sortItems(
    filtered.filter(
      (i) => !isExpiredLocal(i.expiresAt) && !isExpiringSoonLocal(i.expiresAt)
    )
  );

  const Row = (item) => {
    const expired = isExpiredLocal(item.expiresAt);
    const soon = !expired && isExpiringSoonLocal(item.expiresAt);
    const badgeClass = expired
      ? "badge-red"
      : soon
      ? "badge-orange"
      : "badge-green";

    const isEditing = editingId === item.id;

    if (isEditing) {
      return (
        <div key={item.id} className="compact-row editing">
          <span className={`cell-badge ${badgeClass}`} />

          <input
            className="name-input"
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            placeholder="Item name"
          />

          <input
            className="qty-input"
            type="number"
            min="0"
            value={editData.quantity}
            onChange={(e) =>
              setEditData({ ...editData, quantity: e.target.value })
            }
          />
          <input
            className="date-input"
            type="date"
            value={editData.expiresAt}
            onChange={(e) =>
              setEditData({ ...editData, expiresAt: e.target.value })
            }
          />

          <div className="actions">
            <button
              className="icon-btn"
              title="Save"
              onClick={() => handleEdit(item.id)}
            >
              ✔
            </button>
            <button className="icon-btn" title="Cancel" onClick={cancelEdit}>
              ✖
            </button>
          </div>
        </div>
      );
    }

    return (
      <div key={item.id} className="compact-row">
        <span className={`cell-badge ${badgeClass}`} />
        <div className="compact-name">{item.name}</div>
        <div className="qty-col">{item.quantity ?? 0}</div>
        <div className="date-col">
          {item.expiresAt ? formatDateShort(item.expiresAt) : "—"}
        </div>
        <div className="actions">
          <button
            className="icon-btn"
            title="Edit"
            onClick={() => startEdit(item)}
          >
            ✎
          </button>
          <button
            className="icon-btn"
            title="Delete"
            onClick={() => handleDelete(item.id)}
          >
            🗑
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Search + sort + export */}
      <div className="toolbar">
        <input
          className="search"
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="expires">Soonest</option>
          <option value="name">Name</option>
          <option value="quantity">Qty ↑</option>
        </select>
        <button className="icon-btn small" onClick={exportToCSV}>
          Export
        </button>
      </div>

      {/* Clickable legend (filters) */}
      <div className="legend">
        <label className="legend-toggle">
          <input
            className="chk-red"
            type="checkbox"
            checked={showExpired}
            onChange={() => setShowExpired((v) => !v)}
          />
          <span>Expired</span>
        </label>
        <label className="legend-toggle">
          <input
            className="chk-orange"
            type="checkbox"
            checked={showExpiringSoon}
            onChange={() => setShowExpiringSoon((v) => !v)}
          />
          <span>Expiring Soon</span>
        </label>
        <label className="legend-toggle">
          <input
            className="chk-green"
            type="checkbox"
            checked={showGood}
            onChange={() => setShowGood((v) => !v)}
          />
          <span>Good</span>
        </label>
      </div>

      {/* Sectioned, bordered groups */}
      {showExpired && expiredItems.length > 0 && (
        <div className="section-box section-expired">
          <div className="section-title" style={{ color: "#e53935" }}>
            Expired
          </div>
          {expiredItems.map(Row)}
        </div>
      )}
      {showExpiringSoon && soonItems.length > 0 && (
        <div className="section-box section-soon">
          <div className="section-title" style={{ color: "#fb8c00" }}>
            Expiring Soon
          </div>
          {soonItems.map(Row)}
        </div>
      )}
      {showGood && goodItems.length > 0 && (
        <div className="section-box section-good">
          <div className="section-title" style={{ color: "#43a047" }}>
            Good
          </div>
          {goodItems.map(Row)}
        </div>
      )}
    </div>
  );
}
