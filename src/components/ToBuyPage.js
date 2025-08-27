import { useEffect, useState } from "react";
import EditableToBuyList from "./EditableToBuyList";

/** Safe localStorage reader so mobile/PWA quirks don’t break things */
function getUserSafe() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function ToBuyPage() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [location, setLocation] = useState(""); // empty means "choose"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const user = getUserSafe();

      // If not logged in in THIS storage sandbox (e.g., installed app), show empty state
      if (!user?.id) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/to-buy?userId=${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch to-buy items");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch to-buy items:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const user = getUserSafe();
    if (!user?.id) {
      // Important: the installed PWA has its own storage; make sure you log in there once.
      window.location.href = "/login";
      return;
    }

    const qty = Math.max(1, parseInt(quantity || "1", 10));

    try {
      const res = await fetch("/api/to-buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newItem,
          quantity: qty,
          userId: user.id,
          location: location || "Unspecified",
        }),
      });

      if (!res.ok) throw new Error("Failed to add item");

      const item = await res.json();
      setItems((prev) => [...prev, item]);
      setNewItem("");
      setQuantity("1");
      setLocation("");
    } catch (err) {
      console.error(err);
      alert("Failed to add item");
    }
  };

  return (
    <div className="container">
      {/* Optional tiny debug (remove later)
      <div style={{fontSize:12,opacity:.7,marginBottom:8}}>
        origin: {typeof window !== 'undefined' ? window.location.origin : ''}
        <br/>
        user?: {typeof window !== 'undefined' ? localStorage.getItem('user') : 'n/a'}
      </div>
      */}

      <h1>To Buy List</h1>
      <p style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "#666" }}>
        Add items you plan to buy. You can set expiration dates after purchase.
      </p>

      <form
        onSubmit={handleAdd}
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            width: "100%",
          }}
        >
          <input
            type="text"
            placeholder="Item name"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            required
            style={{
              flex: 3,
              padding: "0.4rem 0.6rem",
              fontSize: "1rem",
              minWidth: "150px",
            }}
          />
          <input
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            placeholder="Qty"
            value={quantity}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") return setQuantity("");
              if (/^\d+$/.test(v)) setQuantity(v);
            }}
            onBlur={() => {
              if (quantity === "" || Number(quantity) < 1) setQuantity("1");
            }}
            style={{
              width: "60px",
              padding: "0.4rem 0.6rem",
              fontSize: "1rem",
              textAlign: "center",
            }}
            required
          />
        </div>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            minWidth: "100px",
            padding: "0.4rem 0.6rem",
          }}
        >
          <option value="" disabled>
            📍 Location (Search or select)
          </option>
          <option value="FRIDGE">🥶 Fridge</option>
          <option value="FREEZER">❄️ Freezer</option>
          <option value="PANTRY">🧺 Pantry</option>
          <option value="STORAGE">📦 Storage</option>
          <option value="MEDICINE">💊 Medicine</option>
        </select>

        <button type="submit">➕</button>
      </form>

      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p>No items in your list.</p>
      ) : (
        <EditableToBuyList items={items} setItems={setItems} />
      )}
    </div>
  );
}
