import { useEffect, useState } from "react";
import EditableToBuyList from "./EditableToBuyList";

export default function ToBuyPage() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("user from localStorage:", user); // for testing

      if (!user) {
        alert("You must be logged in");
        return;
      }

      console.log("Sending this to backend:", {
        name: newItem,
        location,
        quantity,
        expiresAt: expiresAt || null,
        userId: user.id,
      });
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
    if (!newItem.trim() || !location) return;

    const user = JSON.parse(localStorage.getItem("user"));
    console.log("user from localStorage:", user); // 👈 this will show up in Console

   if (!user) {
  window.location.href = "/login"; // redirect to login page
  return;
}


    const res = await fetch("/api/to-buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newItem,
        location,
        quantity,
        expiresAt: expiresAt || null,
        userId: user.id,
      }),
    });

    if (res.ok) {
      const item = await res.json();
      setItems((prev) => [...prev, item]);
      setNewItem("");
      setLocation("");
      setQuantity(1);
      setExpiresAt("");
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
        />
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Location</option>
          <option value="fridge">Fridge</option>
          <option value="freezer">Freezer</option>
          <option value="pantry">Pantry</option>
          <option value="storage-room">Storage Room</option>
          <option value="medicine">Medicine</option>
        </select>
        <input
          type="number"
          min="1"
          placeholder="Qty"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ width: "70px" }}
        />
        <input
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
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
