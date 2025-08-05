import { useEffect, useState } from "react";
import EditableToBuyList from "./EditableToBuyList";

export default function ToBuyPage() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [quantity, setQuantity] = useState(1);

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
        location: "PANTRY", // <-- Add this
      }),
    });

    if (res.ok) {
      const item = await res.json();
      setItems((prev) => [...prev, item]);
      setNewItem("");
      setQuantity(1);
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
          flexWrap: "wrap",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Item name"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          placeholder="Qty"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ width: "70px" }}
          required
        />
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
