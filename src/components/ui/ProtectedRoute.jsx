import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loader-wrap" style={{ minHeight: '100vh' }}><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}