import BottomNav from './BottomNav';

export default function Layout({ children }) {
  return (
    <div style={{ padding: '1rem', paddingBottom: '4rem', maxWidth: '600px', margin: 'auto' }}>
      {children}
      <BottomNav />
    </div>
  );
}
