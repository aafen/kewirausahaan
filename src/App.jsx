import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

// Wrapper untuk Rute Pelanggan
function CustomerRoute({ children }) {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');
  if (!auth || !auth.isAuthenticated) return <Navigate to="/login" replace />;
  if (auth.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
}

// Wrapper untuk Rute Admin
function AdminRoute({ children }) {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null');
  if (!auth || !auth.isAuthenticated) return <Navigate to="/login" replace />;
  if (auth.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Area */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

        {/* Customer Area */}
        <Route path="/" element={
          <CustomerRoute>
            <Layout />
          </CustomerRoute>
        }>
          <Route index element={<Home />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
