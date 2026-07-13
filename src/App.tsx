import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import OAuthCallback from './pages/OAuthCallback';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from './components/ui/Toast';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/homestays" element={<Navigate to="/dashboard" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            {/* The Book/Checkout route will go here once implemented. We'll protect dashboard booking action later. */}
          </Route>
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
      <Toaster />
    </div>
  );
}

export default App;
