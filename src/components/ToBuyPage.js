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
  const [error, setError] = useState(null); // ← show friendly errors

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);

      const user = getUserSafe();
      console.log("[ToBuy] user in this context =", user);

      if (!user?.id) {
        // Not logged in in this storage sandbox (e.g., installed PWA)
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        const url = `/api/to-buy?userId=${user.id}&t=${Date.now()}`; // cache-buster
        console.log("[ToBuy] GET", url);

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          const text = await res.text().catch(() => "(no body)");
          console.error("[ToBuy] GET failed", res.status, res.statusText, text);
          setError(`Failed to load list (${res.status})`);
          setItems([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log(
          "[ToBuy] data len:",
          Array.isArray(data) ? data.length : "not-array",
          data
        );
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("[ToBuy] GET error", err);
        setError("Network error loading your list");
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
      // The installed PWA has its own storage; make sure you log in there once.
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

      if (!res.ok) {
        const text = await res.text().catch(() => "(no body)");
        console.error("[ToBuy] POST failed", res.status, res.statusText, text);
        setError("Failed to add item");
        return;
      }

      const item = await res.json();
      setItems((prev) => [...prev, item]);
      setNewItem("");
      setQuantity("1");
      setLocation("");
    } catch (err) {
      console.error("[ToBuy] POST error", err);
      setError("Network error adding item");
    }
  };

  return (
    <div className="container">
      <h1>To Buy List</h1>

      {error && (
        <div
          style={{
            background: "#fee",
            color: "#900",
            padding: "8px",
            borderRadius: 6,
            margin: "8px 0",
          }}
        >
          {error}
        </div>
      )}

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
