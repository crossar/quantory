import Link from 'next/link';
import { useRouter } from 'next/router';

export default function BottomNav() {
  const router = useRouter();
  const current = router.pathname;

  const links = [
    { href: '/', label: '🏠 Home' },
    { href: '/expiring', label: '⚠ Expiring' },
    { href: '/to-buy', label: '🛒 To Buy' },
    { href: '/profile', label: '👤 Profile' },
  ];

  return (
    <nav style={navStyle}>
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          style={{
            ...linkStyle,
            fontWeight: current === link.href ? 'bold' : 'normal',
          }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

const navStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  background: '#f9f9f9',
  padding: '0.75rem 0',
  borderTop: '1px solid #ccc',
  fontSize: '14px',
  zIndex: 1000,
};

const linkStyle = {
  textDecoration: 'none',
  color: '#333',
  flex: 1,
  textAlign: 'center',
};
