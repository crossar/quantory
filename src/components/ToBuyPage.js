import { useEffect, useState } from "react";
import EditableToBuyList from "./EditableToBuyList";

export default function ToBuyPage() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState(""); // Start with an empty value for location

  useEffect(() => {
    const fetchItems = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("You must be logged in");
        return;
      }

      try {
        const res = await fetch(`/api/to-buy?userId=${user.id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setItems(data);
        } else {
          console.error("Expected array, got:", data);
          setItems([]);
        }
      } catch (err) {
        console.error("Failed to fetch to-buy items:", err);
      }
    };

    fetchItems();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const res = await fetch("/api/to-buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newItem,
        quantity,
        userId: user.id,
        location: location || "Unspecified", // If location is empty, set it as "Unspecified"
      }),
    });

    if (res.ok) {
      const item = await res.json();
      setItems((prev) => [...prev, item]);
      setNewItem("");
      setQuantity(1);
      setLocation(""); // Reset to default value (empty)
    } else {
      alert("Failed to add item");
    }
  };

  return (
    <div className="container">
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
              flex: 3, // Name still takes up more space
              padding: "0.4rem 0.6rem", // Reduced padding for a skinnier look
              fontSize: "1rem",
              minWidth: "150px", // Minimum width for readability
            }}
          />
          <input
            type="number"
            min="1"
            placeholder="Qty"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={{
              width: "60px", // Reduced width for the quantity input
              padding: "0.4rem 0.6rem", // Same reduced padding
              fontSize: "1rem",
            }}
            required
          />
        </div>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            minWidth: "100px",
            padding: "0.4rem 0.6rem", // Reduced padding for consistency
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

      {items.length === 0 ? (
        <p>No items in your list.</p>
      ) : (
        <EditableToBuyList items={items} setItems={setItems} />
      )}
    </div>
  );
}
