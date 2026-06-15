import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { NotificationProvider } from './components/Notification';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { WalletsPage } from './pages/WalletsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { GoalsPage } from './pages/GoalsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ReportPage } from './pages/ReportPage';

const Protected = ({ children }) => { const user = useAuthStore(s => s.user); return user ? children : <Navigate to="/login" />; };

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Protected><DashboardPage /></Protected>} />
          <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
          <Route path="/wallets" element={<Protected><WalletsPage /></Protected>} />
          <Route path="/transactions" element={<Protected><TransactionsPage /></Protected>} />
          <Route path="/budgets" element={<Protected><BudgetsPage /></Protected>} />
          <Route path="/goals" element={<Protected><GoalsPage /></Protected>} />
          <Route path="/reports" element={<Protected><ReportPage /></Protected>} />
          <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}
export default App;