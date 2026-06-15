import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore(s => s.user);
  return user ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  
  const navItems = [
    { path: '/dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
    { path: '/transactions', icon: 'ti-file-text', label: 'Transaksi' },
    { path: '/wallets', icon: 'ti-wallet', label: 'Wallet' },
    { path: '/menu', icon: 'ti-menu-2', label: 'Menu' },
  ];

  return (
    <div className="app">
      <div className="content">{children}</div>
      <div className="bottom-nav">
        {navItems.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`nav-item ${path === item.path ? 'nav-item-active' : ''}`}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </button>
        ))}
        <div className="fab-wrapper">
          <button className="fab" onClick={() => navigate('/transactions/new')}>
            <i className="ti ti-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;
