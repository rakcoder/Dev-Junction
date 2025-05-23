import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Developers } from './pages/Developers';
import { Booking } from './pages/Booking';
import { Auth } from './pages/Auth';
import { DeveloperDashboard } from './pages/DeveloperDashboard';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { Profile } from './pages/Profile';
import { Meeting } from './pages/Meeting';
import { ThemeProvider } from './contexts/ThemeContext';
import { Web3Provider } from './contexts/Web3Context';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Web3Provider>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-white dark:bg-dark-200 transition-colors duration-200">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/developers" element={<Developers />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route 
                  path="/developer/dashboard" 
                  element={
                    <ProtectedRoute role="developer">
                      <DeveloperDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customer/dashboard" 
                  element={
                    <ProtectedRoute role="customer">
                      <CustomerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/book/:developerId" 
                  element={
                    <ProtectedRoute role="customer">
                      <Booking />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/meeting/:meetingId" 
                  element={
                    <ProtectedRoute role="any">
                      <Meeting />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </Web3Provider>
    </Router>
  );
}

export default App;