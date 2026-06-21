export default function About() {
  return (
    <div className="page-container container">
      <h1 className="page-title">About Trishul Eco-Homestays</h1>
      <p className="page-description">
        We are a platform dedicated to sustainable village tourism in Chopta, Uttarakhand. Our mission is to provide travelers with authentic cultural immersion while bringing sustainable livelihood opportunities to local village communities, preserving their eco-sensitive region.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
        <div style={{ padding: '2rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary-hover)' }}>For Travelers</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Conscious travelers looking for authentic village tourism experiences, community hospitality, and cultural immersion packages.</p>
        </div>
        <div style={{ padding: '2rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary-hover)' }}>For Local Communities</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Residents of remote villages who provide hospitality services. We bring sustainable livelihood opportunities while preserving the region.</p>
        </div>
      </div>
    </div>
  );
}
