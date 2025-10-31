import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './utils/PrivateRoute'; 

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import AdminDashboard from './pages/AdminDashboard';
import SecurityDashboard from './pages/SecurityDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ProfilePage from './pages/ProfilePage';
import VisitorDashboard from './pages/VisitorDashboard';

import VerifyEmailPage from './pages/VerifyEmailPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard"
            element={
              <PrivateRoute role="visitor">
                <VisitorDashboard />
              </PrivateRoute>
            }
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/security/dashboard" 
            element={
              <PrivateRoute role="security">
                <SecurityDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/employee/dashboard" 
            element={
              <PrivateRoute role="employee">
                <EmployeeDashboard />
              </PrivateRoute>
            } 
          />
          
        </Routes>
      </main>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;