import Link from 'next/link';

export default function Home() {
  const data = [
    { name: 'Fridge', href: '/fridge' },
    { name: 'Freezer', href: '/freezer' },
    { name: 'Pantry', href: '/pantry' },
    { name: 'Storage Room', href: '/storage-room' },
    { name: 'Medicine', href: '/medicine' },
  ];

  return (
    <div className="container">
      <h1>Inventory</h1>
      <div className="card-list">
        {data.map(item => (
          <Link key={item.name} href={item.href} className="card">
            {item.name} →
          </Link>
        ))}
      </div>
    </div>
  );
}
