import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportLost from './pages/ReportLost';
import ReportFound from './pages/ReportFound';
import BrowseLost from './pages/BrowseLost';
import BrowseFound from './pages/BrowseFound';
import ItemDetail from './pages/ItemDetail';
import Messages from './pages/Messages';
import AdminDashboard from './pages/AdminDashboard';
import Leaderboard from './pages/Leaderboard';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Disclaimer from './pages/Disclaimer';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('accio_token');
    const savedUser = localStorage.getItem('accio_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem('accio_token', token);
    localStorage.setItem('accio_user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('accio_token');
    localStorage.removeItem('accio_user');
    setToken(null);
    setUser(null);
  };

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    return token && user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing user={user} />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/register" element={<Register onLogin={login} />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard user={user} token={token} onLogout={logout} /></ProtectedRoute>} />
        <Route path="/report-lost" element={<ProtectedRoute><ReportLost user={user} token={token} /></ProtectedRoute>} />
        <Route path="/report-found" element={<ProtectedRoute><ReportFound user={user} token={token} /></ProtectedRoute>} />
        <Route path="/browse-lost" element={<ProtectedRoute><BrowseLost user={user} token={token} /></ProtectedRoute>} />
        <Route path="/browse-found" element={<ProtectedRoute><BrowseFound user={user} token={token} /></ProtectedRoute>} />
        <Route path="/item/:type/:id" element={<ProtectedRoute><ItemDetail user={user} token={token} /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages user={user} token={token} /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard token={token} /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard user={user} token={token} onLogout={logout} /></AdminRoute>} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
