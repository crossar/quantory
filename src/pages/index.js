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
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <h1>Inventory</h1>
      <ul>
        {data.map(item => (
          <li key={item.name}>
            <Link href={item.href}>
              {item.name} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
