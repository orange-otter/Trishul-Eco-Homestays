export default function Dashboard() {
  return (
    <div className="page-container container">
      <h1 className="page-title">Homestays Dashboard</h1>
      <p className="page-description">
        Browse and manage your eco-homestay bookings. Discover new places to stay in Chopta and support the local communities.
      </p>
      
      <div style={{ marginTop: '2rem', padding: '2rem 1rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '2px dashed var(--border)' }}>
        <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Dashboard Features Coming Soon</h3>
        <p style={{ color: 'var(--text-secondary)', opacity: 0.8 }}>We are currently building the host and guest dashboard experiences.</p>
      </div>
    </div>
  );
}
