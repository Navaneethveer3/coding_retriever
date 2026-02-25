import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CategoryDetail from './pages/CategoryDetail';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="loading-overlay"><div className="spinner"></div></div>;
  if (!token) return <Navigate to="/login" />;
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/:category"
            element={
              <ProtectedRoute>
                <CategoryDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
      <div className="global-watermark">
        - Created by Navaneeth veer
      </div>
    </div>
  );
}

export default App;
