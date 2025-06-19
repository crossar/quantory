export default function ItemListPage({ title, items, onDelete }) {
  return (
    <div className="container">
      <h1>{title}</h1>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul className="item-list">
          {items.map(item => (
            <li key={item.id} className="item-card">
              <span>{item.name} (Qty: {item.quantity})</span>
              <button onClick={() => onDelete(item.id)}>❌</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
