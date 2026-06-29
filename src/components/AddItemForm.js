import { useState } from "react";

export default function AddItemForm({ location, onItemAdded }) {
  const [form, setForm] = useState({
    name: "",
    quantity: 1,
    expiresAt: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const res = await fetch("/api/add-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        location: location.toUpperCase(),
        quantity: parseInt(form.quantity),
        expiresAt: form.expiresAt || null,
      }),
    });

    if (res.ok) {
      const newItem = await res.json();
      onItemAdded(newItem);

      setForm({ name: "", quantity: 1, expiresAt: "" });
    } else if (res.status === 401) {
      window.location.href = "/login";
    } else {
      alert("Failed to add item");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="inline-form">
      <input
        type="text"
        name="name"
        value={form.name}
        placeholder="Item name"
        onChange={handleChange}
      />
      <input
        type="number"
        name="quantity"
        value={form.quantity}
        min="1"
        onChange={handleChange}
      />
      <input
        type="date"
        name="expiresAt"
        value={form.expiresAt}
        onChange={handleChange}
      />
      <button type="submit">Add</button>
    </form>
  );
}
