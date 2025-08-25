import { formatYMDShort } from "../utils/dateUtils";

export default function ItemListPage({ title, items, onDelete }) {
  return (
    <div className="container">
      <h1>{title}</h1>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul className="item-list">
          {items.map((item) => (
            <li key={item.id} className="item-card">
              <span>
                {item.name} (Qty: {item.quantity ?? 0})
                {item.expiresAt && (
                  <> – Expires: {formatYMDShort(item.expiresAt)}</>
                )}
              </span>
              <button
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to delete this item?")
                  ) {
                    onDelete(item.id);
                  }
                }}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
