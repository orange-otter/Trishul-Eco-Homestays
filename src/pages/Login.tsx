export default function Login() {
  return (
    <div className="page-container container" style={{ maxWidth: '450px', margin: '0 auto' }}>
      <div style={{ backgroundColor: 'var(--surface)', padding: '2.5rem 1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)' }}>
        <h1 className="page-title text-center" style={{ fontSize: '2rem' }}>Welcome Back</h1>
        <p className="page-description text-center" style={{ marginBottom: '2rem' }}>
          Login to manage your bookings and homestay listings.
        </p>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} onSubmit={(e) => e.preventDefault()}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>Email Address</label>
            <input type="email" placeholder="hello@example.com" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>Password</label>
            <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Sign In</button>
        </form>
        
        <p className="text-center" style={{ marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Don't have an account? <span style={{ color: 'var(--primary)', fontWeight: 500, cursor: 'pointer' }}>Sign up</span>
        </p>
      </div>
    </div>
  );
}
