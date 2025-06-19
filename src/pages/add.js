import { useState } from "react";

export default function AddItemPage() {
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    location: "FRIDGE",
    expiresAt: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/add-item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMessage("✅ Item added!");
      setForm({ name: "", quantity: "", location: "FRIDGE", expiresAt: "" });
    } else {
      setMessage("❌ Failed to add item.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h1>Add New Item</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <br />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <br />

        <label>
          Quantity:
          <br />
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <br />

        <label>
          Location:
          <br />
          <select name="location" value={form.location} onChange={handleChange}>
            <option value="FRIDGE">Fridge</option>
            <option value="FREEZER">Freezer</option>
            <option value="PANTRY">Pantry</option>
            <option value="STORAGE">Storage Room</option>
            <option value="MEDICINE">Medicine</option>
          </select>
        </label>
        <br />
        <br />

        <label>
          Expires At (optional):
          <br />
          <input
            name="expiresAt"
            type="date"
            value={form.expiresAt}
            onChange={handleChange}
          />
        </label>
        <br />
        <br />

        <button type="submit">Add Item</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
